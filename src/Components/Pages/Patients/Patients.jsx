import React, { useEffect, useState } from 'react'
import Layouts from '../Layouts/Layouts'
import { useLocation, useNavigate } from 'react-router-dom'
import request from '../../../api/api'
import { Badge, Button, Col, Input, Row, Table } from 'reactstrap'
import './patients.css'
import pulse from "../../../images/icons/pulse_white.png";
import patientsIcon from "../../../images/icons/patients.png";
import filterIcon from '../../../images/icons/filters.png'
import doubleLeft from '../../../images/icons/double-left.png'
import doubleRight from '../../../images/icons/double-right.png'
import rightArrow from '../../../images/icons/right-arrow.png'
import leftArrow from '../../../images/icons/left-arrow.png'
import Pagination from 'react-js-pagination'
import { useSelector } from 'react-redux'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar'

const patients = [
    {
      id: 'PT-10458',
      name: 'Robert Chen',
      age: 62,
      gender: 'M',
      matchScore: 98,
      status: 'Eligible',
    },
    {
      id: 'PT-23971',
      name: 'Maria Garcia',
      age: 58,
      gender: 'F',
      matchScore: 95,
      status: 'Eligible',
    },
    {
      id: 'PT-18433',
      name: 'James Wilson',
      age: 67,
      gender: 'M',
      matchScore: 91,
      status: 'Pending Review',
    },
    {
      id: 'PT-31092',
      name: 'Sarah Johnson',
      age: 55,
      gender: 'F',
      matchScore: 89,
      status: 'Eligible',
    },
    {
      id: 'PT-42187',
      name: 'David Kim',
      age: 71,
      gender: 'M',
      matchScore: 87,
      status: 'Pending Review',
    },
  ];

function Patients() {

    const navigate = useNavigate()
    const [pages, setpages] = useState(10);
    const [activePage, setactivePage] = useState(1);
    const [currPage, setcurrPage] = useState(25);
    const [pageRangeDisplayed, setpageRangeDisplayed] = useState(4);
    const location = useLocation()
    const { criteriaFilter } = useSelector((state) => state.criteria)
    const [patientsList,setPatientsList] = useState([])
    const getPatientsDetails = ()=>{
        request({
            url:'/filter-patients',
            method:"POST",
            data:criteriaFilter
        }).then((res)=>{
           setPatientsList(res)
        }).catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        if(criteriaFilter?.length>0){
            getPatientsDetails()
        }
    },[criteriaFilter])

    console.log(criteriaFilter)

    const statusBadge = (status) => {
        if (status === 'Eligible') {
          return <Badge color="success">Eligible</Badge>;
        } else {
          return <Badge color="warning">Pending Review</Badge>;
        }
      };

    const editCriteria =()=>{
        navigate('/criteria')
    }
  return (
    <Layouts>
      <div className="p-4">
        <div className="patients-list-btn">
          <button onClick={() => editCriteria()}>
            {" "}
            <img src={filterIcon} className="patient-ico" />
            Edit Criteria
          </button>
          <button className="run-check">
            <img src={pulse} className="pulse-ico" />
            Run Eligibility Check
          </button>
        </div>
        <Row className="mb-3 align-items-center">
          <Col>
            <h5 className="patient-match">
              Matching Patients <Badge color="primary">0</Badge>
            </h5>
          </Col>
          {/* <Col md="4" className="text-end">
          <Input type="select">
            <option>Match Score</option>
            <option>Age</option>
            <option>Name</option>
          </Input>
        </Col> */}
        </Row>

        <Table hover responsive className="patients-table">
          <thead className="table-light">
            <tr>
              <th>PATIENT ID</th>
              <th>UHID</th>
              <th>AGE/GENDER</th>
              <th>MATCH SCORE</th>
              {/* <th>STATUS</th> */}
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {patientsList.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <strong>{patient["IP No"]}</strong>
                </td>
                <td>{patient["UHID No"]}</td>
                <td>
                  {patient?.Age} / {patient?.Gender}
                </td>
                <td className='d-flex justify-content-center'>
                    <div style={{ width: 35, height: 35 }} className='text-center'>
                        {/* change the value and text to show the progress circular */}
                    <CircularProgressbar value={90} text={`${90}`} 
                        styles={buildStyles({
                            // Rotation of path and trail, in number of turns (0-1)
                            rotation: 0,
                        
                            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                            strokeLinecap: 'butt',
                        
                            // Text size
                            // textSize: '16px',
                        
                            // How long animation takes to go from one percentage to another, in seconds
                            pathTransitionDuration: 0.5,
                        
                            // Can specify path transition in more detail, or remove it entirely
                            // pathTransition: 'none',
                        
                            // Colors
                            pathColor: `rgba(90, 170, 199, ${90 / 100})`,
                            textColor: 'black',
                            trailColor: '',
                            backgroundColor: '#3e98c7',
                          })}
                    />
                    </div>
                </td>
                {/* <td>{statusBadge(patient?.status)}</td> */}
                <td>
                  <Button color="link" className="text-primary p-0 patient-btn">
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination
          // prevPageText={<img src={leftArrow} alt="Left" />}
          // nextPageText={<img src={rightArrow} alt="Right" />}
          // firstPageText={<img src={doubleLeft} alt="Left" />}
          // lastPageText={<img src={doubleRight} alt="Right" />}
          activePage={activePage}
          itemsCountPerPage={currPage}
          totalItemsCount={pages}
          pageRangeDisplayed={pageRangeDisplayed}
          // onChange={paginate}
          itemClass="page-item"
          linkClass="page-link"
          activeLinkClass="clients"
        />
      </div>
    </Layouts>
  );
}

export default Patients