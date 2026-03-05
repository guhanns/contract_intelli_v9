import React, { useEffect, useRef, useState } from 'react'
import Layouts from '../Layouts/Layouts'
import samplePDF from "../PDFViewer/Gen Pharma Agreement.pdf"
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Pencil, Plus, PlusSquare, Save, Trash, Trash2, X } from 'lucide-react'

import stepper3 from "../../../images/sidebar_icons/stepper3.svg"
import { useLocation, useNavigate } from 'react-router-dom'
import request from '../../../api/api'
import requestL from '../../../api/lexi'
import ViewAstInspector from '../../Preview/ViewAstInspector'
import toast from 'react-hot-toast'
import { colourStyles } from '../ContractList/ContractListNew'
import { ragOptions, sqlFormatOptions } from './NewEntityTemplate'
import Select from 'react-select'
import FewShotSelect from '../../Select/FewShotSelect'

function EntityValidation() {
    const navigate = useNavigate()
    const location= useLocation()
    console.log(location)
    const [contractPreview,setContractPreview] = useState({})
    const [isEditEntities,setIsEditEntities] = useState(false)
    const [templateDetail,setTemplateDetail] = useState({})
    const [runExtraction,setRunExtraction] = useState({})
     const [viewAstJsonRight,setViewAstJsonRight] = useState({})
     const [template,setTemplate] = useState({})
     const [editTemplate,setEditTemplate] = useState({})

    
     const mapResponseToTemplateState = (response) => {
    const sectionMap = {};

    response?.fields?.forEach((field) => {
      if (!sectionMap[field.section]) {
        sectionMap[field.section] = {
          sectionName: field.section,
          entities: [],
        };
      }

      sectionMap[field.section].entities.push({
        field_name: field.field_name || "",
        display_key: field.display_key || "",
        format: field.format || "",
        question: field.question || "",
        rag_technique: field.rag_technique || "",
        extra_content: field.extra_content || "",
        format_hint:field.format_hint||"",
        few_shots: field.few_shots || [],
        columns:field?.columns||[]
      });
    });

    return {
      name: response.name || "",
      description: response.description || "",
      sections: Object.values(sectionMap),
      template_id: response?.template_id,
    };
  };

    const getContractPreview =()=>{
        requestL({
            url:`/extract/test/${runExtraction.run_id}`,
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

    useEffect(()=>{
        setTemplate(location?.state?.entities?? {})
        setEditTemplate(
            mapResponseToTemplateState(location?.state?.entities)
        )
    },[location?.state?.entities])

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
        if(location?.state?.testContract?.contract_id)
            // getContractPreview()
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
        toast.loading(res.status)
        console.log("Polling status:", res.status);

        if (res.status === "COMPLETED") {
            toast.remove()
            toast.success("Extraction Completed")
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setContractPreview(res)
        }

        if(res.status==='FAILED'){
             toast.remove()
             toast.error("Extraction Failed")
            clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      })
      .catch((err) => {
         toast.remove()
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
            url:`/templates/${location?.state?.testContract?.contract_id}`,
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

 const buildPayload = (templateData) => {
    const { name, description, sections,is_sytem } = templateData;

    const fields = sections.flatMap((section) =>
      section.entities.map((entity) => ({
        field_name: entity.field_name,
        display_key: entity.display_key,
        section: section.sectionName,
        format: entity.format,
        format_hint:entity.format_hint,
        question: entity.question,
        rag_technique: entity.rag_technique,
        extra_content: entity.extra_content,
        few_shots: entity?.few_shots,
        columns:entity?.columns,
        table_name:entity?.table_name
      })),
    );

    return {
      name,
      description,
      fields,
      is_sytem

    };
  };

  const validateTemplate = (template) => {
  const errors = {};

  if (!template.sections || template.sections.length === 0) {
    errors.sections = "At least one section is required";
    return errors;
  }

  template.sections.forEach((section, secIdx) => {
    if (!section.sectionName || !section.sectionName.trim()) {
      errors[`section_${secIdx}_title`] = "Section title is required";
    }

    if (!section.entities || section.entities.length === 0) {
      errors[`section_${secIdx}_entities`] = "At least one entity is required";
      return;
    }

    section.entities.forEach((entity, entIdx) => {
      if (!entity.field_name || !entity.field_name.trim()) {
        errors[`section_${secIdx + 1}_entity_${entIdx + 1}_name`] =
          "Entity name is required";
      }

      if (!entity.display_key || !entity.display_key.trim()) {
        errors[`section_${secIdx + 1}_entity_${entIdx + 1}_name`] =
          "Entity name is required";
      }

      if (!entity.format) {
        errors[`section_${secIdx + 1}_entity_${entIdx + 1}_sql_format`] =
          "SQL format is required";
      }

      if (!entity.rag_technique) {
        errors[`section_${secIdx + 1}_entity_${entIdx + 1}_rag_type`] =
          "RAG type is required";
      }
    });
  });

  return errors;
};


 const handleSaveTemplate = () => {

    const payload = buildPayload(template);
    const validationErrors = validateTemplate(template);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("All fiels required");
      return;
    }

    let url = '/templates'
    let method= 'POST'

    if(location?.state?.template_id){
        url = `/templates/${location?.state?.template_id}`,
        method='PUT'
    }

    requestL({
      url,
      method,
      data:payload,
    }).then((res) => {
      console.log(res);
      navigate("/entity-extraction");
    });
  };

  const handleSectionChange = (secIdx, key, value) => {
    setEditTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === secIdx
          ? {
              ...section,
              [key]: value,
            }
          : section,
      ),
    }));
  };

  const handleRemoveSection = (secIdx) => {
    setEditTemplate((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== secIdx),
    }));
  };

  const handleRemoveEntity = (secIdx, entityIdx) => {
    setEditTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === secIdx
          ? {
              ...section,
              entities: section.entities.filter(
                (_, eIndex) => eIndex !== entityIdx,
              ),
            }
          : section,
      ),
    }));
  };

  const handleNewEntity = (secIdx) => {
    setEditTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === secIdx
          ? {
              ...section,
              entities: [
                ...section.entities,
                {
                  field_name: "",
                  display_key: "",
                  format: "string",
                  question: "",
                  rag_technique: "basic",
                  extra_content: "",
                },
              ],
            }
          : section,
      ),
    }));
  };

  const handleNewSection = () => {
    setEditTemplate((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          sectionName: "",
          entities: [
            {
              field_name: "",
              display_key: "",
              format: "string",
              question: "",
              rag_technique: "basic",
              extra_content: "",
            },
          ],
        },
      ],
    }));
  };

  const handleEntityChange = (secIdx, entityIdx, key, value) => {
    setEditTemplate((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === secIdx
          ? {
              ...section,
              entities: section.entities.map((entity, eIndex) => {
                if (eIndex !== entityIdx) return entity;

                const updatedEntity = {
                  ...entity,
                  [key]: value,
                };

                if (key === "format" && value === "table") {
                  return {
                    ...updatedEntity,
                    columns: [
                      {
                        name: "",
                        display_key: "",
                        format: "",
                        format_hint: "",
                      },
                    ],
                  };
                }

                return updatedEntity;
              }),
            }
          : section,
      ),
    }));
  };


  const handleTableChange = (secIdx, entIdx, colIdx, key, value) => {
  setEditTemplate(prev => ({
    ...prev,
    sections: prev.sections.map((section, sIndex) =>
      sIndex === secIdx
        ? {
            ...section,
            entities: section.entities.map((entity, eIndex) =>
              eIndex === entIdx
                ? {
                    ...entity,
                    columns: entity.columns.map((col, cIndex) =>
                      cIndex === colIdx
                        ? { ...col, [key]: value }
                        : col
                    )
                  }
                : entity
            )
          }
        : section
    )
  }));
};


const removeColumn = (secIdx, entIdx, colIdx) => {
    let temp = { ...editTemplate };

    temp.sections[secIdx]?.entities[entIdx]?.columns?.splice(colIdx, 1);
    setEditTemplate({ ...temp });
  };

  const addTableColumns = (secIdx, entIdx) => {
    console.log(secIdx, entIdx);
    let temp = { ...editTemplate };
    temp?.sections[secIdx]?.entities[entIdx]?.columns?.push({
      name: "",
      display_key: "",
      format: "",
      format_hint: "",
    });
    setEditTemplate({ ...temp });
  };

  const handleSaveChanges =()=>{
    const payload = buildPayload(editTemplate);
    const validationErrors = validateTemplate(editTemplate);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("All fiels required");
      return;
    }

    
  navigate('/entity-extraction/validation', {
    state: {
      ...location.state,
      entities: editTemplate
    },
    replace: true
  });

    let reqBody ={
            ...payload,
            contract_id:location?.state?.testContract?.contract_id,
            version_number:location?.state?.testContract?.version_number
        }
        requestL({
            url:`/extract/test`,
            method:'POST',
            data:reqBody
        }).then((res)=>{
            setRunExtraction(res)
            setIsEditEntities(false)
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
            <div className="entity-clear" onClick={()=>navigate('/entity-extraction/test')}>
              <ChevronLeft /> Define Entities 
            </div>
            <div className="entity-save"  onClick={()=>handleSaveTemplate()}> <Save style={{marginRight:'8px'}}/>Save Template</div>
            
          </div>
        </div>
        <div className='entity-sec-nav'>
            <div className='container-fluid '>
                <div className='row'>
                <div className='col-5 p-0'>
                    <div className='d-flex justify-content-between align-items-center my-3'>
                        <div className='left-head'>
                        Extracted Entities
                    </div>
                    <div>
                        {
                            isEditEntities ? <div>
                                    <button className='entity-clear' onClick={()=>setIsEditEntities(false)}><Pencil size={18} style={{
                            color:'var(--text-teritary)',
                            marginRight:'8px'
                        }}/>Cancel</button>
                        <button className='entity-clear' onClick={()=>handleSaveChanges()} ><Save size={18} style={{
                            color:'var(--text-teritary)',
                            marginRight:'8px'
                        }}/>Save Changes</button>
                            </div> :  <button className='entity-clear' onClick={()=>setIsEditEntities(true)}><Pencil size={18} style={{
                            color:'var(--text-teritary)',
                            marginRight:'8px'
                        }}/>Edit Entities</button>
                        }
                       
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
            
                <div className='col-5 left-bg'>
                    {
                        isEditEntities ?
                        <div className="entity-main" >
                                <h4>Template Information</h4>
                                <div className="row my-3">
                                  <div className="col-4">
                                    <label>Template Name</label>
                                    <div>
                                      <input
                                        className="entity-input"
                                        placeholder="Template Information"
                                        value={editTemplate?.name}
                                        onChange={(e) =>
                                          setEditTemplate({
                                            ...editTemplate,
                                            name: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="col-8">
                                    <label>Description (optional)</label>
                                    <div>
                                      <input
                                        className="entity-input"
                                        placeholder="Description"
                                        value={editTemplate?.description}
                                        onChange={(e) =>
                                          setEditTemplate({
                                            ...editTemplate,
                                            description: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                        
                                <div className="entity-fields">
                                  <h4>Define Entity fields</h4>
                        
                                  {editTemplate?.sections?.map((sec, secIdx) => {
                                    return (
                                      <div className="entity-box" key={secIdx}>
                                        <div className="box-info">
                                          <div>Section {secIdx + 1}</div>
                                          <div>
                                            {/* <span className="mx-2">
                                              <ArrowUp size={18} />
                                            </span>
                                            <span className="mx-2">
                                              <ArrowDown size={18} />
                                            </span>
                                            <span className="mx-2">
                                              <PlusSquare size={18} />
                                            </span> */}
                                            <span
                                              className="mx-2"
                                              onClick={() => handleRemoveSection(secIdx)}
                                            >
                                              <Trash size={18} />
                                            </span>
                                          </div>
                                        </div>
                                        <div className="row">
                                          <div className="col-12">
                                            <label>Section Name</label>
                                            <div>
                                              <input
                                                className="entity-input"
                                                placeholder="Section Name"
                                                value={sec?.sectionName}
                                                onChange={(e) =>
                                                  handleSectionChange(
                                                    secIdx,
                                                    "sectionName",
                                                    e.target.value,
                                                  )
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        {sec?.entities?.length > 0 &&
                                          sec?.entities?.map((ent, entIdx) => {
                                            return (
                                              <div className="row">
                                                <div className="d-flex justify-content-between align-items-center text-secondary mb-3">
                                                  <div className="Entity-heading-ukg">Entity {entIdx + 1}</div>
                                                  <div>
                                                    <span
                                                      className="mx-2"
                                                      onClick={() => handleRemoveEntity(secIdx, entIdx)}
                                                    >
                                                      <Trash size={18} />
                                                    </span>
                                                  </div>
                                                </div>
                                                <div className="col-6">
                                                  <label>Entity Name*</label>
                                                  <div>
                                                    <input
                                                      className="entity-input"
                                                      placeholder="entity_name "
                                                      value={ent?.field_name}
                                                      onChange={(e) =>
                                                        handleEntityChange(
                                                          secIdx,
                                                          entIdx,
                                                          "field_name",
                                                          e.target.value,
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                                <div className="col-6">
                                                  <label>Entity Display Name </label>
                                                  <div>
                                                    <input
                                                      className="entity-input"
                                                      placeholder="Entity Display Name"
                                                      value={ent?.display_key}
                                                      onChange={(e) =>
                                                        handleEntityChange(
                                                          secIdx,
                                                          entIdx,
                                                          "display_key",
                                                          e.target.value,
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                                {/* <div className="col-4">
                                              <label>Entity Description</label>
                                              <div>
                                                <input
                                                  className="entity-input"
                                                  value={ent?.question}
                                                  onChange={(e) =>
                                                    handleEntityChange(
                                                      secIdx,
                                                      entIdx,
                                                      "question",
                                                      e.target.value,
                                                    )
                                                  }
                                                />
                                              </div>
                                            </div> */}
                                                <div
                                                  className={
                                                    ent?.format !== "table" ? "col-3" : "col-4"
                                                  }
                                                >
                                                  <label>Format</label>
                                                  <div>
                                                    <Select
                                                      styles={colourStyles}
                                                      options={sqlFormatOptions}
                                                      value={sqlFormatOptions?.filter(
                                                        (op) => op.value === ent?.format,
                                                      )}
                                                      onChange={(e) =>
                                                        handleEntityChange(
                                                          secIdx,
                                                          entIdx,
                                                          "format",
                                                          e.value,
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                                {ent?.format !=='table' && (
                                                  <div
                                                    className={
                                                      ent?.format !== "table" ? "col-6" : "col-4"
                                                    }
                                                  >
                                                    <label>Format Hint</label>
                                                    <div>
                                                      <input
                                                      placeholder="Format Hint"
                                                  className="entity-input"
                                                  value={ent?.format_hint}
                                                  onChange={(e) =>
                                                    handleEntityChange(
                                                      secIdx,
                                                      entIdx,
                                                      "format_hint",
                                                      e.target.value,
                                                    )
                                                  }
                                                />
                                                    </div>
                                                  </div>
                                                )}
                        
                                                <div
                                                  className={
                                                    ent?.format !== "table" ? "col-3" : "col-4"
                                                  }
                                                >
                                                  <label>RAG Technique</label>
                                                  <div>
                                                    <Select
                                                      styles={colourStyles}
                                                      options={ragOptions}
                                                      value={ragOptions?.filter(
                                                        (op) => op.value === ent?.rag_technique,
                                                      )}
                                                      onChange={(e) =>
                                                        handleEntityChange(
                                                          secIdx,
                                                          entIdx,
                                                          "rag_technique",
                                                          e.value,
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                                {ent?.format === "table" && (
                                                  <div
                                                    className={
                                                      ent?.format === "string" ? "col-3" : "col-4"
                                                    }
                                                  >
                                                    <label>Table Name</label>
                                                    <div>
                                                      <input
                                                        className="entity-input"
                                                        value={ent?.table_name}
                                                        onChange={(e) =>
                                                          handleEntityChange(
                                                            secIdx,
                                                            entIdx,
                                                            "table_name",
                                                            e.target.value,
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  </div>
                                                )}
                        
                                                <div
                                                    className={
                                                      "col-12" 
                                                    }
                                                  >
                                                    <label>Few Shots</label>
                                                    <div>
                                                      <FewShotSelect
                                                        key={`${secIdx}-${entIdx}`}
                                                        template={editTemplate}
                                                        setTemplate={setEditTemplate}
                                                        sectionIndex={secIdx}
                                                        entityIndex={entIdx}
                                                        optionsArray={ent?.few_shots}
                                                      />
                                                    </div>
                                                  </div>
                        
                                                  <div className="col-12 mt-3">
                                                  <label>Extraction Question</label>
                                                  <div>
                                                    <input
                                                      className="entity-input"
                                                      placeholder="Description"
                                                      value={ent?.question}
                                                      onChange={(e) =>
                                                        handleEntityChange(
                                                          secIdx,
                                                          entIdx,
                                                          "question",
                                                          e.target.value,
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </div>
                        
                                                {/* <div className="col-6">
                                              <label>Few-Shot Example</label>
                                              <div>
                                                <FewShotSelect
                                                  key={`${secIdx}-${entIdx}`}
                                                  template={template}
                                                  setTemplate={setTemplate}
                                                  sectionIndex={secIdx}
                                                  entityIndex={entIdx}
                                                  optionsArray={ent?.few_shots}
                                                />
                                              </div>
                                            </div> */}
                        
                                                {ent?.columns?.length > 0 &&
                                                  ent?.format === "table" &&
                                                  ent?.columns?.map((col, colIdx) => {
                                                    return (
                                                      <div className="row align-items-center">
                                                        <div className="Tabl-col-header">Table Name</div>
                                                        <div className="col-3">
                                                          <label>Column Name</label>
                                                          <div>
                                                            <input
                                                              className="entity-input"
                                                              value={col?.name}
                                                              onChange={(e) =>
                                                                handleTableChange(
                                                          secIdx,
                                                          entIdx,
                                                          colIdx,
                                                          "name",
                                                          e.target.value,
                                                        )
                                                              }
                                                            />
                                                          </div>
                                                        </div>
                        
                                                        
                                                        <div className="col-3">
                                                          <label>Format</label>
                                                          <Select
                                                      styles={colourStyles}
                                                      options={sqlFormatOptions}
                                                      value={sqlFormatOptions?.filter(
                                                        (op) => op.value === col?.format,
                                                      )}
                                                      onChange={(e) =>
                                                        handleTableChange(
                                                          secIdx,
                                                          entIdx,
                                                          colIdx,
                                                          "format",
                                                          e.value,
                                                        )
                                                      }
                                                    />
                                                        </div>
                                                        <div className="col-5">
                                                          <label>Format Hint</label>
                                                          <div>
                                                            <input
                                                              className="entity-input"
                                                              value={col?.format_hint}
                                                              onChange={(e) =>
                                                                handleTableChange(
                                                                  secIdx,
                                                                  entIdx,
                                                                  colIdx,
                                                                  "format_hint",
                                                                  e.target.value,
                                                                )
                                                              }
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="col-1">
                                                          <div>
                                                            <span
                                                              className="mx-2"
                                                              onClick={() =>
                                                                removeColumn(secIdx, entIdx, colIdx)
                                                              }
                                                            >
                                                              <Trash
                                                                size={18}
                                                                color="var(--text-secondary)"
                                                              />
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                        
                                                {ent?.columns?.length > 0 && (
                                                  <div>
                                                    <button
                                                      className="entity-add"
                                                      onClick={() => addTableColumns(secIdx, entIdx)}
                                                    >
                                                      <Plus size={18} /> Add Column
                                                    </button>
                                                  </div>
                                                )}
                        
                                                <div className="col-12 mt-3" >
                                                  <label>Additional Comments</label>
                                                  <div>
                                                    <input
                                                      className="entity-input"
                                                      placeholder="Additional Comments"
                                                      value={ent?.extra_content}
                                                      onChange={(e) =>
                                                        handleEntityChange(
                                                          secIdx,
                                                          entIdx,
                                                          "extra_content",
                                                          e.target.value,
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        <div>
                                          <button
                                            className="entity-add"
                                            onClick={() => handleNewEntity(secIdx)}
                                          >
                                            <Plus size={18} /> New Entity
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                        
                                  <div>
                                    <button className="entity-add" onClick={() => handleNewSection()}>
                                      <Plus size={18} /> New Section
                                    </button>
                                  </div>
                                </div>
                              </div>
                         : <>
                            <div className='val_temp_info_card'>
                        <div className='temp_info_container'>
                            <h3 className='temp_info_title'>Template Information</h3>
                            
                            <div className='temp_info_row'>
                                <span className='temp_info_label'>Template Name:</span>
                                <span className='temp_info_value'>{contractPreview?.name}</span>
                            </div>
                            
                            <div className='temp_info_row'>
                                <span className='temp_info_label'>Description:</span>
                                <span className='temp_info_value'>{contractPreview?.description}</span>
                            </div>
                            
                            <div className='temp_info_row'>
                                <span className='temp_info_label'>Template Type:</span>
                                <span className='temp_info_badge'>{contractPreview?.is_system ? "System Template" : "User Template"}</span>
                            </div>
                        </div>
                    </div>
                    <div className='validation-card-box'>
                        {contractPreview?.sections && contractPreview.sections.map((section, secIdx) => (
                            <div key={secIdx}>
                                {/* Section Header */}
                                <div className='section-header-title'>
                                    {section.section}
                                </div>
                                
                                {/* Section Entities */}
                                {section?.entities && section?.entities.map((entity, entIdx) => (
                                    <div key={entIdx} className='entity-detail-card'>
                                        {/* Entity Header */}
                                        <div className='entity-card-header'>
                                            <div className='entity-card-header-left'>
                                                <span className='entity-card-header-name'>{entity.display_key || entity.field_name}</span>
                                                {/* <span className='entity-card-header-tech-badge'>{entity.rag_technique || 'basic'}</span> */}
                                            </div>
                                            <div className='entity-card-header-actions'>
                                                {/* <span className='mx-2'><ArrowDown size={18}/></span>
                                                <span className='mx-2'><PlusSquare size={18}/></span> */}
                                                {/* <span className='mx-2'><Pencil size={18}/></span> */}
                                                {/* <span className='mx-2'><Trash2 size={18}/></span> */}
                                            </div>
                                        </div>
                                        
                                        {/* Entity Details */}
                                        <div className='entity-details-container'>
                                            <div className='entity-detail-row'>
                                                <span className='entity-detail-label'>Entity Name:</span>
                                                <span className='entity-detail-value'>{entity.field_name}</span>
                                            </div>
                                            <div className='entity-detail-row'>
                                                <span className='entity-detail-label'>Format:</span>
                                                <span className='entity-detail-value'>{entity.format}</span>
                                            </div>
                                            <div className='entity-detail-row'>
                                                <span className='entity-detail-label'>Format Hint:</span>
                                                <span className='entity-detail-value'>{entity.format_hint}</span>
                                            </div>
                                            <div className='entity-detail-row'>
                                                <span className='entity-detail-label'>RAG Technique:</span>
                                                <span className='entity-detail-value'>{entity.rag_technique}</span>
                                            </div>
                                            <div className='entity-detail-row'>
                                                <span className='entity-detail-label'>Extraction Question:</span>
                                                <span className='entity-detail-value'>{entity.question}</span>
                                            </div>
                                            <div className='entity-detail-row'>
                                                <span className='entity-detail-label'>Additional Comments:</span>
                                                <span className='entity-detail-value'>{entity.extra_content || 'Comments comes here...'}</span>
                                            </div>
                                            
                                            {/* Table Format Rendering */}
                                            {entity.format === 'table' && entity?.columns && (
                                                <div className='entity-table-wrapper'>
                                                    <div className='entity-table-title'>Table Name</div>
                                                    <div className='entity-table-container'>
                                                        <table className='entity-table'>
                                                            <thead>
                                                                <tr>
                                                                    {entity?.columns?.map((col, colIdx) => (
                                                                        <th key={colIdx}>
                                                                            {col.display_key}
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                               
                                                                   
                                                                        {entity?.effective_value.map((effV, effIdx) =>{ 
                                                                           return   <tr key={effIdx}>
                                                                                        <td>
                                                                                            {effV?.Tier}
                                                                                        </td>
                                                                                        <td>
                                                                                            {effV["Min Volume"]}
                                                                                        </td>
                                                                                        <td>
                                                                                            {effV["Max Volume"]}
                                                                                        </td>
                                                                                        <td>
                                                                                            {effV["Discount"]}
                                                                                        </td>
                                                                                        <td>
                                                                                            {effV["Fee"]}
                                                                                        </td>
                                                                                        <td>
                                                                                            {effV["Rebate"]}
                                                                                        </td>
                                                                            </tr>
                                                                       } )}
                                                                    
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {/* Extracted Value */}
                                            {entity.format !== 'table' && (
                                                <div className='entity-extracted-value-row'>
                                                    <span className='entity-extracted-value-label'>Extracted value:</span>
                                                    <span className='entity-extracted-value-badge'>
                                                        {entity?.effective_value || 'Not Found'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                        </>
                    }
                    
                </div>
                <div className='col-7 p-0'>
                    <div className='validation-pdf-box'>
                        <ViewAstInspector
                            data={viewAstJsonRight}
                            isPopup={false}
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