import styled from "styled-components";
import SVG from "react-inlinesvg";

export const Range = styled.input.attrs(props => ({
  min: 0,
  max: props.max || 100,
  step: props.step || 1
}))`
  background: white;
  height: 30px;
  width: 100%;
  margin: 0;
  border-bottom: 2px solid black;
  border-left: 2px solid black;
  -webkit-appearance: none;

  &:focus {
    outline: none;
  }

  /* Track Styles */
  &::-ms-track {
    width: 100%;
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

    cursor: pointer;
    transition: all 0.2s ease-out;
  }
`;

export const RangeLabel = styled.label`
  display: block;
  width: 100%;
`;

export const SliderContainer = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
`;

export const Knob = styled(SVG).attrs(props => {
  currentValue: props.currentValue;
})`
  position: absolute;
  left: ${props => `calc(${props.currentValue / props.max} * 100%)`};
  right: ${props => `calc(100% - (${props.currentValue / props.max} * 100%))`};
  transition: left 0.3s ease-out, right 0.3s ease-out, transform 0.3s ease-out;
  pointer-events: none;
  transform: ${props =>
    `translate(calc(${props.currentValue / props.max} * -100%), -50%)`};
  top: 50%;
  width: 30px;
  box-sizing: border-box;
  padding: 0 5px;
`;

export const SliderWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-basis: 0;
  flex-grow: 1;
  align-self: flex-end;
`;
