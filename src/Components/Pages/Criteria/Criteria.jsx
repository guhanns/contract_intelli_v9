import React, { useEffect, useState } from "react";
import Layouts from "../Layouts/Layouts";
import "./criteria.css";
import pulse from "../../../images/icons/pulse_white.png";
import patientsIcon from "../../../images/icons/patients.png";
import Select from "react-select";
import cross from '../../../images/icons/cross.png'
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Table,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCriteria, deleteCriteria } from "../../redux/features/criteriaSlice";

const fieldOptions = [
  { value: "IP No", label: "IP_No" },
  { value: "Gender", label: "Gender" },
  { value: "Age", label: "Age" },
  { value: "Department", label: "Department" },
  { value: "Blood Group", label: "Blood Group" },
  { value: "COVID Vaccination", label: "COVID Vaccination" },
];

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const departmentOptions = [
  { value: "Cardiology", label: "Cardiology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Gynaecology", label: "Gynaecology" },
  // add more
];

const bloodGroupOptions = [
  { value: "O POSITIVE", label: "O POSITIVE" },
  { value: "A POSITIVE", label: "A POSITIVE" },
  // add more
];

const covidVaccination = [
  { value: "Not Done", label: "Not Done" },
  { value: "Done", label: "Done" },
  // add more
];

const operatorsByField = {
  "IP No": [{ value: "equals", label: "equals" }],
  Gender: [{ value: "equals", label: "equals" }],
  Age: [
    { value: "between", label: "between" },
    { value: "equals", label: "equals" },
    { value: "greater_than", label: "greater than" },
    { value: "less_than", label: "less than" },
  ],
  Department: [{ value: "equals", label: "equals" }],
  "Blood Group": [{ value: "equals", label: "equals" }],
  "COVID Vaccination": [{ value: "equals", label: "equals" }],
};

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "32px", // 🔽 Reduce overall height
    height: "32px",
    padding: "0 4px",
    fontSize: "12px",
    borderColor: state.isFocused ? "black" : "#ccc", // Change this to your color
    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "black" : "#aaa",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "20px",
    padding: "0 6px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "32px",
  }),
  option: (provided, state) => ({
    ...provided,
    padding: "6px 10px", // 🔽 Reduce option height
    fontSize: "14px",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "4px",
  }),
  clearIndicator: (provided) => ({
    ...provided,
    padding: "4px",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

function Criteria() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const { criteriaFilter } = useSelector((state) => state.criteria)

    useEffect(()=>{
        setCriteriaList(criteriaFilter)
    },[criteriaFilter])


  const [isNewCriteria, setIsNewCriteria] = useState(false);
  const [criteriaList, setCriteriaList] = useState(criteriaFilter);
  const [open, setOpen] = useState("1");
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const [selectedField, setSelectedField] = useState(null);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [selectedValue, setSelectedValue] = useState([]);

  const handleFieldChange = (selected) => {
    setSelectedField(selected.value);
    setSelectedOperator(null);
    setSelectedValue([]);
  };

  const getValueOptions = () => {
    switch (selectedField) {
      case "Gender":
        return genderOptions;
      case "Department":
        return departmentOptions;
      case "Blood Group":
        return bloodGroupOptions;
      case "COVID Vaccination":
        return covidVaccination;
      default:
        return null;
    }
  };

  console.log(selectedField, selectedOperator, selectedValue);

  const handleSubmitFilter = () => {
    // setCriteriaList([
    //   ...criteriaList,
    //   {
    //     field: selectedField,
    //     operator: selectedOperator,
    //     value: selectedValue,
    //   },
    // ]);

    dispatch(addCriteria({
        field: selectedField,
        operator: selectedOperator,
        value: selectedValue,
      }))
    setSelectedField(null);
    setSelectedOperator(null);
    setSelectedValue([]);
  };

  console.log(criteriaList);

  const handleRunEligibility =()=>{
    navigate('/patients',{state:{criteria:criteriaList}})
  }

  const removeCriteria =(idx)=>{
    dispatch(deleteCriteria(idx))
  }
  return (
    <Layouts>
      <div className="container p-0">
        <div className="criteria-head">
          <div className="lft">
            <h5>Phase II Lung Cancer Immunotherapy Trial</h5>
            <div className="lft-id">ID: ONCO-432</div>
          </div>
          <div className="ryt">
            <button>
              {" "}
              <img src={patientsIcon} className="patient-ico" />
              View Patients
            </button>
            <button className="run-check" onClick={()=>handleRunEligibility()}>
              <img src={pulse} className="pulse-ico" />
              Run Eligibility Check
            </button>
          </div>
        </div>
        <div className="criteria-box">
          <div className="filter-head">
            <div className="filter-name">Eligibility Criteria</div>
            <div
              className="filter-add"
              onClick={() => setIsNewCriteria(!isNewCriteria)}
            >
              + Add Criteria
            </div>
          </div>
          {isNewCriteria && (
            <div className="add-criteria">
              <h6>Add Criteria</h6>
              <div className="filter-row">
                <div className="row">
                  <div className="col-4">
                    <Select
                      styles={customStyles}
                      options={fieldOptions}
                      value={fieldOptions.filter((op)=>op.value === selectedField)}
                      onChange={handleFieldChange}
                      placeholder="Select Field"
                    />
                  </div>
                  <div className="col-4">
                    <Select
                      styles={customStyles}
                      options={operatorsByField[selectedField] || []}
                      value={operatorsByField[selectedField]?.filter((op)=>op.value===selectedOperator)}
                      onChange={(e) => setSelectedOperator(e.value)}
                      placeholder="Select Operator"
                      isDisabled={!selectedField}
                    />
                  </div>
                  <div className="col-4">
                    {selectedField === "Age" &&
                    selectedOperator === "between" ? (
                      <div className="d-flex">
                        <input
                          type="number"
                          placeholder="From"
                          className="age-input"
                          value={selectedValue[0]}
                          onChange={(e) => {
                            const newValue = [...selectedValue];
                            newValue[0] = e.target.value;
                            setSelectedValue(newValue);
                          }}
                        />
                        <input
                          type="number"
                          placeholder="To"
                          className="age-input"
                          value={selectedValue[1]}
                          onChange={(e) => {
                            const newValue = [...selectedValue];
                            newValue[1] = e.target.value;
                            setSelectedValue(newValue);
                          }}
                        />
                      </div>
                    ) : getValueOptions() ? (
                      <Select
                        styles={customStyles}
                        options={getValueOptions()}
                        onChange={(e) => setSelectedValue([e.value])}
                        placeholder="Select Value"
                      />
                    ) : (
                      <input type="text" placeholder="Enter Value"  className="input-value" onChange={(e)=>setSelectedValue([e.target.value])}/>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-end">
                <button className="cancel-btn" >Cancel</button>
                <button
                  className="success-btn"
                  onClick={() => handleSubmitFilter()}
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div>
            <Accordion open={open} toggle={toggle}>
              <AccordionItem>
                <AccordionHeader targetId="1">Inclusion</AccordionHeader>
                <AccordionBody accordionId="1">
                  <Table className="crteria-list-table">
                    <thead>
                      <tr>
                        <th>s.no</th>
                        <th>Field</th>
                        <th>Operator</th>
                        <th>Value</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                        {
                            criteriaList?.map((list,i)=>{
                                return <tr key={i}>
                                <th scope="row">{i+1}</th>
                                <td>{list?.field}</td>
                                <td>{list.operator}</td>
                                <td>{list?.value?.join(',')}</td>
                                <td><img src={cross} className="cross-img" title="Remove" onClick={()=>removeCriteria(i)}/></td>
                              </tr>
                            })
                        }
                    </tbody>
                  </Table>
                </AccordionBody>
              </AccordionItem>
              <AccordionItem>
                <AccordionHeader targetId="2">Exclusion</AccordionHeader>
                <AccordionBody accordionId="2">
                  Work in progress....
                </AccordionBody>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </Layouts>
  );
}

export default Criteria;
