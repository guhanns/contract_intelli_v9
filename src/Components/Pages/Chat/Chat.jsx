import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import Layouts from "../Layouts/Layouts";
import { useMsal } from "@azure/msal-react";
import externalLink from "../../../images/icons/external-link.svg";
import logo from "../../../images/icons/SRM_chat-logo.svg";
import pdfRedIcon from "../../../images/icons/pdf-red-icon.svg";
import close from "../../../images/icons/x-close.svg";
import maximize from "../../../images/icons/maximize.svg";
import loadingImg from "../../../images/icons/Group 3.svg";
import lightLoading from "../../../images/icons/lightLoading.svg";
import pricingPdf from "./Product_Pricing_Table.pdf";
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Modal, ModalBody, ModalHeader } from "reactstrap";
import request, { NodeURL } from "../../../api/api";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from 'react-markdown';
import {
  addMessageByBot,
  addMessageByUser,
} from "../../redux/features/chat.bot";
import axios from "axios";
import { loadingStatus } from "../../Preview/Preview";
import toast from "react-hot-toast";
import { useTheme } from "../../../Themecontext";

const messages = [
  {
    question: "who are all the teams in the formula 1?",
    thread_id: "memory-test",
  },
  {
    answer:
      "As of the 2023 Formula 1 season, there are 10 teams competing in the championship. Here is the list of teams:\n\n1. Mercedes-AMG Petronas Motorsport (Mercedes)\n2. Scuderia Ferrari (Ferrari)\n3. Red Bull Racing (Red Bull)\n4. McLaren F1 Team (McLaren)\n5. Alpine F1 Team (Alpine)\n6. Aston Martin Aramco Cognizant Formula One Team (Aston Martin)\n7. Scuderia AlphaTauri (AlphaTauri)\n8. Williams Racing (Williams)\n9. Haas F1 Team (Haas)\n10. Alfa Romeo F1 Team (Alfa Romeo)\n\nNote: In 2024, Alfa Romeo will be rebranded to Audi, and the team will be known as Audi F1 Team.\n\nPlease keep in mind that team names, sponsors, and liveries can change from season to season, so this information might not be valid in the future.",
    thread_id: "memory-test",
  },
];

function Chat() {
  const { chatMessages } = useSelector((state) => state.chat);
  const { theme, toogleTheme } = useTheme();
  const chatEndRef = useRef(null);
  const dispatch = useDispatch();
  const { instance, accounts } = useMsal();
  const [isMaxi, setIsMaxi] = useState(false);
  const [isPdfPreview, setIsPdfPreview] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const [activeTab,setActiveTab] = useState('entities')
   const [accordionOpen, setAccordionOpen] = useState("");
   const [isDataLoading,setIsDatLoading] = useState(true)
   const [entities,setEntities] = useState({})
   const [statusIndex, setStatusIndex] = useState(0);
  const[pdfUrl,setPdfUrl]= useState({
    url:'',
    filename:''
  })
  const [sampleQ,setSampleQ] = useState([])

  const chatMessage = (msg) => {
    setIsLoading(true);
    let question = sendMessage 
    if(msg){
      question = msg
    }
   
    if(!question) {
      return toast.error("Please Enter Something!")
    }
    setSendMessage("");
    dispatch(addMessageByUser(question));
    axios.post(`${NodeURL}/icontract/chatbot/ask`,{question:question}).then((res) => {
        setIsLoading(false);
        // setMessages(res?.data?.);
        dispatch(addMessageByBot(res?.data))
      })
      .catch((err) => {
        console.log(err);
        setSendMessage('')
      });
  };

  const loadPdf = (filename,contract_number,version) => {
  axios
    .get(`${NodeURL}/icontract/backend/download/${filename}`, {
      responseType: 'blob',  // Important to handle PDF correctly
    })
    .then(async(res) => {
      if(!isPdfPreview) setIsPdfPreview(!isPdfPreview);
      let blobUrl = URL.createObjectURL(res.data);
      setPdfUrl({
        url:blobUrl,
        filename:filename
      });
      
      if(contract_number) fetchActiveContract(contract_number,version)
    })
    .catch((err) => {
      console.log(err);
    });
};

const fetchActiveContract =(contract_number,version)=>{
  setIsDatLoading(true)
    request({
         url:`/icontract/backend/AllColumns/${contract_number}/${version}`,
        method:'GET',
    }).then((res)=>{
        if(res.success){
          setIsDatLoading(false)
            setEntities(res)
        }
    }).catch((err)=>{
        console.log(err)
    })
  }


const getSampleQuestion =()=>{
  axios.get(`${NodeURL}/icontract/chatbot/sample_questions`).then((res)=>{
      setSampleQ(res.data?.sample_questions?.splice(0,3))
  }).catch((err)=>{
    console.log(err)
  })
}

useEffect(()=>{
  if(sendMessage==='') setMessages('')
},[sendMessage])

useEffect(()=>{
  getSampleQuestion()
},[])


 const toggleAccordion = (id) => {
    if (accordionOpen.includes(id)) {
      setAccordionOpen((prev) => prev.filter((item) => item !== id)); // remove if already open
    } else {
      setAccordionOpen((prev) => [...prev, id]); // add if not open
    }
  };

 useEffect(() => {
    if (!isDataLoading) return;

    const interval = setInterval(() => {
      setStatusIndex((prevIndex) => (prevIndex + 1) % loadingStatus.length);
    }, 8000); // 10 seconds

    return () => clearInterval(interval); // cleanup
  }, [isDataLoading]);

    useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages])


  return (
    <Layouts>
      <div className="main-chat-box">
        <div className={`container chat ${isPdfPreview ? "preview" : ""}`}>
          <div className="chat-box">
            {chatMessages.length <= 0 ? (
              <div className="initial-chat">
                <h1 className="chat-user">
                  Hi, {accounts[0]?.name ?? "User"}!
                </h1>
                <h1 className="chat-help">How can I help you?</h1>
                <div className="initial-question">
                  <div className="row g-2">
                    {sampleQ?.length > 0 &&
                      sampleQ?.map((que) => {
                        return (
                          <div className="col-4">
                            <div className="q-box">
                              <h6>{que}</h6>
                              <div className="text-end ex-link">
                                <img
                                  src={externalLink}
                                  onClick={() => chatMessage(que)}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    {/* <div className="col-4">
                      <div className="q-box">
                        <h6>Explain how rebate tiers are calculated?</h6>
                        <div className="text-end ex-link">
                          <img src={externalLink} />
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="q-box">
                        <h6>Explain how rebate tiers are calculated?</h6>
                        <div className="text-end ex-link">
                          <img src={externalLink} />
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {chatMessages.map((msg) => {
                  return (
                    <>
                      {msg.role === "user" ? (
                        <div className="chat-right">
                          <div className="chat-msg right">
                            {/* <div className="by">You</div> */}
                            <div className="msg right">{msg.message}</div>
                          </div>
                        </div>
                      ) : msg.role === "bot" ? (
                        <div className="chat-left">
                          <div className="logo-round">
                            <img src={logo} className="srm-bot" />
                          </div>
                          <div className="chat-msg ">
                            <div className="by">SRM Bot</div>
                            <div className="msg">
                              <ReactMarkdown >
                                {msg?.message?.answer.replace(/•/g,'-')}
                              </ReactMarkdown>
                              {/* {renderBulletPoints()} */}
                            </div>
                            {msg?.document_versions?? (
                              <div className="mb-5">
                                <div>
                                  {msg?.message?.document_versions.length >
                                    0 && (
                                    <>
                                      <span className="text-secondary">
                                        Source{" "}
                                      </span>
                                      {msg?.message?.document_versions?.map(
                                        (pdf) => {
                                          return (
                                            <>
                                              <img
                                                src={pdfRedIcon}
                                                className="pdf-icons"
                                                onClick={() =>
                                                  loadPdf(pdf.filename, pdf?.contract_number,pdf?.version)
                                                }
                                                title={pdf}
                                              />
                                            </>
                                          );
                                        }
                                      )}
                                    </>
                                  )}

                                  {/*                                   
                                  <img
                                    src={pdfRedIcon}
                                    className="pdf-icons"
                                    onClick={() =>
                                      setIsPdfPreview(!isPdfPreview)
                                    }
                                  /> */}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  );
                })}
                <>
                  {isLoading ? (
                    <>
                      <div className="chat-left">
                        <div className="logo-round">
                          <img src={logo} className="srm-bot" />
                        </div>
                        <div className="chat-msg ">
                          <div className="by">SRM Bot</div>
                          <div>
                            <div class="loader">
                              <li class="ball"></li>
                              <li class="ball"></li>
                              <li class="ball"></li>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    ""
                  )}
                </>
              </>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-search">
            <input
              className="chat-search-input"
                placeholder="Ask your question"
              value={sendMessage}
              onChange={(e) => {
                setSendMessage(e.target.value);
              }}
              onKeyDown={(e) => e.key === "Enter" && chatMessage()}
            />
            <div>
              <button
                className="chat-send-btn"
                onClick={() => chatMessage()}
              ></button>
            </div>
          </div>
        </div>
        <div className={`chat-preview-pdf ${isPdfPreview ? "" : "preview"}`}>
          <div className="pdf-preview-head">
            <div className="pdf-head">{pdfUrl?.filename}</div>
            <div>
              <button
                className="pdf-close me-4"
                onClick={() => setIsMaxi(!isMaxi)}
              >
                <img src={maximize} />
              </button>
              <button
                className="pdf-close"
                onClick={() => setIsPdfPreview(!isPdfPreview)}
              >
                <img src={close} />
              </button>
            </div>
          </div>
          <div className="pdf-nav">
            <div
              className={`tab-1 ${activeTab === "entities" ? "active" : ""}`}
              onClick={() => setActiveTab("entities")}
            >
              Contract Entities
            </div>
            <div class="divider"></div>
            <div
              className={`tab-1 ${activeTab === "preview" ? "active" : ""}`}
              onClick={() => setActiveTab("preview")}
            >
              File Preview
            </div>
          </div>
          <div>
            { activeTab === "entities" ? (
              isDataLoading ? (
              <>
                <div className="container my-5 p-0 loading-contract">
                  <div className="w-50 m-auto text-center">
                    <img src={theme ==="Dark" ? loadingImg :lightLoading} className="loadingimg" />
                    <h5 className="loading-info">
                      <i>{loadingStatus[statusIndex]}</i>
                    </h5>
                  </div>
                </div>
              </>
            ) :
              <div className="chat-preview-acc-box">
                <Accordion
                  open={accordionOpen}
                  toggle={toggleAccordion}
                  flush
                  className="chat-preview-acc"
                >
                  <AccordionItem>
                    <AccordionHeader targetId={1}>
                      Contract Offer
                    </AccordionHeader>
                    <AccordionBody accordionId={1}>
                      <ul className="acc-list-data">
                        {entities?.contracts.length > 0 &&
                          Object.entries(entities?.contracts[0]).map(
                            ([key, value], index) => (
                              key !=="id" ?
                              <li key={index}>
                                <span className="text-capitalize">
                                  {key.replace(/_/g, " ")}:
                                </span>
                                {String(value)}
                              </li>
                            :'')
                          )}
                      </ul>
                    </AccordionBody>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionHeader targetId={2}>
                      Product Group
                    </AccordionHeader>
                    <AccordionBody accordionId={2}>
                      <ul className="acc-list-data">
                        {entities?.contracts?.length > 0 &&
                          Object.entries(entities?.contracts[0])
                            .filter(([key]) =>
                              [
                                "adjust_by",
                                "category_pricing",
                                "price_list_name",
                                "pricing_method",
                              ].includes(key)
                            )
                            .map(([key, value], index) =>
                              (
                                <li key={index}>
                                  <span className="text-capitalize">
                                   {key.replace(/_/g, " ")}:
                                  </span>{" "}
                                  {String(value)}
                                </li>
                              ) 
                            )}
                      </ul>
                    </AccordionBody>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionHeader targetId={3} className="tiered-head">
                      Tiered Summary
                    </AccordionHeader>
                    <AccordionBody accordionId={3} className="tiered-body">
                      {entities?.tier_structures.length>0 && entities?.tier_structures?.map((list, idx) => {
                          return (
                            <ul className="acc-list-data tiered">
                              <li className="hdr">
                                <h6>
                                  Tier Level :
                                  <span className="cnt">0{list?.tier_level}</span>{" "}
                                </h6>
                              </li>
                              <li className="hdr">
                                <div className="d-flex justify-content-between text-start">
                                  <div className="ndc-num ndc-bg">
                                    <span className="tier-span">
                                      Purchase Volume Min
                                    </span>
                                    <h5>{list?.volume_min ?? "-"}</h5>
                                  </div>
                                  <div className="wac-price ndc-bg">
                                    <span className="tier-span">
                                      Purchase Volume Max
                                    </span>
                                    <h5 className="">
                                      {list?.volume_max ?? "-"}
                                    </h5>
                                  </div>
                                </div>
                              </li>
                              <li className="split-li-sum">
                                <div className="d-flex justify-content-around">
                                  <div className="ndc-num">
                                    <h5>
                                      <span className="tier-span">
                                        Price Discount (%)
                                      </span>{" "}
                                    </h5>
                                    <h5>{list?.discount_percentage}%</h5>
                                  </div>
                                  <div className="ndc-num">
                                    <h5>
                                      <span className="tier-span">
                                        Admin Fees(%)
                                      </span>{" "}
                                    </h5>
                                    <h5>
                                      {list?.admin_fee_percentage}%
                                    </h5>
                                  </div>
                                  <div className="ndc-num">
                                    <h5>
                                      <span className="tier-span">
                                        Rebate(%)
                                      </span>{" "}
                                    </h5>
                                    <h5>{list?.rebate_percentage}%</h5>
                                  </div>
                                </div>
                              </li>
                              
                            </ul>
                          );
                        })}
                    </AccordionBody>
                  </AccordionItem>

                  <AccordionItem>
                    <AccordionHeader className="tiered-head" targetId={4}>
                      Tiered LI
                    </AccordionHeader>
                    <AccordionBody accordionId={4} className="tiered-body">
                      {entities?.products?.length>0 && entities?.products?.map((list) => {
                          return (
                            <ul className="acc-list-data tiered">
                              <li className="hdr">
                                <div className="d-flex justify-content-between">
                                  <div className="ndc-num">
                                    <span>NDC Number</span>
                                    <h5>{list?.ndc_number}</h5>
                                  </div>
                                  <div className="wac-price">
                                    <span>WAC Price</span>
                                    <h5 className="text-end">
                                      {list?.wac_price}
                                    </h5>
                                  </div>
                                </div>
                              </li>
                              {list?.tiers?.map((tierData) => {
                                return (
                                  <li className="split-li">
                                    <div className="d-flex align-items-center justify-content-between tier-split">
                                      <div className="">
                                        <h6>Tier {tierData?.tier}</h6>
                                      </div>
                                      <div className="">
                                        <h6>
                                          <span>Discount </span>:{" "}
                                          {tierData?.discount}
                                        </h6>
                                      </div>
                                      <div>
                                        <h6>
                                          <span>Final Price</span> :{" "}
                                          {tierData?.final_price}
                                        </h6>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                              
                            </ul>
                          );
                        })}
                    </AccordionBody>
                  </AccordionItem>
                </Accordion>
              </div>
            ) : activeTab === "preview" ? (
              <iframe src={pdfUrl?.url} width={"90%"} height={"950px"}></iframe>
              // <PDFViewer url={pdfUrl?.url}/>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isMaxi}
        // toggle={() => setIsMaxi(!isMaxi)}
        centered
        fullscreen
        zIndex={4000}
      >
        <ModalHeader toggle={() => setIsMaxi(!isMaxi)}></ModalHeader>
        <ModalBody>
          <iframe
            src={pdfUrl?.url}
            width={"100%"}
            height={"950"}
            allowFullScreen
          ></iframe>
        </ModalBody>
      </Modal>
    </Layouts>
  );
}

export default Chat;
