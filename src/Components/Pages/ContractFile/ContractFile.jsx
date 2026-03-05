import React, { useEffect, useRef, useState, version } from "react";
import Layouts from "../Layouts/Layouts";
import "./contractfile.css";
import { Col, Offcanvas, OffcanvasBody, Row } from "reactstrap";
import uploadLight from "./../../../images/icons/uploadlight.svg";
import loading from './../../../images/icons/loading-0122.svg'
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
import ext_doc from "../../../images/icons/File-extract-search.svg";
import up_doc from "../../../images/icons/upload-extract.svg";
import purpleUpload from "./../../../images/upload_icons/upload_doc_light1.svg";
import ListContract from "../EntityExtraction/ListContract";
function ContractFile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [templateList, setTemplateList] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [contractList, setContractList] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({});
  const [contractExtraction, setContractExtraction] = useState({});
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
      params:{
        expand:'full'
      }
    })
      .then((res) => {
        setIsLoading(false);
        setContractList(getContractVersions(res));

        dispatch(saveContracts(res));
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setIsError(true);
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
        setIsError(true);
      });
  };

  useEffect(() => {
    getContractList();
    getTemplateList();
  }, []);

  console.log(location);

  const getContractVersions = (contracts) => {
  const result = [];

  contracts.forEach((contract) => {
    const amendments = contract.amendments.map((a) => ({
      contract_id: contract.contract_id,
      contract_number: contract.contract_number,
      version_number: a.version_number,
      amendment_number: a.amendment_number,
      type: "AMENDMENT",
      status: a.status,
      uploaded_at: a.uploaded_at,
      original_filename: a.original_filename
    }));

    // const locAgreements = contract.loc_agreements.map((l) => ({
    //   contract_id: contract.contract_id,
    //   contract_number: contract.contract_number,
    //   version_number: l.version_number,
    //   type: "LOC",
    //   status: l.status,
    //   uploaded_at: l.uploaded_at,
    //   original_filename: l.original_filename
    // }));

    result.push(...amendments);
  });

  return result.sort(
    (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
  );
};

  useEffect(() => {
    if (!location?.state?.uploadResults) return;

    let intervalId;

    const fetchStatus = () => {
      let url = `/contracts/${
  location?.state?.uploadResults?.[0]
    ? location?.state?.uploadResults?.[0].data?.contract_id
    : location?.state?.uploadResults?.contract_id
}/status`;

if (location?.state?.uploadResults?.[0]?.data?.file_type==='LOC_Agreement') {
  url = `/contracts/${
    location?.state?.uploadResults?.[0]
      ? location?.state?.uploadResults?.[0].data?.contract_id
      : location?.state?.uploadResults?.contract_id
  }/loc-aggrements`;
}


      requestL({
        url,
        method: "GET",
        params: {
          version_number: location?.state?.uploadResults?.[0]
            ? location?.state?.uploadResults?.[0]?.data?.version_number
            : location?.state?.uploadResults?.version_number,
        },
      }).then((res) => {
        setUploadStatus(res);

        if (res?.status === "READY") {
          clearInterval(intervalId);
          getContractList();
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

    navigate("/list/upload", { state: { file: newFiles } });
  };

  console.log(contractExtraction);

  const handleExtraction = (e, contract) => {
    e.stopPropagation();
    setIsTemplate(true);
    setContractExtraction(contract);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  const handleStartExtraction = () => {
    if (!selectedTemplate?.template_id) {
      return toast.error("Please Select the Template for Extraction");
    }

    requestL({
      url: "/extract",
      method: "POST",
      data: {
        contract_id: contractExtraction?.contract_id,
        template_id: selectedTemplate?.template_id,
        version_number: contractExtraction?.latest_amendment_number,
      },
    })
      .then((res) => {
        setIsTemplate(false);
        navigate("/list/preview", {
          state: {
            contract_id: contractExtraction?.contract_id,
            template_id: selectedTemplate?.template_id,
            version_number: contractExtraction?.latest_amendment_number,
            isExtract: true,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(contractList)

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
                <div className="doc-txt-table-cont table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="cs-titles-newone">
                      <tr>
                        <th className="cd-titles">File Name</th>
                        <th className="cd-titles">Contract Number</th>
                        <th className="cd-titles">Upload Date</th>
                        <th className="cd-titles">Version</th>
                        <th className="cd-titles">Contract Status</th>
                        <th className="cd-titles">Contract Actions</th>
                      </tr>
                    </thead>

                    <tbody className="contract-list-body-table">
                      {isExtracting &&
                        location?.state?.files?.length > 0 &&
                        location?.state?.files?.map((li) => (
                          <tr key={li?.file?.name}>
                            <td title={li?.file?.name}>{li?.file?.name}</td>
                            <td className="text-center">-</td>
                            <td className="text-center">-</td>
                            <td className="text-center">-</td>
                            <td className="text-center">-</td>
                            <td className="text-center">
                              <span className="badge bg-warning text-dark">
                                {uploadStatus?.status}
                              </span>
                            </td>
                          </tr>
                        ))}

                      {contractList?.length > 0 &&
                        contractList.map((doc) => (
                          <tr
                            key={
                              doc?.contract_number +
                              "-" +
                              doc?.latest_amendment_number
                            }
                             onClick={() =>
                              navigate("/list/preview", {
                                state: {
                                  contract_id: doc?.contract_id,
                                  version_number: doc?.version_number,
                                },
                              })
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <td
                              className="dxt-first-data"
                              title={doc?.document_name}
                            >
                              {doc?.original_filename}
                            </td>

                            <td className="dxt-second-data">
                              {doc?.contract_number}
                            </td>

                            <td className="dxt-second-data">
                              {doc?.uploaded_at &&
                                format(
                                  new Date(doc?.uploaded_at),
                                  "dd-MM-yyyy",
                                )}
                            </td>

                            <td className="dxt-second-data">
                              V{doc?.version_number}.0
                            </td>

                            <td className="dxt-second-data">
                              {
                                doc?.status==="READY" ?    <span className="upload-ready">
                                Ready
                              </span> : doc?.status==="PROCESSING" ?  <span className="upload-processing">
                                Processing 
                              </span> : doc?.status==='NOT READY' ?  <span className="upload-notready">
                                Not Ready 
                              </span> :doc?.status==='FAILED' ? <span className="upload-failed">
                                Failed 
                              </span> :""
                              }
                            </td>

                            <td className="dxt-second-data">
                              {doc?.status === "READY" ? (
                                <span
                                  className="extract-btn-docx"
                                  onClick={(e) => handleExtraction(e, doc)}
                                >
                                  <img src={ext_doc} />
                                  Extract
                                </span>
                              ) : (
                                doc?.status ==="PROCESSING" ?
                                <span className="Processing-contract">
                                  <img src={loading}/>
                                </span> : 
                                doc?.status ==="Not Ready"?
                                      <span className="Processing-contract">
                                        <img src={loading} />
                                      </span> :
                                doc?.status ==="FAILED" ?
                                <span className="dxt-btn-sec-upload">
                                  <img src={up_doc} />
                                  Upload
                                </span> : "-"
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
        scrollable={true}
        style={{
          width: "65%",
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
                <button
                  className="entity-clear"
                  onClick={() => setIsTemplate(false)}
                >
                  Cancel
                </button>
                <button
                  className="extract-btn"
                  onClick={() => handleStartExtraction()}
                >
                  Extract Entities
                </button>
              </div>
            </div>
            <hr className="border-name-line" />
            <div className="temp-search">
              <div className="head">Select a Template for Extraction</div>
              <div class="search-container temp">
                <img className="i" src={search} />
                <input type="text" placeholder="Type Template Name " />
              </div>
            </div>
            <div className="temp-table">
              <div class="contract-details-box right">
                <div className="contract-acc-box temp list-view">
                  <table className="table">
                    <thead className="extract-small-table">
                      <tr>
                        <th scope="col">Template Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Entity Count</th>
                      </tr>
                    </thead>

                    <tbody className="extr-body-radio">
                      {templateList?.length > 0 &&
                        templateList.map((list) => {
                          return (
                            <tr
                              key={list?.template_id}
                              onClick={() => handleSelectTemplate(list)}
                              style={{ cursor: "pointer" }}
                            >
                              <td>
                                <input
                                  type="radio"
                                  className="temp-radio"
                                  checked={
                                    selectedTemplate?.template_id ===
                                    list?.template_id
                                  }
                                  readOnly
                                />{" "}
                                <span className="template-namsan">
                                  {list?.name}
                                </span>
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
