import React, { useEffect, useState } from "react";
import Layouts from "../Layouts/Layouts";
import "./newEntity.css";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  ClosedCaption,
  Cross,
  Download,
  FileDown,
  FolderClosed,
  MoveDown,
  PanelTopCloseIcon,
  Plus,
  PlusSquare,
  Save,
  Trash,
  Trash2Icon,
  Upload,
  X,
} from "lucide-react";
import Select from "react-select";
import { colourStyles } from "../ContractList/ContractListNew";
import { CloseButton, Modal, ModalBody } from "reactstrap";
import { useLocation, useNavigate } from "react-router-dom";
import stepper1 from "../../../images/sidebar_icons/stepper1.svg";
import TagSelect from "../../Select/TagSelect";
import FewShotSelect from "../../Select/FewShotSelect";
import request from "../../../api/api";
import toast from "react-hot-toast";
import requestL from "../../../api/lexi";

export const sqlFormatOptions = [
  { label: "String", value: "string" },
  { label: "Table", value: "table" },
  { label: "Date", value: "date" },
  { label: "Percentage", value: "percentage" },
  { label: "Currency", value: "currency" },
  { label: "Boolean", value: "boolean" },
  { label: "Number", value: "number" },
];

export const ragOptions = [
  { label: "Basic", value: "basic" },
  { label: "HyDE", value: "hyde" },
  { label: "Subquestion", value: "subquestion" },
  { label: "Recursive", value: "recursive" },
  { label: "Automerge", value: "automerge" },
  { label: "Raptor", value: "raptor" },
  { label: "Fusion", value: "fusion" },
  { label: "Keyword", value: "keyword" },
];

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

function NewEntityTemplate() {
  const navigate = useNavigate();
  const [isupload, setIsupload] = useState(false);
  const location = useLocation();

  const [template, setTemplate] = useState({
    name: "",
    description: "",
    sections: [
      {
        sectionName: "",
        entities: [
          {
            field_name: "",
            display_key: "",
            format: "",
            question: "",
            rag_technique: "",
            extra_content: "",
            few_shots: [],
          },
        ],
      },
    ],
  });
  const [entities, setEntities] = useState([
    {
      entity_name: "",
      description: "",
      few_shot_example: "",
      rag_tech: "",
      addition_content: "",
    },
  ]);

  const handleNewEntity = (secIdx) => {
    setTemplate((prev) => ({
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
    setTemplate((prev) => ({
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

  const handleRemoveSection = (secIdx) => {
    setTemplate((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== secIdx),
    }));
  };

  const handleRemoveEntity = (secIdx, entityIdx) => {
    setTemplate((prev) => ({
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

  const handleSectionChange = (secIdx, key, value) => {
    setTemplate((prev) => ({
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

  const handleEntityChange = (secIdx, entityIdx, key, value) => {
    setTemplate((prev) => ({
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
  setTemplate(prev => ({
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

  const buildPayload = (templateData) => {
    const { name, description, sections } = templateData;

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
        columns:entity?.columns
      })),
    );

    return {
      name,
      description,
      fields,
    };
  };

  const handleEditTemplateSave = () => {
    console.log(template);
    const payload = buildPayload(template);
    const validationErrors = validateTemplate(template);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("All fiels required");
      return;
    }

    requestL({
      url: `/templates/${template?.template_id}`,
      method: "PUT",
      data: payload,
    }).then((res) => {
      toast.success("Template Saved Successfully")
      navigate('/entity-extraction')
    });
  };

  const handleSaveTemplate = () => {
    const payload = buildPayload(template);

    const validationErrors = validateTemplate(template);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("All fiels required");
      return;
    }

    console.log(payload);

    requestL({
      url: "/templates",
      method: "POST",
      data: payload,
    }).then((res) => {
      console.log(res);
      navigate("/entity-extraction/test", {
        state: {
          template: payload,
          template_id:template?.template_id ?? null
        },
      });
    });
  };

  const handleSaveAndContinue = () => {
    console.log(template)
    const payload = buildPayload(template);

    const validationErrors = validateTemplate(template);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("All fiels required");
      return;
    }

    console.log(payload);
    navigate("/entity-extraction/test", {
      state: {
        template: payload,
      },
    });

    // requestL({
    //   url: "/templates",
    //   method: "POST",
    //   data: payload
    // }).then((res)=>{
    //       console.log(res)
    // })
    // navigate('/entity-extraction/test')
  };

  const mapResponseToTemplateState = (response) => {
    const sectionMap = {};

    response.fields.forEach((field) => {
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

  const getTemplateData = () => {
    requestL({
      url: `/templates/${location?.state?.tempId}`,
      method: "GET",
    })
      .then((res) => {
        setTemplate(mapResponseToTemplateState(res));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (location?.state?.tempId) {
      getTemplateData();
    }
  }, [location?.state?.tempId]);

  console.log(template);

  const addTableColumns = (secIdx, entIdx) => {
    console.log(secIdx, entIdx);
    let temp = { ...template };
    temp?.sections[secIdx]?.entities[entIdx]?.columns?.push({
      name: "",
      display_key: "",
      format: "",
      format_hint: "",
    });
    setTemplate({ ...temp });
  };

  const removeColumn = (secIdx, entIdx, colIdx) => {
    let temp = { ...template };

    temp.sections[secIdx]?.entities[entIdx]?.columns?.splice(colIdx, 1);
    setTemplate({ ...temp });
  };

  console.log(template);

  return (
    <Layouts>
      <div className="container-fluid position-relative">
        <div className="entity-nav">
          <div className="entity-head">
            New Entity Template- Define Template
          </div>
          <div className="right-entity">
            <div className="stepper-width-adjust">
              <img src={stepper1} />
            </div>
            <div className="entity-clear">Clear All</div>
            <div
              className="entity-clear"
              onClick={() => {
                template?.template_id
                  ? handleEditTemplateSave()
                  : handleSaveTemplate();
              }}
            >
              {" "}
              <Save style={{ marginRight: "8px" }} />
              Save Template
            </div>
            <div
              className="entity-save"
              onClick={() => handleSaveAndContinue()}
            >
              Test Template<ChevronRight />
            </div>
          </div>
        </div>
      </div>
      <div className="entity-main" >
        <h4>Template Information</h4>
        <div className="row my-3">
          <div className="col-4">
            <label>Template Name</label>
            <div>
              <input
                className="entity-input"
                placeholder="Template Information"
                value={template?.name}
                onChange={(e) =>
                  setTemplate({
                    ...template,
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
                value={template?.description}
                onChange={(e) =>
                  setTemplate({
                    ...template,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="entity-fields">
          <h4>Define Entity fields</h4>

          {template?.sections?.map((sec, secIdx) => {
            return (
              <div className="entity-box" key={secIdx}>
                <div className="box-info">
                  <div>Section {secIdx + 1}</div>
                  <div>
                    <span className="mx-2">
                      <ArrowUp size={18} />
                    </span>
                    <span className="mx-2">
                      <ArrowDown size={18} />
                    </span>
                    <span className="mx-2">
                      <PlusSquare size={18} />
                    </span>
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
                                template={template}
                                setTemplate={setTemplate}
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
      <Modal
        isOpen={isupload}
        centered
        size="md"
        fade={true}
        backdrop={true}
        zIndex={4000}
        style={{
          padding: "34px",
        }}
      >
        <div className="modal-mark-with">
          <div className="upload-bg">
            <Upload size={17} />
          </div>
          <X onClick={() => setIsupload(false)} />
        </div>
        <ModalBody>
          <div className="modal-comments-modal">
            <label>upload Sample Documents</label>
            <div>
              Test your entity template against a real document to ensure
              accurate extraction.
            </div>
          </div>

          <div class="modal-actions px-0 py-3">
            <button
              class="save-btn m-0"
              onClick={() => navigate("/entity-extraction/validation")}
            >
              Upload a Sample PDF
            </button>
          </div>
        </ModalBody>
      </Modal>
    </Layouts>
  );
}

export default NewEntityTemplate;
