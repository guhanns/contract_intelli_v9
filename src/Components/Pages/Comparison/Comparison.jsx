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
            <div className=" child-1">
              <div className="controller-left ">
                <div className="controller-left-nav">
                  <h5>{comparisondetails?.contract_path} <button className='compare-version-number'>Version {comparisondetails?.version}</button></h5>
                  <div className="controller-btns">
                    <UncontrolledDropdown direction="start">
                      <DropdownToggle color="transparent">
                        <EllipsisVertical
                          size={18}
                          color="#85888E"
                          style={{ cursor: "pointer" }}
                        />
                      </DropdownToggle>
                      <DropdownMenu dark>
                        <DropdownItem>
                          <div
                            className="py-2"
                            onClick={() => setIsViewEntities(!isViewEntities)}
                          >
                            <div className="d-flex align-items-center justify-space-between">
                              {isViewEntities ? (
                                <img
                                  className="me-2"
                                  src={
                                    theme === "Dark" ? pdfFileDark : pdfFileDark
                                  }
                                />
                              ) : (
                                <img
                                  className="me-2"
                                  src={
                                    theme === "Dark"
                                      ? checkFileDark
                                      : pdfFileDark
                                  }
                                />
                              )}
                              {`View ${isViewEntities ? "PDF" : "Entities"}`}
                            </div>
                          </div>
                        </DropdownItem>
                        <DropdownItem>
                          <div
                            className="py-2"
                            title="Export as Excel"
                            onClick={() => handleExport("Main")}
                          >
                            <div className="d-flex align-items-center justify-space-between">
                              <img
                                className="me-2"
                                src={theme === "Dark" ? fileImg : filexl}
                              />{" "}
                              Export as Excel
                            </div>
                          </div>
                        </DropdownItem>
                        <DropdownItem>
                          <div
                            className="py-2"
                            title="Export as xml"
                            onClick={() =>
                              downloadAsXml(
                                comparisondetails?.contract_number,
                                comparisondetails?.version,
                                "Main"
                              )
                            }
                          >
                            <div className="d-flex align-items-center justify-space-between">
                              <img
                                className="me-2"
                                src={theme === "Dark" ? file2Img : filexml}
                              />{" "}
                              Export as xml
                            </div>
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                  {/* <div >
                    
                    
                    
                  </div> */}
                </div>
                <div className="controller-left-view">
                  {isViewEntities ? (
                    <div className="prev-acc-box">
                      <h6 className="acc-head">Contract Entities</h6>

                      <div className="preview-acc-box">
                        <Accordion
                          open={accordionOpen}
                          toggle={toggleAccordion}
                          flush
                          className="preview-acc"
                        >
                          <AccordionItem>
                            <AccordionHeader targetId={1}>
                              Contract Offer
                            </AccordionHeader>
                            <AccordionBody accordionId={1}>
                              <ul className="acc-list-data">
                                {Object.entries(
                                  mainContract?.contractOffer
                                ).map(([key, value], index) =>
                                  key !== "id" &&
                                  key !== "created_at" &&
                                  key !== "updated_at" &&
                                  key !== "adjust_by" &&
                                  key !== "category_pricing" &&
                                  key !== "price_list_name" &&
                                  key !== "pricing_method" ? (
                                    <li key={index}>
                                      <span className="text-capitalize">
                                        {key.replace(/_/g, " ")}:{" "}
                                      </span>
                                      {String(value)}
                                    </li>
                                  ) : (
                                    ""
                                  )
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
                                {Object.entries(
                                  mainContract?.contractOffer
                                ).map(([key, value], index) =>
                                  key === "adjust_by" ||
                                  key === "category_pricing" ||
                                  key === "price_list_name" ||
                                  key === "pricing_method" ||
                                  key === "number_of_tiers" ? (
                                    <li key={index}>
                                      <span className="text-capitalize">
                                        {key.replace(/_/g, " ")}:
                                      </span>{" "}
                                      {String(value)}
                                    </li>
                                  ) : (
                                    ""
                                  )
                                )}
                              </ul>
                            </AccordionBody>
                          </AccordionItem>

                          <AccordionItem>
                            <AccordionHeader
                              targetId={3}
                              className="tiered-head"
                            >
                              Tiered Summary
                            </AccordionHeader>
                            <AccordionBody
                              accordionId={3}
                              className="tiered-body"
                            >
                              {mainContract?.tierSummary?.map((list, idx) => {
                                return (
                                  <ul className="acc-list-data tiered">
                                    <li className="hdr pt-3">
                                      <h6>
                                        Tier Level:
                                        <span className="cnt">
                                          {" "}
                                          0{list?.tier_level}
                                        </span>{" "}
                                      </h6>
                                    </li>
                                    <li className="hdr">
                                      <div className="d-flex justify-content-between text-start">
                                        <div className="ndc-num ndc-bg">
                                          <span className="tier-span">
                                            Purchase Volume Min
                                          </span>
                                          <h5>{list.volume_min ?? "-"}</h5>
                                        </div>
                                        <div className="wac-price ndc-bg">
                                          <span className="tier-span">
                                            Purchase Volume Max
                                          </span>
                                          <h5 className="">
                                            {list.volume_max ?? "-"}
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
                                          <h5>{list.discount_percentage}%</h5>
                                        </div>
                                        <div className="ndc-num">
                                          <h5>
                                            <span className="tier-span">
                                              Admin Fees(%)
                                            </span>{" "}
                                          </h5>
                                          <h5>{list.admin_fee_percentage}%</h5>
                                        </div>
                                        <div className="ndc-num">
                                          <h5>
                                            <span className="tier-span">
                                              Rebate(%)
                                            </span>{" "}
                                          </h5>
                                          <h5>{list.rebate_percentage}%</h5>
                                        </div>
                                      </div>
                                    </li>
                                    {/* <li className="split-li">
                                <div className="d-flex justify-content-between">
                                  <div className="ndc-num">
                                    <h5>
                                      <span className="tier-span">
                                        Administrative Fees Percentage :
                                      </span>{" "}
                                      {list.administrative_fee_percentage}%
                                    </h5>
                                  </div>
                                </div>
                              </li> */}
                                    {/* <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 3</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 20%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $156</h6>
                                </div>
                            </div>
                          </li> */}
                                  </ul>
                                );
                              })}
                              {/* <ul className="acc-list-data tiered">
                          <li className="hdr">
                            <div className="d-flex justify-content-between">
                                <div className="ndc-num">
                                    <span>NDC Number</span>
                                    <h5>65483-1021-30</h5>
                                </div>
                                <div className="wac-price">
                                    <span>WAC Price</span>
                                    <h5 className="text-end">$195</h5>
                                </div>
                            </div>
                          </li>
                          <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 1</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 10%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $175.5</h6>
                                </div>
                            </div>
                          </li>
                          <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 2</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 15%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $165.8</h6>
                                </div>
                            </div>
                          </li>
                          <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 3</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 20%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $156</h6>
                                </div>
                            </div>
                          </li>
                        </ul>
                        <ul className="acc-list-data tiered">
                          <li className="hdr">
                            <div className="d-flex justify-content-between">
                                <div className="ndc-num">
                                    <span>NDC Number</span>
                                    <h5>65483-2041-60</h5>
                                </div>
                                <div className="wac-price">
                                    <span>WAC Price</span>
                                    <h5 className="text-end">$425</h5>
                                </div>
                            </div>
                          </li>
                        </ul> */}
                            </AccordionBody>
                          </AccordionItem>

                          <AccordionItem>
                            <AccordionHeader
                              className="tiered-head"
                              targetId={4}
                            >
                              Tiered LI
                            </AccordionHeader>
                            <AccordionBody
                              accordionId={4}
                              className="tiered-body"
                            >
                              {mainContract?.tierDataProduct?.map((list) => {
                                return (
                                  <ul className="acc-list-data tiered">
                                    <li className="hdr pt-3">
                                      <div className="d-flex justify-content-between">
                                        <div className="ndc-num">
                                          <span>NDC Number</span>
                                          <h5>{list?.ndc_number}</h5>
                                        </div>
                                        <div className="wac-price text-end">
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
                                                <span>Discount:</span>{" "}
                                                {tierData?.discount}
                                              </h6>
                                            </div>
                                            <div>
                                              <h6>
                                                <span>Final Price:</span>{" "}
                                                {tierData?.final_price}
                                              </h6>
                                            </div>
                                          </div>
                                        </li>
                                      );
                                    })}
                                    {/* <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 1</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 10%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $175.5</h6>
                                </div>
                            </div>
                          </li>
                          <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 2</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 15%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $165.8</h6>
                                </div>
                            </div>
                          </li>
                          <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 3</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 20%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $156</h6>
                                </div>
                            </div>
                          </li> */}
                                  </ul>
                                );
                              })}
                              {/* <ul className="acc-list-data tiered">
                          <li className="hdr">
                            <div className="d-flex justify-content-between">
                                <div className="ndc-num">
                                    <span>NDC Number</span>
                                    <h5>65483-1021-30</h5>
                                </div>
                                <div className="wac-price">
                                    <span>WAC Price</span>
                                    <h5 className="text-end">$195</h5>
                                </div>
                            </div>
                          </li>
                          <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 1</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 10%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $175.5</h6>
                                </div>
                            </div>
                          </li>
                          <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 2</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 15%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $165.8</h6>
                                </div>
                            </div>
                          </li>
                          <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 3</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 20%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $156</h6>
                                </div>
                            </div>
                          </li>
                        </ul>
                        <ul className="acc-list-data tiered">
                          <li className="hdr">
                            <div className="d-flex justify-content-between">
                                <div className="ndc-num">
                                    <span>NDC Number</span>
                                    <h5>65483-2041-60</h5>
                                </div>
                                <div className="wac-price">
                                    <span>WAC Price</span>
                                    <h5 className="text-end">$425</h5>
                                </div>
                            </div>
                          </li>
                          {/* <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 1</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 10%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $180</h6>
                                </div>
                            </div>
                          </li>
                          <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 2</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 15%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $170</h6>
                                </div>
                            </div>
                          </li>
                          <li className="split-li">
                            <div className="d-flex align-items-center justify-content-between tier-split">
                                <div className="">
                                    <h6>Tier 3</h6>
                                </div>
                                <div className="">
                                    <h6><span>Discount </span>: 20%</h6>
                                </div>
                                <div>
                                    <h6><span>Final Price</span> : $160</h6>
                                </div>
                            </div>
                          </li> */}
                              {/* </ul> */}
                            </AccordionBody>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  ) : (
                    <>
                      {(
                        viewAstJsonLeft
                      ) ? (
                       <ViewAstInspector
                                     data={viewAstJsonLeft}
                                    
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
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className=" p-0 child-2">
              <div className="controller-right">
                <div className="controller-left-nav">
                  <h5>{comparisondetails?.contract_path} <button className='compare-version-number'>Version {comparisondetails?.compareVersion}</button></h5>
                  <div className="controller-btns">
                    <UncontrolledDropdown direction="start">
                      <DropdownToggle color="transparent">
                        <EllipsisVertical
                          size={18}
                          color="#85888E"
                          style={{ cursor: "pointer" }}
                        />
                      </DropdownToggle>
                      <DropdownMenu dark>
                        <DropdownItem>
                          <div
                            className="py-2"
                            onClick={() =>
                              setIsViewCompareEntities(!IsViewCompareEntities)
                            }
                          >
                            <div className="d-flex align-items-center justify-space-between">
                              {IsViewCompareEntities ? (
                                <img
                                  className="me-2"
                                  src={
                                    theme === "Dark" ? pdfFileDark : pdfFileDark
                                  }
                                />
                              ) : (
                                <img
                                  className="me-2"
                                  src={
                                    theme === "Dark"
                                      ? checkFileDark
                                      : pdfFileDark
                                  }
                                />
                              )}
                              {`View ${
                                IsViewCompareEntities ? "PDF" : "Entities"
                              }`}
                            </div>
                          </div>
                        </DropdownItem>
                        <DropdownItem>
                          <div
                            className="py-2"
                            title="Export as Excel"
                            onClick={() => handleExport("Compare")}
                          >
                            <div className="d-flex align-items-center justify-space-between">
                              <img
                                className="me-2"
                                src={theme === "Dark" ? fileImg : filexl}
                              />{" "}
                              Export as Excel
                            </div>
                          </div>
                        </DropdownItem>
                        <DropdownItem>
                          <div
                            className="py-2"
                            title="Export as xml"
                            onClick={() =>
                              downloadAsXml(
                                comparisondetails?.contract_number,
                                comparisondetails?.compareVersion,
                                "Compare"
                              )
                            }
                          >
                            <div className="d-flex align-items-center justify-space-between">
                              <img
                                className="me-2"
                                src={theme === "Dark" ? file2Img : filexml}
                              />{" "}
                              Export as xml
                            </div>
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </div>
                <div className="controller-left-view">
                  {IsViewCompareEntities ? (
                    <div className="prev-acc-box">
                      <h6 className="acc-head">Contract Entities</h6>

                      <div className="preview-acc-box">
                        <Accordion
                          open={accordionOpen}
                          toggle={toggleAccordion}
                          flush
                          className="preview-acc"
                        >
                          {/* Contract Offer */}
                          <AccordionItem>
                            <AccordionHeader targetId="1">
                              Contract Offer
                            </AccordionHeader>
                            <AccordionBody accordionId="1">
                              <ul className="acc-list-data">
                                {Object.entries(
                                  compareContract?.contractOffer || {}
                                ).map(([key, value], index) =>
                                  key !== "id" &&
                                  key !== "created_at" &&
                                  key !== "updated_at" &&
                                  key !== "adjust_by" &&
                                  key !== "category_pricing" &&
                                  key !== "price_list_name" &&
                                  key !== "pricing_method" ? (
                                    <li key={index}>
                                      <span className="text-capitalize">
                                        {key.replace(/_/g, " ")}:
                                      </span>{" "}
                                      <span
                                        className={getHighlightClass(
                                          getDiff(`contractOffer.${key}`)
                                        )}
                                      >
                                        {String(value)}
                                      </span>
                                    </li>
                                  ) : null
                                )}
                              </ul>
                            </AccordionBody>
                          </AccordionItem>

                          {/* Product Group */}
                          <AccordionItem>
                            <AccordionHeader targetId="2">
                              Product Group
                            </AccordionHeader>
                            <AccordionBody accordionId="2">
                              <ul className="acc-list-data">
                                {Object.entries(
                                  compareContract?.contractOffer || {}
                                ).map(([key, value], index) =>
                                  key === "adjust_by" ||
                                  key === "category_pricing" ||
                                  key === "price_list_name" ||
                                  key === "pricing_method" ||
                                  key === "number_of_tiers" ? (
                                    <li key={index}>
                                      <span className="text-capitalize">
                                        {key.replace(/_/g, " ")}:
                                      </span>{" "}
                                      <span
                                        className={getHighlightClass(
                                          getDiff(`contractOffer.${key}`)
                                        )}
                                      >
                                        {String(value)}
                                      </span>
                                    </li>
                                  ) : null
                                )}
                              </ul>
                            </AccordionBody>
                          </AccordionItem>

                          {/* Tiered Summary */}
                          <AccordionItem>
                            <AccordionHeader
                              targetId="3"
                              className="tiered-head"
                            >
                              Tiered Summary
                            </AccordionHeader>
                            <AccordionBody
                              accordionId="3"
                              className="tiered-body"
                            >
                              {compareContract?.tierSummary?.map(
                                (list, idx) => (
                                  <ul
                                    key={idx}
                                    className="acc-list-data tiered"
                                  >
                                    <li className="hdr pt-3">
                                      <h6>
                                        Tier Level:
                                        <span
                                          className={`cnt ${getHighlightClass(
                                            getDiff(
                                              `tierSummary.${idx}.tier_level`
                                            )
                                          )}`}
                                        >
                                          {list?.tier_level}
                                        </span>
                                      </h6>
                                    </li>
                                    <li className="hdr">
                                      <div className="d-flex justify-content-between text-start">
                                        <div className={`ndc-num ndc-bg`}>
                                          <span className="tier-span">
                                            Purchase Volume Min
                                          </span>
                                          <h5
                                            className={getHighlightClass(
                                              getDiff(
                                                `tierSummary.${idx}.volume_min`
                                              )
                                            )}
                                          >
                                            {list.volume_min ?? "-"}
                                          </h5>
                                        </div>
                                        <div className="wac-price ndc-bg">
                                          <span className="tier-span">
                                            Purchase Volume Max
                                          </span>
                                          <h5
                                            className={getHighlightClass(
                                              getDiff(
                                                `tierSummary.${idx}.volume_max`
                                              )
                                            )}
                                          >
                                            {list.volume_max ?? "-"}
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
                                          <h5
                                            className={getHighlightClass(
                                              getDiff(
                                                `tierSummary.${idx}.discount_percentage`
                                              )
                                            )}
                                          >
                                            {list.discount_percentage}%
                                          </h5>
                                        </div>
                                        <div className="ndc-num">
                                          <h5>
                                            <span className="tier-span">
                                              Admin Fees(%)
                                            </span>{" "}
                                          </h5>
                                          <h5
                                            className={getHighlightClass(
                                              getDiff(
                                                `tierSummary.${idx}.admin_fee_percentage`
                                              )
                                            )}
                                          >
                                            {list.admin_fee_percentage}%
                                          </h5>
                                        </div>
                                        <div className="ndc-num">
                                          <h5>
                                            <span className="tier-span">
                                              Rebate(%)
                                            </span>{" "}
                                          </h5>
                                          <h5
                                            className={getHighlightClass(
                                              getDiff(
                                                `tierSummary.${idx}.rebate_percentage`
                                              )
                                            )}
                                          >
                                            {list.rebate_percentage}%
                                          </h5>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                )
                              )}
                            </AccordionBody>
                          </AccordionItem>

                          {/* Tiered LI */}
                          <AccordionItem>
                            <AccordionHeader
                              targetId="4"
                              className="tiered-head"
                            >
                              Tiered LI
                            </AccordionHeader>
                            <AccordionBody
                              accordionId="4"
                              className="tiered-body"
                            >
                              {compareContract?.tierDataProduct?.map(
                                (list, idx) => (
                                  <ul
                                    key={idx}
                                    className="acc-list-data tiered"
                                  >
                                    <li className="hdr pt-3">
                                      <div className="d-flex justify-content-between">
                                        <div className="ndc-num">
                                          <span>NDC Number</span>
                                          <h5
                                            className={getHighlightClass(
                                              getDiff(
                                                `tierDataProduct.${idx}.ndc_number`
                                              )
                                            )}
                                          >
                                            {list?.ndc_number}
                                          </h5>
                                        </div>
                                        <div className="wac-price text-end">
                                          <span>WAC Price</span>
                                          <h5
                                            className={getHighlightClass(
                                              getDiff(
                                                `tierDataProduct.${idx}.wac_price`
                                              )
                                            )}
                                          >
                                            {list?.wac_price}
                                          </h5>
                                        </div>
                                      </div>
                                    </li>
                                    {list?.tiers?.map((tierData, tIdx) => (
                                      <li key={tIdx} className="split-li">
                                        <div className="d-flex align-items-center justify-content-between tier-split">
                                          <div>
                                            <h6>Tier {tierData?.tier}</h6>
                                          </div>
                                          <div>
                                            <h6
                                              className={getHighlightClass(
                                                getDiff(
                                                  `tierDataProduct.${idx}.tiers.${tIdx}.discount`
                                                )
                                              )}
                                            >
                                              <span>Discount:</span>{" "}
                                              {tierData?.discount}
                                            </h6>
                                          </div>
                                          <div>
                                            <h6
                                              className={getHighlightClass(
                                                getDiff(
                                                  `tierDataProduct.${idx}.tiers.${tIdx}.final_price`
                                                )
                                              )}
                                            >
                                              <span>Final Price:</span>{" "}
                                              {tierData?.final_price}
                                            </h6>
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )
                              )}
                            </AccordionBody>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  ) : (
                    <>
                      {(
                        viewAstJsonRight
                      ) ? (
                        <ViewAstInspector
                                     data={viewAstJsonRight}
                                    
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
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className=" p-0 child-3">
              <div class="changes">
                <div class="changes__header">
                  <div onClick={()=>setIsChangeHistory(true)}>Change History</div>
                  <div onClick={()=>setIsChangeHistory(false)}>Change Summary</div>
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