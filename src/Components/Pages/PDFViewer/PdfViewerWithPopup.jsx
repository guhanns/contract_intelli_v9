import React, { useEffect, useRef, useState } from "react";
import {
  PdfLoader,
  PdfHighlighter,
  Tip,
  Highlight,
} from "react-pdf-highlighter";
import { Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import request from "../../../api/api";
import './pdfviewerwithpopup.css'
import { useTheme } from "../../../Themecontext";
import { useMsal } from "@azure/msal-react";
import toast from "react-hot-toast";
import { SquarePen } from "lucide-react";
import aiStar from "../../../images/icons/ai_star.svg"
import aiSummary from "../../../images/icons/ai_summary.svg"
import close from "../../../images/icons/x-close.svg"
import sample from './Gen Pharma Agreement.pdf'
import 'react-pdf-highlighter/dist/style.css'

const PdfViewerWithPopup = ({ file, filename, contract, fetchList, width }) => {
  const { theme } = useTheme();
  const [highlights, setHighlights] = useState([]);
  const [selectedText, setSelectedText] = useState("");
  const { accounts } = useMsal();
  const [popupPos, setPopupPos] = useState(null);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [isExplain, setIsExplain] = useState(false);
  const [isExplainLoad, setIsExplainLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [extraction, setExtraction] = useState({});
  const containerRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [scale, setScale] = useState(1);
  const [modal, setModal] = useState(false);
  const pdfUrl = file;

  // Fetch highlights/comments on mount/update

    const toggle = () => setModal(!modal);


  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      // auto-calculate scale if you want to fit width
      const containerWidth = containerRef.current.offsetWidth;
      const newScale = containerWidth < 800 ? 0.9 : 1.1;
      setScale(newScale);
      setRefreshKey((prev) => prev + 1); // force PDF refresh
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [width]);
 

  const fetchCommentList = () => {
    request({
      url: `/icontract/backend/redlining/comments/${contract?.id}`,
      method: "GET",
    })
      .then((res) => {
        setHighlights(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

   useEffect(() => {
    if (contract?.id ) fetchCommentList();
  }, [contract?.id]);

  // Save comment & update highlights
  const handleAddComment = (highlight) => {
    if (!comment.trim() || !selectedText) return;
    const newHighlight = {
      ...highlight,
      selected_text: selectedText,
      comment,
      commented_by: accounts[0]?.name,
      section: highlight.position?.pageNumber,
      action_type: "",
      id: contract?.id,
      color: "rgba(255, 255, 0, 0.2)",
    };
   
    // request({
    //   url: '/icontract/backend/redlining/comments',
    //   method: 'POST',
    //   data: newHighlight,
    // })
    //   .then(() => {
    //     fetchCommentList();
    //     fetchList();
    //     toast.success("Comment Added");
    //     setSelectedText("");
    //     setComment("");
    //     setPopupPos(null);
    //     setShowCommentBox(false);
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   });
  };

  // Explain API
  const handleExplainThis = async (highlight) => {
    setIsExplainLoad(true);
    if (!selectedText.trim()) return;
    try {
      const res = await request({
        url: `/icontract/chatbot/chat_document/${filename}`,
        method: "POST",
        params: {
          s3_filename:filename,
          query: selectedText,
          query_intent:'explain_clause'
        },
      });
      if (res.success) {
        setIsExplain(true);
        setIsLoading(false);
        setExtraction(res);
        setIsExplainLoad(false);
      }
    } catch (error) {
      console.error("Explain API error:", error);
    } finally {
      setSelectedText("");
      setPopupPos(null);
      setIsExplainLoad(false);
    }
  };

  const [tipPosition, setTipPosition] = useState(null);
const [currentHighlight, setCurrentHighlight] = useState(null);

// on selection finished, save position and content to show popup
const handleSelectionFinished = (position, content, hideTipAndSelection) => {
  setTipPosition(position);
  console.log(position,content)
  setSelectedText(content?.text || "");
  setShowCommentBox(false);
  setComment("");
  setCurrentHighlight({ position, content });
  // do not call hideTipAndSelection yet; call it after user action
};

// on popup "Explain this" click
const onExplainClick = async () => {
  if (!currentHighlight || !selectedText.trim()) return;
  await handleExplainThis(currentHighlight);
  setTipPosition(null);
};

// on popup "Mark with notes" click
const onMarkNotesClick = () => {
  setShowCommentBox(true);
};

// on comment box save
const onSaveComment = () => {
  if (!currentHighlight) return;
  const newHighlight = {
    selected_text: selectedText,
    comment,
    commented_by: accounts[0]?.name,
    section: currentHighlight.position?.pageNumber,
    action_type: "",
    id: contract?.id,
    rect:JSON.stringify({...currentHighlight,comment}),
    color: "rgba(255, 255, 0, 0.2)",
  };

   request({
      url:'/icontract/backend/redlining/comments',
      method:'POST',
      data:newHighlight
    }).then((res)=>{
        fetchCommentList()
        fetchList()
        toast.success("Comment Added");
        setComment("");
        setShowCommentBox(false);
        setTipPosition(null);
        setSelectedText("");
    }).catch((err)=>{
      console.log(err)
    })
  // optionally save to backend here
};

// on comment box cancel
const onCancelComment = () => {
  setShowCommentBox(false);
  setTipPosition(null);
  setSelectedText("");
};

 const handleCloseExtraction = () => {
    setIsExplain(false);
    setExtraction({});
    setIsLoading(true);
  };

  const handleMouseDown =()=>{
    setTipPosition(null)
    setSelectedText('')
  }

  console.log(width)

  // Custom popup for comment/explain
  const renderPopup = (pos, onAdd, onExplain, isLoading) => {
    return (
      <div
        style={{
          position: "absolute",
          top: pos?.boundingRect?.y1,
          left: (pos?.boundingRect?.x1 + 80),
          transform: "translate(-50%, -110%)",
          backgroundColor: "var(--bg)",
          color: "var(--text)",
          borderRadius: "10px",
          padding: "8px 0",
          width: "180px",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          onClick={onExplain}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--text)",
            padding: "10px 16px",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              theme === "Dark" ? "#1e293b" : "#dfdfdfff")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <span style={{ fontSize: "16px" }}>
            <img
              src={aiStar}
              style={{ width: "20px", height: "20px" }}
              alt=""
            />
          </span>
          Explain this {isExplainLoad ? <Spinner size={8} /> : ""}
        </button>
        {!isExplainLoad && (
          <button
            onClick={onAdd}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text)",
              padding: "10px 16px",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              transition: "background 0.2s",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                theme === "Dark" ? "#1e293b" : "#dfdfdfff")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <span style={{ fontSize: "16px" }}>
              <SquarePen color="#94969C" />
            </span>
            Mark with Notes
          </button>
        )}
      </div>
    );
  };

  // Comment box UI
  // const renderCommentBox = (pos, onSave, onCancel) => (
  //   <div
  //     style={{
  //       position: "absolute",
  //       top: pos?.boundingRect?.y1,
  //       left: pos?.boundingRect?.x1 + 100,
  //       transform: "translate(-50%, -100%)",
  //       background: "#111827",
  //       color: "#fff",
  //       borderRadius: "12px",
  //       boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
  //       zIndex: 10,
  //       padding: "16px",
  //       width: "280px",
  //       fontFamily: "Inter, sans-serif",
  //     }}
  //     onMouseDown={(e) => e.stopPropagation()}
  //   >
  //     <div style={{
  //       display: "flex",
  //       justifyContent: "space-between",
  //       alignItems: "center",
  //       marginBottom: "10px",
  //     }}>
  //       <div style={{ fontWeight: "600", fontSize: "14px" }}>
  //         Mark with Comments
  //       </div>
  //       <button
  //         onClick={onCancel}
  //         style={{
  //           background: "transparent",
  //           border: "none",
  //           color: "#9ca3af",
  //           fontSize: "16px",
  //           cursor: "pointer",
  //         }}
  //       >
  //         ×
  //       </button>
  //     </div>
  //     <textarea
  //       rows={3}
  //       value={comment}
  //       placeholder="Type your comment..."
  //       onChange={e => setComment(e.target.value)}
  //       style={{
  //         width: "100%",
  //         background: "#1f2937",
  //         color: "#fff",
  //         fontSize: "13px",
  //         padding: "8px",
  //         border: "1px solid #374151",
  //         borderRadius: "8px",
  //         resize: "none",
  //         outline: "none",
  //       }}
  //     />
  //     <div style={{
  //       marginTop: "14px",
  //       display: "flex",
  //       justifyContent: "flex-end",
  //       gap: "8px",
  //     }}>
  //       <button onClick={onCancel} style={{
  //         background: "#1f2937",
  //         color: "#d1d5db",
  //         border: "1px solid #374151",
  //         borderRadius: "8px",
  //         padding: "6px 12px",
  //         cursor: "pointer",
  //         fontSize: "13px",
  //       }}>Cancel</button>
  //       <button onClick={onSave} style={{
  //         background: "linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)",
  //         color: "#fff",
  //         border: "none",
  //         borderRadius: "8px",
  //         padding: "6px 12px",
  //         cursor: "pointer",
  //         fontWeight: "500",
  //         fontSize: "13px",
  //       }}>Save Comments</button>
  //     </div>
  //   </div>
  // );

  const addHighlight = (highlight) => {
    // Prompt user for a comment (very simple for demo)
    const comment = prompt("Add a comment to your highlight:");
    // Store highlight along with comment
    setHighlights([
      ...highlights,
      { ...highlight, comment: { text: comment } }
    ]);
  };

  console.log(highlights)

  

  return (
    <div
      style={{ height: "100vh", position: "relative" }}
      onMouseDown={handleMouseDown}
    >
      <PdfLoader key={refreshKey} url={file} className="pdf-light">
        {(pdfDocument) => (
          <>
            <PdfHighlighter
            key={refreshKey}
              pdfDocument={pdfDocument}
              scale={1}
              highlights={highlights.map((li) => li.rect)}
              onSelectionFinished={handleSelectionFinished}
              highlightTransform={(
                highlight,
                index,
                setTip,
                hideTip,
                viewportToScaled,
                screenshot,
                isScrolledTo
              ) => (
                <Highlight
                  key={index}
                  isScrolledTo={isScrolledTo}
                  position={highlight.position}
                  comment={highlight.comment}
                  pageIndex={highlight.position.pageNumber}
                  onClick={() =>
                    setTip(highlight, () => <div>{highlight?.comment}</div>)
                  }
                />
              )}
              onHighlightClicked={(highlight) => {
                alert(highlight.comment.text);
              }}
            />

            {/* Render popup for Explain this / Mark with notes */}
            {tipPosition &&
              !showCommentBox &&
              renderPopup(
                tipPosition,
                onMarkNotesClick,
                onExplainClick,
                isExplainLoad
              )}
          </>
        )}
      </PdfLoader>
      {/* Explain Modal */}
      <Modal
        isOpen={isExplain}
        toggle={handleCloseExtraction}
        centered
        zIndex={4000}
        size="md"
        style={{
          padding: "24px",
        }}
      >
        <ModalHeader
          toggle={handleCloseExtraction}
          className="Modal-head-explainthis"
        >
          <img
            src={aiSummary}
            style={{ width: "40px", height: "40px", marginRight: "8px" }}
          />
          {`AI Summary`}
        </ModalHeader>
        <ModalBody className="Modal-body-explainthis">
          {isLoading ? "Loading..." : extraction?.llm_response}
        </ModalBody>
      </Modal>
      <Modal
        isOpen={showCommentBox}
        centered
        size="md"
        zIndex={4000}
        style={{
          padding: "34px",
        }}
      >
        <div className="modal-mark-with" >
          Mark With Comments
          <img src={close} onClick={onCancelComment}/>
        </div>
        <ModalBody>
          <div className="modal-comments-modal">
            <label>Comments</label>
          </div>
          <textarea
           
            rows={7}
            value={comment}
            placeholder="Type your comment..."
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: "100%",
              background: "var(--white-bg)",
              color: "var(--modal-text-area)",
              fontSize: "13px",
              padding: "8px",
              border: "1px solid #374151",
              borderRadius: "8px",
              resize: "none",
              outline: "none",
            }}
          />
          <div class="modal-actions px-0 py-3">
            <button class="cancel-btn m-0" onClick={onCancelComment}>
              Cancel
            </button>
            <button class="save-btn m-0" onClick={onSaveComment}>
              Save Comments
            </button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default PdfViewerWithPopup;
