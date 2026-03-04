
import backbtn from "../../../images/icons/arrow-narrow-left-history.svg";
import search from "../../../images/icons/search-history.svg";
import exportimg from "../../../images/icons/export-history.svg";
import "./changehistory.css";
import Layouts from "../Layouts/Layouts";
import { colourStyles } from "../ContractList/ContractListNew";
import Select from "react-select";
import { useEffect, useState } from "react";
import request from "../../../api/api";
import { format, isToday, isYesterday } from "date-fns";


const actionOptions = [
  { value: "INSERT", label: "Insert" },
  { value: "DELETE", label: "Delete" },
  { value: "MOVE", label: "Move" },
  { value: "REPLACE", label: "Replace" },
  { value: "UPDATE", label: "Update" },
  { value: "LOGGED-IN", label: "Logged In" },
  { value: "LOGGED-OUT", label: "Logged Out" },
  { value: "EXPORT", label: "Export" }
];

const groupAuditLogsByDate = (logs) => {
  return logs.reduce((acc, item) => {
    const date = new Date(item.created_at);

    let groupLabel;
    if (isToday(date)) {
      groupLabel = "Today";
    } else if (isYesterday(date)) {
      groupLabel = `Yesterday, ${format(date, "dd MMM yyyy")}`;
    } else {
      groupLabel = format(date, "dd MMM yyyy"); // Example: 26 Oct 2025
    }

    if (!acc[groupLabel]) {
      acc[groupLabel] = [];
    }

    acc[groupLabel].push(item);
    return acc;
  }, {});
};

function ChangeHistory() {
  const [auditList,setAuditList] = useState({})
  const [isLoading,setIsLoading] =useState(true)
  const [isError,setIsError] =useState(false)
  const [userOption,setUserOption]=useState([])
  const [filterOption,setFilterOption] = useState({
  
    })

    const handleFilterChange = (e,name)=>{
    if(e.target.checked){
        setFilterOption({...filterOption,[name]:e.target.name})
    }
  }


  const fetchAuditLog =()=>{
     setIsLoading(true);
    const params = new URLSearchParams();

  // Loop through filterOption and add only non-empty values
 Object.entries(filterOption).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) params.append(key, item);
      });
    } else if (value) {
      params.append(key, value);
    }
  });

    const queryString = params.toString();
    request({
        url:`/icontract/audit/filter?${queryString}`,
        method:'GET',
    }).then((res)=>{
        setIsLoading(false);
        setAuditList(groupAuditLogsByDate(res))
    }).catch((err)=>{
        console.log(err)
    })
  }


  const fetchUser =()=>{
    request({
      url:'/icontract/audit/users',
      method:'GET'
    }).then((res)=>{
        setUserOption(res.map((li)=>{
          return {
            label:li,
            value:li
          }
        }))
    }).catch((err)=>{
      console.log(err)
      setIsError(true)
    })
  }



  useEffect(()=>{
    fetchAuditLog()
    fetchUser()
  },[])

  const clearAll =()=>{
    setFilterOption({})
    fetchAuditLog()
  }

  console.log(auditList)
  return (
    <div class="row">
      <div className="col-3 m-0 p-0  position-relative">
        <div class="contract-search-box grid history me-0 p-3 pe-0">
          <div className="filter-scroll">
            <div className="search-box-head grid">
              <h3>Filters</h3>
            </div>
            {/* <h3 className="contract-status-head">Sections</h3>
            <div className="mb-4">
              <label class="radio-option" htmlFor="section1">
                <input type="radio" id="section1" name="Active" />
                <span class="custom-radio"></span>
                Section1
              </label>

              <label class="radio-option" htmlFor="section1">
                <input type="radio" id="section1" name="Active" />
                <span class="custom-radio"></span>
                Section1
              </label>

              <label class="radio-option" htmlFor="section1">
                <input type="radio" id="section1" name="Active" />
                <span class="custom-radio"></span>
                Section1
              </label>

              <label class="radio-option" htmlFor="section1">
                <input type="radio" id="section1" name="Active" />
                <span class="custom-radio"></span>
                Section1
              </label>
            </div> */}
            <div className="grid-filter-doc">
              <h3>Users</h3>
              <div>
                <Select
                  styles={colourStyles}
                  placeholder="Select User"
                  isMulti
                  options={userOption}
                  onChange={(e) =>
                    setFilterOption({
                      ...filterOption,
                      user_names: e.map((li) => li.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid-filter-doc">
              <h3>Actions</h3>
              <div>
                <Select
                  styles={colourStyles}
                  options={actionOptions}
                  isMulti
                  placeholder="Select Action"
                  onChange={(e) =>
                    setFilterOption({
                      ...filterOption,
                      action_types: e.map((li) => li.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid-date-range">
              <h3 className="contract-status-head">Effective Date Range</h3>
              <div className="mb-4">
                <label class="radio-option">
                  <input
                    type="radio"
                    name="Today"
                    checked={filterOption.date_range === "Today"}
                    onChange={(e) => handleFilterChange(e, "date_range")}
                  />
                  <span class="custom-radio"></span>
                  Today
                </label>

                <label class="radio-option">
                  <input
                    type="radio"
                    name="Yesterday"
                    checked={filterOption.date_range === "Yesterday"}
                    onChange={(e) => handleFilterChange(e, "date_range")}
                  />
                  <span class="custom-radio"></span>
                  Yesterday
                </label>

                <label class="radio-option">
                  <input
                    type="radio"
                    name="This Week"
                    checked={filterOption.date_range === "This Week"}
                    onChange={(e) => handleFilterChange(e, "date_range")}
                  />
                  <span class="custom-radio"></span>
                  This Week
                </label>

                <label class="radio-option">
                  <input
                    type="radio"
                    name="This Month"
                    checked={filterOption.date_range === "This Month"}
                    onChange={(e) => handleFilterChange(e, "date_range")}
                  />
                  <span class="custom-radio"></span>
                  This Month
                </label>
                <label class="radio-option">
                  <input
                    type="radio"
                    name="Last 6 Months"
                    checked={filterOption.date_range === "Last 6 Month"}
                    onChange={(e) => handleFilterChange(e, "date_range")}
                  />
                  <span class="custom-radio"></span>
                  Last 6 Month
                </label>
                <label class="radio-option">
                  <input
                    type="radio"
                    name="This Year"
                    checked={filterOption.date_range === "This Year"}
                    onChange={(e) => handleFilterChange(e, "date_range")}
                  />
                  <span class="custom-radio"></span>
                  This Year
                </label>
                {/* <label class="radio-option">
                          <input
                            type="radio"
                            name="custom"
                            checked={filterOption.date_range === "custom"}
                            onChange={(e) => {
                              handleFilterChange(e, "date_range");
                            }}
                          />
                          <span class="custom-radio"></span>
                          Custom
                        </label> */}
                {/* {filterOption?.date_range === "custom" && (
                            <div className="date-picker-container">
                              <label>From Date</label>
                              <div className="input-wrapper">
                                <DatePicker
                                    selected={filterOption?.date_from && format(new Date(),'dd/MM/yyyy')}
                                  onChange={(date) =>
                                    setFilterOption({
                                      ...filterOption,
                                      date_from: date,
                                    })
                                  }
                                  placeholderText="Select From Date"
                                  className="date-input"
                                  calendarClassName="custom-calendar"
                                />
                              </div>

                              <label>To Date</label>
                              <div className="input-wrapper">
                                <DatePicker
                                  selected={filterOption?.date_to ? format(new Date(),'dd/MM/yyyy'):''}
                                  onChange={(date) =>
                                    setFilterOption({
                                      ...filterOption,
                                      date_to: date,
                                    })
                                  }
                                  placeholderText="Select To Date"
                                  className="date-input"
                                  calendarClassName="custom-calendar"
                                />
                              </div>
                            </div>
                          )} */}
              </div>
            </div>
            <div className="apply-filter-btn grid">
              <div className="filter-btn">
                <button className="clr-btn" onClick={() => clearAll()}>
                  Clear
                </button>
                <button className="apply-btn" onClick={() => fetchAuditLog()}>
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-9 p-0 change-history-container">
        <div className="mt-0 export-history-container">
          <div class="search-container">
            <img className="i" src={search} />
            <input type="text" placeholder="Search " />
          </div>

          {/* <div className="export-history-box">
            <img src={exportimg} />
            <span className="title">Export Change History</span>
          </div> */}
        </div>
        <div className="changes-history-content-sec">
          {Object.keys(auditList).length === 0 ? 
          <div className="audit-no-list">
            {
              isError ? <>Data Load Error</> : <>No Records Found</>
            }
            
          </div> :
          <ul className="datas">
            {Object.entries(auditList).map(([dateLabel, logs]) => (
              <div key={dateLabel} className="audit-group">
                <h3 className="audit-date">{dateLabel}</h3>

                <ul className="audit-list">
                  {logs?.map((item) => (
                    <li key={item?.audit_id}>
                      <span className="time">
                        {new Date(item?.created_at)?.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      <strong>{item?.user_name}</strong> {" "}

                      {
                        actionOptions.find(
                          (li) => li?.value === item?.action_type
                        )?.label
                      }

                      {item?.context && ` ${item?.context?.replace(/_/g," ")}`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </ul>}
          
        </div>
      </div>
    </div>
  );
}

export default  ChangeHistory;
