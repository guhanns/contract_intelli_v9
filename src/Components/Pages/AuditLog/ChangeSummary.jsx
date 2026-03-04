
import backbtn from "../../../images/icons/arrow-narrow-left-history.svg";
import search from "../../../images/icons/search-history.svg";
import exportimg from "../../../images/icons/export-history.svg";
import chevron from "../../../images/icons/chevron-down.svg";
import "./changesummary.css";
function ChangeSummary() {
  return (
     <div class="row ">
            <div class="col-3  change-history-filter">
              <h3 className="history-filter-title">Filters</h3>
    
              <div className="sections-history">
                <h3 className="sec-history-title">Sections</h3>
                <div className="all">
                  <input type="radio" id="all" name="fav_language" value="All" />
                  <label for="all" className="title">
                    All
                  </label>
                </div>
    
                <div className="section-one">
                  <input
                    type="radio"
                    id="sec1"
                    name="fav_language"
                    value="Section 1"
                  />
    
                  <label for="sec1" className="title">
                    Section 1
                  </label>
                </div>
    
                <div className="section-two">
                  <input
                    type="radio"
                    id="sec2"
                    name="fav_language"
                    value="Section 2"
                  />
                  <label for="sec2" className="title">
                    Section 2
                  </label>
                </div>
    
                <div className="section-three">
                  <input
                    type="radio"
                    id="sec3"
                    name="fav_language"
                    value="Section 3"
                  />
                  <label for="sec3" className="title">
                    Section 3
                  </label>
                </div>
    
                <div class="filter-container">
                  <div class="filter-content"></div>
                  <div class="button-group">
                    <button class="clear-btn">Clear</button>
                    <button class="apply-btn">Apply Filters</button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-9">
              <div className="export-history-container">
                <div class="search-container">
                  <img className="i" src={search} />
                  <input type="text" placeholder="Search " />
                </div>
    
                <div className="export-history-container">
                  <img src={exportimg} />
                  <span className="title">Export Change Summary</span>
                </div>
              </div>
    
              <div className="Change-summ-initial">
                <div className="change-summ-sec">
                  <p className="clauses-added">Clauses Added</p>
                  <ul className="clause-list">
                    <li>
                      Added a new Confidentiality clause to address data security.
                    </li>
                    <li>
                      Added a new Confidentiality clause to address data security.
                    </li>
                  </ul>
                </div>
    
                <div className="change-summ-sec">
                  <p className="clauses-added">Clauses Removed</p>
                  <ul className="clause-list">
                    <li>Removed outdated Pricing Adjustment clause.</li>
                    <li>
                      Deleted legacy Service Level clause no longer applicable.
                    </li>
                  </ul>
                </div>
    
                <div className="change-summ-sec">
                  <p className="clauses-added">Clauses Modified</p>
                  <ul className="clause-list">
                    <li>
                      Payment Terms updated – due date extended from 30 to 45 days
                    </li>
                    <li>
                      Renewal Terms revised – auto-renewal changed from 2 years to 1
                      year.
                    </li>
                  </ul>
                </div>
    
                <div className="change-summ-sec">
                  <p className="clauses-added">Financial / Pricing Changes</p>
                  <ul className="clause-list">
                    <li>Discount percentage revised from 8% to 10%.</li>
                    <li>
                      Rebate eligibility threshold increased from 5,000 to 10,000
                      units
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
  )
}

export default ChangeSummary