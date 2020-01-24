import React from "react";

export const DropdownOption = ({ value, label }) => (
  <option value={value}>{label}</option>
);

const DropdownList = ({ options, selectOption, datalistId }) => {
  return (
    <datalist id={datalistId}>
      {options.length &&
        options.map((option, index) => (
          <DropdownOption
            value={option.symbol}
            key={`option-${index}`}
            label={option.name}
          />
        ))}
    </datalist>
  );
};

export default DropdownList;
