import React, { useState } from "react";
import Layouts from "../Layouts/Layouts";
import dots from "../../../images/icons/dots-vertical-restatement.svg";
import search from "../../../images/icons/search-icon-restatement.svg";
import { Table } from "reactstrap";
import "./restatement.css";
import Restatementtable from "../../Skeleton-loading/Restatementtable";
import { useNavigate } from "react-router-dom";
const Restatement = () => {
  const navigate = useNavigate()
  const[isLoading ,setisLoading]=useState(false);

  return (
    <Layouts>
      <div class="reststement-body-container">
        <div class="row ">
          <div class="col-12 restatement-title ">
            <h6>Restatement</h6>
          </div>
        </div>

          {isLoading ? (
                < Restatementtable/>
                ) : ( <div>
            <div class="row ">
          <div class="col-12 select-base-doc ">
            <div>
               <h6>Select Base Document</h6>
            </div>
           
             <div class="search-containers">
              <img className="i" src={search} />
              <input type="text" placeholder="Type Document Name, Version, Document Type... " />
            </div>

          </div>
        </div>
        </div>)
              }
       
      

        <div className="restatement-table-container">
          <Table responsive className="restatement-table">
            <thead>
              <tr className="restatement-table-title">
                <th className="docname">Document Name</th>
                <th className="version">Version</th>
                <th className="doc-type">Doc Type</th>
                <th className="customer">Customer</th>
                <th className="author">Author</th>
                <th className="date">Generated Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="restatement-values" onClick={()=>navigate('/conflict')}>
                <td className="document-data">
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>

              <tr className="restatement-values">
                <td className="document-data">
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>

              <tr className="restatement-values">
                <td className="document-data">
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>

              <tr className="restatement-values">
                <td className="document-data">
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>

              <tr className="restatement-values">
                <td className="document-data">
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>

              <tr className="restatement-values">
                <td className="document-data">
                  {" "}
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>

              <tr className="restatement-values">
                <td className="document-data">
                  {" "}
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>

              <tr className="restatement-values">
                <td className="document-data">
                  {" "}
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>

              <tr className="restatement-values">
                <td className="document-data">
                  {" "}
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>

              <tr className="restatement-values">
                <td className="document-data">
                  {" "}
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>

              <tr className="restatement-values">
                <td className="document-data">
                  {" "}
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>

              <tr className="restatement-values">
                <td className="document-data">
                  {" "}
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>
              <tr className="restatement-values">
                <td className="document-data">
                  {" "}
                  <input type="radio" id="html" />
                  <span className="pdf">
                    Health Innovations Partnership Agreement.pdf
                  </span>
                </td>
                <td className="version-data">v1.0</td>
                <td className="doc-type-data">GPO</td>
                <td className="customer-datas">PharmaTech Innovations</td>
                <td className="author-data">Raj Kumar</td>
                <td className="date-data">25 Dec 2025, 3:45 PM</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </Layouts>
  );
};

export default Restatement;


