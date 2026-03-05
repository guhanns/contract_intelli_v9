import React, { useEffect, useRef, useState, version } from "react";
import Layouts from "../Pages/Layouts/Layouts";
import "./preview.css";
import classnames from "classnames";
import aidark from './../../images/icons/stardark.svg'
import ailight from './../../images/icons/starlight.svg'
import loadingImg from "../../images/icons/Group 3.svg";
import lightLoading from "../../images/icons/lightLoading.svg";
import fileImg from "../../images/icons/Excel-default.svg";
import xmlImg from "../../images/icons/file-02.svg";
import arrow_narrow_left from "../../images/icons/arrow-narrow-left.svg";
import aiSummary from "../../images/icons/ai_summary.svg"
import left_arrow from "../../images/icons/left-arrow.svg";
import right_arrow from "../../images/icons/right-arrow.svg";
import logo from "../../images/icons/SRM_chat-logo.svg";
import externalLink from "../../images/icons/external-link.svg";
import refreshimg from "../../images/icons/refresh.svg";
import refreshLightimg from "../../images/icons/refresh-light.svg";
import layoutLeft from "../../images/icons/layout-left.svg";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { truncate } from "lodash";
import DatePicker from "react-datepicker";
import {Calendar, CircleAlert, CircleCheckBig, EllipsisVertical, Info, Pencil, TriangleAlert, X} from  'lucide-react'

import contractPdf from "./SRM Pharma Contract.pdf";
import pricingPdf from "./Product_Pricing_Table.pdf";

// import demoexcel from "./ContractEntities.xlsx";

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Offcanvas,
  OffcanvasBody,
  OffcanvasHeader,
  Row,
  TabContent,
  TabPane,
  Tooltip,
  UncontrolledDropdown,
  UncontrolledTooltip,
} from "reactstrap";
import toast from "react-hot-toast";
import request, { NodeURL } from "../../api/api";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../Themecontext";
import chatAi from '../../images/icons/chat_entities.svg';
import { useMsal } from "@azure/msal-react";
import { addMessageByBot, addMessageByUser, clearChat } from "../redux/features/previewChat";
import { format, getTime, isToday, isYesterday } from "date-fns";
import Select from "react-select";
import PdfViewerWithPopup from "../Pages/PDFViewer/PdfViewerWithPopup";
import closeImg from "../../images/icons/x-comments.svg";
import avatar from "../../images/icons/Avatar-comment.svg";
import dots from "../../images/icons/dots-vertical-comment.svg";
import Avatar from "@mui/material/Avatar";
import Sections from "./Sections";
import aiDark from '../../images/icons/aiDark.svg';
import requestL, { LexiURL } from "../../api/lexi";
import NewPreview from "./NewPreview";
import ViewAstInspector from "./ViewAstInspector";
import { sqlFormatOptions } from "../Pages/EntityExtraction/NewEntityTemplate";

const colourStyles = {
  container: (styles) => ({
    ...styles,
    width: "100%",
    fontSize: "16px",
    color: "var(--text)",
  }),
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "var(--select-option-bg-color)",
    cursor: "pointer",
    minHeight: "40px",
    borderRadius: "8px",
    borderColor: isFocused ? "var(--select-option-boder-focused)" :  "var(--react-select-border-color)",
    boxShadow: "none",
    ":hover": {
      borderColor: "var(--select-option-border-onhover)",
    },
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "var(--bg-color-select-still)",
    border: "1px solid var(--select-document-type-border)",
    zIndex: 9999,
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    cursor: "pointer",
    backgroundColor: isFocused ? "var(--select-option-boder-focused)" : "var(--select-option-bg-color)",
    color: "var(--document-type-font-color)",
    ":hover": {
      backgroundColor: "var(--document-type-hover)",
    },
    fontSize: "14px",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "var(--placeholder-text)",
    fontSize: "14px",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "var(--text)",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "var(--text)",
    ":hover": {
      color: "var(--placeholder-text)",
    },
  }),
};

const docTypeOption = [
    {
        label:'Group (GROUP)',
        value:'GPO'
    },
    {
        label:'Independent Customer Contract (IND)',
        value:'IND'
    },
    {
        label:'IDN Buying Group Contract (IDN)',
        value:'IDN'
    },
    {
        label:'FSS Contract',
        value:'FSS'
    },
    {
        label:'PHS Contract',
        value:'PHS'
    },
    {
        label:'Master Contract (MA)',
        value:'MA'
    },
    {
        label:'Institutional Contract (INST)',
        value:'INST'
    },
    {
        label:'Managed Care Contract (MCO)',
        value:'MCO'
    },
    {
        label:'Medicare (MCARE)',
        value:'MCARE'
    }
]

const pricingOption = [
    {
        label:'Fixed Pricing Method (FIXED)',
        value:'FIXED'
    },
    {
        label:'List Pricing Method (LIST)',
        value:'LIST'
    },
    {
        label:'Discount-Off-List Pricing Method (DOL)',
        value:'DOL'
    },
    {
        label:'Tiered Pricing Method (TIER)',
        value:'TIER'
    },
    {
        label:'Dynamic Discount Off List Pricing Method (DDOL)',
        value:'DDOL'
    },
    {
        label:'Dynamic Tiered Pricing Method (DTIER)',
        value:'DTIER'
    },
    {
        label:'Order Quantity (OOD)',
        value:'OOD'
    },
]

const contractStatus = [
  {
    label:'Implemented',
    value:'Active'
  },
  {
    label:"Expired",
    value:"Expired"
  },
  {
    label:"Terminated",
    value:"Terminated"
  },
  {
    label:"Draft",
    value:"Draft"
  }

]

const adjustOption =[
  {
    label:'Percentage(%)',
    value:'%'
  },
  {
    label:'Dollars($)',
    value:'$'
  }
]

const sourceOption =[
  {
    label:'New',
    value:'New'
  },
  {
    label:'Amendment',
    value:'Amendment'
  }
]

const accordionData = [
  {
    name: "Contract Offer",
    data: Object.entries({
      author: "Admnistrator",
      customer: "39882",
      startDate: "7/1/2025",
      endDate: "6/30/2028",
      "document Id": "SM23457890",
      "document Name": "Premier Health Alliance Agreement",
      "document Type": "GPO",
      "document Status": "Active",
      "document Version Number": "DOC1.0",
      "document Version Creation Date": "5/23/2025",
      owner: "Administrator",
      "program Only": false,
      "source Type": "New",
    }),
  },
  // {
  //   name: "Business Segment",
  //   data: Object.entries({
  //     'import Action': "add Modify",
  //     'business Segment Template Name': "Business Segment",
  //     'section Name': "Business Segment",
  //   }),
  // },
  {
    name: "Product Group",
    data: Object.entries({
      "adjust By": "%",
      "category Pricing": "Pricing",
      "price List Name": "WAC",
      "pricing Method": "Tier",
      "number Of Tiers": 3,
    }),
  },
  {
    name: "Tiered LI",
    data: Object.entries({
      " base Price": "$20,000",
      "product Number": "PR456678",
      "direct Or Indirect": "DIRECT",
      "minimum Order Quantity": 50000,
      "minimum Order Block": true,
      minimumOrderPenalty: "$2,500",
    }),
  },
];

export const loadingStatus = [
  "Analyzing your PDF...",
  "Looking for key data points and patterns…",
  "Extracting contract offer, business segment, product group, Tired LI summary...",
  "Smart AI is reading between the lines…",
  "Ensuring accuracy before showing results…",
  "Ready! Loading your insights…",
];

const sections = [
  {
    title: '1. Introduction and General',
    subsections: [
      '1.1 Purpose and Scope',
      '1.2 Parties to the Agreement',
      '1.3 Key Definitions (Glossary)',
      '1.4 Term, Termination, Renewal'
    ]
  },
  { title: '2. Administrative Services', subsections: [] },
  { title: '3. Claims Processing and Payment', subsections: [] },
  { title: '4. Pharmacy Network Management', subsections: [] },
  { title: '5. Formulary and Drug Utilization Review', subsections: [] },
  { title: '6. Clinical and Specialty Programs', subsections: [] },
  { title: '7. Financial Terms and Payment', subsections: [] },
  { title: '8. Manufacturer Rebates', subsections: [] }
];

export const formatMessageTime = (date) => {
  const now = new Date();
  const messageDate = new Date(date);

  const diffInMinutes = Math.floor((now - messageDate) / (1000 * 60));

  if (diffInMinutes < 1) {
    return "Just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (isToday(messageDate)) {
    return format(messageDate, "'Today', hh:mm a");
  } else if (isYesterday(messageDate)) {
    return format(messageDate, "'Yesterday', hh:mm a");
  } else {
    return format(messageDate, "dd MMM yyyy, hh:mm a");
  }
};

function Preview() {
  const iframeRef = useRef(null);
  const location = useLocation();
  console.log(location)
  const dispatch = useDispatch()
  const chatEndRef = useRef(null);
  const [template,setTemplate] = useState('')
  const [locLatest,setLocLatest] = useState({})
  const [loadingExplain, setLoadingExplain] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [isInfo,setIsInfo] = useState(false)
  const [isEntityEdit,setIsEntityEdit] = useState(false)
  const [entityValue,setEntityValue] = useState(null)
  const [entityCommnet,setEntityComment] = useState("")
  const [extractionEntites,setExtractionEntites] = useState({})
  const [templateOption,setTemplateOption] = useState([])
    const [comment, setComment] = useState("");
    const [isExplain, setIsExplain] = useState(false);
    const [isExplainLoad, setIsExplainLoad] = useState(false);
    const [tierList,setTierList] = useState([])
    const [pricingList,setPricingList] = useState([])
    const [extraction, setExtraction] = useState({});
  const contractsData = useSelector((state)=>state.contract.contracts)
  const { chatMessages } = useSelector((state) => state.preview);
  const [versionList,setVersionList] = useState([])
  const [versionOpt,setVersionOpt] = useState([])
  const[verisonDetail,setVersionDetail] = useState({})
   const { theme, toogleTheme } = useTheme();
    const { instance, accounts } = useMsal();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSection,setIsSection] = useState(false)
  const [histLoading,setHistLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("1");
  const [accordionOpen, setAccordionOpen] = useState("");
  const [responseData, setResponseData] = useState({});
  const [contractOffer, setContractOffer] = useState([]);
  const [contractOfferWithScore, setContractOfferWithScore] = useState([]);
  const [productGroup, setProductGroup] = useState([]);
  const [tierDataProduct, setTierDataProduct] = useState([]);
  const [sendMessage, setSendMessage] = useState("");
  const [tierSummary,setTierSummary] = useState()
  const [tierSummaryWithScore,setTierSummaryWithScore] = useState()
  const [isChat,setIsChat] = useState(false)
  const [isChanges,setIsChanges] = useState(false)
  const [isViewEntities,setIsViewEntities] = useState(true)
  const [isComments,setIsComments] = useState(false)
  const { files } = location.state || {};
   const [sampleQ,setSampleQ] = useState([])
   const [commentsList,setCommentsList] = useState([])
   const [isTierWarning,setIsTierWarning] = useState(false)
   const [isTierEdit,setIsTierEdit] = useState(false)
   const [editTierData,setEditTierData] = useState({})
    const [width, setWidth] = useState(300); // initial width, adjust as needed
    const [viewAstJson,setViewAstJson] = useState({})
  const minWidth = 300;
  const maxWidth = 600;
  
  const containerRef = useRef(null);
  const isResizingRef = useRef(false);

  const [contractUrl, setContractUrl] = useState("");
  const [url, setUrl] = useState("");
  const [statusIndex, setStatusIndex] = useState(0);
  const [historyList,setHistoryList] = useState({})
  const [summaryList,setSummaryList] = useState({})
  const [open, setOpen] = useState('0');
  const [isEdit,setIsEdit] = useState(false)
  const [editEntitie,setEditEntitie] =useState({
    key:'',
    value:'',
    comment:''
  })
  const [commentIndex,setCommentIndex] = useState({})


  const toggleSectionAcc = id => {
    open === id ? setOpen() : setOpen(id);
  };

// Modal Open for edit Entity
  const toggleEditEntity =() =>{
    setIsEdit(!isEdit)
  }

//Which entity we are editing saving the key and value
  const editEntities =(key,value) =>{
    setEditEntitie({
      ...editEntitie,
      key,
      value
    })
    setIsEdit(!isEdit)
  }


  const handleEntities =()=>{
    setIsChat(false)
    setIsChanges(false)
    setIsViewEntities(true)
  }

  const handleChat =()=>{
    setIsChat(true)
    setIsChanges(false)
    setIsViewEntities(false)
  }

  const handleChanges =()=>{
     setIsChat(false)
    setIsChanges(true)
    setIsViewEntities(false)
  }

  const handleViewComments =() =>{
     setIsChat(false)
    setIsChanges(false)
    setIsViewEntities(false)
    setIsComments(true)
  }

  const fetchCommentList =()=>{
    requestL({
      url:`/contracts/${location?.state?.contract_id}/${location?.state?.version_number}/annotations`,
      method:"GET",
    }).then((res)=>{
      setCommentsList(res)
    }).catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    if(location?.state?.contract_id){
      fetchCommentList()
    }
  },[location?.state?.contract_id])

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setStatusIndex((prevIndex) => (prevIndex + 1) % loadingStatus.length);
    }, 8000); // 10 seconds

    return () => clearInterval(interval); // cleanup
  }, [isLoading]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleAccordion = (id) => {
    if (accordionOpen.includes(id)) {
      setAccordionOpen((prev) => prev.filter((item) => item !== id)); // remove if already open
    } else {
      setAccordionOpen((prev) => [...prev, id]); // add if not open
    }
  };


  useEffect(() => {
    if (location?.state?.pricing) {
      setTierData(location?.state?.pricing);
    }
  }, [location]);


  const getVersionList = async(contract_number,version)=>{
   axios
      .get(`${LexiURL}/contracts/${contract_number}/versions`)
      .then((res) => {
        if(res?.data){
          let filteredVersion = res?.data?.amendments.filter((li)=>{
            return li.version_number !== Number(version)
          })
          setVersionList(filteredVersion);
          setVersionOpt(filteredVersion?.map((li)=>{
            return {
              lable: `v${li.version_number}`,
              value: li.version_number
            }
          }))
          setVersionDetail(res?.data)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }


 
  const fetchContract = async (contract_num,version) => {
    axios
      .get(`${NodeURL}/icontract/backend/AllColumns/${contract_num}/${version}`)
      .then((res) => {
        setIsLoading(false)
        setContractOffer(res?.data?.contracts[0]);
        setContractOfferWithScore(res?.data?.contract_details?.basic_info)
        setTierSummary(res?.data?.contract_details?.tier_structure)
        setTierDataProduct(res?.data?.products)
        setUrl(res?.data?.file_info)
        dispatch(clearChat())
      })
      .catch((err) => {
        console.log(err);
      });
  };

 
  useEffect(() => {
    if (location?.state?.contract_id) {
      fetchContract(location?.state?.contract_id,location?.state?.version_number);
      getVersionList(location?.state?.contract_id,location?.state?.version_number)
    }
  }, [location?.state?.contract_id]);


 
const handleExport = (type) => {
  toast.loading('Downloading...')
  requestL({
    url: `/contracts/${location?.state?.contract_id}/${location?.state?.version_number}/export/${type}`,
    method: "GET",
    responseType: "blob",
  })
    .then((res) => {
      const blob = new Blob([res], { type: res.type || "application/octet-stream" });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `contract_export.${type}`; // file name

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss()
      toast.success("Downloaded Successfully")
    })
    .catch((err) => {
      console.log(err);
    });
};

  const prevContract =()=>{
    
    let currentIndex = contractsData?.findIndex(
      (list) =>
        list.contract_number === location?.state?.contractNum &&
        list.document_version_number === location?.state?.version
    );
    let nextIndex = currentIndex === 0 ? Number(1) : currentIndex - 1;
    if(currentIndex!==0){
      navigate('/list/preview',{state:{contractNum:contractsData[nextIndex]?.contract_number,version:contractsData[nextIndex]?.document_version_number}})
    }
  }


  const nextContract =()=>{
    
    let currentIndex = contractsData?.findIndex((list)=>list.contract_number === location?.state?.contractNum &&
        list.document_version_number === location?.state?.version)
    let nextIndex = currentIndex+1
    if(nextIndex !== contractsData.length){
      navigate('/list/preview',{state:{contractNum:contractsData[nextIndex]?.contract_number,version:contractsData[nextIndex]?.document_version_number}})
    }
  }

  const handleCompare = (value) => {
    navigate("/comparison", {
      state: {
        contract_id:verisonDetail?.contract_id,
        contract_number:verisonDetail?.contract_number,
        version_number:location?.state?.version_number,
        compare_verison :value
      },
    });
  };

  


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
   
   requestL({
    url:`/contracts/${location?.state?.contract_id}/${location?.state?.version_number}/ask`,
    method:'POST',
    data:{
      question:question
    }
   }).then((res) => {
  setIsLoading(false);
  dispatch(addMessageByBot(res));
}).catch((err) => {
        console.log(err);
        setSendMessage('')
      });
  };


  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]) 



  const fetchChangeHistory = (contract,version) =>{

    if(versionList?.length > 0 ){
      setHistLoading(true)
      request({
      url:`/icontract/backend/change_history/${contract}/${Number(version)-1}/${version}`,
      method:'GET',
    }).then((res)=>{
      setHistLoading(false)
        setHistoryList(res?.change_history)
        setSummaryList(res?.change_summary)
    }).catch((err)=>{
      console.log(err)
    })
    }
  }

  useEffect(()=>{
    if(location?.state?.contractNum && location?.state?.version){
      fetchChangeHistory(location?.state?.contractNum,location?.state?.version)
    }
  },[location,versionList])

  const saveXmlFile = (xmlData) => {
  // If xmlData is already a string, skip stringify
  const xmlString = typeof xmlData === "string" ? xmlData : new XMLSerializer().serializeToString(xmlData);

  const blob = new Blob([xmlString], { type: "application/xml;charset=utf-8" });
  const filename = url?.file_name?.split('.')[0] || "exported_data";
  saveAs(blob, `${filename}.xml`); // download file as contract_data.xml
};


  const downloadAsXml =()=>{
    if(location?.state?.contractNum && location?.state?.version){
      
        request({
      url:'/icontract/backend/export_xml',
      method:'POST',
      data:{
        contract_number:location?.state?.contractNum,
        document_version_number:String(location?.state?.version)
      }
    }).then((res)=>{
      if(res){
        saveXmlFile(res)
      }
    }).catch((err)=>{
      console.log(err)
    })
    }
    
  }

  const toggleSection = () =>{
    setIsSection(!isSection)
    setWidth(300)
    fetchCommentList()
  }

  

  const updateContract =()=>{
    const {key,value,comment} = editEntitie
    request({
      url:'/icontract/backend/contracts/update-and-comment',
      method:'POST',
      data:{
        id:contractOffer?.id,
        commented_by:accounts[0]?.name,
        comment:comment,
        [key]:value,
        new_value:value,
        old_value:contractOffer[key]
      }
    }).then((res)=>{
      toast.success("Entities Updated Successfully")
      setIsEdit(!isEdit)
      fetchContract(contractOffer?.contract_number,contractOffer?.document_version_number)
    }).catch((err)=>{
      console.log(err)
      toast.error("Entities not Updated")
    })
  }


  const handleMouseUp = () => {
    const iframe = iframeRef.current;
    const iframeWindow = iframe.contentWindow;
    const selectedText = iframeWindow.getSelection().toString();

    if (selectedText.trim()) {
      console.log("Selected text:", selectedText);

    }
  };


  const handleScrollToPage = (pageNum) => {
     const pageElement = document.querySelector(`[data-page-number="${pageNum}"]`);
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleScrollToNode = (nodeId, index, color) => {
  // Find the node element in ViewAstInspector
  const docNodes = document.querySelectorAll('.vai-doc-node');
  let targetElement = null;

  for (const node of docNodes) {
    if (node.getAttribute('data-node-id') === nodeId && 
        node.getAttribute('data-index') === String(index)) {
      targetElement = node;
      break;
    }
  }

  if (targetElement) {
    // Scroll into view
    targetElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Apply highlight effect using comment color
    targetElement.style.transition = "box-shadow 0.3s ease, background 0.3s ease";
    targetElement.style.boxShadow = `0 0 10px 4px ${color}`;
    targetElement.style.backgroundColor = `${color}30`; // soft background tint
    targetElement.style.borderRadius = "4px";
    targetElement.style.padding = "4px";

    // Remove highlight effect after 3 seconds
    setTimeout(() => {
      targetElement.style.boxShadow = "none";
      targetElement.style.backgroundColor = "transparent";
      targetElement.style.borderRadius = "0px";
      targetElement.style.padding = "0px";
    }, 3000);
  } else {
    console.warn(`Node with id: ${nodeId} and index: ${index} not found in ViewAstInspector`);
  }
};

  const editTierLevel =(data)=>{
    setIsTierWarning(true)
    setEditTierData(data)
  }

  const confirmEditTierLevl =()=>{
    setIsTierEdit(true)
    setIsTierWarning(false)
  }

   const handleEditTierData =()=>{
    requestL({
    url:`/entities/${tierList?.entity_id}`,
    method:'PATCH',
    data:{
      value:editTierData,
      comment:entityCommnet
    }
  }).then((res)=>{
    toast.success("Updated Successfully")
    console.log(res)
    setIsTierEdit(false)
    setEditTierData({})
    setEntityComment("")
    setEntityValue(null)
    handleExtractionEntities()

  }).catch((err)=>{
    console.log(err)
  })
  }

  const handleMouseDown = (e) => {
    isResizingRef.current = true;
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizingRef.current) return;
      const newWidth = e.clientX - (containerRef.current?.getBoundingClientRect().left ?? 0);
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = (e) => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleChangeVerison = (value)=>{
    navigate('/list/preview',{state:{...location?.state,version_number:value}})
    handleExtractionEntities()
    setVersionOpt([])
    setVersionList([])
    getVersionList(location?.state?.contract_id,value)}

const pollingRef = useRef(null);
  const handleExtractionEntities = () => {
    let templateId = location?.state?.isExtract ? location?.state?.template_id : template
  requestL({
    url: `/entities/${location?.state?.contract_id}/${location?.state?.version_number}`,
    method: "GET",
    params: {
      template_id:templateId,
    },
  })
    .then((res) => {
      
      setExtractionEntites(res)
      setTemplateOption(res?.templates?.map((li)=>{
        return {
          label:li?.template_name,
          value:li?.template_id
        }
      }))
      const status = res?.status;

      if (status === "PROCESSING") {
        pollingRef.current = setTimeout(() => {
          handleExtractionEntities();
        }, 5000);
      }

      if (status === "COMPLETED") {
        setIsLoading(false)
        fetchContractPricing()
        if (pollingRef.current) {
          clearTimeout(pollingRef.current);
          
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

useEffect(() => {
  if (location?.state?.contract_id) {
    handleExtractionEntities();
  }

  return () => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
    }
  };
}, [location?.state,template]);


const fetchViewAstJson =()=>{
  requestL({
    url:`/contracts/${location?.state?.contract_id}/${location?.state?.version_number}/view-ast-json`,
    method:'GET',
  }).then((res)=>{
    setViewAstJson(res)
  }).catch((err)=>{
    console.log(err)
  })
}

const intervalRef = useRef(null);

const fetchLocAgreement = () => {
  requestL({
    url: `/contracts/${location?.state?.contract_id}/loc-agreements`,
    method: "GET",
  })
    .then((res) => {
      const lastItem = res[res.length - 1];
      setLocLatest(lastItem);

      if (lastItem?.status === "PROCESSING") {
        startPolling();
      } else {
        stopPolling();
      }
    })
    .catch((err) => {
      console.log(err);
      stopPolling();
    });
};

const startPolling = () => {
  if (intervalRef.current) return; // prevent duplicate intervals

  intervalRef.current = setInterval(() => {
    fetchLocAgreement();
  }, 5000);
};

const stopPolling = () => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
};

useEffect(() => {
  if(location?.state?.contract_id){
    fetchLocAgreement();
  }

  return () => {
    stopPolling(); // cleanup when component unmounts
  };
}, [location?.state?.contract_id]);

useEffect(()=>{
  if(location?.state?.contract_id){
    fetchViewAstJson()
    
  }
},[location?.state])

const saveNodeIndex =(data)=>{
  setCommentIndex({
    node_id:data?.id,
    index:data?.index
  })
  
}


const handleExplain = async (nodeId, index) => {
    console.log("Explain clicked:", nodeId, index);

    setLoadingExplain(true);
    setIsExplain(true);
    setExtraction({});

    try {
      const res = await requestL({
        url:`/contracts/${location?.state?.contract_id}/${location?.state?.version_number}/explain-clause`,
        method:'POST',
        data:{
         node_id: nodeId
        }
      });
      setExtraction(res);
      setLoadingExplain(false);
    } catch (error) {
      console.error("Error explaining clause:", error);
      setExtraction({ explanation: "Failed to load explanation. Please try again." });
      setLoadingExplain(false);
    }
  };

  const handleAddNote = (nodeId, index) => {
    console.log("Add note clicked:", nodeId, index);
    setShowCommentBox(true)
    setCommentIndex({
      node_id:nodeId,
      index
    })
    
  };

   const handleCloseExtraction = () => {
    setIsExplain(false);
    setExtraction({});
  };

  const onCancelComment = () => {
  setShowCommentBox(false);
  setCommentIndex({})
};

const getRGBFromString = (str) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate RGB values
  let r = (hash >> 16) & 255;
  let g = (hash >> 8) & 255;
  let b = hash & 255;

  // Make colors softer (avoid dark ugly shades)
  r = (r + 256) % 256;
  g = (g + 256) % 256;
  b = (b + 256) % 256;

  // Lighten the color
  r = Math.floor((r + 255) / 2);
  g = Math.floor((g + 255) / 2);
  b = Math.floor((b + 255) / 2);

  return `rgb(${r}, ${g}, ${b})`;
};

const saveComment =()=>{
  requestL({
    url:`/contracts/${location?.state?.contract_id}/${location?.state?.version_number}/annotations`,
    method:'POST',
    data:{
      node_id:commentIndex?.node_id,
      node_index:commentIndex?.index,
      comment,
      created_by: accounts[0]?.name,
      color:getRGBFromString(commentIndex?.node_id)
    }
  }).then((res)=>{
    console.log(res)
    fetchCommentList()
    setShowCommentBox(false)
    setComment("")
  }).catch((err)=>{
    console.log(err)
  })
}

const fetchContractPricing =()=>{
  requestL({
    url:`/contracts/${location?.state?.contract_id}/${location?.state?.version_number}/pricing`,
    method:'GET',
  }).then((res)=>{
    setIsLoading(false)
    setTierList(res?.tiers_source)
    setPricingList(res?.pricing)
  }).catch((err)=>{
    console.log(err)
  })
}







useEffect(()=>{
  if(location?.state?.contract_id){
    fetchContractPricing()
  }
},[location?.state?.contract_id])

const UpdateEntity =()=>{
  requestL({
    url:`/entities/${entityValue?.entity_id}`,
    method:'PATCH',
    data:{
      value:entityValue?.value,
      comment:entityCommnet
    }
  }).then((res)=>{
    console.log(res)
    setIsEntityEdit(false)
    setEntityComment("")
    setEntityValue(null)
    handleExtractionEntities()

  }).catch((err)=>{
    console.log(err)
  })
}


const handleEditCell = (rowIndex, key, value) => {
  setEntityValue(prev => {
    const updatedRows = [...prev.value];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [key]: value
    };

    return {
      ...prev,
      value: updatedRows
    };
  });
};


const handleEditTierCell = (rowIndex, key, value) => {
  setEditTierData(prev => {
    const updatedRows = [...prev];

    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [key]: value === "" ? null : value
    };

    return [
      ...updatedRows
    ];
  });
};

  return (
    <Layouts>
      <style>{`
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
        }
        table, th, td {
          border: 1px solid #ccc;
        }
        th, td {
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background: #f5f5f5;
        }
      `}</style>
      <div className="container-fluid position-relative">
        <div className="doc-nav">
          <div className="head-back">
            <h5 onClick={() => navigate(-1)}>
              <img src={arrow_narrow_left} />
              {extractionEntites?.original_filename}
              {versionList?.length > 0 ? (
                <div className="ms-3">
                  <UncontrolledDropdown onClick={(e) => e.stopPropagation()}>
                    <DropdownToggle caret className="contract-upld-btn version">
                      Version {location?.state?.version_number}
                    </DropdownToggle>
                    <DropdownMenu className="">
                      {versionOpt?.map((contract, idx) => (
                        <DropdownItem
                          key={idx}
                          onClick={() => handleChangeVerison(contract?.value)}
                        >
                          {contract.lable}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              ) : (
                ""
              )}
            </h5>
          </div>
          <div className="next-page">
            {versionList?.length > 0 ? (
              <div>
                <UncontrolledDropdown>
                  <DropdownToggle caret className="contract-upld-btn">
                    Compare Versions
                  </DropdownToggle>
                  <DropdownMenu className="">
                    {versionOpt?.map((contract, idx) => (
                      <DropdownItem
                        key={idx}
                        onClick={() => handleCompare(contract?.value)}
                      >
                        {contract.lable}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            ) : (
              ""
            )}

            {isViewEntities ? (
              <>
                {/* {versionList?.length > 0 && (
                  <button
                    className="view-entities"
                    onClick={() => handleChanges()}
                  >
                    <img
                      src={theme === "Dark" ? refreshimg : refreshLightimg}
                      className="me-2"
                    />
                    Contract Changes
                  </button>
                )} */}

                <button className="ask-ai" onClick={() => handleChat()}>
                  {" "}
                  <img src={chatAi} style={{ marginRight: "10px" }} />
                  Ask AI
                </button>
              </>
            ) : isChat ? (
              <>
                {/* {versionList?.length > 0 && (
                  <button
                    className="view-entities"
                    onClick={() => handleChanges()}
                  >
                    <img
                      src={theme === "Dark" ? refreshimg : refreshLightimg}
                      className="me-2"
                    />
                    Contract Changes
                  </button>
                )} */}
                <button
                  className="view-entities"
                  onClick={() => handleEntities()}
                >
                  View Entities
                </button>{" "}
              </>
            ) : isChanges ? (
              <>
                <button
                  className="view-entities"
                  onClick={() => handleEntities()}
                >
                  View Entities
                </button>
                {/* <button className="ask-ai" onClick={() => handleChat()}>
                  {" "}
                  <img src={chatAi} style={{ marginRight: "10px" }} />
                  Ask AI
                </button> */}
              </>
            ) : isComments ? (
              <>
                {/* {versionList?.length > 0 && (
                  <button
                    className="view-entities"
                    onClick={() => handleChanges()}
                  >
                    <img
                      src={theme === "Dark" ? refreshimg : refreshLightimg}
                      className="me-2"
                    />
                    Contract Changes
                  </button>
                )} */}
                <button
                  className="view-entities"
                  onClick={() => handleEntities()}
                >
                  View Entities
                </button>
                {/* <button className="ask-ai" onClick={() => handleChat()}>
                  {" "}
                  <img src={chatAi} style={{ marginRight: "10px" }} />
                  Ask AI
                </button> */}
              </>
            ) : (
              ""
            )}
            <div className="me-3">
              <UncontrolledDropdown>
                <DropdownToggle
                  className=""
                  style={{ background: "transparent", border: "none" }}
                >
                  <EllipsisVertical
                    size={25}
                    color="#85888E"
                    style={{ cursor: "pointer" }}
                  />
                </DropdownToggle>
                <DropdownMenu className="">
                  <DropdownItem onClick={() => handleViewComments()}>
                    View Comments
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>

            {/* <div className="next-page-nav">
              <span onClick={() => prevContract()}>
                <img src={left_arrow} />
              </span>
              <span className="count-page">
                <span>
                  {contractsData?.findIndex(
                    (list) =>
                      list.contract_number === location?.state?.contractNum &&
                      list.document_version_number === location?.state?.version
                  ) + 1}
                </span>
                /<span>{contractsData?.length}</span>
              </span>
              <span onClick={() => nextContract()}>
                <img src={right_arrow} />
              </span>
            </div> */}
          </div>
        </div>
        <Row>
          {/* Left Side: File Preview */}
          <Col sm="12" md="12" lg="8" className="left-nav">
            <div className={`pdf-view-url ${isSection ? "pdf-resize" : ""}`}>
              {/* <div
                className="layout-section"
                title="Section"
                // onClick={() => toggleSection()}
              >
                <img src={layoutLeft} />
              </div> */}
              {/* {url?.file_url && (
                <PdfViewerWithPopup
                  file={url?.file_url}
                  filename={url?.file_name}
                  contract={contractOffer}
                  fetchList={fetchCommentList}
                  commentList={commentsList}
                  width={containerRef}
                />
              )} */}
              {/* <iframe
                ref={iframeRef}
                src={url?.file_url}
                width={"100%"}
                height={"900px"}
                // style={{ border: "1px solid #ccc" }}
              /> */}

              <ViewAstInspector
                data={viewAstJson}
                onNodeSelect={saveNodeIndex}
                onExplain={handleExplain}
                onAdd={handleAddNote}
                isExplainLoad={loadingExplain}
                isPopup={true}
              />

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
                    style={{
                      width: "40px",
                      height: "40px",
                      marginRight: "8px",
                    }}
                  />
                  {`AI Summary`}
                </ModalHeader>
                <ModalBody className="Modal-body-explainthis">
                  {loadingExplain ? "Loading..." : extraction?.explanation}
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
                <div className="modal-mark-with">
                  Mark With Comments
                  <img src={close} onClick={onCancelComment} />
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
                    <button class="save-btn m-0" onClick={() => saveComment()}>
                      Save Comments
                    </button>
                  </div>
                </ModalBody>
              </Modal>
              <div
                ref={containerRef}
                className={`section-list-layout ${isSection ? "" : "hide"}`}
                style={{
                  width: `${width}px` /* maybe minWidth and maxWidth inline for safety */,
                }}
              >
                <div>
                  <div className="layout-header">
                    <div className="head">
                      <img src={theme === "Dark" ? aiDark : ailight} />
                      Sections
                    </div>
                    {/* <div className="off-btn" onClick={() => toggleSection()}>
                    <img src={layoutLeft} />
                    </div> */}
                  </div>
                  <Sections filename={url?.file_name} />
                </div>
                <div
                  className="resize-handle"
                  onMouseDown={handleMouseDown}
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "5px",
                    cursor: "col-resize",
                  }}
                />
              </div>
            </div>
          </Col>

          {/* Right Side: Contract Entities */}
          <Col sm="12" md="12" lg="4" className="right-tab">
            <>
              {isChat ? (
                <>
                  <div className="prev-acc-box preview">
                    <h6 className="acc-head">Ask AI Assistant</h6>
                    {chatMessages.length <= 0 ? (
                      <div className="initial-chat p-4 preview">
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
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="preview-chat-main-box">
                          {chatMessages?.map((msg) => {
                            return (
                              <>
                                <div className="preview-chat-box">
                                  {msg.role === "user" ? (
                                    <div className="chat-right">
                                      <div className="chat-msg right">
                                        {/* <div className="by">You</div> */}
                                        <div className="msg right">
                                          {msg.message}
                                        </div>
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
                                          <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                          >
                                            {msg?.message?.answer}
                                          </ReactMarkdown>
                                          {/* {renderBulletPoints()} */}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
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
                            <div ref={chatEndRef} />
                          </>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="chat-search preview">
                      <input
                        className="chat-search-input preview"
                        value={sendMessage}
                        placeholder="Ask your question"
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
                </>
              ) : isChanges ? (
                <>
                  <div className="prev-acc-box preview">
                    <div className="history-container">
                      {/* Tabs */}
                      <Nav tabs className="history-tabs">
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "1",
                            })}
                            onClick={() => toggle("1")}
                          >
                            Change History
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "2",
                            })}
                            onClick={() => toggle("2")}
                          >
                            Change Summary
                          </NavLink>
                        </NavItem>
                      </Nav>

                      {/* Tab Content */}
                      {histLoading ? (
                        <>
                          <div className="container my-5 p-0 loading-contract">
                            <div className="w-50 m-auto text-center">
                              <img
                                src={
                                  theme === "Dark" ? loadingImg : lightLoading
                                }
                                className="loadingimg"
                              />
                              <h5 className="loading-info">
                                <i>{loadingStatus[statusIndex]}</i>
                              </h5>
                            </div>
                          </div>
                        </>
                      ) : (
                        <TabContent
                          activeTab={activeTab}
                          className="history-content"
                        >
                          <TabPane tabId="1">
                            {/* Timeline */}
                            <div className="timeline">
                              <div className="timeline-date">
                                {historyList?.upload_timestamp && (
                                  <>
                                    {isToday(
                                      new Date(historyList?.upload_timestamp),
                                    )
                                      ? "Today"
                                      : ""}
                                  </>
                                )}
                                ,{" "}
                                {historyList?.upload_timestamp &&
                                  format(
                                    new Date(historyList?.upload_timestamp),
                                    "dd-MMM-yyyy",
                                  )}
                              </div>
                              {historyList?.change_history?.length > 0 && (
                                <>
                                  {historyList?.change_history?.map((chng) => {
                                    return (
                                      <div className="timeline-item">
                                        <div className="timeline-dot" />
                                        <div className="timeline-time">
                                          {historyList?.upload_timestamp &&
                                            format(
                                              new Date(
                                                historyList?.upload_timestamp,
                                              ),
                                              "hh:mm a",
                                            )}{" "}
                                          | Edited by {historyList?.modified_by}
                                        </div>
                                        <div className="timeline-card">
                                          <h4>{chng?.type}</h4>
                                          <p
                                            className=""
                                            dangerouslySetInnerHTML={{
                                              __html: chng?.description,
                                            }}
                                          ></p>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              )}
                            </div>
                          </TabPane>

                          <TabPane tabId="2">
                            <div className="summary p-3 ">
                              {historyList?.change_history?.length > 0 && (
                                <div>
                                  <ReactMarkdown>
                                    {summaryList?.llm_generated_histories?.replace(
                                      /•/g,
                                      "-",
                                    )}
                                  </ReactMarkdown>
                                </div>
                              )}
                            </div>
                          </TabPane>
                        </TabContent>
                      )}
                    </div>
                  </div>
                </>
              ) : isViewEntities ? (
                <>
                  <div className="prev-acc-box">
                    <div className="bundle-type-box">
                      <span className="bundle-label">Bundle Type:</span>
                      {locLatest?.classification ? (
                        <span className="bundle-value active">
                          {locLatest?.classification} <Info size={18}  onClick={()=>setIsInfo(true)}/>
                        </span>
                      ) : (
                        <span className="bundle-value">
                          No Bundle Allocation
                        </span>
                      )}
                    </div>
                    {!location?.state?.isExtract && (
                      <div className="d-flex align-items-center">
                        <h5 className="acc-head">Select Entity Template</h5>
                        <div>
                          <Select
                            styles={colourStyles}
                            options={templateOption}
                            placeholder="Select Template"
                            value={templateOption?.filter(
                              (li) => li.value === template,
                            )}
                            onChange={(e) => setTemplate(e.value)}
                          />
                        </div>
                      </div>
                    )}

                    {isLoading ? (
                      <>
                        <div className="container my-5 p-0 loading-contract">
                          <div className="w-50 m-auto text-center">
                            <img
                              src={theme === "Dark" ? loadingImg : lightLoading}
                              className="loadingimg"
                            />
                            <h5 className="loading-info">
                              <i>{loadingStatus[statusIndex]}</i>
                            </h5>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="preview-acc-box">
                        <Accordion
                          open={accordionOpen}
                          toggle={toggleAccordion}
                          flush
                          className="preview-acc"
                        >
                          {extractionEntites?.sections?.length > 0
                            ? extractionEntites?.sections?.map(
                                (sec, secIdx) => {
                                  return (
                                    <AccordionItem>
                                      <AccordionHeader targetId={secIdx + 1}>
                                        {sec?.section}
                                      </AccordionHeader>
                                      <AccordionBody accordionId={secIdx + 1}>
                                        <ul className="acc-list-data">
                                          {sec?.entities?.length > 0
                                            ? sec?.entities?.map(
                                                (ent, entId) => {
                                                  return (
                                                    <li
                                                      key={entId}
                                                      className="px-2 contract-offer"
                                                    >
                                                      {ent?.format ===
                                                        "string" && (
                                                        <div className="me-2">
                                                          <span className="text-capitalize">
                                                            {ent?.display_key} :
                                                          </span>

                                                          <span className="ms-2">
                                                            {
                                                              ent?.effective_value
                                                            }
                                                          </span>
                                                        </div>
                                                      )}

                                                      {ent?.format ===
                                                        "table" && (
                                                        <div>
                                                          <div>
                                                            {ent?.display_key}
                                                          </div>
                                                          <div>
                                                            <table className="bundle-table-edx">
                                                              <thead>
                                                                <tr>
                                                                  {ent?.columns
                                                                    ?.length >
                                                                    0 &&
                                                                    ent?.columns?.map(
                                                                      (
                                                                        li,
                                                                        colIdx,
                                                                      ) => {
                                                                        return (
                                                                          <th
                                                                            className="ai-ns-table"
                                                                            key={
                                                                              colIdx
                                                                            }
                                                                          >
                                                                            {
                                                                              li?.display_key
                                                                            }
                                                                          </th>
                                                                        );
                                                                      },
                                                                    )}
                                                                </tr>
                                                              </thead>
                                                              <tbody>
                                                                {ent
                                                                  ?.effective_value
                                                                  ?.length >
                                                                  0 &&
                                                                  ent.effective_value.map(
                                                                    (
                                                                      li,
                                                                      index,
                                                                    ) => (
                                                                      <tr
                                                                        key={
                                                                          index
                                                                        }
                                                                        style={{
                                                                          borderBottom:
                                                                            index <
                                                                            ent
                                                                              .effective_value
                                                                              .length -
                                                                              1
                                                                              ? "1px solid rgba(255,255,255,0.05)"
                                                                              : "none",
                                                                          backgroundColor:
                                                                            index %
                                                                              2 ===
                                                                            0
                                                                              ? "transparent"
                                                                              : "rgba(0,0,0,0.02)",
                                                                        }}
                                                                      >
                                                                        {Object.entries(
                                                                          li,
                                                                        ).map(
                                                                          (
                                                                            [
                                                                              key,
                                                                              value,
                                                                            ],
                                                                            cellIdx,
                                                                          ) => (
                                                                            <td
                                                                              key={
                                                                                key
                                                                              }
                                                                            >
                                                                              {
                                                                                value
                                                                              }
                                                                            </td>
                                                                          ),
                                                                        )}
                                                                      </tr>
                                                                    ),
                                                                  )}
                                                              </tbody>
                                                            </table>
                                                          </div>
                                                        </div>
                                                      )}

                                                      {ent?.format ===
                                                        "date" && (
                                                        <div className="me-2">
                                                          <span className="text-capitalize">
                                                            {ent?.display_key} :
                                                          </span>

                                                          <span className="ms-2">
                                                            {ent?.effective_value
                                                              ? ent?.effective_value
                                                              : "-"}
                                                          </span>
                                                        </div>
                                                      )}

                                                      <div className=" edit">
                                                        <Pencil
                                                          size={18}
                                                          onClick={() => {
                                                            setEntityValue({
                                                              value:
                                                                ent?.format ===
                                                                "string"
                                                                  ? ent?.effective_value
                                                                  : ent?.format ===
                                                                      "table"
                                                                    ? ent?.effective_value
                                                                    : ent?.format ===
                                                                        "date"
                                                                      ? ent?.effective_value
                                                                      : null,
                                                              entity_id:
                                                                ent?.entity_id,
                                                              columns:
                                                                ent?.columns,
                                                            });
                                                            setIsEntityEdit(
                                                              true,
                                                            );
                                                          }}
                                                        />
                                                      </div>
                                                    </li>
                                                  );
                                                },
                                              )
                                            : ""}
                                        </ul>
                                      </AccordionBody>
                                    </AccordionItem>
                                  );
                                },
                              )
                            : ""}
                          <AccordionItem>
                            <AccordionHeader
                              targetId={
                                extractionEntites?.sections?.length > 0
                                  ? extractionEntites?.sections?.length + 1
                                  : 3
                              }
                              className="tiered-head"
                            >
                              Tiered Summary
                            </AccordionHeader>
                            <AccordionBody
                              accordionId={
                                extractionEntites?.sections?.length > 0
                                  ? extractionEntites?.sections?.length + 1
                                  : 3
                              }
                              className="tiered-body"
                            >
                              <div
                                className=""
                                style={{
                                  color: "var(--text)",
                                  padding: "16px",
                                }}
                              >
                                Number of Tiers : {tierList?.value?.length}
                              </div>
                              {tierList?.value?.map((list, idx) => {
                                return (
                                  <ul className="acc-list-data tiered">
                                    <li className="hdr pt-3">
                                      <div className="d-flex justify-content-between">
                                        <h6>
                                          <span className="cnt">
                                            {" "}
                                            {list?.Tier}
                                          </span>{" "}
                                        </h6>
                                        <div>
                                          <Pencil
                                            size={18}
                                            style={{ cursor: "pointer" }}
                                            onClick={() =>
                                              editTierLevel(tierList?.value)
                                            }
                                          />
                                        </div>
                                      </div>
                                    </li>
                                    <li className="hdr">
                                      <div className="d-flex justify-content-between text-start">
                                        <div className="ndc-num ndc-bg">
                                          <span className="tier-span">
                                            Purchase Volume Min
                                          </span>
                                          <h5>{list["Min Volume"] ?? "-"}</h5>
                                        </div>
                                        <div className="wac-price ndc-bg">
                                          <span className="tier-span">
                                            Purchase Volume Max
                                          </span>
                                          <h5 className="">
                                            {list["Max Volume"] ?? "-"}
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
                                          <h5>{list["Discount"]}%</h5>
                                        </div>
                                        <div className="ndc-num">
                                          <h5>
                                            <span className="tier-span">
                                              Admin Fees(%)
                                            </span>{" "}
                                          </h5>
                                          <h5>{list["Fee"]}%</h5>
                                        </div>
                                        <div className="ndc-num">
                                          <h5>
                                            <span className="tier-span">
                                              Rebate(%)
                                            </span>{" "}
                                          </h5>
                                          <h5>{list["Rebate"]}%</h5>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                );
                              })}
                            </AccordionBody>
                          </AccordionItem>

                          <AccordionItem>
                            <AccordionHeader
                              className="tiered-head"
                              targetId={
                                extractionEntites?.sections?.length > 0
                                  ? extractionEntites?.sections?.length + 2
                                  : 4
                              }
                            >
                              Tiered LI
                            </AccordionHeader>
                            <AccordionBody
                              accordionId={
                                extractionEntites?.sections?.length > 0
                                  ? extractionEntites?.sections?.length + 2
                                  : 4
                              }
                              className="tiered-body"
                            >
                              {pricingList?.length > 0 &&
                                pricingList?.map((list) => {
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
                                              $ {list?.wac_price}
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
                                                  {tierData?.discount}%
                                                </h6>
                                              </div>
                                              <div>
                                                <h6>
                                                  <span>Final Price:</span> ${" "}
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
                    )}
                  </div>

                  {/* Export Buttons */}
                  {isLoading ? (
                    ""
                  ) : (
                    <div className="p-3 d-flex justify-content-evenly  gap-12 export-btn">
                      <button
                        className="exportxl-btn"
                        onClick={() => handleExport("xlsx")}
                      >
                        <img src={fileImg} /> Export as Excel
                      </button>
                      <Button
                        className="exportxl-btn"
                        onClick={() => handleExport("xml")}
                      >
                        <img src={xmlImg} /> Export as XML
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="Comments-section">
                    <div className="Comments-Top">
                      <div className="Commets-heading">
                        <p className="Comments-title">Comments</p>
                      </div>
                    </div>
                    {commentsList?.length > 0 ? (
                      commentsList?.map((list) => {
                        return (
                          <div
                            className="Comment-details"
                            onClick={() =>
                              handleScrollToNode(
                                list?.node_id,
                                list?.node_index,
                                list?.color,
                              )
                            }
                          >
                            <div>
                              <div className="Comment-body">
                                <div className="Customer-details">
                                  <div className="customer-detail-1">
                                    <div>
                                      <Avatar
                                        className="profile-img"
                                        style={{
                                          backgroundColor: "#8c8c8c",
                                          color: "#1f1f1f",
                                          fontWeight: 550,
                                          marginRight: "10px",
                                        }}
                                      >
                                        {list.commented_by
                                          ?.charAt(0)
                                          ?.toUpperCase()}
                                      </Avatar>
                                    </div>
                                    <div>
                                      <p className="Name-of-cust">
                                        {list.commented_by}
                                      </p>
                                      <p className="Last-seen-cust">
                                        {list?.created_at &&
                                          formatMessageTime(list?.created_at)}
                                      </p>
                                      <div className="cust-comments">
                                        <p>{list.comment}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="Kebeb-menu">
                                  <img src={dots} />
                                </div> */}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div
                        className="text-center mt-5"
                        style={{ color: "var(--text)" }}
                      >
                        No Comments Added
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          </Col>
        </Row>
        <Modal
          isOpen={isEdit}
          centered
          style={{ padding: "24px" }}
          zIndex={4000}
        >
          <ModalHeader
            toggle={toggleEditEntity}
            style={{ padding: "24px", paddingBottom: "10px" }}
          >
            Edit Extracted Entity
          </ModalHeader>
          <ModalBody className="p-0">
            <div class="edit-body">
              <label for="start-date" class="modal-label text-capitalize">
                {editEntitie?.key?.replace(/_/g, " ")}
              </label>
              {editEntitie?.key === "document_type" ? (
                <div>
                  <Select
                    options={docTypeOption}
                    styles={colourStyles}
                    onChange={(e) =>
                      setEditEntitie({ ...editEntitie, value: e.value })
                    }
                  />
                </div>
              ) : editEntitie?.key === "document_status" ? (
                <div>
                  <Select
                    options={contractStatus}
                    styles={colourStyles}
                    onChange={(e) =>
                      setEditEntitie({ ...editEntitie, value: e.value })
                    }
                  />
                </div>
              ) : editEntitie?.key === "source_type" ? (
                <div>
                  <Select
                    options={sourceOption}
                    styles={colourStyles}
                    onChange={(e) =>
                      setEditEntitie({ ...editEntitie, value: e.value })
                    }
                  />
                </div>
              ) : editEntitie?.key === "adjust_by" ? (
                <div>
                  <Select
                    options={adjustOption}
                    styles={colourStyles}
                    onChange={(e) =>
                      setEditEntitie({ ...editEntitie, value: e.value })
                    }
                  />
                </div>
              ) : editEntitie?.key === "pricing_method" ? (
                <div>
                  <Select
                    options={pricingOption}
                    styles={colourStyles}
                    onChange={(e) =>
                      setEditEntitie({ ...editEntitie, value: e.value })
                    }
                  />
                </div>
              ) : editEntitie?.key === "start_date" ||
                editEntitie?.key === "end_date" ? (
                <div style={{ width: "100%" }}>
                  <DatePicker
                    showIcon
                    icon={<Calendar />}
                    closeOnScroll
                    selected={
                      editEntitie?.value &&
                      format(new Date(editEntitie?.value), "yyyy-MM-dd")
                    }
                    onChange={(date) =>
                      setEditEntitie({
                        ...editEntitie,
                        value: format(new Date(date), "yyyy-MM-dd"),
                      })
                    }
                    placeholderText="Select From Date"
                    className="date-input"
                    calendarClassName="custom-calendar edit"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select" // or "scroll" if you want scrolling instead of dropdown
                  />
                </div>
              ) : (
                <div class="input-icon">
                  <input
                    id="start-date"
                    type="text"
                    value={editEntitie?.value}
                    class="modal-input"
                    onChange={(e) =>
                      setEditEntitie({
                        ...editEntitie,
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <label for="reason" class="modal-label">
                Why you are changing this value?
              </label>
              <textarea
                id="reason"
                class="modal-textarea"
                rows="6"
                onChange={(e) =>
                  setEditEntitie({
                    ...editEntitie,
                    comment: e.target.value,
                  })
                }
              ></textarea>
            </div>
            <div class="modal-actions">
              <button class="cancel-btn" onClick={() => toggleEditEntity()}>
                Cancel
              </button>
              <button class="save-btn" onClick={() => updateContract()}>
                Save Changes
              </button>
            </div>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={isTierWarning}
          centered
          zIndex={4000}
          className="edittierleve"
        >
          <div className="d-flex justify-content-between align-items-center px-4 py-3">
            <div className="edit-tier-level-title">Edit Tier Level?</div>
            <div>
              <X
                size={18}
                color="var(--text)"
                style={{ cursor: "pointer" }}
                onClick={() => setIsTierWarning(!isTierWarning)}
              />
            </div>
          </div>
          <div className="edite-tierlevel-body">
            Editing the tier level will recalculate and regenerate the Tiered LI
            section. Would you like to continue?
            <div class="modal-actions">
              <button
                class="cancel-btn"
                onClick={() => setIsTierWarning(!isTierWarning)}
              >
                Cancel
              </button>
              <button class="save-btn" onClick={() => confirmEditTierLevl()}>
                Yes, Proceed
              </button>
            </div>
          </div>
        </Modal>
        <Modal size="lg" isOpen={isTierEdit} centered zIndex={4000}>
          <ModalHeader toggle={() => setIsTierEdit(!isTierEdit)}>
            Edit Tier Level
          </ModalHeader>
          <ModalBody>
            <div className="container">
              {Array.isArray(editTierData) && editTierData.length > 0 && (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Tier Level</th>
                      <th>Min Volume</th>
                      <th>Max Volume</th>
                      <th>Discount %</th>
                      <th>Fee </th>
                      <th>Rebate %</th>
                    </tr>
                  </thead>

                  <tbody>
                    {editTierData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.keys(row).map((key, colIndex) => (
                          <td key={colIndex}>
                            <input
                              className="entity-input"
                              type={
                                typeof row[key] === "number" ? "number" : "text"
                              }
                              value={row[key] ?? ""}
                              onChange={(e) =>
                                handleEditTierCell(
                                  rowIndex,
                                  key,
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="modal-comments-modal">
                <label>Comment</label>
              </div>
              <textarea
                rows={7}
                value={entityCommnet}
                placeholder="Type your comment..."
                onChange={(e) => setEntityComment(e.target.value)}
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
              <div class="modal-actions">
                <button
                  class="cancel-btn"
                  onClick={() => setIsTierEdit(!isTierEdit)}
                >
                  Cancel
                </button>
                <button class="save-btn" onClick={() => handleEditTierData()}>
                  Save Changes
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={isEntityEdit}
          centered
          size={typeof entityValue?.value === "string" ? "md" : "lg"}
          zIndex={4000}
          style={{
            padding: "34px",
          }}
        >
          <div className="modal-mark-with">
            Edit Extracted Entity
            <img
              src={closeImg}
              onClick={() => {
                setEntityValue(null);
                setIsEntityEdit(false);
                setEntityComment("");
              }}
            />
          </div>
          <ModalBody>
            <div className="modal-comments-modal">
              <label>Value</label>
            </div>
            <div>
              {typeof entityValue?.value === "string" && (
                <input
                  style={{
                    backgroundColor: "#0C111D",
                    width: "300px",
                    padding: "6px 10px",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                    color: "#fff",
                    marginBottom: "10px",
                  }}
                  value={entityValue?.value}
                  onChange={(e) => {
                    setEntityValue({
                      ...entityValue,
                      value: e.target.value,
                    });
                  }}
                />
              )}
              {Array.isArray(entityValue?.value) && (
                <table className="table table-bordered">
                  <thead className="rdx-txt-ai">
                    <tr>
                      {entityValue?.columns?.map((col, i) => (
                        <th key={i}>{col.display_key || col.name}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="rdx-intelli">
                    {entityValue?.value?.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {entityValue?.columns?.map((col, colIndex) => (
                          <td key={colIndex}>
                            <input
                              className="entity-input"
                              value={row[col.name] || ""}
                              onChange={(e) =>
                                handleEditCell(
                                  rowIndex,
                                  col.name,
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-comments-modal">
              <label>Comment</label>
            </div>
            <textarea
              rows={7}
              value={entityCommnet}
              placeholder="Type your comment..."
              onChange={(e) => setEntityComment(e.target.value)}
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
              <button
                class="cancel-btn m-0"
                onClick={() => {
                  setEntityValue(null);
                  setIsEntityEdit(false);
                  setEntityComment("");
                }}
              >
                Cancel
              </button>
              <button class="save-btn m-0" onClick={() => UpdateEntity()}>
                Save Changes
              </button>
            </div>
          </ModalBody>
        </Modal>

        <Modal size="lg" isOpen={isInfo} centered zIndex={4000} className="contingency-modal">
          <ModalHeader toggle={() => setIsInfo(false)} className="contingency-modal-header">
            <h5 className="contingency-modal-title">Contingency Discount Structure</h5>
          </ModalHeader>
          <ModalBody className="contingency-modal-body">
            <div className="bundle-badge">
              {locLatest?.classification}
            </div>
            <div className="contingency-table-wrapper">
              {Array.isArray(locLatest?.extracted_table) && locLatest?.extracted_table.length > 0 && (
                <table className="contingency-table" >
                  <thead>
                    <tr>
                      <th>Brand</th>
                      <th>Parent Discount</th>
                      <th>Effective Discount</th>
                      <th>Contingency Discount</th>
                      
                    </tr>
                  </thead>

                  <tbody >
                    {locLatest?.extracted_table.map((row, rowIndex) => {
                     
                          return  <tr key={rowIndex}><td>
                             {row?.brand}
                          </td>
                          <td className="number-cell">
                             {row?.parent_discount}
                          </td>
                          <td className="number-cell">
                             {row?.effective_discount}
                          </td>
                          <td className="positive-value">
                             {row?.contingency_discount}
                          </td>
                      </tr>
})}
                  </tbody>
                </table>
              )}
            </div>

            <div className="contingency-rationale">
              {locLatest?.classification_rationale}
            </div>
          </ModalBody>
        </Modal>
      </div>
    </Layouts>
  );
}

export default Preview;
