
import React, { useState,useRef } from "react";
import Layouts from "../Layouts/Layouts";
import layoutLeft from "./../../../images/icons/layout-left.svg";
import pencil from './../../../images/icons/edit-02.svg'
import { useTheme } from "../../../Themecontext";
import reloadrevert from './../../../images/icons/refresh-ccw-01.svg'
import restatementammen from './../../../images/icons/file-plus-02.svg'
import yellowalert from './../../../images/icons/alert-circle.svg'
import closeicn from './../../../images/icons/x-close.svg'
import "./conflict.css";
import lefticn from './../../../images/icons/arrow-narrow-left.svg'
import { UncontrolledDropdown,DropdownToggle,DropdownItem,DropdownMenu, Col } from "reactstrap";
import {Button,Offcanvas,OffcanvasBody,OffcanvasHeader} from 'reactstrap'
import Sections from "../../Preview/Sections";
import aidark from '../../../images/icons/stardark.svg'
import ailight from '../../../images/icons/starlight.svg'

const Conflict = () => {
    const { theme, toogleTheme } = useTheme();
  const [isConflict,setIsConflict] = useState(false)



     const toggleConflict = () =>{
    setIsConflict(!isConflict)
  }
  


  return (
    <Layouts>
      {/* Restatement 2 */}
      <div className="Header-bar-restatement">
        <div className="LHS">
          <img src={lefticn} className="leftback" />
          <span>Restatement</span>
          <span className="name-of-agreement">
            Premier Health Alliance Agreement
          </span>
          <span>
            <DropdownToggle caret className="contract-upld-btn version">
              Version
              {/* {contractOffer?.document_version_number} */}
            </DropdownToggle>
          </span>
        </div>

        <div className="RHS">
          <span>
            <img src={closeicn} className="closeimg" />
          </span>
        </div>
      </div>

      <div className="Body-content-restatement">
        <div className="row">
          <div className={`col-4 ${isConflict ? 'hide-col':''}`}>
            <div className="">
                 <div className={`conflict-left`}>
                                    <div className=""><img src={theme === 'Dark'?aidark:ailight}/>Sections</div>
                                    <div className="" onClick={() => toggleConflict()}>
                                    <img src={layoutLeft} />
                                    </div>
                                  </div>
            </div>
          </div>
          <div className="col-8">
          <div className="Container-restatement">
            {
              isConflict ? <div className="open-btn" onClick={() => toggleConflict()}>
                                    <img src={layoutLeft} />
                                    </div> : ""
            }
            
            <div className="conflict-detection">
              <div className="LHS-CD">
                <div className="P-1">
                  <p>Conflict Detection & Resolution</p>
                </div>

                <div className="P-2">
                  <p>3 Conflicts Found</p>
                </div>
              </div>
            </div>

            <div className="Conflict-body">
              <div className="Unit-price-header-container">
                <span>
                  <img src={yellowalert} />
                </span>
                <span className="unit-price">Unit Price</span>
                <span className="found-in">Found in Branch A1, Branch A2</span>
              </div>

              <div className="Unit-price-toogle">
                <div className="toggle-button-group-rs ms-2">
                  <button className={`toggle-button-rs `}>
                    <span className="Ammendment-1">
                      <img
                        src={restatementammen}
                        className="restatementfileimg"
                      />
                      Accept Amendment 1
                    </span>
                  </button>

                  <button className={`toggle-button-rs `}>
                    <span className="Ammendment-1">
                      <img
                        src={restatementammen}
                        className="restatementfileimg"
                      />
                      Accept Amendment 2
                    </span>
                  </button>

                  <button className={`toggle-button-rs `}>
                    <span className="Ammendment-1">
                      <img src={reloadrevert} className="restatementfileimg" />
                      Revert to Master
                    </span>
                  </button>

                  <button className={`toggle-button-rs `}>
                    <span className="Ammendment-1">
                      <img src={pencil} className="restatementfileimg" />
                      Manual Edit
                    </span>
                  </button>
                </div>
              </div>

              <div className="Unit-price-input-box">
                <div className="Master">
                  <p>Master</p>
                  <input></input>
                </div>

                <div className="Ammendment-1">
                  <p>Ammendment 1</p>
                  <input></input>
                </div>
              </div>

              <hr className="hr-line-rs"></hr>
            </div>

            <div className="Conflict-body">
              <div className="Unit-price-header-container">
                <span>
                  <img src={yellowalert} />
                </span>
                <span className="unit-price">Payment Terms</span>
                <span className="found-in">Found in Branch A1</span>
              </div>

              <div className="Unit-price-toogle">
                <div className="toggle-button-group-rs-3 ms-2">
                  <button className={`toggle-button-rs `}>
                    <span className="Ammendment-1">
                      <img
                        src={restatementammen}
                        className="restatementfileimg"
                      />
                      Accept Amendment 1
                    </span>
                  </button>

                  {/* <button
                            className={`toggle-button-rs `}
                          >
                            <span className="Ammendment-1">
                               <img src={restatementammen}  className="restatementfileimg"/>Accept Amendment 2
                            </span>
                          </button> */}

                  <button className={`toggle-button-rs `}>
                    <span className="Ammendment-1">
                      <img src={reloadrevert} className="restatementfileimg" />
                      Revert to Master
                    </span>
                  </button>

                  <button className={`toggle-button-rs `}>
                    <span className="Ammendment-1">
                      <img src={pencil} className="restatementfileimg" />
                      Manual Edit
                    </span>
                  </button>
                </div>
              </div>

              <div className="Unit-price-input-box">
                <div className="Master">
                  <p>Master</p>
                  <input></input>
                </div>

                {/* <div className="Ammendment-1">
                  <p>
                    Ammendment 1
                  </p>
                  <input>
                  
                  </input>
                </div> */}
              </div>

              <hr className="hr-line-rs"></hr>
            </div>

            <div className="Conflict-body">
              <div className="Unit-price-header-container">
                <span>
                  <img src={yellowalert} />
                </span>
                <span className="unit-price">Pricing</span>
                <span className="found-in">Found in Branch A1</span>
              </div>

              <div className="Unit-price-toogle">
                <div className="toggle-button-group-rs-3 ms-2">
                  <button className={`toggle-button-rs `}>
                    <span className="Ammendment-1">
                      <img
                        src={restatementammen}
                        className="restatementfileimg"
                      />
                      Accept Amendment 1
                    </span>
                  </button>

                  {/* <button
                            className={`toggle-button-rs `}
                          >
                            <span className="Ammendment-1">
                               <img src={restatementammen}  className="restatementfileimg"/>Accept Amendment 2
                            </span>
                          </button> */}

                  <button className={`toggle-button-rs `}>
                    <span className="Ammendment-1">
                      <img src={reloadrevert} className="restatementfileimg" />
                      Revert to Master
                    </span>
                  </button>

                  <button className={`toggle-button-rs `}>
                    <span className="Ammendment-1">
                      <img src={pencil} className="restatementfileimg" />
                      Manual Edit
                    </span>
                  </button>
                </div>
              </div>

              <div className="Unit-price-input-box">
                <div className="Master">
                  <p>Master</p>
                  <input></input>
                </div>

                <div className="Ammendment-1">
                  <p>Manual</p>
                  <input
                    type="Text"
                    placeholder="Enter a description..."
                  ></input>
                </div>
              </div>
            </div>
            {/* filter and clear button */}
            <div className="apply-filter-btn-summary-rs">
              <div className="filter-btn-rs">
                <button className="clr-btn-rs">Clear All</button>
                <button className="apply-btn-rs">Apply Changes</button>
              </div>
            </div>
          </div>
        </div>
        </div>
        
      </div>
    </Layouts>
  );
};

export default Conflict;
