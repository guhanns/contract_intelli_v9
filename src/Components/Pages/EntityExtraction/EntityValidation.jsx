import React, { useEffect, useRef, useState } from 'react'
import Layouts from '../Layouts/Layouts'
import samplePDF from "../PDFViewer/Gen Pharma Agreement.pdf"
import { ArrowDown, ChevronLeft, ChevronRight, Pencil, PlusSquare, Save, Trash2, X } from 'lucide-react'

import stepper3 from "../../../images/sidebar_icons/stepper3.svg"
import { useLocation, useNavigate } from 'react-router-dom'
import request from '../../../api/api'
import requestL from '../../../api/lexi'
import ViewAstInspector from '../../Preview/ViewAstInspector'

function EntityValidation() {
    const navigate = useNavigate()
    const location= useLocation()
    console.log(location)
    const [contractPreview,setContractPreview] = useState({})
    const [templateDetail,setTemplateDetail] = useState({})
    const [runExtraction,setRunExtraction] = useState({})
     const [viewAstJsonRight,setViewAstJsonRight] = useState({})

    const getContractPreview =()=>{
        requestL({
            url:`/contracts/${location?.state?.contract_id}/preview`,
            method:'GET',
            params:{
                version_number : location?.state?.version_number
            }
        }).then((res)=>{
            setContractPreview(res)
        }).catch((err)=>{
            console.log(err)
        })
    }

    const getExtractTest =()=>{

        let reqBody ={
            ...location?.state?.entities,
            contract_id:location?.state?.testContract?.contract_id,
            version_number:location?.state?.testContract?.version_number
        }
        requestL({
            url:`/extract/test`,
            method:'POST',
            data:reqBody
        }).then((res)=>{
            setRunExtraction(res)
        }).catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        if(location?.state?.contract_id)
            getContractPreview()
            getExtractTest()
            fetchViewAstJsonRight()
    },[location?.state])


    const intervalRef = useRef(null);

useEffect(() => {
  if (!runExtraction?.run_id) return; // 🚫 no run_id, do nothing

  // Prevent duplicate intervals
  if (intervalRef.current) return;

  intervalRef.current = setInterval(() => {
    requestL({
      url: `/extract/test/${runExtraction.run_id}`,
      method: "GET",
    })
      .then((res) => {
        console.log("Polling status:", res.status);

        if (res.status === "READY") {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if(res.status==='FAILED'){
            clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      })
      .catch((err) => {
        console.error("Polling error:", err);
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      });
  }, 5000);

  // Cleanup on unmount or run_id change
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
}, [runExtraction?.run_id]);


    const getTemplateData =()=>{
        requestL({
            url:`/templates/${location?.state?.tempId}`,
            method:'GET',
        }).then((res)=>{
            setTemplateDetail(res)
        }).catch((err)=>{
            console.log(err)
        })
    }

    useEffect(()=>{
        if(location?.state?.tempId){
            getTemplateData()
        }
    },[location?.state?.tempId])


    const fetchViewAstJsonRight =()=>{
  requestL({
    url:`/contracts/${location?.state?.testContract?.contract_id}/${location?.state?.testContract?.version_number}/view-ast-json`,
    method:'GET',
  }).then((res)=>{
    setViewAstJsonRight(res)
  }).catch((err)=>{
    console.log(err)
  })
}
  return (
    <Layouts>
        <div className="container-fluid position-relative">
        <div className="entity-nav">
          <div className="entity-head">
            {templateDetail?.template_id ? templateDetail?.name :'New Entity Template'}  - Validation
          </div>
          <div className="right-entity">
            <div>
                <img src={stepper3}/>
            </div>
            <div className="entity-save" onClick={()=>navigate('/entity-extraction/test')}>
              <ChevronLeft /> Define Entities 
            </div>
            <div className="entity-clear"> <Save style={{marginRight:'8px'}}/>Save Template</div>
            
          </div>
        </div>
        <div className='entity-sec-nav'>
            <div className='container-fluid '>
                <div className='row'>
                <div className='col-5 p-0'>
                    <div>
                        <div className='left-head'>
                        Validate Entities
                    </div>
                    </div>
                </div>
                <div className='col-7 p-0'>
                   <div className='sec-ryt-entity'>
                    <h4> {contractPreview?.original_filename}  </h4><X/>
                   
                   </div>
                </div>
            </div>
            </div>
        </div>
      </div>
      <div className='validation-main'>
      <div className='container-fluid'>
           <div className='row'>
            
                <div className='col-5 p-0'>

                    <div className='validation-card-box'>
                        {
                contractPreview?.results?.length>0 ? contractPreview?.results?.map((ent)=>{
                    return <div className='valid-card'>
                            <div className='card-head-opt'>
                                <div>Entity 1 <span className='badge-basic'>Basic</span></div>
                                <div>
                                    <span className='mx-2'><ArrowDown size={18}/></span>
                                    <span className='mx-2'><PlusSquare size={18}/></span>
                                    <span className='mx-2'><Pencil size={18}/></span>
                                    <span className='mx-2'><Trash2 size={18}/></span>
                                </div>
                            </div>
                            <div className='card-content'>
                                <h5>contact_number</h5>
                                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam fuga fugiat modi?</p>
                            </div>
                            <div className='entity-sample'>
                                <span>Sample number</span>
                            </div>
                        </div>
                }):<div>No Results found</div>
            }
                       
                    </div>
                </div>
                <div className='col-7 p-0'>
                    <div className='validation-pdf-box'>
                        <ViewAstInspector
                            data={viewAstJsonRight}
                            />
                        
                    </div>
                </div>
           </div>
      </div>
      </div>
    </Layouts>
  )
}

export default EntityValidation