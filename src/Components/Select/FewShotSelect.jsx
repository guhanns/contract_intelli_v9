import CreatableSelect from "react-select/creatable";

const colourStyles = {
  container: (styles) => ({
    ...styles,
    width: "100%",
    marginRight: "20px",
    fontSize: "16px",
    color: "var(--text)",
  }),
  control: (styles, { isFocused }) => ({
    ...styles,
    backgroundColor: "var(--select-option-bg-color)",
    cursor: "pointer",
    minHeight: "40px",
    borderRadius: "8px",
    borderColor: isFocused
      ? "var(--select-option-boder-focused)"
      : "var(--react-select-border-color)",
    boxShadow: "none",
    ":hover": {
      borderColor: "var(--select-option-border-onhover)",
    },
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "var(--bg-color-select-still)",
    border: "1px solid var(--select-document-type-border)",
    zIndex: 9999,
  }),
  option: (styles, { isFocused }) => ({
    ...styles,
    cursor: "pointer",
    backgroundColor: isFocused
      ? "var(--select-option-boder-focused)"
      : "var(--select-option-bg-color)",
    color: "var(--document-type-font-color)",
    ":hover": {
      backgroundColor: "var(--document-type-hover)",
    },
    fontSize: "14px",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "var(--placeholder-text)",
    fontSize: "14px",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "var(--text)",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "var(--text)",
    ":hover": {
      color: "var(--placeholder-text)",
    },
  }),
  multiValue: (styles) => ({
    ...styles,
    borderRadius: "6px",
    backgroundColor: "var(--select-option-bg-color)",
    border: "1px solid var(--react-select-border-color)",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    borderRadius: "6px 0 0 6px",
    color: "var(--text)",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    borderRadius: "0 6px 6px 0",
    ":hover": {
      backgroundColor: "var(--select-option-border-onhover)",
      color: "var(--text)",
    },
  }),
  input: (styles) => ({
    ...styles,

    color: "white", // or var(--text) or whatever ghostly shade you want
  }),
};

const FewShotSelect = ({
  template,
  setTemplate,
  sectionIndex,
  entityIndex,
  optionsArray = [],
  placeholder = "Add few shot examples..."
}) => {

  const options = optionsArray.map(item => ({
    label: item,
    value: item
  }));

  const value =
    template.sections?.[sectionIndex]?.entities?.[entityIndex]?.few_shots?.map(item => ({
      label: item,
      value: item
    })) || [];

  const handleChange = (selected) => {
    setTemplate(prev => {
      const updated = { ...prev };
      const entities = [...updated.sections[sectionIndex].entities];

      entities[entityIndex] = {
        ...entities[entityIndex],
        few_shots: (selected || []).map(opt => opt.value)
      };

      updated.sections[sectionIndex] = {
        ...updated.sections[sectionIndex],
        entities
      };

      return updated;
    });
  };

  const handleCreate = (inputValue) => {
    const clean = inputValue.trim();
    if (!clean) return;

    setTemplate(prev => {
      const updated = { ...prev };
      const entities = [...updated.sections[sectionIndex].entities];

      const existing =
        entities[entityIndex].few_shots || [];

      entities[entityIndex] = {
        ...entities[entityIndex],
        few_shots: [...existing, clean]
      };

      updated.sections[sectionIndex] = {
        ...updated.sections[sectionIndex],
        entities
      };

      return updated;
    });
  };

  return (
    <CreatableSelect
      styles={colourStyles}
      isMulti
      options={options}
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      onCreateOption={handleCreate}
    />
  );
};

export default FewShotSelect;