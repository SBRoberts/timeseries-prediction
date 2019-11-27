import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface Props {
  options: {
    [key: string]: string;
  };
  emitCurrentOption: Function;
}

const Range = styled.input.attrs(props => ({
  type: "range",
  min: 0,
  max: props.max || 100,
  step: props.step || 1,
  height: "30px"
}))`
  background: peachpuff;
  height: 30px;
  -webkit-appearance: none;

  &:focus {
    outline: none;
  }

  /* Track Styles */
  &::-ms-track {
    width: 100%;
    /* height: props.height; */
    cursor: pointer;

    /* Hides the slider so custom styles can be added */
    background: transparent;
    border-color: transparent;
  }

  /* Knob Styles */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: tomato;
    cursor: pointer;
  }
`;

const RangeLabel = styled.label`
  display: block;
`;

const RangeSlider = ({ options, emitCurrentOption }: Props) => {
  const [currentValue, setCurrentValue] = useState(0);
  const rangeMax = Object.keys(options).length - 1;
  const rangeLabels = Object.keys(options);
  const rangeValues = Object.values(options);

  useEffect(() => {
    emitCurrentOption(rangeValues[currentValue]);
  }, [currentValue]);

  const changeHandler = e => {
    const { value } = e.target;
    setCurrentValue(value);
  };

  return (
    <>
      <RangeLabel htmlFor="range">
        Range: {rangeLabels[currentValue]}
      </RangeLabel>
      <Range
        onChange={changeHandler}
        max={rangeMax}
        name="range"
        value={currentValue}
        list="rangeList"
      />
    </>
  );
};

export default RangeSlider;
