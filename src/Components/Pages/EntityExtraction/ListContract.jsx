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
import stepper2 from "../../../images/sidebar_icons/stepper2.svg";
import purpleUpload from "./../../../images/upload_icons/upload_doc_light1.svg";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Delete,
  DeleteIcon,
  Edit,
  Eye,
  Pencil,
  PlusIcon,
  Trash,
} from "lucide-react";
import requestL from "../../../api/lexi";
function ListContract() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [contractList, setContractList] = useState([]);
  const { theme, toogleTheme } = useTheme();
  const { accounts } = useMsal();
  const [testContract, setTestContract] = useState({});

  const [isExtracting, setIsExtracting] = useState(false);
  const isProcessed = useRef(false);

  // Get current logged-in user from SSO
  const currentUser = accounts.length > 0 ? accounts[0] : null;
  const userName = currentUser
    ? currentUser.name || currentUser.username || "Unknown User"
    : "Anonymous User";

  const getContractList = async () => {
    setIsLoading(false);
    requestL({
      url: "/contracts",
      method: "GET",
    }).then((res) => {
     setContractList(res);
    });
  };

  useEffect(() => {
    getContractList();
  }, []);

  const sendToTest = (contract_id, version_number) => {
    navigate("/entity-extraction/validation", {
      state: {
        contract_id,
        version_number,
      },
    });
  };

  const handleCheckChange = (checked, value) => {
    if (checked) {
      setTestContract(value);
    } else {
      setTestContract({});
    }
  };


  const testTemplate =()=>{
    navigate("/entity-extraction/validation",{
        state:{
          testContract,
          entities:location?.state?.template
        }
    })
  }
  return (
    <Layouts>
      <div className="contract-file-list">
        <>
          <div className="list-head">
            <h5>New Entity Templates - Select Contract Document</h5>
            <div className="d-flex gap-2">
              <div>
                <img src={stepper2} />
              </div>
              <div>
                <button
                  className="contract-upld-btn"
                  onClick={() => navigate("/entity-extraction/new")}
                >
                  <ChevronLeft size={20} style={{ marginRight: "6px" }} />
                  Back to Entities
                </button>
                <button
                  className="contract-upld-btn"
                  onClick={() => testTemplate()}
                >
                  Test Template
                  <ChevronRight size={20} style={{ marginLeft: "6px" }} />
                </button>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center my-3">
            <div className="left-head">
              Select a contract document to validate the template
            </div>
            <div>
              <input className="list-test-input" />
            </div>
          </div>
          <div className="table-list-contract">
            <table className="Table-contract-list">
              <thead>
                <tr className="table-row">
                  <th className="checkbox-col">
                    <input type="checkbox" />
                  </th>
                  <th className="template-col">Document Name</th>
                  <th className="description-col">Doc Type</th>
                  <th className="entity-col">Customer</th>
                  <th className="date-col">Author</th>
                  <th className="status-col">Generated Date</th>
                  {/* <th className="action-col">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {contractList?.length > 0
                  ? contractList?.map((list, listIdx) => {
                      return (
                        <tr
                          className="contract-result-list"
                        //   onClick={(e) =>{
                        //     e.stopPropagation()
                        //      sendToTest(list?.contract)
                        //   }}
                        >
                          <td className="checkbox-col">
                            <input
                              type="checkbox"
                              checked={list?.contract_id===testContract?.contract_id}
                              onChange={(e) =>{
                                e.stopPropagation()
                                handleCheckChange(e.target.checked, {
                                  contract_id: list?.contract_id,
                                  version_number: list?.latest_amendment_number,
                                  index: listIdx,
                                })}
                              }
                            />
                          </td>
                          <td className="template-col">{list?.original_filename}</td>
                          <td className="description-col">
                            {list?.original_filename?.split('.')?.[1]}
                          </td>
                          <td className="entity-col text-center">-</td>
                          <td className="entity-col text-center">-</td>
                          <td className="date-col text-center">{list?.uploaded_at &&
                                                          format(new Date(list?.uploaded_at), "dd-MM-yyyy")}
                                                      </td>
                          
                        </tr>
                      );
                    })
                  : ""}
              </tbody>
            </table>
            {contractList?.length <= 0 && (
              <div className="text-center text-secondary my-3">
                No Data Found
              </div>
            )}
          </div>
        </>
      </div>
    </Layouts>
  );
}

export default ListContract;
