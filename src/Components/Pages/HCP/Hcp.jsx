import React, { useState } from "react";
import Layouts from "../Layouts/Layouts";
import "./hcp.css";
import profile from "../../../images/icons/profile.png";
import linkedin from "../../../images/icons/linkedin.png";
import details from "../../../images/icons/info.png";
import {
    Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Modal,
  ModalBody,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  ListGroup,
  ListGroupItem,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import { doctorListData, hcpDoctorData } from "./hcpData";
import request from "../../../api/api";
import CardData from "../../Skeleton-loading/CardData";
import ProfileHead from "../../Skeleton-loading/ProfileHead";
import TableData from "../../Skeleton-loading/TableData";
import StatBoxes3 from "../../Skeleton-loading/StatBoxes3";
import ContentData from "../../Skeleton-loading/ContentData";
import toast from "react-hot-toast";
import { truncate } from "lodash";

function Hcp() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDocDetail, setIsDocDetail] = useState(false);
  const [doctorData, setDoctorData] = useState(hcpDoctorData);
  const [docList, setDocList] = useState(doctorListData);
  const [activeTab, setActiveTab] = useState("1");
  const [searchName,setSearchName] = useState('')

  const [open, setOpen] = useState('1');
  const [headlineOpen,setHeadLineOpen] = useState('')
  const toggleAccordion = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const toggleHeadlineAccordion = (id) => {

    if (headlineOpen === id) {
        setHeadLineOpen();
    } else {
        setHeadLineOpen(id);
    }
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  //view
  const viewDoc = (link) => {
    setIsLoading(true);
    setIsDocDetail(!isDocDetail);

    request({
      url: "/analyze-profile",
      method: "POST",
      data: { linkedin_url: link },
    })
      .then((res) => {
        setIsLoading(false);
        setIsDocDetail(!isDocDetail);
        setDoctorData(res);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleSearch =(value)=>{
    setSearchName(value)
  }

  const serachProfiles = ()=>{

    if(!searchName){
      return  toast.error("Name Required")
    }

    request({
        url:`/find-profile/?name=${searchName}`,
        method:'GET',
    }).then((res)=>{
        setDocList(res.linkedin_profiles)
    }).catch((err)=>{
        console.log(err)
    })
  }

  return (
    <Layouts>
      <div className="container">
        <div className="hcp-doc-box">
          <div className="d-flex justify-content-between align-items-center hcp-head-box">
            {/* <div className="hcp-head">Key HCPs in Your Territory</div> */}
            <div className="hcp-btn">
              {/* <button>View All</button> */}
            </div>
          </div>

          <div className="doc-serach">
            <div class="ui-input-container">
              <input
                required=""
                placeholder="Search for HealthCare Professional ..."
                class="ui-input"
                type="text"
                value={searchName}
                onChange={(e)=>handleSearch(e.target.value)}
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
            <button className="doc-search-btn" onClick={()=>serachProfiles()}> <span>Search</span>
            </button>
            </div>
          </div>
          <div className="mb-4 search-content">Enter the full name as it would appear in publications</div>

          <div className="hcp-doc-list">
            {docList?.map((doc,index) => {
                 const accordionId = `accordion-${index}`;
              return (
                <div
                  className="doc-details"
                  onClick={(e) => {
                    e.stopPropagation();
                    viewDoc(doc?.doc_link);
                  }}
                  key={index}
                >
                  <div className="doc-profile">
                    <div className="doc-profile-name">
                      <img src={profile} alt="doc-img" className="doc-img" />{" "}
                      <span className="text-white doc-name">
                        {doc?.first_name} {doc?.last_name}
                      </span>
                      <span>
                        <a
                          href={doc?.linkedin_url}
                          onClick={(e) => e.stopPropagation()}
                          target={"_blank"}
                        >
                          <img src={linkedin} className="linkedin" title="Linkedin"/>
                        </a>
                      </span>
                      <div className="doc-influ">
                        <img
                          src={details}
                          className="doc-info-icon"
                          title="information"
                        />  
                      </div>
                    </div>
                  </div>

                  <div>
                    <Accordion
                      className="doc-list-accordion"
                      open={headlineOpen}
                      onClick={(e) => {
                        e.stopPropagation(); // Stop event from reaching the parent
                        toggleHeadlineAccordion(accordionId, e);
                      }}
                    >
                      <AccordionItem>
                        <AccordionHeader targetId={accordionId}>
                          <div>
                            <h6 className="text-white">
                              {truncate(doc.headline, { length: 30 })}
                            </h6>
                          </div>
                        </AccordionHeader>
                        <AccordionBody accordionId={accordionId}>
                          {doc?.headline}
                        </AccordionBody>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isDocDetail}
        toggle={() => setIsDocDetail(!isDocDetail)}
        size="lg"
      >
        <ModalHeader toggle={() => setIsDocDetail(!isDocDetail)}>
          {isLoading ? (
            <ProfileHead></ProfileHead>
          ) : (
            <div className="doc-details-view">
              <div className="doc-profile">
                <img src={profile} alt="doc-img" />{" "}
                <span>
                  Dr. Kosar's Profile Summary<br></br>Cardiology · Metro Heart
                  Institute
                </span>
              </div>
            </div>
          )}
        </ModalHeader>
        <ModalBody>
        {isLoading ? (
                  <ContentData />
                ) : (
<div>
          <Nav className="doc-detail-nav">
                <NavItem>
                  <NavLink onClick={() => toggle("1")} className={activeTab==='1'?'active':''}>OverView</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={() => toggle("2")} className={activeTab==='2'?'active':''}>Publication</NavLink>
                </NavItem>
                {/* <NavItem>
                  <NavLink onClick={() => toggle("3")}>Clinical Practice</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={() => toggle("4")}>
                    Engagement History
                  </NavLink>
                </NavItem> */}
              </Nav>
            
            <TabContent className="mt-3" activeTab={activeTab}>
              <TabPane tabId={"1"}>
               
                  <Container className="mt-2 overview-container">
                    <h5 className="mb-4">{doctorData?.profile_summary?.split(',')[0]}</h5>
                    <h6>{doctorData?.profile_summary?.split(',')[1]}{doctorData?.profile_summary?.split(',')[2]}</h6>

                    <Row className="mb-4">
                      <Col md="6" lg="12">
                        <Card className="mb-3 key-roles">
                          <CardBody>
                            <CardTitle tag="h6">
                              Key Roles & Expertise
                            </CardTitle>
                            <ListGroup>
                              {doctorData.key_roles_expertise.map(
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
                        <Card className="mb-3 practice-influ">
                          <CardBody>
                            <CardTitle tag="h6">Practice Influence</CardTitle>
                            <ListGroup>
                              {doctorData.practice_influence.map(
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
                        <Card className="mb-3 engagement-trigger">
                          <CardBody>
                            <CardTitle tag="h6">Engagement Triggers</CardTitle>
                            <ListGroup>
                              {doctorData.engagement_triggers.map(
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
                        <Card className="mb-3 top-skills">
                          <CardBody>
                            <CardTitle tag="h6">Top Skills</CardTitle>
                            <ListGroup>
                              {doctorData.top_skills.map((item, index) => (
                                <ListGroupItem key={index}>
                                  {item}
                                </ListGroupItem>
                              ))}
                            </ListGroup>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>

                    <Card className="mb-4 conversation-start">
                      <CardBody>
                        <CardTitle tag="h6">Conversation Starters</CardTitle>
                        {doctorData.conversation_starters.map((item, index) => (
                          <Card className="mb-3" key={index}>
                            <CardBody>
                              <CardText>
                                <strong>Q:</strong> {item.question}
                              </CardText>
                              <ul>
                                <li>
                                  <strong>Why Chosen:</strong>{" "}
                                  {item?.breakdown?.why}
                                </li>
                                <li>
                                  <strong>Viatris Connection:</strong>{" "}
                                  {item?.breakdown?.product_area}
                                </li>
                                <li>
                                  <strong>Sales Tip:</strong>{" "}
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
              <TabPane tabId={"2"}>
                    <div className="container mt-4">
                    <Accordion open={open} toggle={toggleAccordion}>
        <AccordionItem>
          <AccordionHeader targetId="1">
            <div>
            <h6>-</h6>
                <h6 className=" px-2 text-muted">Recent Publications</h6>
            </div>
          </AccordionHeader>
          <AccordionBody accordionId="1">
                No Data
          </AccordionBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader targetId="2"> <div>
                <h6>-</h6>
                <h6 className="text-muted">Published Articles</h6>
            </div></AccordionHeader>
          <AccordionBody accordionId="2">
           No Data
          </AccordionBody>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader targetId="3"> <div>
                <h6>-</h6>
                <h6 className="text-muted">Medical Writings</h6>
            </div></AccordionHeader>
          <AccordionBody accordionId="3">
           No Data
          </AccordionBody>
        </AccordionItem>
      </Accordion>
                    </div>
              </TabPane>
              <TabPane tabId={"3"}></TabPane>
              <TabPane tabId={"4"}></TabPane>
            </TabContent>
          </div>
                )}
            
          
        </ModalBody>
      </Modal>
    </Layouts>
  );
}

export default Hcp;
