import React, { useEffect, useRef, useState, version } from "react";
import Layouts from "../Layouts/Layouts";
import "./contractfile.css";
import { Col, Offcanvas, OffcanvasBody, Row } from "reactstrap";
import uploadLight from "./../../../images/icons/uploadlight.svg";
import uploadImg from "../../../images/icons/upload-ico.svg";
import editImg from "../../../images/icons/edit-02.svg";
import minusImg from "../../../images/icons/minus-circle.svg";
import addFiles from "../../../images/icons/add_files.svg";
import fileImg from "../../../images/icons/file-06.svg";
import search from "../../../images/icons/search-history.svg";
import fileCheckImg from "../../../images/icons/file-check.svg";
import fileSearchImg from "../../../images/icons/file-search.svg";
import { useLocation, useNavigate } from "react-router-dom";
import requestL from "../../../api/lexi";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveContracts } from "../../redux/features/contractSlice";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useTheme } from "../../../Themecontext";
import { useMsal } from "@azure/msal-react";
import TableSkeleton from "../../Skeleton-loading/TableSkeloton";
import upload_doc from "../../../images/upload_icons/upload_doc.svg";
import purpleUpload from './../../../images/upload_icons/upload_doc_light1.svg';
import ListContract from "../EntityExtraction/ListContract";
function ContractFile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [templateList,setTemplateList] = useState([])
  const [selectedTemplate,setSelectedTemplate] = useState({})
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isTemplate,setIsTemplate] = useState(false)
  const [contractList, setContractList] = useState([]);
  const [uploadStatus,setUploadStatus]= useState({})
  const [contractExtraction,setContractExtraction] = useState({})
  const { theme, toogleTheme } = useTheme();
  const { accounts } = useMsal();

  const [isExtracting, setIsExtracting] = useState(false);
  const isProcessed = useRef(false);

  // Get current logged-in user from SSO
  const currentUser = accounts.length > 0 ? accounts[0] : null;
  const userName = currentUser
    ? currentUser.name || currentUser.username || "Unknown User"
    : "Anonymous User";

  const getContractList = async () => {
    setIsLoading(true);
    requestL({
      url: "/contracts",
      method: "GET",
    })
      .then((res) => {
        setIsLoading(false);
        setContractList(res);
        dispatch(saveContracts(res));
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsError(true)
      });
  };

  const getTemplateList = async () => {
    setIsLoading(true);
    requestL({
      url: "/templates",
      method: "GET",
    })
      .then((res) => {
        setIsLoading(false);
        setTemplateList(res);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsError(true)
      });
  };



  useEffect(() => {
    getContractList();
    getTemplateList();
  }, []);

  console.log(location)

useEffect(() => {
  if (!location?.state?.uploadResults) return;

  let intervalId;

  const fetchStatus = () => {
    requestL({
      url: `/contracts/${location?.state?.uploadResults?.[0] ? location?.state?.uploadResults?.[0].data?.contract_id :location?.state?.uploadResults?.contract_id }/status`,
      method: 'GET',
      params: {
        version_number: location?.state?.uploadResults?.[0]? location?.state?.uploadResults?.[0]?.data?.version_number:location?.state?.uploadResults?.version_number
      }
    }).then((res) => {
      setUploadStatus(res);

      if (res?.status === "READY") {
        clearInterval(intervalId);
        getContractList()
      }
    });
  };

  fetchStatus();
  intervalId = setInterval(fetchStatus, 5000);
  return () => clearInterval(intervalId);

}, [location?.state?.uploadResults]);



  const sendtoPreview = (contract, version) => {
    navigate("/list/preview", {
      state: { contractNum: contract, version: version },
    });
  };


   const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const newFiles = selectedFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      type,
      progress: 0,
    }));

   navigate('/list/upload',{state:{file:newFiles}})
  };

  console.log(contractExtraction)

  const handleExtraction = (e,contract) =>{
    e.stopPropagation()
    setIsTemplate(true)
    setContractExtraction(contract)
  }

  const handleSelectTemplate =(template)=>{
    setSelectedTemplate(template)
  }

  const handleStartExtraction =()=>{

    if(!selectedTemplate?.template_id){
      return toast.error("Please Select the Template for Extraction")
    }

    requestL({
      url:'/extract',
      method:'POST',
      data:{
        contract_id:contractExtraction?.contract_id,
        template_id:selectedTemplate?.template_id,
        version_number:contractExtraction?.latest_amendment_number
      }
    }).then((res)=>{
      setIsTemplate(false)
      navigate('/list/preview',{state:{
        contract_id:contractExtraction?.contract_id,
        template_id:selectedTemplate?.template_id,
        version_number:contractExtraction?.latest_amendment_number,
        isExtract:true
      }})
    }).catch((err)=>{
      console.log(err)
    })
  }

  return (
    <Layouts>
      <div className="contract-file-list">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            {contractList?.length > 0 ? (
              <>
                <div className="list-head">
                  <h5>{contractList?.length} Contract Documents</h5>
                  <div className="d-flex gap-2">
                    <div
                      className="total-contract review"
                      data-tip="Review for Ready"
                    >
                      <div className="count-round green">
                        <img src={fileCheckImg} />
                      </div>
                      <div className="count-result">
                        <h5 className="head">Ready for Review</h5>
                        <h3 className="result">{contractList?.length}</h3>
                      </div>
                    </div>

                    <div
                      className="total-contract review"
                      data-tip="Processing Contracts"
                    >
                      <div className="count-round orange">
                        <img src={fileSearchImg} />
                      </div>
                      <div className="count-result">
                        <h5 className="head">Processing Contracts </h5>
                        <h3 className="result">
                          {location?.state?.files?.length ?? 0}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <button
                        className="contract-upld-btn"
                        onClick={() => navigate("/list/upload")}
                      >
                        <img src={theme === "Dark" ? uploadImg : uploadLight} />
                        Upload More Docs
                      </button>
                    </div>

                    <div></div>
                  </div>
                </div>
                <div className="table-list-contract">
                  <table className="Table-contract-list">
                    <thead>
                      <tr className="table-row">
                        {/* <th scope="col" className="check-box-table">
                        <input type="checkbox" />
                      </th> */}
                        <th scope="col" className="doc-boxs">
                          Document Name
                        </th>

                        <th scope="col text-center" className="id-box">
                          Document ID
                        </th>
                        <th scope="col text-center" className="type-box">
                          Doc Type
                        </th>
                        <th scope="col text-center" className="ver-box">
                          Ver. Number
                        </th>
                        <th scope="col text-center" className="ver-box">
                          Created On
                        </th>
                        <th scope="col text-center" className="status-box">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Show analyzing rows while extracting */}
                      {isExtracting &&
                        location?.state?.files?.length > 0 &&
                        location?.state?.files?.map((li) => (
                          <tr
                            className="contract-result-list"
                            key={li?.file?.name}
                          >
                            <td className="doc-boxs" title={li?.file?.name}>
                              {li?.file?.name}
                            </td>
                            <td className="id-box text-center">-</td>
                            <td className="type-box text-center">-</td>
                            <td className="ver-box text-center">-</td>
                            <td className="ver-box text-center">-</td>
                            <td className="status-box text-center">
                              <span className="analyse">
                                {uploadStatus?.status}
                              </span>
                            </td>
                          </tr>
                        ))}

                      {/* Show contracts list if available */}
                      {contractList?.length > 0 &&
                        contractList.map((doc) => (
                          <tr
                            key={
                              doc?.contract_number +
                              "-" +
                              doc?.latest_amendment_number
                            }
                            onClick={() =>
                              sendtoPreview(
                                doc?.contract_number,
                                doc?.latest_amendment_number,
                              )
                            }
                            className="contract-result-list"
                          >
                            <td className="doc-boxs" title={doc?.document_name}>
                              {doc?.original_filename}
                            </td>
                            <td className="id-box text-center">
                              {doc?.contract_number}
                            </td>
                            <td className="type-box text-center">
                              {doc?.original_filename?.split(".")[1]}
                            </td>
                            <td className="ver-box text-center">
                              {doc?.latest_amendment_number}
                            </td>
                            <td className="ver-box text-center">
                              {doc?.uploaded_at &&
                                format(
                                  new Date(doc?.uploaded_at),
                                  "dd-MM-yyyy",
                                )}
                            </td>
                            <td className="status-box text-center">
                              {doc?.status === "READY" ? (
                                <button
                                  className="extraction-btn"
                                  onClick={(e) => handleExtraction(e, doc)}
                                >
                                  Extract
                                </button>
                              ) : (
                                <span className="review">
                                  {uploadStatus?.status === "PROCESSING"
                                    ? uploadStatus?.stages?.length
                                      ? uploadStatus?.stages?.[uploadStatus?.stages?.length - 1]?.stage
                                      : "EXTRACTING"
                                    : "Uploading"}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className="contract-list-err">
                  {isError ? (
                    <>
                      <h4>We couldn’t load your contracts</h4>
                      <h6>Please refresh the page or try again later.</h6>
                    </>
                  ) : (
                    <>
                      <h4>No Contract Found</h4>
                      <h6>
                        Try adjusting your filters or upload a new contract.
                      </h6>
                      <div class="upload-box contract-files-upload">
                        <label
                          for="contractUpload"
                          class="upload-area"
                          style={{ height: 50 }}
                        >
                          <img
                            src={theme === "Dark" ? upload_doc : purpleUpload}
                            className="upload-img"
                          />
                          <span class="text-white-50">
                            <u className="dottedbox-upload-content">
                              Upload Contract Documents
                            </u>
                          </span>
                          <input
                            type="file"
                            id="contractUpload"
                            class="d-none upload-input"
                            accept="application/pdf"
                            multiple
                            onChange={(e) => handleFileChange(e, "contract")}
                          />
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <Offcanvas
        direction="end"
        backdrop={true}
        scrollable={false}
        style={{
          width: "60%",
          marginTop: "80px",
          backgroundColor: "#161B26",

          borderLeft: "2px solid #333741",
        }}
        isOpen={isTemplate}
        toggle={() => setIsTemplate(false)}
      >
        <OffcanvasBody>
          <div className="">
            <div className="temp-header">
              <div className="head">
                Select Template - {contractExtraction?.original_filename}
              </div>
              <div>
                <button className="entity-clear">Cancel</button>
                <button
                  className="extract-btn"
                  onClick={() => handleStartExtraction()}
                >
                  Extract Entities
                </button>
              </div>
            </div>
            <hr />
            <div className="temp-search">
              <div className="head">Select a Template for Extraction</div>
              <div class="search-container temp">
                <img className="i" src={search} />
                <input type="text" placeholder="Type Template Name " />
              </div>
            </div>
            <div className="temp-table">
              <div class="contract-details-box right ">
                <div className="contract-acc-box temp list-view">
                  <table className="tier-table">
                    <thead>
                      <th className="sno">Template Name</th>
                      <th>Description</th>
                      <th>Entity Count</th>
                    </thead>
                    <tbody>
                      {templateList?.length > 0 &&
                        templateList?.map((list) => {
                          return (
                            <tr onClick={() => handleSelectTemplate(list)}>
                              <td>
                                <input
                                  type="radio"
                                  checked={
                                    selectedTemplate?.template_id ===
                                    list?.template_id
                                  }
                                  className="temp-radio"
                                />
                                {list?.name}
                              </td>
                              <td>{list?.description}</td>
                              <td>{list?.fields?.length ?? 0}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </OffcanvasBody>
      </Offcanvas>
    </Layouts>
  );
}

export default ContractFile;
