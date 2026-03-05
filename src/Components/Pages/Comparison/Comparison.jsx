import React, { useEffect, useState } from 'react'
import Layouts from '../Layouts/Layouts'
import './comparison.css'
import ReactMarkdown from 'react-markdown';

import fileImg from '../../../images/icons/file-dark-xcel.svg'
import filexl from '../../../images/icons/file-xl-light.svg'
import filexml from '../../../images/icons/file-xml-light.svg'
import file2Img from '../../../images/icons/file-dark-xml.svg'

import arrow_narrow_left from "../../../images/icons/arrow-narrow-left.svg";
import loadingImg from "../../../images/icons/LoadingDark.svg";
import lightLoading from "../../../images/icons/Group 4.svg";
import checkFileDark from "../../../images/icons/check-file-dark.svg";
import pdfFileDark from "../../../images/icons/file-02.svg";
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import request, { NodeURL } from '../../../api/api'
import { diff } from "deep-diff";
import { useTheme } from '../../../Themecontext'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { EllipsisVertical, FileText, FilterIcon } from 'lucide-react'
import { format, isToday } from 'date-fns'
import ChangeCardSkeleton from '../../Skeleton-loading/ChangeCardSkeleton'
import requestL from '../../../api/lexi'
import ViewAstInspector from '../../Preview/ViewAstInspector'

function Comparison() {
    const location = useLocation()
    const navigate = useNavigate()
    const { theme, toogleTheme } = useTheme();
    const [comparisondetails,setComparisonDetails] = useState({})
    const [historyList,setHistoryList] = useState({})
    const [summaryChange,setSummaryChange] = useState({})
    const [isToggle, setToggle] = useState(true)
    const [isViewEntities,setIsViewEntities] = useState(false)
    const [IsViewCompareEntities,setIsViewCompareEntities] = useState(false)
    const [differences, setDifferences] = useState([]);
    const [accordionOpen, setAccordionOpen] = useState("");
    const [isChangeHistory,setIsChangeHistory] = useState(true)
  const [comparedFiles,setComparedFiles]= useState({})
  const [isLoading,setIsLoading] = useState(true)
  const [navTabsActive,setTabsActive] = useState(true)
  const [mainContract, setMainContract] = useState({
  contractOffer: null,
  tierSummary: [],
  tierDataProduct: [],
  url: null
});

const [compareContract, setCompareContract] = useState({
  contractOffer: null,
  tierSummary: [],
  tierDataProduct: [],
  url: null
});

 const [viewAstJsonLeft,setViewAstJsonLeft] = useState({})
 const [viewAstJsonRight,setViewAstJsonRight] = useState({})



  const toggleAccordion = (id) => {
    if (accordionOpen.includes(id)) {
      setAccordionOpen((prev) => prev.filter((item) => item !== id)); // remove if already open
    } else {
      setAccordionOpen((prev) => [...prev, id]); // add if not open
    }
  }; 
    

    useEffect(()=>{
        setComparisonDetails({
            contract_id:location?.state?.contract_id,
        contract_number:location?.state?.contract_number,
        version_number:location?.state?.version_number,
        compare_verison :location?.state?.compare_verison
        })

        requestL({
          url:`/contracts/${location?.state?.contract_id}/diff/${location?.state?.compare_verison}/${location?.state?.version_number}/changes`,
          method:'GET',
        }).then((res)=>{
          setIsLoading(false)
          setHistoryList(res?.changes)
        }).catch((err)=>{
          console.log(err)
        })

        requestL({
          url:`/contracts/${location?.state?.contract_id}/diff/${location?.state?.compare_verison}/${location?.state?.version_number}/summary`,
          method:'GET',
        }).then((res)=>{
          setIsLoading(false)
          setSummaryChange(res)
        }).catch((err)=>{
          console.log(err)
        })

    },[location])


   const fetchViewAstJsonLeft =()=>{
  requestL({
    url:`/contracts/${location?.state?.contract_id}/${location?.state?.version_number}/view-ast-json`,
    method:'GET',
  }).then((res)=>{
    setViewAstJsonLeft(res)
  }).catch((err)=>{
    console.log(err)
  })
}

const fetchViewAstJsonRight =()=>{
  requestL({
    url:`/contracts/${location?.state?.contract_id}/${location?.state?.compare_verison}/view-ast-json`,
    method:'GET',
  }).then((res)=>{
    setViewAstJsonRight(res)
  }).catch((err)=>{
    console.log(err)
  })
}

useEffect(()=>{
  if(location?.state?.contract_id){
      fetchViewAstJsonLeft()
  fetchViewAstJsonRight()
  }
},[location?.state?.contract_id])

    


    // Method 3: Download files from URLs and send as actual files
  const downloadAndSendFiles = () => {
    let toastId = toast.loading("Comparing...",{duration:Infinity})
    // Assuming comparisondetails.file and comparisondetails.compareFile are URLs
    axios.post(`${NodeURL}/icontract/backend/compare_documents`, {
      url1: comparisondetails?.file,
      url2: comparisondetails?.compareFile,
    }).then((res)=>{
        toast.remove(toastId)
        if(res.data.success){
            setComparedFiles(res?.data)
        }
    })
};


  useEffect(()=>{
    if(comparisondetails?.file && comparisondetails?.compareFile){

        downloadAndSendFiles()
    }
  },[comparisondetails?.file, comparisondetails?.compareFile])



  const fetchContract = async (contract_num, version, target = "main") => {
  try {
    const res = await axios.get(
      `${NodeURL}/icontract/backend/AllColumns/${contract_num}/${version}`
    );

    const data = {
      contractOffer: res?.data?.contracts[0],
      tierSummary: res?.data?.tier_structures,
      tierDataProduct: res?.data?.products,
      url: res?.data?.file_info
    };

    if (target === "main") {
      setMainContract(data);
    } else {
      setCompareContract(data);
    }
  } catch (err) {
    console.error(err);
  } 
};



  useEffect(()=>{
    if(comparisondetails?.contract_number && comparisondetails?.version){
        fetchContract(comparisondetails?.contract_number,comparisondetails?.version,"main")
       
    }
    if(comparisondetails?.contract_number && comparisondetails?.compareVersion){
        fetchContract(comparisondetails?.contract_number,comparisondetails?.compareVersion,"compare")
    }
  },[comparisondetails.contract_number,comparisondetails.version,comparisondetails.compareVersion])



//   const differences = diff(mainContract, compareContract);
//   console.log(differences)

  // Compute differences whenever contracts change
  useEffect(() => {
    if (mainContract && compareContract) {
      const result = diff(mainContract, compareContract) || [];
      setDifferences(result);
    }
  }, [mainContract, compareContract]);

  // Helper to check if a field changed
  const getDiff = (path) => {
    return differences.find((d) => d.path?.join(".") === path);
  };

  // Helper to style differences
  const getHighlightClass = (diffEntry) => {
    if (!diffEntry) return "";
    if (diffEntry.kind === "N") return "highlight-added";
    if (diffEntry.kind === "D") return "highlight-removed";
    if (diffEntry.kind === "E") return "highlight-changed";
    return "";
  };


  
  const handleExport = (target) => {
   const sheetData = [];
 
   // Helper to push object or array section into sheetData
   const pushSection = (title, data) => {
     if (!data || (Array.isArray(data) && data.length === 0)) return;
 
     sheetData.push([`${title.toUpperCase()}`]);
 
     if (Array.isArray(data)) {
       const headers = Object.keys(data[0] || {});
       sheetData.push(headers);
       data.forEach((item) => {
         sheetData.push(headers.map((key) => item[key]));
       });
     } else if (typeof data === "object") {
       const entries = Object.entries(data);
       // sheetData.push(["Key", "Value"]);
       entries.forEach(([key, value]) => {
         sheetData.push([key, typeof value === "object" ? JSON.stringify(value) : value]);
       });
     }
 
     sheetData.push([]); // Spacer row
   };
 
   // Push each section
   pushSection("Contracts", target==='Main' ? mainContract?.contractOffer:compareContract?.contractOffer);
   pushSection("Tier Structures",target==='Main' ?compareContract?.tierSummary:compareContract?.tierSummary);
   // pushSection("Products", tierDataProduct);
 
   // Convert to worksheet
   const ws = XLSX.utils.aoa_to_sheet(sheetData);
 
   // Create and append workbook
   const wb = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, "Combined Data");
 
   // Write and download
   const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
   const blob = new Blob([wbout], {
     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
   });
 
   const filename = mainContract?.url?.file_name?.split('.')[0] || "exported_data";
   saveAs(blob, `${filename}.${target}.xlsx`);
 };

 const saveXmlFile = (xmlData,target) => {
   // If xmlData is already a string, skip stringify
   const xmlString = typeof xmlData === "string" ? xmlData : new XMLSerializer().serializeToString(xmlData);
 
   const blob = new Blob([xmlString], { type: "application/xml;charset=utf-8" });
   const filename = target==='Main'?mainContract?.url?.file_name?.split('.')[0]:compareContract?.url?.file_name?.split('.')[0]|| "exported_data";
   saveAs(blob, `${filename}.xml`); // download file as contract_data.xml
 };


 const downloadAsXml =(contract_num,version,target)=>{
   
      
        request({
      url:'/icontract/backend/export_xml',
      method:'POST',
      data:{
        contract_number:contract_num,
        document_version_number:String(version)
      }
    }).then((res)=>{
      if(res){
        saveXmlFile(res,target)
      }
    }).catch((err)=>{
      console.log(err)
    })
    
  }


  const getStatusClass = (status) => {
  switch (status) {
    case "InsertedNode":
      return "changes__tag--added";
    case "DeleteNode":
      return "changes__tag--removed";
    case "UpdateNode":
      return "changes__tag--replaced";
    
    default:
      return "";
  }
};

    
  return (
    <Layouts>
      <div className="comparison-container">
        <div className="comparison-header">
          <h4 className="left-head" onClick={() => navigate(-1)}>
            <img src={arrow_narrow_left} style={{ marginRight: "10px" }} />
            Compare Versions
          </h4>
        </div>
        <div className="comparison-controller">
          <div className="m-0 parents">
            <div className="child-1">
              <div className="controller-left ">
                <div className="controller-left-nav">
                  <div className={`navTabs ${navTabsActive ? 'active':''}`} onClick={()=>setTabsActive(true)}>
                    <h5>{summaryChange?.contract_number} <button className='compare-version-number'>Version {summaryChange?.from_version}</button></h5>  
                  </div>
                  <div className={`navTabs ${navTabsActive ? '':'active'}`} onClick={()=>setTabsActive(false)}>
                    <h5>{summaryChange?.contract_number} <button className='compare-version-number'>Version {summaryChange?.to_version}</button></h5>  

                  </div>
                </div>
                <div className="controller-left-view">
                      {(
                        viewAstJsonLeft || viewAstJsonRight
                      ) ? (
                       <ViewAstInspector
                        data={navTabsActive? viewAstJsonLeft :viewAstJsonRight}
                        isPopup={false}
                         />
                      ) : (
                        <div className="container my-5 p-0 loading-contract">
                          <div className="w-50 m-auto text-center">
                            <img
                              src={theme === "Dark" ? loadingImg : lightLoading}
                              className="loadingimg"
                            />
                            <h5 className="loading-info">
                              <i>Preparing PDF for preview…</i>
                            </h5>
                          </div>
                        </div>
                      )}
                </div>
              </div>
            </div>
            {/* <div className=" p-0 child-2">
              <div className="controller-right">
                <div className="controller-left-nav">
                  <h5>{comparisondetails?.contract_path} <button className='compare-version-number'>Version {comparisondetails?.compareVersion}</button></h5>
                </div>
                <div className="controller-left-view">
                  {
                        viewAstJsonRight
                      ? 
                        <ViewAstInspector
                                     data={viewAstJsonRight}
                                    
                                     />
                      : 
                        <div className="container my-5 p-0 loading-contract">
                          <div className="w-50 m-auto text-center">
                            <img
                              src={theme === "Dark" ? loadingImg : lightLoading}
                              className="loadingimg"
                            />
                            <h5 className="loading-info">
                              <i>Preparing PDF for preview…</i>
                            </h5>
                          </div>
                        </div>
                        }
                </div>
              </div>
            </div> */}
            <div className=" p-0 child-3">
              <div class="changes">
                <div class="changes__header">
                  <div className={`head1 ${isChangeHistory&&'active'}`} onClick={()=>setIsChangeHistory(true)}>Change History</div>
                  <div className={`head2 ${!isChangeHistory&&'active'}`} onClick={()=>setIsChangeHistory(false)}>Change Summary</div>
                  {/* <FilterIcon color='#85888E' size={18} onClick={()=>navigate('/audit')}/> */}
                </div>
                <div className="divider"></div>

                {
                  isChangeHistory ?  <div class="changes__list">
                    {
                      isLoading ? <ChangeCardSkeleton/> : <>
                      {/* {historyList?.upload_timestamp && (
                      <div style={{color:'var(--text)'}}>
                        {isToday(new Date(historyList?.upload_timestamp))
                          ? "Today,"
                          : ""} {" "}
                          {historyList?.upload_timestamp &&
                      format(
                        new Date(historyList?.upload_timestamp),
                        "dd-MMM-yyyy"
                      )}
                      </div>
                    )} */}
                    
                      
                    {historyList?.length > 0 ?(
                      <>
                        {historyList?.map((chng) => {
                          return (
                            <div class="changes__item changes__item--replaced">
                              <span class={`changes__tag ${getStatusClass(chng?.op_type)}`}>
                                {
                                  chng?.op_type === 'UpdateNode' ? "REPLACED" :chng?.op_type === 'DeleteNode' ? "REMOVED" :chng?.op_type === 'InsertedNode' ? 'ADDED' :""
                                }
                              </span>
                              <p
                                class="changes__text"
                                dangerouslySetInnerHTML={{
                                  __html: chng?.natural_language,
                                }}
                              ></p>
                            </div>
                          );
                        })}
                      </>
                    ):
                    <div style={{color:'var(--text)'}} className='text-center mt-5'>
                        No Changes Found
                      </div>}
                      
                      </>
                    }
                  </div> : <div class="changes__list">
                    {
                      isLoading ? <ChangeCardSkeleton/> : <>
                      {/* {historyList?.upload_timestamp && (
                      <div style={{color:'var(--text)'}}>
                        {isToday(new Date(historyList?.upload_timestamp))
                          ? "Today,"
                          : ""} {" "}
                          {historyList?.upload_timestamp &&
                      format(
                        new Date(historyList?.upload_timestamp),
                        "dd-MMM-yyyy"
                      )}
                      </div>
                    )} */}
                    
                      
                    {summaryChange?.summary?(
                      <>
                            <div class="changes__item changes__item--replaced">
                              <span class={`changes__tag`}>
                                This version includes the following updates compared to V2.0
                              </span>
                              <p
                                class="changes__text"
                                
                              >
                                <ReactMarkdown >
                                                                {summaryChange?.summary?.replace(/•/g,'-')}
                                                              </ReactMarkdown>
                              </p>
                            </div>
                          
                      </>
                    ):
                    <div style={{color:'var(--text)'}} className='text-center mt-5'>
                        No Changes Found
                      </div>}
                      
                      </>
                    }
                  </div>
                }
                
                 

                  
                {/* <button class="changes__export">
                  <FileText/>
                  Export as Document
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layouts>
  );
}

export default Comparison