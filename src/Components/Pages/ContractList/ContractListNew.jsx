import React, { useEffect, useState } from "react";
import Layouts from "../Layouts/Layouts";
import "./contractlist.css";
import maximizelight from "./../../../images/icons/Maxi-L.svg";
import DatePicker from "react-datepicker";
import lightfile from "../../../images/icons/dash-total-light.svg";
import eye from "../../../images/icons/eye.svg";
import maximize from "../../../images/icons/maximize.svg";
import minimize from "../../../images/icons/minimize.svg";
import minimizeDark from "../../../images/icons/minimize-dark.svg";
import eyeCrossImg from "../../../images/icons/eye-off.svg";
import pdfIcon from "../../../images/icons/pdf-grey-i.svg";
import request from "../../../api/api";
import gridSel from "./../../../images/icons/Gridwhite-selected.svg";
import gridnotSel from "./../../../images/icons/Gridwhite-notselected.svg";
import fileSel from "./../../../images/icons/File-white-selected.svg";
import docxImg from "../../../images/icons/docx-icon-grid.svg";
import filenotSel from "./../../../images/icons/File-white-notselected.svg";
import serachImg from "../../../images/icons/search-sm.svg";
import fileImg from "../../../images/icons/file-06.svg";
import filedarkImg from "../../../images/icons/file-dark.svg";
import filewhiteImg from "../../../images/icons/file-white.svg";
import griddarkImg from "../../../images/icons/grid-dark.svg";
import gridwhiteImg from "../../../images/icons/grid-white.svg";
import alertImg from "../../../images/icons/alert-triangle.svg";
import pdfwhitee from "../../../images/icons/File-white-pdf.svg";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from "reactstrap";
import Select from "react-select";
import { truncate } from "lodash";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { saveContracts } from "../../redux/features/contractSlice";
import { data, useNavigate } from "react-router-dom";
import ContractCard from "../../Skeleton-loading/ContractCard";
import { useTheme } from "../../../Themecontext";
import ContractFilter from "../../Skeleton-loading/ContractFilter";
import ContractDetailsSkeleton from "../../Skeleton-loading/ContractDetailsSkeleton";
import TierStructureSkeloton from "../../Skeleton-loading/TierStructureSkeloton";
import ProductPricingDetails from "../../Skeleton-loading/ProductPricingDetails";
import TierStructureSkeleton from "../../Skeleton-loading/TierStructureSkeloton";
import TotalContracts from "../../Skeleton-loading/TotalContracts";
import ContractDocuments from "../../Skeleton-loading/ContractDocuments";
import upload_doc from "../../../images/upload_icons/upload_doc.svg";
import purpleUpload from "./../../../images/upload_icons/upload_doc_light1.svg";
import requestL from "../../../api/lexi";
import { Pencil, Pointer, Upload } from "lucide-react";

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

const pricingData = [
  {
    ndc: "65483-1021-30",
    name: "Cardiolex 10mg",
    size: "30 tablets",
    price: 195,
    tiers: [
      { tier: "Tier 1", discount: 10, final: 175.5, savings: 19.5 },
      { tier: "Tier 2", discount: 15, final: 165.75, savings: 29.25 },
      { tier: "Tier 3", discount: 20, final: 156, savings: 39 },
    ],
  },
  {
    ndc: "65483-1022-30",
    name: "Cardiolex 20mg",
    size: "30 tablets",
    price: 275,
    tiers: [],
  },
];

export const colourStyles = {
  container: (styles) => ({
    ...styles,
    width: "95%",
    marginRight: "20px",
    fontSize: "16px",
    color: "var(--text)",
  }),
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "var(--select-option-bg-color)",
    cursor: "pointer",
    minHeight: "40px",
    borderRadius: "8px",
    borderColor: isFocused
      ? "var(--select-option-boder-focused)"
      : "var(--react-select-border-color)",
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
    backgroundColor: isFocused
      ? "var(--select-option-boder-focused)"
      : "var(--select-option-bg-color)",
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
    label: "Group (GROUP)",
    value: "GPO",
  },
  {
    label: "Independent Customer Contract (IND)",
    value: "IND",
  },
  {
    label: "IDN Buying Group Contract (IDN)",
    value: "IDN",
  },
  {
    label: "FSS Contract",
    value: "FSS",
  },
  {
    label: "PHS Contract",
    value: "PHS",
  },
  {
    label: "Master Contract (MA)",
    value: "MA",
  },
  {
    label: "Institutional Contract (INST)",
    value: "INST",
  },
  {
    label: "Managed Care Contract (MCO)",
    value: "MCO",
  },
  {
    label: "Medicare (MCARE)",
    value: "MCARE",
  },
];

const pricingOption = [
  {
    label: "Fixed Pricing Method (FIXED)",
    value: "FIXED",
  },
  {
    label: "List Pricing Method (LIST)",
    value: "LIST",
  },
  {
    label: "Discount-Off-List Pricing Method (DOL)",
    value: "DOL",
  },
  {
    label: "Tiered Pricing Method (TIER)",
    value: "TIER",
  },
  {
    label: "Dynamic Discount Off List Pricing Method (DDOL)",
    value: "DDOL",
  },
  {
    label: "Dynamic Tiered Pricing Method (DTIER)",
    value: "DTIER",
  },
  {
    label: "Order Quantity (OOD)",
    value: "OOD",
  },
];

function ContractListNew() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toogleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersions, setSelectedVersions] = useState({});
  const [isError, setIsError] = useState(false);
  const [contractList, setContractList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [accordionOpen, setAccordionOpen] = useState([1, 2]);
  const [template, setTemplate] = useState("");
  const [extractionEntites, setExtractionEntites] = useState({});
  const [open, setOpen] = useState([]);
  const [active, setActive] = useState("grid");
  const [priceMaxi, setPriceMaxi] = useState(false);
  const [offerMaxi, setofferMaxi] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [activeContractTab, setActiveContractTab] = useState(null);
  const [tierList, setTierList] = useState([]);
  const [pricingList, setPricingList] = useState([]);
  const [showSelected, setShowSelected] = useState({});
  const [isCustom, setIsCoustom] = useState(false);
  const [gridContractData, setGridContractData] = useState([]);
  const [selectVersion, setSelectVersion] = useState(null);
  const [templateList, setTemplateList] = useState([]);
  const [templateOption, setTemplateOption] = useState([]);
  const [selectTemplate, setSelectTemplate] = useState({});
  const [filterOption, setFilterOption] = useState({});

  useEffect(() => {
    // Open all accordions initially
    setOpen(pricingData.map((_, idx) => `item-${idx}`));
  }, []);

  const toggle = (id) => {
    if (open.includes(id)) {
      setOpen(open.filter((item) => item !== id));
    } else {
      setOpen([...open, id]);
    }
  };

  const handleHideAll = () => {
    if (open.length > 0) {
      // close all
      setOpen([]);
    } else {
      // open all
      const allIds = showSelected?.products?.map((_, idx) => `item-${idx}`);
      setOpen(allIds);
    }
  };
  const [contractOffer, setContractOffer] = useState({
    contract_number: "PPPH18SR01",
    agreement_number: "NP-PHA-2025-C4761",
    pharma_company: "SRM Pharmaceuticals, Inc.",
    channel_partner_name: "Premier Health Alliance, LLC",
    channel_partner_type: "GPO",
    start_date: "2025-07-01",
    end_date: "2025-10-31",
    contract_status: "Active",
    document_path: null,
    author: "Administrator",
    document_name: "Premier Health Alliance Agreement with SRM Pharmaceuticals",
    document_type: "GPO",
    document_status: "Active",
    document_version_number: "1",
    document_version_creation_date: "2025-07-01",
    contract_sub_type: "Contract",
    owner: "Administrator",
    program_only: 0,
    source_type: "NEW",
    adjust_by: "%",
    category_pricing: "PRICE",
    price_list_name: "WAC",
    pricing_method: "Tier",
    number_of_tiers: 3,
    created_at: "2025-06-17T09:21:22",
    updated_at: "2025-06-17T09:21:22",
  });

  const getContractList = (expand = "full") => {
    requestL({
      url: "/contracts",
      method: "GET",
      params: {
        expand,
      },
    })
      .then((res) => {
        setContractList(res);
        dispatch(saveContracts(res));
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getContractList();
  }, []);

  console.log(accordionOpen);

  const toggleAccordion = (id) => {
    if (accordionOpen.includes(id)) {
      setAccordionOpen((prev) => prev.filter((item) => item !== id)); // remove if already open
    } else {
      setAccordionOpen((prev) => [...prev, id]); // add if not open
    }
  };

  const addSelectContract = (contract) => {
    console.log(contract);
    setSelectedData((prev) => {
      const exists = prev.find((c) => c.contract_id === contract.contract_id);
      console.log(exists);
      if (exists) {
        const updated = prev.filter(
          (c) => c.contract_id !== contract.contract_id,
        );
        if (activeContractTab === contract.contract_id) {
          setActiveContractTab(updated.length ? updated[0]?.contract_id : null);

          setTemplateList(updated[0]?.templates);
          console.log(updated);
          setTemplateOption(
            updated[0]?.templates?.map((li) => {
              return {
                label: li?.template_name,
                value: li?.template_id,
              };
            }),
          );
          // Reset active tab
        }
        return updated;
      } else {
        const updated = [...prev, contract];
        setSelectVersion(
          updated.length ? updated[0]?.latest_amendment_number : null,
        );
        if (!activeContractTab) {
          setActiveContractTab(contract.contract_id);
        } // Set first active

        return updated;
      }
    });
  };

  console.log(selectedData);

  const fetchActiveContractTab = (expand = "full") => {
    let contract = contractList.find(
      (li) => li.contract_id === activeContractTab,
    );
    requestL({
      url: `/entities/${contract?.contract_id}/${selectVersion}`,
      method: "GET",
      params: {
        expand,
      },
    })
      .then((res) => {
        setShowSelected(res);
        setTemplateOption(
          res?.templates?.map((li) => {
            return {
              label: li?.template_name,
              value: li?.template_id,
            };
          }),
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // whenever the active tab or selected version changes, re‑fetch details
    if (!activeContractTab) return;
    fetchActiveContractTab("full");
  }, [activeContractTab, selectVersion]);

  const handleFilterChange = (e, name) => {
    if (e.target.checked) {
      setFilterOption({ ...filterOption, [name]: e.target.name });
    }
  };

  const applyGridFilter = (expand = "full") => {
    setIsLoading(true);
    const params = new URLSearchParams();

    // Loop through filterOption and add only non-empty values
    Object.entries(filterOption).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    const queryString = params.toString();
    requestL({
      url: `/contracts`,
      method: "GET",
      params: {
        expand,
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res) {
          setGridContractData(res);
          setTotalCount(res);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsError(true);
      });
  };

  useEffect(() => {
    if (active === "grid") {
      applyGridFilter("full");
    }
  }, [active]);

  const sendtoPreview = (contract, version) => {
    navigate("/list/preview", {
      state: { contractNum: contract, version: version },
    });
  };

  const getVersionStatus = (contract, versionNumber) => {
    if (!contract?.amendments || contract.amendments.length === 0) {
      return contract?.status;
    }
    const selectedAmendment = contract.amendments.find(
      (amd) => amd?.version_number === versionNumber
    );
    return selectedAmendment?.status || contract?.status;
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

  console.log(activeContractTab);

  const fetchContractPricing = () => {
    requestL({
      url: `/contracts/${activeContractTab}/${selectVersion}/pricing`,
      method: "GET",
    })
      .then((res) => {
        setTierList(res?.tiers_source);
        setPricingList(res?.pricing);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchEntities = () => {
    requestL({
      url: `/entities/${activeContractTab}/${selectVersion}`,
      method: "GET",
      params: {
        template_id: template,
      },
    })
      .then((res) => {
        setExtractionEntites(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (template) {
      fetchEntities();
    }
  }, [template, activeContractTab, selectVersion]);

  useEffect(() => {
    if (activeContractTab && selectVersion) {
      fetchContractPricing();
    }
  }, [activeContractTab, selectVersion]);

  return (
    <Layouts>
      <div className="contract-list">
        <div className="row">
          <div className="col-12 p-0">
            <div class="contract-head-menu">
              <div className="menu-head-1">
                <div className="menu-head-count">
                  {isLoading ? (
                    <TotalContracts />
                  ) : (
                    <div className="total">
                      <div className="ico">
                        <img src={theme === "Dark" ? fileImg : lightfile} />
                      </div>

                      <div className="d-flex align-items-center">
                        Total Contracts
                        <span className="count">{contractList?.length}</span>
                      </div>
                    </div>
                  )}

                  {/* <div className="expire">
                    <div className="ico orange">
                      <img src={alertImg} />
                    </div>
                    <div className="d-flex align-items-center">
                      Expiring in next 30 days
                      <span className="count">{contractList?.length}</span>
                    </div>
                  </div> */}
                </div>
                <div className="d-flex align-items-center">
                  {active === "grid" ? (
                    ""
                  ) : (
                    <h3 className="me-3 mb-0">
                      {selectedData?.length} Contract Documents Selected
                    </h3>
                  )}

                  <div className="toggle-button-group-mt ms-2">
                    <button
                      className={`toggle-button-mt ${
                        active === "grid" ? "active" : ""
                      }`}
                      onClick={() => setActive("grid")}
                    >
                      <span className="icon">
                        <img
                          src={
                            active === "grid"
                              ? theme === "Dark"
                                ? gridwhiteImg
                                : gridSel
                              : theme === "light"
                                ? griddarkImg
                                : gridnotSel
                          }
                        />
                      </span>
                    </button>
                    <button
                      className={`toggle-button-mt ${
                        active === "doc" ? "active" : ""
                      }`}
                      onClick={() => setActive("doc")}
                    >
                      <span className="icon">
                        <img
                          src={
                            active === "doc"
                              ? theme === "Dark"
                                ? filewhiteImg
                                : fileSel
                              : theme === "light"
                                ? filedarkImg
                                : filenotSel
                          }
                        />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Doc view */}
          {active === "doc" && (
            <>
              {isLoading ? (
                <ContractDocuments />
              ) : (
                <>
                  <div className="col-sm-4 col-md-4 col-lg-3 col-xl-3 col-xxl-3 m-0 pe-0">
                    <div class="contract-search-box">
                      <div className="search-box-head">
                        <h3>Contract Documents</h3>
                      </div>
                      {/* <div className="search-box">
                    <img src={serachImg} />
                    <input
                      className="contract-search-inp"
                      placeholder="Search"
                    />
                  </div> */}
                      <div className="contract-list-scroll">
                        {contractList?.length > 0 &&
                          contractList?.map((list, index) => {
                            return (
                              <div
                                className="contract-doc-list"
                                key={index}
                                style={{ cursor: "pointer" }}
                              >
                                <div>
                                  <label class="checkbox-container">
                                    <input
                                      type="checkbox"
                                      onChange={() => addSelectContract(list)}
                                    />
                                    <div class="custom-checkbox"></div>
                                    <div className="doc-name-id">
                                      <h5
                                        className="name"
                                        title={list?.original_filename}
                                      >
                                        {truncate(list?.original_filename, {
                                          length: 36,
                                        })}
                                      </h5>
                                      <h5 className="id">
                                        {list?.contract_number}
                                      </h5>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-8 col-md-8 col-lg-9 col-xl-9 col-xxl-9 ps-0">
                    {selectedData?.length > 0 ? (
                      <>
                        <div className="contract-head-menu p-0 pe-2 contract-nav">
                          <div className="menu-head-2">
                            <div className="menu-nav-list">
                              {selectedData?.map((list) => {
                                return (
                                  <div
                                    className={`${
                                      activeContractTab === list?.contract_id
                                        ? "active"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      setActiveContractTab(list?.contract_id);
                                      setSelectVersion(
                                        list?.latest_amendment_number,
                                      );
                                      
                                      setTemplate(null);
                                      setExtractionEntites({});
                                    }}
                                    title={list.original_filename}
                                  >
                                    {truncate(list.original_filename, {
                                      length:
                                        activeContractTab === list?.contract_id
                                          ? 40
                                          : 20,
                                    })}
                                    <UncontrolledDropdown className="version-dropdown">
                                      <DropdownToggle
                                        caret
                                        className="version-toggle"
                                        onClick={(e) => {
                                          // prevent parent div click (which resets version) when toggling menu
                                          e.stopPropagation();
                                        }}
                                      >
                                        {/* show the version for the active contract using state */}
                                        V
                                        {activeContractTab === list?.contract_id
                                          ? selectVersion
                                          : (list?.amendments?.find(
                                              (li) =>
                                                li?.version_number ===
                                                Number(selectVersion),
                                            )?.version_number ?? 0)}
                                        .0
                                      </DropdownToggle>

                                      <DropdownMenu end container="body">
                                        {list?.amendments?.map((amd, index) => (
                                          <DropdownItem
                                            key={index}
                                            onClick={(e) => {
                                              // stop propagation so parent onClick doesn't fire
                                              e.stopPropagation();
                                              setSelectVersion(
                                                amd?.version_number,
                                              );
                                            }}
                                          >
                                            {amd?.version_number}
                                          </DropdownItem>
                                        ))}
                                      </DropdownMenu>
                                    </UncontrolledDropdown>
                                  </div>
                                );
                              })}
                              {/* <div className="active">
                        Premier Health Alliance Agreement
                      </div>
                      <div>Premier Health Alliance Agreement</div>
                      <div>Premier Health Alliance Agreement</div>
                      <div className="last">
                        Premier Health Alliance Agreement
                      </div> */}
                            </div>
                          </div>
                        </div>
                        <div className="row me-0 hide-price">
                          <div
                            className={`${offerMaxi ? "col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 " : "col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6"} contractdetails pe-0 ${priceMaxi ? "close" : offerMaxi ? "inc" : ""}`}
                          >
                            {isLoading ? (
                              <ContractDetailsSkeleton />
                            ) : (
                              <div class="contract-details-box">
                                <div className="details-head">
                                  <h3>Contract Details</h3>

                                  <div className="contract-select-dpdown">
                                    <Select
                                      styles={colourStyles}
                                      options={templateOption}
                                      placeholder="Select Template"
                                      value={templateOption?.filter(
                                        (li) => li.value === template,
                                      )}
                                      getOptionLabel={(e) =>
                                        truncate(e.label, { length: 30 })
                                      }
                                      onChange={(e) => setTemplate(e.value)}
                                    />
                                  </div>

                                  <div>
                                    <img
                                      src={
                                        priceMaxi
                                          ? theme === "Dark"
                                            ? minimizeDark
                                            : minimize
                                          : maximize
                                      }
                                      onClick={() => setofferMaxi(!offerMaxi)}
                                    />
                                  </div>
                                </div>
                                <div className="contract-acc-box list-view">
                                  <Accordion
                                    open={accordionOpen}
                                    toggle={toggleAccordion}
                                    flush
                                    className="contract-acc"
                                  >
                                    {extractionEntites?.sections?.length > 0 ? (
                                      extractionEntites?.sections?.map(
                                        (sec, secIdx) => {
                                          return (
                                            <AccordionItem>
                                              <AccordionHeader
                                                targetId={secIdx + 1}
                                              >
                                                {sec?.section}
                                              </AccordionHeader>
                                              <AccordionBody
                                                accordionId={secIdx + 1}
                                              >
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
                                                                    {
                                                                      ent?.display_key
                                                                    } :
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
                                                                    {
                                                                      ent?.display_key
                                                                    }
                                                                  </div>
                                                                  <div>
                                                                    <table>
                                                                      <thead>
                                                                        <tr>
                                                                          {ent
                                                                            ?.columns
                                                                            ?.length >
                                                                            0 &&
                                                                            ent?.columns?.map(
                                                                              (
                                                                                li,
                                                                                colIdx,
                                                                              ) => {
                                                                                return (
                                                                                  <th
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
                                                                    {
                                                                      ent?.display_key
                                                                    }{" "}
                                                                    :
                                                                  </span>

                                                                  <span className="ms-2">
                                                                    {ent?.effective_value
                                                                     }
                                                                  </span>
                                                                </div>
                                                              )}

                                                              {/* <div className=" edit">
                                                                  <Pencil
                                                                    size={18}
                                                                  />
                                                                </div> */}
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
                                    ) : (
                                      <div className="No-data-msg">No Data</div>
                                    )}
                                  </Accordion>
                                </div>
                              </div>
                            )}
                          </div>
                          <div
                            className={`col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 tierstructure ${priceMaxi ? "close" : offerMaxi ? "close" : ""}`}
                          >
                            {isLoading ? (
                              <TierStructureSkeleton />
                            ) : (
                              <div class="contract-details-box right">
                                <div className="details-head">
                                  <h3>Tier Structure</h3>
                                  {/* <div>
                                  <img src={maximize} />
                                </div> */}
                                  {/* {theme==="Light"? <img src={maximizelight}/>:<img src={maximize}/>} */}
                                </div>
                                <div className="contract-acc-box list-view">
                                  <table className="tier-table">
                                    <thead>
                                      <th className="sno">Tier</th>
                                      <th>Vol Minimum</th>
                                      <th>Vol Maximum</th>
                                      <th>Discount</th>
                                      <th>Admin Fee</th>
                                      <th>Rebate</th>
                                    </thead>
                                    <tbody>
                                      {tierList?.value?.length > 0 &&
                                        tierList?.value?.map((tier) => {
                                          return (
                                            <tr>
                                              <td className="sno">
                                                {tier?.Tier}
                                              </td>
                                              <td>
                                                {tier["Min Volume"]
                                                  ? `$${tier["Min Volume"]}`
                                                  : "No limit"}
                                              </td>
                                              <td>
                                                {tier["Max Volume"]
                                                  ? `$${tier["Max Volume"]}`
                                                  : "No limit"}
                                              </td>
                                              <td>{tier?.Discount}%</td>
                                              <td>{tier?.Fee}%</td>
                                              <td>{tier?.Rebate ?? "-"}%</td>
                                            </tr>
                                          );
                                        })}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                            {isLoading ? (
                              <ProductPricingDetails />
                            ) : (
                              <div
                                class={`pricing-table-box ${
                                  priceMaxi ? "inc" : offerMaxi ? "close" : ""
                                }`}
                              >
                                <div className="details-head">
                                  <h3>Product Pricing Table</h3>
                                  <div className="opt-btn">
                                    <span
                                      onClick={() => {
                                        if (pricingList?.length > 0) {
                                          handleHideAll();
                                        }
                                      }}
                                    >
                                      <img
                                        src={
                                          open?.length > 0 ? eyeCrossImg : eye
                                        }
                                      />
                                      {open?.length > 0
                                        ? "Hide All Tier Details"
                                        : "View All Tier Details"}
                                    </span>
                                    <img
                                      src={
                                        priceMaxi
                                          ? theme === "Dark"
                                            ? minimizeDark
                                            : minimize
                                          : maximize
                                      }
                                      className="maxi-img"
                                      onClick={() => setPriceMaxi(!priceMaxi)}
                                    />
                                  </div>
                                </div>
                                <div>
                                  <div className="product-table-container">
                                    <table className="product-tier-table">
                                      <thead>
                                        <tr className="head-sticky">
                                          <th width={"20%"}>NDC Number</th>
                                          <th>Product Name</th>
                                          <th></th>
                                          <th>WAC Price</th>
                                        </tr>
                                      </thead>
                                    </table>
                                    {pricingList?.length > 0 &&
                                      pricingList?.map((item, index) => (
                                        <Accordion
                                          key={index}
                                          open={open}
                                          toggle={() => toggle(`item-${index}`)}
                                          className="product-accordion"
                                        >
                                          <AccordionItem>
                                            <AccordionHeader
                                              targetId={`item-${index}`}
                                              className="product-header"
                                            >
                                              <div
                                                className="product-header-cell"
                                                style={{ width: "25%" }}
                                              >
                                                {item?.ndc_number}
                                              </div>
                                              <div
                                                className="product-header-cell"
                                                style={{ width: "25%" }}
                                              >
                                                {item?.product_name}
                                              </div>
                                              <div
                                                className="product-header-cell"
                                                style={{ width: "25%" }}
                                              >
                                                {item?.size}
                                              </div>
                                              <div className="product-header-cell">
                                                ${item?.wac_price}
                                              </div>
                                            </AccordionHeader>
                                            <AccordionBody
                                              accordionId={`item-${index}`}
                                            >
                                              {item?.tiers?.length > 0 ? (
                                                <table className="product-tier-table">
                                                  <thead>
                                                    <tr className="price-th">
                                                      <th>Tier</th>
                                                      <th>Discount</th>
                                                      <th>Admin Fee</th>
                                                      <th>Rebate Fee</th>
                                                      <th>Final Price</th>
                                                      <th>Savings</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {item?.tiers?.map(
                                                      (tier, i) => (
                                                        <tr key={i}>
                                                          <td>{tier?.tier}</td>
                                                          <td>
                                                            {tier?.discount}%
                                                          </td>
                                                          <td>
                                                            {tier?.admin_fee}%
                                                          </td>
                                                          <td>
                                                            {tier?.rebate_fee}%
                                                          </td>
                                                          <td>
                                                            ${tier?.final_price}
                                                          </td>
                                                          <td className="savings-amount">
                                                            ${tier?.savings}
                                                          </td>
                                                        </tr>
                                                      ),
                                                    )}
                                                  </tbody>
                                                </table>
                                              ) : (
                                                <div className="no-tier-message">
                                                  No tier pricing available.
                                                </div>
                                              )}
                                            </AccordionBody>
                                          </AccordionItem>
                                        </Accordion>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {isError ? (
                          <div className="contract-list-err">
                            <h4>Data Load Error</h4>
                            <h6>
                              We couldn’t fetch contract details. Refresh or try
                              again later.
                            </h6>
                          </div>
                        ) : (
                          <div className="no-contract-status">
                            <div className="text-center">
                              No Contract Selected
                              <p>
                                Select two or more contracts to see the overview
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </>
          )}
          {/* Grid View */}
          {active === "grid" && (
            <>
              <div className="col-sm-6 col-md-7 col-lg-12 col-xl-12 col-xxl-12 contract-card-box">
                {/* <div className="contract-head-menu p-0 pe-2 contract-nav">
                  <div className="menu-head-2">
                    <div className="menu-nav-list">
                      <div className="active">
                        Premier Health Alliance Agreement
                      </div>
                      <div>Premier Health Alliance Agreement</div>
                      <div>Premier Health Alliance Agreement</div>
                      <div className="last">
                        Premier Health Alliance Agreement
                      </div>  
                    </div>
                  </div>
                </div> */}
                {isLoading ? (
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                      <ContractCard />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                      <ContractCard />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                      <ContractCard />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                      <ContractCard />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                      <ContractCard />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                      <ContractCard />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                      <ContractCard />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                      <ContractCard />
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 col-xxl-4 mb-3">
                      <ContractCard />
                    </div>
                  </div>
                ) : (
                  <div className="row grid-card-row">
                    {gridContractData?.length > 0 ? (
                      gridContractData.map((list) => (
                        <div
                          key={list.contract_id}
                          className="col-sm-12 col-md-6 col-lg-4 col-xl-3 grid-col"
                        >
                          <div
                            className="grid-card"
                            onClick={() =>
                              navigate("/list/preview", {
                                state: {
                                  contract_id: list?.contract_id,
                                  version_number:
                                    selectedVersions[list?.contract_id] ??
                                    list?.latest_amendment_number,
                                },
                              })
                            }
                          >
                            <div className="grid-card-head">
                              <img src={theme === "Dark" ? docxImg : docxImg} />

                              <div className="grid-card-data">
                                <h3>
                                  {truncate(list?.original_filename, {
                                    length: 40,
                                  })}
                                </h3>

                                <h6>{list?.contract_number}</h6>

                                <div className="doc-version ">
                                  {list?.amendments?.length > 0 ? (
                                    <div className="">
                                      <UncontrolledDropdown
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <DropdownToggle
                                          caret
                                          className="contract-list-upld-btn version"
                                        >
                                          V{" "}
                                          {selectedVersions[
                                            `${list?.contract_id}-amendment`
                                          ] ?? list?.latest_amendment_number}
                                          .0
                                        </DropdownToggle>
                                        <DropdownMenu className="">
                                          {list?.amendments?.map(
                                            (version, idx) => (
                                              <DropdownItem
                                                key={idx}
                                                onClick={() =>
                                                  setSelectedVersions(
                                                    (prev) => ({
                                                      ...prev,
                                                      [list?.contract_id]:
                                                        version?.version_number,
                                                      [`${list?.contract_id}-amendment`]:
                                                        version?.amendment_number,
                                                    }),
                                                  )
                                                }
                                              >
                                                {version?.amendment_number}.0
                                              </DropdownItem>
                                            ),
                                          )}
                                        </DropdownMenu>
                                      </UncontrolledDropdown>
                                    </div>
                                  ) : (
                                    ""
                                  )}

                                  <span
                                    className={`status status-${getVersionStatus(list, selectedVersions[list?.contract_id])?.toLowerCase()}`}
                                  >
                                    {getVersionStatus(list, selectedVersions[list?.contract_id]) === "PROCESSING"
                                      ? "Processing..."
                                      : getVersionStatus(list, selectedVersions[list?.contract_id])
                                    
                                      ?.toLowerCase()
                                      .replace(/^./, (c) => c.toUpperCase())}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <hr
                              style={{
                                borderColor: theme === "Dark" ? "#eee" : "#333",
                                opacity: 0.08,
                              }}
                            />

                            <div className="grid-details">
                              {/* <div>
                                <span className="type">File Type</span>
                                <span className="value">{list?.file_type}</span>
                              </div> */}

                              <div>
                                <span className="type">Uploaded at</span>
                                <span className="value">
                                  {list?.uploaded_at &&
                                    format(
                                      new Date(list?.uploaded_at),
                                      "dd MMM yyyy",
                                    )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="contract-list-err">
                        <h4>No Contract Found</h4>
                        <h6>Try upload a new contract.</h6>
                        <div className="my-3">
                          <button className="upld-btn">
                            <label
                              for="contractUpload"
                              // class="upload-area"
                              style={{ cursor: "pointer" }}
                            >
                              <Upload
                                size={18}
                                color="#CECFD2"
                                className="me-2"
                              />
                              <span>Upload Document</span>
                              <input
                                type="file"
                                id="contractUpload"
                                class="d-none upload-input"
                                accept="application/docx"
                                multiple
                                onChange={(e) =>
                                  handleFileChange(e, "contract")
                                }
                              />
                            </label>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layouts>
  );
}

export default ContractListNew;
