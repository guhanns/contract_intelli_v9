import CreatableSelect from "react-select/creatable";

const TagSelect = ({
  state,
  setState,
  stateKey,
  optionsArray = [],
  placeholder = "Add items..."
}) => {
  const options = optionsArray.map(item => ({
    label: item,
    value: item
  }));

  const valueArray = state[stateKey] || [];

  const value = valueArray.map(item => ({
    label: item,
    value: item
  }));

  const handleChange = (selected) => {
    setState(prev => ({
      ...prev,
      [stateKey]: (selected || []).map(opt => opt.value)
    }));
  };

  const handleCreate = (inputValue) => {
    const clean = inputValue.trim();
    if (!clean) return;

    setState(prev => ({
      ...prev,
      [stateKey]: [...(prev[stateKey] || []), clean]
    }));
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

export default TagSelect;
