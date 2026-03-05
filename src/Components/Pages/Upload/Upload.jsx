import React, { useEffect, useState } from "react";
import Layouts from "../Layouts/Layouts";
import Select from 'react-select'
import "./upload.css";
import upload_doc from "../../../images/upload_icons/upload_doc.svg";
import trash from "../../../images/icons/trash-01.svg";
// import uploadImg from "../../../images/icons/upload.svg";
import fileImg from "../../../images/icons/contract-file.svg";
import { useLocation, useNavigate } from "react-router-dom";
import request, { NodeURL } from "../../../api/api";
import toast from "react-hot-toast";
import axios from "axios";
import arrow_narrow_left from "../../../images/icons/arrow-narrow-left.svg";
import purpleUpload from './../../../images/upload_icons/upload_doc_light1.svg';
import { useTheme } from "../../../Themecontext";
import filelight from './../../../images/upload_icons/fileLight.svg'
import filedark from './../../../images/upload_icons/fileDark.svg'
import trashdark from'./../../../images/upload_icons/trashDark.svg'
import trashlight from'./../../../images/upload_icons/trashLight.svg'
import uploadImg from "./../../../images/icons/upload-icon-intelli.svg";
import { useMsal } from "@azure/msal-react";
 import uploadicdark from'./../../../images/icons/upload-icon-intelli.svg'
 import uploadiclight from'./../../../images/icons/uploadlight.svg'
import { truncate } from "lodash";
import { colourStyles } from "../ContractList/ContractListNew";
import { AlertCircle, Save, X } from "lucide-react";
import { Modal, ModalBody } from "reactstrap";
import requestL, { LexiURL } from "../../../api/lexi";

const typeOption =[
  {
    label:'PRIMARY',
    value:'PRIMARY'
  },
  {
    label:'LOC_Agreement',
    value:'LOC_Agreement',
  }
]
function Upload() {
  const navigate = useNavigate();
  const location = useLocation()
  const [conflictData,setConflictData] = useState({})
  const [files, setFiles] = useState([]);
  const [isConflict,setIsConflict] = useState(false)
  const [isContractNum,setIsContractNum] = useState(false)
  const [errData,setErrData] = useState({})
  const [fileInfo,setFileInfo] = useState({
    contract_number:'',
    file_type:""
  })
  const [isUpload,setIsUpload] = useState(false)
    const { theme, toogleTheme } = useTheme();
    const { accounts } = useMsal();
 
  // Get current logged-in user from SSO
  const currentUser = accounts.length > 0 ? accounts[0] : null;
  const userName = currentUser ? (currentUser.name || currentUser.username || 'Unknown User') : 'Anonymous User';
  

  const [uploadProgress, setUploadProgress] = useState({
    price: 0,
    contract: 0,
  });

  useEffect(()=>{
    if(location?.state?.file){

      setFiles(location?.state?.file)
      location?.state?.file.forEach((fileObj) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setFiles((prevFiles) =>
          prevFiles.map((f) => (f.id === fileObj.id ? { ...f, progress } : f))
        );
        if (progress >= 100) clearInterval(interval);
      }, 200);
    });
    }
  },[location?.state?.file])

  console.log(files)


  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    const newFiles = selectedFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      type,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((fileObj) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setFiles((prevFiles) =>
          prevFiles.map((f) => (f.id === fileObj.id ? { ...f, progress } : f))
        );
        if (progress >= 100) clearInterval(interval);
      }, 200);
    });
  };

  const removeFile = (id) => {
  setFiles((prev) => prev.filter((f) => f.id !== id));
};

  // const handleUpload = async() => {
  //   toast.loading("Uploading...", {
  //     duration: Infinity,
  //   });

  //   if (files.length<=0) {
  //     return alert("Please upload file");
  //   }

   

  //   files.forEach(async (li) => {
  //     const formData = new FormData();
  //     formData.append("file", li.file);

  //     await axios.post("http://localhost:8006/icontract/process_contract",formData)
  //     .then((res)=>{
  //       toast.remove();
  //         toast.success("Extraction Completed");
  //     }).catch((err)=>{
  //       console.log(err)
  //     })

  //     await axios
  //       .post(
  //         "http://localhost:8006/icontract/backend/uploadtos3",
  //         formData
  //       )
  //       .then((res) => {
  //         console.log(res);
  //         toast.remove();
  //         toast.success("Upload Completed");
  //         navigate('/list')
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   });


    
  // };

  console.log(isConflict)

const handleUpload = async () => {
  setIsUpload(true);

  // Reset previous errors
  setIsConflict(false);
  setConflictData(null);
  setIsContractNum(false);
  setErrData(null);

  if (files.length <= 0) {
    toast.error("Please upload file");
    return;
  }

  if (!fileInfo?.contract_number) {
    toast.error("Contract Number Required");
    return;
  }

  if (!fileInfo?.file_type) {
    toast.error("File type Required");
    return;
  }

  try {
    toast.loading("Uploading...");

    const uploadResults = await Promise.all(
      files.map(async (li) => {
        const formData = new FormData();
        formData.append("file", li.file);
        formData.append("contract_number", fileInfo?.contract_number);
        formData.append("file_type", fileInfo?.file_type);
        formData.append("author", userName);

        let url = `/upload`;

        if (fileInfo?.file_type === "LOC_Agreement") {
          url = `/contracts/loc-agreement`;
        }

        const response = await axios.post(`${LexiURL}${url}`, formData);

        console.log(response);

        // ❌ Contract number not found
        if (response?.data?.found === false) {
          throw {
            type: "CONTRACT_NOT_FOUND",
            data: response.data,
          };
        }

        // ❌ Conflict detected
        if (response?.data?.conflict) {
          throw {
            type: "CONFLICT",
            data: response.data,
          };
        }

        // ✅ Successful upload
        return {
          originalFile: li,
          data: response.data,
        };
      })
    );

    toast.dismiss();
    toast.success("Upload Completed");

    navigate("/list", {
      state: {
        fromUpload: true,
        files,
        uploadResults,
      },
    });

  } catch (err) {
    toast.dismiss();
    console.error("Upload failed:", err);

    if (err?.type === "CONTRACT_NOT_FOUND") {
      setIsContractNum(true);
      setErrData(err.data);
      return;
    }

    if (err?.type === "CONFLICT") {
      setIsConflict(true);
      setConflictData(err.data);
      return;
    }

    toast.error("Upload failed");
  } finally {
    setIsUpload(false);
  }
};

const handleCloseConflict = () => {
  setIsConflict(false);
  setConflictData(null);
};

const handleCloseContractError = () => {
  setIsContractNum(false);
  setErrData(null);
};

const uploadConflicts = () => {
  let formData = new FormData();
  files.map((li) => {
    formData.append("file", li.file);
  });
  requestL({
    url: `/contracts/${conflictData?.contract_id}/upload-version`,
    method: "POST",
    data: formData,
  }).then((res) => {
      navigate("/list", { state: { fromUpload: true, files ,uploadResults:res} });
  });
};

const isUploadReady =()=>{
  if(files.length<=0){
    return true
  }

  if(fileInfo?.contract_number==="" || fileInfo?.file_type==""){
    return true
  }

  return false
}

console.log(isUploadReady())



  return (
    <Layouts>
      <div className="upload-head-back upload-back">
        <h5 onClick={() => navigate(-1)} style={{ cursor: "pointer" }}>
          <img src={arrow_narrow_left} />
          Back
        </h5>
      </div>
      <div class="container text-center upload-main-box">
        <h2 class="upload-name">Upload Documents</h2>
        <p class="upload-info">
          Your documents should be uploaded as a DOCX file (maximum size 100MB).        </p>
        <>
        {
          files?.length <=0 && <div class="upload-box">
            <label
              for="contractUpload"
              class="upload-area"
              style={{ height: 50 }}
            >
              <img
                src={theme === "Dark" ? uploadicdark : uploadiclight}
                className="upload-img"
              />
              <span class="text-white-50">
                <span className="dottedbox-upload-content">
                  Upload Document
                </span>
              </span>
              <input
                type="file"
                id="contractUpload"
                class="d-none upload-input"
                accept="application/docx"
                multiple
                onChange={(e) => handleFileChange(e, "contract")}
              />
            </label>
          </div>
        }
          
          <div className="upload-list-box">
            {files
              .filter((f) => f.type === "contract")
              .map((fileObj) => (
                <div
                  key={fileObj.id}
                  className=" bg-opacity-10 p-3 rounded mb-3 uploaded-box"
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex justify-content-between align-items-center uploaded-doc gap-3">
                      <div className="me-2">
                        <img
                          src={theme === "Light" ? filelight : filedark}
                          className="file-img"
                        />
                      </div>
                      <div className="uploaded-file-name">
                        Contract Document:{" "}
                        {truncate(fileObj.file.name, { length: "15" })}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                      <div className="">
                        <div className="text-start">
                          <label>Contract Number</label>
                        </div>
                        <input
                          className="upload-input"
                          onChange={(e) =>
                            setFileInfo({
                              ...fileInfo,
                              contract_number: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-start">
                          <label>Type</label>
                        </div>
                        <Select
                          styles={{
                            ...colourStyles,
                            container: (styles) => ({
                              ...styles,
                              width: "95%",
                              height: "56px",
                              marginRight: "20px",
                              fontSize: "16px",
                              color: "var(--text)",
                            }),
                          }}
                          menuPortalTarget={document.body} 
                          menuPosition="fixed" 
                          options={typeOption}
                          value={typeOption?.filter(
                            (op) => op.value === fileInfo?.file_type,
                          )}
                          onChange={(e) =>
                            setFileInfo({ ...fileInfo, file_type: e.value })
                          }
                        />
                      </div>
                      <small
                        className={
                          theme === "Dark" ? "text-white" : "text-dark"
                        }
                      >
                        <i>
                          {fileObj.progress === 100 ? (
                            <div className="trash-round">
                              <img
                                src={theme === "Light" ? trashlight : trashdark}
                                className="trash-img"
                                onClick={() => removeFile(fileObj.id)}
                              />
                            </div>
                          ) : (
                            `${fileObj.progress}% uploaded...`
                          )}
                        </i>
                      </small>
                    </div>
                  </div>
                  {fileObj.progress < 100 && (
                    <div className="progress mt-2">
                      <div
                        className="progress-bar bg-gradient"
                        style={{ width: `${fileObj.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </>
      </div>
      <div className="text-center">
        {files.length > 0 ? (
          <button
            class="upload-btn"
            // disabled={() => isUploadReady()}
            onClick={() => handleUpload()}
          >
            <Save /> Submit {files?.length>1 ? files?.length:''} Contract Document{files?.length>1?'s':''}
          </button>
        ) : (
          ""
        )}
      </div>

      <Modal
        isOpen={isConflict}
        centered
        size="md"
        fade={true}
        backdrop={true}
        zIndex={4000}
        style={{
          padding: "34px",
        }}
      >
        <div className="modal-mark-with">
          <div className="d-flex align-items-center gap-3">
            <div className="cfl-bg">
              <AlertCircle size={17} />
            </div>
            <div>Confirmation Required</div>
          </div>

          <X onClick={() => setIsConflict(false)} />
        </div>
        <ModalBody>
          <div className="modal-comments-modal">
            <div>
              {/* <div></div> */}
              <div>
                <span>Contract Number</span> :{" "}
                {conflictData?.contract_number}{" "}
              </div>
              {/* <div><span>Type</span> : {conflictData?.type}</div> */}
            </div>
            <div>
              <p>There is already an existing Contract within the database.</p>
              <p>
                Can you confirm that you are uploading an amendment to the
                original contract(?)
              </p>
            </div>
            <div className="">
              <button className="cfl-btn">Cancel</button> <button className="upld-amd" onClick={()=>uploadConflicts()}>Upload Amendment</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
       <Modal
        isOpen={isContractNum}
        centered
        size="lg"
        fade={true}
        backdrop={true}
        zIndex={4000}
        style={{
          padding: "34px",
        }}
      >
        <div className="modal-mark-with">
          <div className="d-flex align-items-center gap-3">
            <div className="cfl-bg">
              <AlertCircle size={17} />
            </div>
            <div>Confirmation Required</div>
          </div>

          <X onClick={()=>handleCloseContractError()}/>
        </div>
        <ModalBody>
          <div className="modal-comments-modal">
            <div>
              {/* <div></div> */}
              <div>
                <span>Contract Number</span> :{" "}
                {errData?.contract_number}{" "}
              </div>
              <div><span>Type</span> : LOC Agreement</div>
            </div>
            <div>
              <p>There is no matching contract available</p>
              
            </div>
            <div className="">
              <button className="cfl-btn" onClick={()=>handleCloseContractError()}>Cancel</button>
               <button className="upld-amd" onClick={()=>handleCloseContractError()}>Enter Correct Contract Number</button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </Layouts>
  );
}

export default Upload;
