import React, { useState } from "react";
import Layouts from "../Layouts/Layouts";
import "./employee.css";
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap";

// Images
import filter from "../../../images/icons/filter.png";
import request from "../../../api/api";
import toast from "react-hot-toast";
import FileSaver from "file-saver";

const profileType = [
  {
    label: "Technical",
    value: "Technical",
  },
  {
    label: "Management",
    value: "Management",
  },
  {
    label: "Intern/Trainee",
    value: "Intern/Trainee",
  },
];

const skills = [
  {
    label: "Python",
    value: "Python",
  },
  {
    label: "Java",
    value: "Java",
  },
  {
    label: "Javascript",
    value: "Javascript",
  },
  {
    label: "Data Analyst",
    value: "Data Analyst",
  },
];

const experienceLevel = [
  {
    label: "0-2 years",
    value: "2",
  },
  {
    label: "2-5 years",
    value: "5",
  },
  {
    label: "5-10 years",
    value: "10",
  },
  {
    label: "10+ years",
    value: "10",
  },
];

function Employee() {
  const [isFilter, setIsFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultDoc, setResultDoc] = useState([]);
  const [resultFuzzy, setResultFuzzy] = useState([]);
  const [search, setSearch] = useState({
    query: "",
    typeSearch: "",
  });

  const filterToggle = () => {
    setIsFilter(!isFilter);
  };

  const handleSearch = (name, event) => {
    setSearch({
      ...search,
      [name]: event.target.value,
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmitSearch();
    }
  };

  const handleSubmitSearch = () => {
    const { query, typeSearch } = search;

    if (query.length === 0) {
      return toast.error("Search text Requiured");
    }
    if (typeSearch.length === 0) {
      return toast.error("Please select type of search");
    }
    setIsLoading(true);
    if (typeSearch === "keywordSearch") {
      request({
        url: "/search/",
        method: "POST",
        data: { query: query },
      })
        .then((res) => {
          setIsLoading(false);
          if (res.status === 1) {
            setResultDoc(res?.matching_documents);
            setResultFuzzy(res?.fuzzy_matches);
          }
          if (res.status === 0) {
            toast.error(res.message);
            setResultDoc([]);
            setResultFuzzy([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const downloadProfile = (fileName) => {
    if (!fileName) {
      return toast.error("File Name Required");
    }
    request({
      url: `/download/${fileName}`,
      method: "GET",
      responseType: "blob",
    })
      .then((res) => {
        toast.success("Download success !");
        // console.log(res);
        const file = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        FileSaver.saveAs(file, `${fileName}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Layouts>
      <div className="profile-sticky">
        <div className="d-flex justify-content-between">
          <div>
            <h6>Employee Profile Repository</h6>
            <h6 className="text-muted">
              Search and discover employee talents skills and experience
            </h6>
          </div>
        </div>
        <div className="container p-0">
          <div className="search-employee">
            <h6 className="p-2 m-0">Search Employee Profiles</h6>
            <hr className="my-0 px-2 w-100 m-auto"></hr>
            <div className="d-flex justify-content-between my-2 px-2">
              <div className="d-flex">
                <div className="me-3">
                  <label class="custom-radio">
                    <input
                      type="radio"
                      name="choice"
                      value="keywordSearch"
                      onChange={(e) => handleSearch("typeSearch", e)}
                    />
                    <span class="radio-mark"></span>
                    Keyword Search
                  </label>
                </div>
                <div className="me-3">
                  <label class="custom-radio">
                    <input
                      type="radio"
                      name="choice"
                      value="semanticSearch"
                      onChange={(e) => handleSearch("typeSearch", e)}
                    />
                    <span class="radio-mark"></span>
                    Semantic Search
                  </label>
                </div>
                <div className="me-3">
                  <label class="custom-radio">
                    <input
                      type="radio"
                      name="choice"
                      value="advanceSearch"
                      onChange={(e) => handleSearch("typeSearch", e)}
                    />
                    <span class="radio-mark"></span>
                    Advance Search
                  </label>
                </div>
              </div>
              <div>
                <img
                  src={filter}
                  className="filter-icon"
                  onClick={filterToggle}
                />
              </div>
            </div>
            <div>
              <input
                className="profile-search"
                onChange={(e) => handleSearch("query", e)}
                onKeyDown={handleKeyDown}
              />{" "}
              <button
                className="profile-search-btn"
                onClick={() => handleSubmitSearch()}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="employee-result">
          {resultFuzzy.length > 0 && (
            <div className="emp-show-result">
              {resultFuzzy[0]?.matched_word === resultFuzzy[0]?.query_word
                ? `Showing result for ${resultFuzzy[0]?.query_word} [Score:${resultFuzzy[0]?.similarity_score}]`
                : `Showing result for ${resultFuzzy[0]?.matched_word} instead of ${resultFuzzy[0]?.query_word} [Score:${resultFuzzy[0]?.similarity_score}]`}
            </div>
          )}

          <h6>Matching Profiles({resultDoc?.length})</h6>
          <hr className=""></hr>
          {isLoading ? (
            <div className="text-center">
              <div class="loader">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
              </div>
            </div>
          ) : (
            <div>
              <div className="row">
                {resultDoc.map((doc) => {
                  return (
                    <div className="col-12">
                      <div className="employee-result-box">
                        <h6>{doc.document}</h6>
                        {/* <h6 className="text-muted employee-exp">
                            Experience 0.5 years
                          </h6> */}
                        <div className="employee-resume-details">
                          <div className="d-flex">
                            <div className="me-4  emp-skill">Python</div>
                            <div className="me-4  emp-skill">
                              Data Analytics
                            </div>
                            <div className="me-4 emp-skill">SQL</div>
                          </div>
                          <div>
                            <div>
                              <span className="fs-12">Found Words:</span>{" "}
                              <span className="fs-12">
                                <b>{resultFuzzy[0]?.matched_word}</b>
                              </span>
                            </div>
                          </div>
                          <div>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => downloadProfile(doc.document)}
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <Offcanvas direction="end" isOpen={isFilter} toggle={filterToggle}>
          <OffcanvasHeader toggle={filterToggle}>Filters</OffcanvasHeader>
          <OffcanvasBody>
            <div className="container">
              <div className="">
                <h6>Profile Type</h6>
                {profileType.map((list) => {
                  return (
                    <div className="profile-check">
                      <input type="checkbox" className="profile-check-box" />
                      <label>{list.label}</label>
                    </div>
                  );
                })}
              </div>
              <div className="">
                <h6>Experience Level</h6>
                {experienceLevel.map((list) => {
                  return (
                    <div className="experience-check">
                      <input type="checkbox" className="experience-check-box" />
                      <label>{list.label}</label>
                    </div>
                  );
                })}
              </div>
              <div className="">
                <h6>Skills</h6>
                {skills.map((list) => {
                  return (
                    <div className="skills-check">
                      <input type="checkbox" className="skills-check-box" />
                      <label>{list.label}</label>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-4">
                <button className="profile-filter-apply-btn">
                  Apply Filters
                </button>
              </div>
            </div>
          </OffcanvasBody>
        </Offcanvas>
      </div>
    </Layouts>
  );
}

export default Employee;
