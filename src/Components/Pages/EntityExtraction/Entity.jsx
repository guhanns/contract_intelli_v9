import React, { useEffect, useRef, useState } from "react";
import Layouts from "../Layouts/Layouts";
import "./entity.css";
import { Col, Row } from "reactstrap";
import uploadLight from "./../../../images/icons/uploadlight.svg";
import uploadImg from "../../../images/icons/upload-ico.svg";
import editImg from "../../../images/icons/edit-02.svg";
import minusImg from "../../../images/icons/minus-circle.svg";
import addFiles from "../../../images/icons/add_files.svg";
import fileImg from "../../../images/icons/file-06.svg";
import fileCheckImg from "../../../images/icons/file-check.svg";
import fileSearchImg from "../../../images/icons/file-search.svg";
import { useLocation, useNavigate } from "react-router-dom";
import request, { NodeURL } from "../../../api/api";
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
import { Copy, Delete, DeleteIcon, Edit, Eye, Pencil, PlusIcon, Trash } from "lucide-react";
import requestL from "../../../api/lexi";
function Entity() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [templateList,setTemplateList] = useState([]);
  const { theme, toogleTheme } = useTheme();
  const { accounts } = useMsal();

  const [isExtracting, setIsExtracting] = useState(false);
  const isProcessed = useRef(false);

  // Get current logged-in user from SSO
  const currentUser = accounts.length > 0 ? accounts[0] : null;
  const userName = currentUser
    ? currentUser.name || currentUser.username || "Unknown User"
    : "Anonymous User";

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
    getTemplateList();
  }, []);

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

  console.log(isError)

  return (
    <Layouts>
      <div className="contract-file-list">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <>
            {templateList?.length > 0 ? (
              <>
                <div className="list-head">
                  <h5>{templateList?.length} Entity Templates</h5>
                  <div className="d-flex gap-2">
                    <div
                      className="total-contract review"
                      data-tip="Review for Ready"
                    >
                      <div className="count-round green">
                        <img src={fileCheckImg} />
                      </div>
                      <div className="count-result">
                        <h5 className="head">Templates Validated</h5>
                        <h3 className="result">{templateList?.length}</h3>
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
                        <h5 className="head">Templates Not Validated</h5>
                        <h3 className="result">
                          {location?.state?.files?.length ?? 0}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <button
                        className="contract-upld-btn"
                        onClick={() => navigate("/entity-extraction/new")}
                      >
                        <PlusIcon size={20} style={{ marginRight: "6px" }} />
                        New Entity Template
                      </button>
                    </div>

                    <div></div>
                  </div>
                </div>
                <div className="table-list-contract">
                  <table className="table">
                    <thead className="extracting-temp-edit">
                      <tr>
                        <th scope="col">Template Name</th>
                        <th scope="col" className="text-start">
                          Description
                        </th>
                        <th scope="col" className="text-center">
                          Entity Count
                        </th>
                        <th scope="col" className="text-center">
                          Last modified
                        </th>
                        <th scope="col" className="text-center">
                          Validation Status
                        </th>
                        <th scope="col" className="text-center">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="extracting-temp-edit">
                      {templateList?.length > 0 ? (
                        templateList.map((doc) => (
                          <tr key={doc?.template_id}>
                            <td className="docs-name-extract">{doc?.name}</td>

                            <td className="text-start">{doc?.description}</td>

                            <td className="text-center">
                              {doc?.fields?.length ?? 0}
                            </td>

                            <td className="text-center">
                              {doc?.updated_at
                                ? format(
                                    new Date(doc?.updated_at),
                                    "dd-MM-yyyy",
                                  )
                                : "-"}
                            </td>

                            <td className="text-center">
                              <span className="review-validate">Validate</span>
                            </td>

                            <td className="text-center">
                              <span className="mx-2">
                                <Eye size={16} />
                              </span>

                              {/* <span className="mx-2">
                                <Copy size={16} />
                              </span> */}

                              <span
                                className="mx-2"
                                onClick={() =>
                                  navigate("/entity-extraction/new", {
                                    state: {
                                      tempId: doc?.template_id,
                                    },
                                  })
                                }
                              >
                                <Pencil size={16} />
                              </span>

                              {/* <span className="mx-2">
                                <Trash size={16} />
                              </span> */}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No Templates Found
                          </td>
                        </tr>
                      )}
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
    </Layouts>
  );
}

export default Entity;
