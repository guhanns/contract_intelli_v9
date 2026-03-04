import React, { useState } from "react";
import Layouts from "../Layouts/Layouts";
import Select from "react-select";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  Collapse,
  Container,
  Input,
  Label,
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink,
  Progress,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import profile from "../../../images/icons/profile.png";
import linkedin from "../../../images/icons/linkedin.png";
import details from "../../../images/icons/info.png";
import { doctorListData, hcpDoctorData } from "./hcpData";
import request from "../../../api/api";
import toast from "react-hot-toast";
import { useMsal } from "@azure/msal-react";


const colourStyles = {
  container: (styles) => ({
    ...styles,
    width: '100%',
    marginRight: '20px',
    fontSize: '16px',
    color: 'white',
  }),
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: '#1f2935',
    cursor: 'pointer',
    minHeight: '30px',
    borderColor: isFocused ? 'white' : 'white',
    boxShadow: 'none',
    ':hover': {
      borderColor: 'white',
    },
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: '#1f2935',
    border: '1px solid white',
    zIndex: 9999,
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    cursor: 'pointer',
    backgroundColor: isFocused ? 'grey' : '#1f2935',
    color: 'white',
    ':hover': {
      backgroundColor: 'grey',
    },
    fontSize: '14px',
  }),
  placeholder: (styles) => ({
    ...styles,
    color: 'white',
    fontSize: '14px',
  }),
  singleValue: (styles) => ({
    ...styles,
    color: 'white',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: 'white',
    ':hover': {
      color: 'grey',
    },
  }),
};



export const therapeuticAreaOptions = [
  { label: 'Diabetes', value: 'Diabetes' },
  { label: 'Central Nervous Systems', value: 'Central Nervous Systems' },
];

function NewHcp() {
    const { instance, accounts } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const [rangeValue, setRangeValue] = useState(0);
  const [activeTab, setActiveTab] = useState("1");
  const [searchName,setSearchName] = useState('')
  
  const [docList, setDocList] = useState([]);
  const [doctorData, setDoctorData] = useState({});
  const [collapseOpen, setCollapseOpen] = useState({ 1: false, 2: true });

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const toggleCollapse = (index) => {
    setCollapseOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  //Searching Profiles
  const serachProfiles = ()=>{
   
    if(!searchName){
      return  toast.error("Name Required")
    }
    setDocList([])
    setDoctorData({})
    setIsLoading(true)
    request({
        url:`/find-profile/?name=${searchName}`,
        method:'GET',
    }).then((res)=>{
        setDocList(res.linkedin_profiles)
    }).catch((err)=>{
        console.log(err)
        setIsLoading(false)
        setDocList(doctorListData)
    })
  }

    //view Doc details
    const viewDoc = (link) => {
      setIsLoading(true);
  
      request({
        url: "/analyze-profile",
        method: "POST",
        data: { linkedin_url: link },
      })
        .then((res) => {
          setIsLoading(false);
          setDoctorData(res);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          setDoctorData(hcpDoctorData)
        });
    };

    console.log(doctorData)
  return (
    <Layouts>
      <div className="container">
        <div className="hcp-doc-box mb-4">
        <h5 className="text-white text-center">Welcome! {accounts[0]?.name}.</h5>
        </div>
        <div className="hcp-doc-box">
          <div className="d-flex justify-content-between align-items-center hcp-head-box">
            
          </div>

          <div className="doc-serach">
            <div class="ui-input-container">
              <input
                required=""
                placeholder="Search for HealthCare Professional ..."
                class="ui-input"
                type="text"
                onChange={(e)=>setSearchName(e.target.value)}
              />
              <div class="ui-input-underline"></div>
              <div class="ui-input-highlight"></div>
              <div class="ui-input-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2"
                    stroke="currentColor"
                    d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="mx-3">
              <button
                className="doc-search-btn"
                onClick={() => serachProfiles()}
              >
                {" "}
                <span>Search</span>
              </button>
            </div>
          </div>
          <div className="mb-4 search-content">
            Enter the full name as it would appear in publications
          </div>
        </div>
        <div className="hcp-doc-box mt-4">
          <div className="">
            <div className="mb-4">
              <div>
                <label className="text-white">Therapeutic Area</label>
              </div>
              <Select className="doc-area-select" styles={colourStyles} options={therapeuticAreaOptions}/>
            </div>
            <div style={{ width: "30%" }}>
              <Label for="customRange1" className="form-label text-white">
                Max Publications: {rangeValue}
              </Label>
              <Input
                type="range"
                className="custom-range"
                id="customRange1"
                min="1"
                max="10"
                value={rangeValue}
                onChange={(e) => setRangeValue(e.target.value)}
                style={{
                  background: `linear-gradient(to right, #1f2935 0%, #1f2935 ${(rangeValue - 1) * 11.11}%, #ccc ${(rangeValue - 1) * 11.11}%, #ccc 100%)`,
                }}
              />
            </div>
            <div className="text-end text-white">
              {doctorData?.profile_summary ?`Viewing :${doctorData?.profile_summary} `  :'Search for a healthcare professional' }
            </div>
          </div>
        </div>
        {

          isLoading ? <>
          <div className="d-flex justify-content-center w-25 m-auto mt-5">
          <div class="spinner">
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
</div>
          </div>
<h6 className="text-white text-center mt-5">Searching...</h6>
        </> :
          doctorData?.profile_summary || docList.length<=0 ? '' :<>
          <div className="hcp-doc-box mt-4">
          <div>
            <h5 className="text-white">Healthcare Professional Profiles</h5>
            <div className="hcp-doc-list">
              {
                docList?.map((doc,index)=>{
                  return (
                    <div className="doc-details" 
                    onClick={(e) => {
                      e.stopPropagation();
                      viewDoc(doc?.doc_link);
                    }}
                    key={index}
                    >
                <div className="doc-profile">
                  <div className="doc-profile-name">
                    <div>
                      <img src={profile} alt="doc-img" className="doc-img" />{" "}
                    </div>
                    <div className="text-white">
                      <h6>{doc?.first_name} {doc?.last_name}</h6>
                      <h6>Lorem ipsum dolor sit amet.</h6>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="doc-view-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-5 w-5"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
              </div>
                  )
                })
              }
              
            </div>
          </div>
        </div></>
        }
        

        <>
        {
          isLoading && !doctorData ? <>
            <div className="d-flex justify-content-center w-25 m-auto mt-5">
            <div class="spinner">
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
</div>
            </div>
          </> : doctorData?.key_roles_expertise ?
         <>
          <div className="hcp-doc-box mt-4">
          <div className="doc-details border-0 m-0">
            <div className="doc-profile">
              <div className="doc-profile-name">
                <div>
                  <img src={profile} alt="doc-img" className="doc-img" />{" "}
                </div>
                <div className="text-white">
                  <h6>Lorem ipsum dolor sit amet.</h6>
                  <h6>Lorem ipsum dolor sit amet.</h6>
                </div>
              </div>
            </div>
            <div>
              <button className="doc-view-btn" onClick={()=>setDoctorData({})}>X</button>
            </div>
          </div>
         
        </div>
        <div className="mt-4">
        <div className="">
            {/* Tabs */}
            <Nav tabs className="new-doc-detail border-bottom mb-4">
              <NavItem>
                <NavLink
                  className={`${activeTab === "1" ? "active" : ""}`}
                  onClick={() => toggleTab("1")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-journal-text me-2"></i> Publications &
                  Insights
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={` ${activeTab === "2" ? "active" : ""}`}
                  onClick={() => toggleTab("2")}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-linkedin me-2"></i> LinkedIn Profile
                  Analysis
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent className="mt-3" activeTab={activeTab}>
              <TabPane tabId={"1"}>
               
                 
              </TabPane>
              <TabPane tabId={"2"}>
              <Container className="mt-2 overview-container">
                    {/* <h5 className="mb-4">Guhan{doctorData?.profile_summary?.split(',')[0]}</h5>
                    <h6>{doctorData?.profile_summary?.split(',')[1]}{doctorData?.profile_summary?.split(',')[2]}</h6> */}

                    <Row className="mb-4">
                      <Col md="6" lg="12">
                        <Card className="mb-3 key-roles">
                          <CardBody>
                          <CardTitle tag="h6">
                             <div className="d-flex justify-content-between">
                             <div>
                              Profile Summary
                              </div>
                              <div>
                              View Linkedin
                              <button className="doc-view-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-arrow-right h-5 w-5"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </button>
                              </div>
                             </div>
                            </CardTitle>
                            <ListGroup className="mb-3">
                              <ListGroupItem>Dr. Name</ListGroupItem>
                              <ListGroupItem>Dr. Name</ListGroupItem>
                              <ListGroupItem>Dr. Name</ListGroupItem>
                            </ListGroup>
                            <CardTitle tag="h6">
                              Key Roles & Expertise
                            </CardTitle>
                            <ListGroup>
                              {doctorData?.key_roles_expertise?.map(
                                (item, index) => (
                                  <ListGroupItem key={index}>
                                    {item}
                                  </ListGroupItem>
                                )
                              )}
                            </ListGroup>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="6" lg="12">
                        <Card className="mb-3 key-roles">
                          <CardBody>
                            <CardTitle tag="h6">Practice Influence</CardTitle>
                            <ListGroup>
                              {doctorData?.practice_influence?.map(
                                (item, index) => (
                                  <ListGroupItem key={index}>
                                    {item}
                                  </ListGroupItem>
                                )
                              )}
                            </ListGroup>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>

                    <Row className="mb-4">
                      <Col md="6" lg="12">
                        <Card className="mb-3 key-roles">
                          <CardBody>
                            <CardTitle tag="h6">Engagement Triggers</CardTitle>
                            <ListGroup>
                              {doctorData?.engagement_triggers?.map(
                                (item, index) => (
                                  <ListGroupItem key={index}>
                                    {item}
                                  </ListGroupItem>
                                )
                              )}
                            </ListGroup>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="6" lg="12">
                        <Card className="mb-3 key-roles">
                          <CardBody>
                            <CardTitle tag="h6">Top Skills</CardTitle>
                            <ListGroup>
                              {doctorData?.top_skills?.map((item, index) => (
                                <ListGroupItem key={index}>
                                  {item}
                                </ListGroupItem>
                              ))}
                            </ListGroup>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>

                    <Card className="mb-4 key-roles">
                      <CardBody>
                        <CardTitle tag="h6">Conversation Starters</CardTitle>
                        {doctorData?.conversation_starters?.map((item, index) => (
                          <Card className="mb-3 key-roles" key={index}>
                            <CardBody>
                              <CardText>
                                <strong>Q:</strong> {item.question}
                              </CardText>
                              <ul className="">
                                <li>
                                  <strong className="text-primary">Why Chosen:</strong>{" "}
                                  {item?.breakdown?.why}
                                </li>
                                <li>
                                  <strong  className="text-primary">Viatris Connection:</strong>{" "}
                                  {item?.breakdown?.product_area}
                                </li>
                                <li>
                                  <strong className="text-primary">Sales Tip:</strong>{" "}
                                  {item?.breakdown?.sales_enablement_tip}
                                </li>
                              </ul>
                            </CardBody>
                          </Card>
                        ))}
                      </CardBody>
                    </Card>

                    {/* <Card className="next-best-action">
                      <CardBody>
                        <CardTitle tag="h6">Next Best Actions</CardTitle>
                        <ListGroup>
                          {doctorData.next_best_actions.map((item, index) => (
                            <ListGroupItem key={index}>
                              <strong>Action:</strong> {item.action} <br />
                              <strong>Rationale:</strong> {item.rationale}{" "}
                              <br />
                              <strong>Sales Intent:</strong> {item.sales_intent}{" "}
                              <br />
                              <strong>Tip:</strong> {item.execution_tip}
                            </ListGroupItem>
                          ))}
                        </ListGroup>
                      </CardBody>
                    </Card> */}
                  </Container>
              </TabPane>
              
            </TabContent>

            
          </div>
        </div>
         </> : <div>
          
         </div>
        }
        </>
      </div>
    </Layouts>
  );
}

export default NewHcp;
