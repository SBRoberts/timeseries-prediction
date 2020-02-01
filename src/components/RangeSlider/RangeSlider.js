import React, { useState } from "react";

import EyeSvg from "../../assets/witness.svg";

// Styles
import {
  Range,
  RangeLabel,
  SliderContainer,
  Knob,
  SliderWrapper
} from "./RangeSliderStyles";

const RangeSlider = ({ options, emitCurrentOption }) => {
  const [currentValue, setCurrentValue] = useState("0");
  const rangeLabels = Object.values(options);
  const rangeValues = Object.keys(options);
  const rangeMax = rangeLabels.length - 1;
  emitCurrentOption(rangeValues[currentValue]);

  const changeHandler = e => {
    const { value } = e.target;
    setCurrentValue(value);
    emitCurrentOption(rangeValues[value]);
  };

  return (
    <SliderWrapper>
      <RangeLabel htmlFor="range">
        Range: {rangeLabels[currentValue]}
      </RangeLabel>
      <SliderContainer>
        <Range
          max={rangeMax}
          name="range"
          type="range"
          onChange={changeHandler}
          value={currentValue}
          list="rangeList"
        />
        <Knob src={EyeSvg} currentValue={currentValue} max={rangeMax} />
      </SliderContainer>
    </SliderWrapper>
  );
};

export default RangeSlider;
