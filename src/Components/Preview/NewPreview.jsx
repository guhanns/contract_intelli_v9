import React, { useState } from "react";
import "./newPreview.css";

const NewPreview = ({ data, onExplain,onAdd,isExplainLoad }) => {
    const [popupState, setPopupState] = useState(null);

  
  const handleNodeClick = (e, node) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setPopupState({
      nodeId: node.id,
      index: node.index,
      boundingRect: {
        x1: rect.left,
        y1: rect.top,
      },
    });
  };

  const closePopup = () => {
    setPopupState(null);
  };

  const handleExplain = () => {
    onExplain?.(popupState.nodeId, popupState.index);
  };

  const handleAdd = () => {
    onAdd?.(popupState.nodeId, popupState.index);
  };

  return (
    <div className="doc-container" onClick={closePopup}>
      {data?.nodes?.map((node) => {
        if (node.type === "sectPr") return null;

        return (
          <div
           key={node.id}
  className="doc-line"
  data-node-id={node.id}
  data-index={node.index}
  onClick={(e) => {
    e.stopPropagation();
    handleNodeClick(e, node);
  }}
          >
            <p
              className={`doc-paragraph ${
                node.attrs?.hasBold ? "bold" : ""
              } ${node.attrs?.hasItalic ? "italic" : ""}`}
            >
              {node.text_preview}
            </p>
          </div>
        );
      })}

      {popupState &&
        renderPopup(
          popupState,
          handleAdd,
          handleExplain,
          isExplainLoad
        )}
        
    </div>

  )
};

const renderPopup = (pos, onAdd, onExplain, isLoading) => {
  return (
    <div
      style={{
        position: "fixed",
        top: pos?.boundingRect?.y1 - 10,
        left: pos?.boundingRect?.x1 + 120,
        backgroundColor: "var(--bg)",
        color: "var(--text)",
        borderRadius: "10px",
        padding: "8px 0",
        width: "180px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={onExplain}
        className="popup-btn"
      >
        Explain this
      </button>

      <button
        onClick={onAdd}
        className="popup-btn border-top"
      >
        Mark with Notes
      </button>
    </div>
  );
};

export default NewPreview;