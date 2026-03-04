import { useState, useMemo, useEffect, useRef, useCallback, memo } from 'react';
import { Lightbulb, MessageSquare, Sparkles, SquarePen } from 'lucide-react';
import './ViewAstInspector.css';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const domParser = new DOMParser();

const HIGHLIGHT_COLORS = {
  yellow: '#FFFF00', green: '#00FF00', cyan: '#00FFFF', magenta: '#FF00FF',
  blue: '#0000FF', red: '#FF0000', darkBlue: '#000080', darkCyan: '#008080',
  darkGreen: '#008000', darkMagenta: '#800080', darkRed: '#800000',
  darkYellow: '#808000', darkGray: '#808080', lightGray: '#C0C0C0', black: '#000000',
};

// ─────────────────────────────────────────────────────────────────────────────
// OOXML HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function parseXml(xml) {
  return domParser.parseFromString(xml, 'application/xml');
}
function wEl(parent, tag) {
  return parent.getElementsByTagNameNS(W, tag)[0] || null;
}
function wEls(parent, tag) {
  return Array.from(parent.getElementsByTagNameNS(W, tag));
}
function wVal(el) {
  if (!el) return null;
  return el.getAttributeNS(W, 'val') || null;
}
function hasProp(parent, tag) {
  const el = wEl(parent, tag);
  if (!el) return false;
  const v = wVal(el);
  return v !== '0' && v !== 'false';
}
function twipsToPt(twips) {
  return (parseInt(twips, 10) / 20).toFixed(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// NUMBERING
// ─────────────────────────────────────────────────────────────────────────────
class NumberingContext {
  constructor(defs) {
    this.defs     = defs || {};
    this.counters = {};
  }

  nextLabel(numId, ilvl) {
    const key     = `${numId}:${ilvl}`;
    const def     = ((this.defs[numId] || {})[String(ilvl)]) || {};
    const numFmt  = def.numFmt  || 'bullet';
    const start   = def.start  != null ? def.start  : 1;
    const lvlText = def.lvlText != null ? def.lvlText : '•';

    if (this.counters[key] == null) {
      this.counters[key] = start;
    } else {
      this.counters[key]++;
    }
    // Reset deeper levels when this level ticks
    for (const k of Object.keys(this.counters)) {
      const [kId, kLvl] = k.split(':');
      if (kId === numId && parseInt(kLvl, 10) > ilvl) delete this.counters[k];
    }
    return fmtLabel(this.counters[key], numFmt, lvlText);
  }
}

function fmtLabel(n, numFmt, lvlText) {
  const sub = (text, rep) => text.replace(/%\d+/g, rep);
  switch (numFmt) {
    case 'decimal':     return sub(lvlText, String(n))              || `${n}.`;
    case 'lowerLetter': return sub(lvlText, numToLetter(n, false))  || `${numToLetter(n, false)}.`;
    case 'upperLetter': return sub(lvlText, numToLetter(n, true))   || `${numToLetter(n, true)}.`;
    case 'lowerRoman':  return sub(lvlText, toRoman(n).toLowerCase()) || `${toRoman(n).toLowerCase()}.`;
    case 'upperRoman':  return sub(lvlText, toRoman(n).toUpperCase()) || `${toRoman(n).toUpperCase()}.`;
    case 'bullet':
    default:            return lvlText || '•';
  }
}

function toRoman(n) {
  const V = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const S = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let r = '';
  for (let i = 0; i < V.length; i++) { while (n >= V[i]) { r += S[i]; n -= V[i]; } }
  return r || 'i';
}

function numToLetter(n, upper) {
  const base = upper ? 65 : 97;
  if (n <= 26) return String.fromCharCode(base + n - 1);
  return numToLetter(Math.floor((n - 1) / 26), upper) + String.fromCharCode(base + (n - 1) % 26);
}

// ─────────────────────────────────────────────────────────────────────────────
// OOXML NORMALIZATION  (Python ET uses ns0:/ns1: prefixes)
// ─────────────────────────────────────────────────────────────────────────────
function normalizeOoxml(xml) {
  return xml
    .replace(/\bns0:/g, 'w:')
    .replace(/\bns1:/g, 'w14:')
    .replace(/\bns2:/g, 'r:')
    .replace(/xmlns:ns0="[^"]*"\s*/g, '')
    .replace(/xmlns:ns1="[^"]*"\s*/g, '')
    .replace(/xmlns:ns2="[^"]*"\s*/g, '')
    .replace(/></g, '>\n<')
    .trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// RUN FORMATTING
// ─────────────────────────────────────────────────────────────────────────────
function getRunStyle(rPr) {
  if (!rPr) return {};
  const style = {};

  if (hasProp(rPr, 'b') || hasProp(rPr, 'bCs')) style.fontWeight = 'bold';
  if (hasProp(rPr, 'i') || hasProp(rPr, 'iCs')) style.fontStyle  = 'italic';

  const decos = [];
  const u = wEl(rPr, 'u');
  if (u && wVal(u) !== 'none') decos.push('underline');
  if (hasProp(rPr, 'strike') || hasProp(rPr, 'dstrike')) decos.push('line-through');
  if (decos.length) style.textDecoration = decos.join(' ');

  const color = wEl(rPr, 'color');
  if (color) { const v = wVal(color); if (v && v !== 'auto') style.color = '#' + v; }

  const hl = wEl(rPr, 'highlight');
  if (hl) { const v = wVal(hl); if (HIGHLIGHT_COLORS[v]) style.backgroundColor = HIGHLIGHT_COLORS[v]; }

  const sz = wEl(rPr, 'sz');
  if (sz) { const v = wVal(sz); if (v) style.fontSize = (parseInt(v, 10) / 2) + 'pt'; }

  const va = wEl(rPr, 'vertAlign');
  if (va) {
    const v = wVal(va);
    if (v === 'superscript') { style.verticalAlign = 'super'; style.fontSize = '0.75em'; }
    if (v === 'subscript')   { style.verticalAlign = 'sub';   style.fontSize = '0.75em'; }
  }

  return style;
}

// Build JSX array from a parsed <w:p> DOM element (handles r, hyperlink, del, ins)
function getRunsFromPara(pEl) {
  const elements = [];
  let k = 0;

  for (const child of pEl.childNodes) {
    if (child.nodeType !== 1) continue;
    const tag = child.localName;

    if (tag === 'r') {
      const rPr  = wEl(child, 'rPr');
      const text = wEls(child, 't').map(t => t.textContent).join('');
      if (!text) continue;
      elements.push(<span key={k++} style={getRunStyle(rPr)}>{text}</span>);

    } else if (tag === 'hyperlink') {
      const inner = [];
      let ik = 0;
      for (const r of child.childNodes) {
        if (r.nodeType !== 1 || r.localName !== 'r') continue;
        const text = wEls(r, 't').map(t => t.textContent).join('');
        if (text) inner.push(<span key={ik++} style={getRunStyle(wEl(r, 'rPr'))}>{text}</span>);
      }
      if (inner.length) {
        elements.push(
          <a key={k++} style={{ color: '#1155CC', textDecoration: 'underline' }}>{inner}</a>
        );
      }

    } else if (tag === 'del') {
      let delText = '';
      for (const r of child.childNodes) {
        if (r.nodeType !== 1 || r.localName !== 'r') continue;
        delText += wEls(r, 'delText').map(t => t.textContent).join('');
      }
      if (delText) elements.push(<span key={k++} className="vai-tracked-del">{delText}</span>);

    } else if (tag === 'ins') {
      const inner = [];
      let ik = 0;
      for (const r of child.childNodes) {
        if (r.nodeType !== 1 || r.localName !== 'r') continue;
        const text = wEls(r, 't').map(t => t.textContent).join('');
        if (text) inner.push(<span key={ik++} style={getRunStyle(wEl(r, 'rPr'))}>{text}</span>);
      }
      if (inner.length) {
        elements.push(<span key={k++} className="vai-tracked-ins">{inner}</span>);
      }
    }
  }
  return elements;
}

// Check if a parsed <w:p> has any visible text (avoids inspecting React elements)
function getParaTextContent(pEl) {
  return [...wEls(pEl, 't'), ...wEls(pEl, 'delText')]
    .map(t => t.textContent).join('').trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE BREAK
// ─────────────────────────────────────────────────────────────────────────────
function PageBreakNode() {
  return <div className="vai-page-break-node">— page break —</div>;
}

// ─────────────────────────────────────────────────────────────────────────────
// PARAGRAPH NODE
// listInfo: { label: string, ilvl: number } | undefined
// ─────────────────────────────────────────────────────────────────────────────
const ParagraphNode = memo(function ParagraphNode({ node, listInfo }) {
  const xmlDoc = parseXml(node.ooxml);
  const pEl    = xmlDoc.documentElement;
  const pPr    = wEl(pEl, 'pPr');

  // Page-break detection
  const hasPageBreak = wEls(pEl, 'br').some(br => br.getAttributeNS(W, 'type') === 'page');
  const pbBefore     = pPr ? wEl(pPr, 'pageBreakBefore') : null;
  const hasPbBefore  = pbBefore !== null && wVal(pbBefore) !== '0';

  // Class names and inline style from paragraph properties
  const classNames = ['vai-para'];
  const style = {};

  if (pPr) {
    const jc = wEl(pPr, 'jc');
    if (jc) {
      const a = wVal(jc);
      if (a === 'center')                        classNames.push('centered');
      else if (a === 'right')                    classNames.push('right-aligned');
      else if (a === 'both' || a === 'distribute') classNames.push('justified');
    }

    const pStyle = wEl(pPr, 'pStyle');
    if (pStyle) {
      const s = (wVal(pStyle) || '').toLowerCase();
      if (s.startsWith('heading')) {
        const lvl = parseInt(s.replace(/[^0-9]/g, ''), 10) || 2;
        classNames.push(`h${Math.min(lvl, 3)}`);
      }
    }

    const ind = wEl(pPr, 'ind');
    if (ind) {
      const left      = ind.getAttributeNS(W, 'left');
      const right     = ind.getAttributeNS(W, 'right');
      const hanging   = ind.getAttributeNS(W, 'hanging');
      const firstLine = ind.getAttributeNS(W, 'firstLine');
      if (left)    style.marginLeft  = twipsToPt(left)  + 'pt';
      if (right)   style.marginRight = twipsToPt(right) + 'pt';
      if (hanging)        style.textIndent = `-${twipsToPt(hanging)}pt`;
      else if (firstLine) style.textIndent =  `${twipsToPt(firstLine)}pt`;
    }

    const spacing = wEl(pPr, 'spacing');
    if (spacing) {
      const before   = spacing.getAttributeNS(W, 'before');
      const after    = spacing.getAttributeNS(W, 'after');
      const line     = spacing.getAttributeNS(W, 'line');
      const lineRule = spacing.getAttributeNS(W, 'lineRule');
      if (before) style.marginTop    = twipsToPt(before) + 'pt';
      if (after)  style.marginBottom = twipsToPt(after)  + 'pt';
      if (line) {
        if (!lineRule || lineRule === 'auto') style.lineHeight = (parseInt(line, 10) / 240).toFixed(2);
        else                                  style.lineHeight = twipsToPt(line) + 'pt';
      }
    }

    // List indent — only set marginLeft if not already set by explicit w:ind
    if (listInfo) {
      if (!style.marginLeft) style.marginLeft = `${(listInfo.ilvl + 1) * 22}px`;
      style.paddingLeft = '1.6em';
      style.textIndent  = '-1.6em';
    }
  }

  const runs    = getRunsFromPara(pEl);
  const hasText = getParaTextContent(pEl).length > 0;

  const listMarker = listInfo
    ? <><span className="vai-list-marker">{listInfo.label}</span>{'\u00A0'}</>
    : null;

  const parts = [];
  if (hasPbBefore) parts.push(<PageBreakNode key="pb-before" />);

  if (!hasText && !hasPageBreak) {
    parts.push(<div key="para" className={[...classNames, 'empty'].join(' ')} style={style} />);
  } else if (hasPageBreak && !hasText) {
    parts.push(<PageBreakNode key="pb-only" />);
  } else {
    parts.push(
      <div key="para" className={classNames.join(' ')} style={style}>
        {listMarker}
        {runs}
      </div>
    );
    if (hasPageBreak) parts.push(<PageBreakNode key="pb-after" />);
  }

  return <>{parts}</>;
});

// ─────────────────────────────────────────────────────────────────────────────
// TABLE NODE
// ─────────────────────────────────────────────────────────────────────────────
const TableNode = memo(function TableNode({ node }) {
  const tblEl = parseXml(node.ooxml).documentElement;

  return (
    <div className="vai-tbl-wrapper">
      <table className="vai-tbl-render">
        <tbody>
          {wEls(tblEl, 'tr').map((trEl, rowIdx) => {
            const cells = Array.from(trEl.childNodes).filter(
              n => n.nodeType === 1 && n.localName === 'tc'
            );
            return (
              <tr key={rowIdx}>
                {cells.map((tcEl, cellIdx) => {
                  const tcPr        = wEl(tcEl, 'tcPr');
                  const vMerge      = tcPr ? wEl(tcPr, 'vMerge') : null;
                  const isMergeCont = vMerge && wVal(vMerge) !== 'restart';

                  if (isMergeCont) {
                    return <td key={cellIdx} className="vai-vmerge-cont" />;
                  }

                  let colSpan;
                  if (tcPr) {
                    const gs = wEl(tcPr, 'gridSpan');
                    if (gs) { const v = wVal(gs); if (v && parseInt(v, 10) > 1) colSpan = parseInt(v, 10); }
                  }

                  const cellParas = Array.from(tcEl.childNodes).filter(
                    n => n.nodeType === 1 && n.localName === 'p'
                  );

                  return (
                    <td key={cellIdx} colSpan={colSpan}>
                      {cellParas.map((pEl, pIdx) => {
                        if (!getParaTextContent(pEl)) return null;
                        return (
                          <div key={pIdx} style={{ margin: 0 }}>
                            {getRunsFromPara(pEl)}
                          </div>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// DOC NODE WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
const DocNode = memo(function DocNode({ node, arrayIdx, listInfo, selected, onSelect }) {
  return (
    <div
      className={`vai-doc-node${selected ? ' selected' : ''}`}
      data-array-idx={arrayIdx}
      data-node-id={node.id}
      data-index={node.index}
      onClick={(e) => onSelect(arrayIdx, e)}
    >
      {/* <span className="vai-node-gutter">[{node.index}] {node.id.slice(0, 8)}</span> */}
      {node.type === 'paragraph' ? (
        <ParagraphNode node={node} listInfo={listInfo} />
      ) : node.type === 'table' ? (
        <TableNode node={node} />
      ) : (
        <div className="vai-tbl-raw">[{node.type}]</div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// INDEX ITEM
// ─────────────────────────────────────────────────────────────────────────────
const IndexItem = memo(function IndexItem({ node, arrayIdx, selected, hidden, onSelect }) {
  const typeClass = node.type === 'paragraph' ? 'vai-badge-paragraph'
                  : node.type === 'table'     ? 'vai-badge-table'
                  :                             'vai-badge-other';
  const typeShort = node.type === 'paragraph' ? 'P'
                  : node.type === 'table'     ? 'T'
                  : node.type.slice(0, 3).toUpperCase();

  return (
    <div
      className={`vai-index-item${selected ? ' selected' : ''}${hidden ? ' search-hidden' : ''}`}
      data-array-idx={arrayIdx}
      data-node-id={node.id}
      data-index={node.index}
      onClick={() => onSelect(arrayIdx)}
    >
      <span className="vai-index-num">{node.index}</span>
      <span className={`vai-index-type-badge ${typeClass}`}>{typeShort}</span>
      <span className="vai-index-text">{node.text_preview || '(empty)'}</span>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// INSPECTOR HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function InspRow({ label, value }) {
  let valEl;
  if (value === null || value === undefined) {
    valEl = <span className="vai-insp-val-null">null</span>;
  } else if (typeof value === 'string') {
    valEl = <span className="vai-insp-val-str">"{value}"</span>;
  } else if (typeof value === 'number') {
    valEl = <span className="vai-insp-val-num">{value}</span>;
  } else {
    valEl = <span>{String(value)}</span>;
  }
  return (
    <div className="vai-insp-row">
      <span className="vai-insp-key">{label}</span>
      {valEl}
    </div>
  );
}

function InspBoolRow({ label, value }) {
  const valEl = value === true  ? <span className="vai-insp-val-true">true</span>
              : value === false ? <span className="vai-insp-val-false">false</span>
              :                   <span className="vai-insp-val-null">null</span>;
  return (
    <div className="vai-insp-row">
      <span className="vai-insp-key">{label}</span>
      {valEl}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INSPECTOR PANEL
// Keyed on node.id by caller so ooxmlVisible resets on node change
// ─────────────────────────────────────────────────────────────────────────────
function Inspector({ node, numbering }) {
  const [ooxmlVisible, setOoxmlVisible] = useState(false);

  const attrs  = node.attrs  || {};
  const ooxml  = node.ooxml  || '';
  const text   = node.text_preview || '';

  const numDef = attrs.numId != null && numbering
    ? ((numbering[attrs.numId] || {})[String(attrs.ilvl)] || {})
    : null;

  const chips = [];
  if (attrs.hasBold)       chips.push({ cls: 'vai-chip-bold',      label: 'Bold' });
  if (attrs.hasItalic)     chips.push({ cls: 'vai-chip-italic',    label: 'Italic' });
  if (attrs.hasUnderline)  chips.push({ cls: 'vai-chip-underline', label: 'Underline' });
  if (attrs.numId != null) chips.push({ cls: 'vai-chip-list',      label: `List ilvl=${attrs.ilvl}` });

  return (
    <div className="vai-inspector-content">
      <div className="vai-insp-section">
        <span className="vai-insp-title">Identity</span>
        <InspRow label="index"       value={node.index} />
        <InspRow label="id"          value={node.id} />
        <InspRow label="type"        value={node.type} />
        <InspRow label="fingerprint" value={node.attrs_fingerprint || ''} />
      </div>

      <div className="vai-insp-section">
        <span className="vai-insp-title">Attributes</span>
        <InspRow label="pStyle" value={attrs.pStyle} />
        <InspRow label="numId"  value={attrs.numId} />
        <InspRow label="ilvl"   value={attrs.ilvl} />
        {numDef && (
          <>
            <InspRow label="numFmt"  value={numDef.numFmt} />
            <InspRow label="lvlText" value={numDef.lvlText} />
          </>
        )}
        <InspBoolRow label="hasBold"      value={attrs.hasBold} />
        <InspBoolRow label="hasItalic"    value={attrs.hasItalic} />
        <InspBoolRow label="hasUnderline" value={attrs.hasUnderline} />
        {chips.length > 0 && (
          <div style={{ marginTop: 6 }}>
            {chips.map(c => (
              <span key={c.label} className={`vai-attr-chip ${c.cls}`}>{c.label}</span>
            ))}
          </div>
        )}
      </div>

      <div className="vai-insp-section">
        <span className="vai-insp-title">Text Preview</span>
        <div className={`vai-insp-text-preview${!text.trim() ? ' empty' : ''}`}>
          {text || '(empty paragraph)'}
        </div>
      </div>

      <div className="vai-insp-section">
        <span className="vai-insp-title">
          OOXML
          <button className="vai-ooxml-toggle-btn" onClick={() => setOoxmlVisible(v => !v)}>
            {ooxmlVisible ? 'collapse' : 'expand'}
          </button>
        </span>
        {ooxmlVisible && (
          <pre className="vai-ooxml-block">{normalizeOoxml(ooxml)}</pre>
        )}
      </div>

      <div className="vai-insp-section">
        <span className="vai-insp-title">Binds</span>
        {(!node.binds || !node.binds.length)
          ? <div className="vai-binds-empty">(none)</div>
          : <pre className="vai-binds-pre">{JSON.stringify(node.binds, null, 2)}</pre>
        }
      </div>
    </div>
  );
}



// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
//
// Props:
//   data          {object}   — view-ast JSON ({ schema, numbering, nodes })
//                              Also accepts API format ({ contract_id, version_number, nodes })
//   onNodeSelect  {function} — called with the full node object when a node is selected
// ─────────────────────────────────────────────────────────────────────────────
export default function ViewAstInspector({ data: rawData,onNodeSelect,onExplain,onAdd}) {
  // Accept both file format { schema, nodes } and API format { contract_id, nodes }
  const data = useMemo(() => {
    if (!rawData) return null;
    if (!rawData.nodes || !Array.isArray(rawData.nodes)) return null;
    if (rawData.schema) return rawData;
    return { schema: 'view-ast', numbering: rawData.numbering || {}, nodes: rawData.nodes };
  }, [rawData]);

  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [popupPos, setPopupPos] = useState(null);
const [showPopup, setShowPopup] = useState(false);

  // Refs to avoid stale closures in effects
  const selectedIdxRef  = useRef(-1);
  const onNodeSelectRef = useRef(onNodeSelect);
  const indexListRef    = useRef(null);
  const docPanelRef     = useRef(null);

  useEffect(() => { onNodeSelectRef.current = onNodeSelect; }, [onNodeSelect]);

  // Reset selection and search when data changes
  useEffect(() => {
    setSelectedIdx(-1);
    selectedIdxRef.current = -1;
    setSearchQuery('');
  }, [data]);

  // Pre-compute list labels sequentially — NumberingContext is stateful and
  // must iterate nodes in order, so we do this once per data load.
  const listLabels = useMemo(() => {
    if (!data) return {};
    const ctx    = new NumberingContext(data.numbering || {});
    const labels = {};
    for (const node of data.nodes) {
      if (node.type !== 'paragraph') continue;
      const pEl  = parseXml(node.ooxml).documentElement;
      const pPr  = wEl(pEl, 'pPr');
      if (!pPr) continue;
      const numPr = wEl(pPr, 'numPr');
      if (!numPr) continue;
      const numId = wVal(wEl(numPr, 'numId'));
      const ilvl  = parseInt(wVal(wEl(numPr, 'ilvl')) || '0', 10) || 0;
      if (numId && numId !== '0') {
        labels[node.index] = { label: ctx.nextLabel(numId, ilvl), ilvl };
      }
    }
    return labels;
  }, [data]);

  // Hidden node indices (search filter)
  const hiddenIndices = useMemo(() => {
    if (!data || !searchQuery) return new Set();
    const q = searchQuery.toLowerCase().trim();
    const hidden = new Set();
    data.nodes.forEach((n, i) => {
      const match = (n.text_preview || '').toLowerCase().includes(q)
        || String(n.index).includes(q)
        || n.type.includes(q)
        || n.id.includes(q);
      if (!match) hidden.add(i);
    });
    return hidden;
  }, [data, searchQuery]);

  // Stable select handler (useCallback so DocNode/IndexItem memo is effective)
 const handleSelectNode = useCallback((idx, e) => {
  setSelectedIdx(idx);
  selectedIdxRef.current = idx;

  if (data?.nodes[idx]) {
    const rect = e.currentTarget.getBoundingClientRect();

    setPopupPos({
      boundingRect: {
        x1: rect.left,
        y1: rect.top,
      }
    });

    setShowPopup(true);

    if (onNodeSelectRef.current) {
      onNodeSelectRef.current(data.nodes[idx]);
    }
  }
}, [data]);

  // Scroll selected items into view
  useEffect(() => {
    if (selectedIdx < 0) return;
    const idxItem = indexListRef.current?.querySelector(`[data-array-idx="${selectedIdx}"]`);
    if (idxItem) idxItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    const docNode = docPanelRef.current?.querySelector(`[data-array-idx="${selectedIdx}"]`);
    if (docNode) docNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedIdx]);

  // Keyboard navigation (arrow keys / Escape)
  useEffect(() => {
    if (!data?.nodes?.length) return;
    const nodeCount = data.nodes.length;

    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const curr = selectedIdxRef.current;
        const next = curr < 0 ? 0 : Math.min(curr + 1, nodeCount - 1);
        if (next !== curr || curr < 0) handleSelectNode(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const curr = selectedIdxRef.current;
        if (curr <= 0) return;
        handleSelectNode(curr - 1);
      } else if (e.key === 'Escape') {
        setSearchQuery('');
        setShowPopup(false);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [data, handleSelectNode]);

  // Close popup when clicking outside
  useEffect(() => {
    if (!showPopup) return;

    const handleClickOutside = (e) => {
      // Check if click is on popup or its children
      const popup = document.querySelector('.vai-popup');
      if (popup && !popup.contains(e.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopup]);

  if (!data) {
    return (
      <div className="vai-root">
        <div className="vai-no-data">No AST data provided</div>
      </div>
    );
  }

  const { nodes, numbering } = data;
  const selectedNode = selectedIdx >= 0 ? nodes[selectedIdx] : null;

  const renderPopup = (pos, nodeId, index, onAddCallback, onExplainCallback, isLoading) => {
  return (
    <div
      className="vai-popup"
      style={{
        position: "fixed",
        top: pos?.boundingRect?.y1 - 10,
        left: pos?.boundingRect?.x1 + 120,
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        borderRadius: "12px",
        padding: "12px",
        width: "auto",
        minWidth: "200px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        overflow: "hidden",
        border: `1px solid var(--text-teritary)`,
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
        backdropFilter: "blur(10px)",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          onExplainCallback && onExplainCallback(nodeId, index);
          setShowPopup(false);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 14px",
          backgroundColor: "transparent",
          // border: "1px solid var(--text-teritary)",
          borderRadius: "8px",
          color: "var(--text)",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "var(--bg-primary)";
          // e.target.style.borderColor = "var(--text)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          // e.target.style.borderColor = "var(--text-teritary)";
        }}
        className="popup-btn-icon"
      >
        <Sparkles size={18} />
        <span>Explain this</span>
      </button>

      <button
        onClick={() => {
          onAddCallback && onAddCallback(nodeId, index);
          setShowPopup(false);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 14px",
          backgroundColor: "transparent",
          // border: "1px solid var(--text-teritary)",
          borderRadius: "8px",
          color: "var(--text)",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.2s ease",
          fontFamily: "inherit",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "var(--bg-primary)";
          // e.target.style.borderColor = "var(--text)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent";
          // e.target.style.borderColor = "var(--text-teritary)";
        }}
        className="popup-btn-icon"
      >
        <SquarePen size={18} />
        <span>Mark with Notes</span>
      </button>
    </div>
  );
};

  return (
    <div className="vai-root">
      
      <div className="vai-main">
       {showPopup && popupPos && selectedNode &&
  renderPopup(
    popupPos,
    selectedNode.id,
    selectedNode.index,
    onAdd,
    onExplain,
    false
  )
}
        {/* Document panel */}
        <div className="vai-doc-panel">
          <div className="vai-doc-page" ref={docPanelRef}>
            {nodes.map((node, i) => (
              <DocNode
                key={node.id}
                node={node}
                arrayIdx={i}
                listInfo={listLabels[node.index]}
                selected={i === selectedIdx}
                onSelect={handleSelectNode}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
