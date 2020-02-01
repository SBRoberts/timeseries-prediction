import styled from "styled-components";

export const StyledTextInput = styled.input.attrs(props => ({
  ref: props.ref,
  type: "text",
  list: props.list,
  placeholder: "Predict future stock prices for...",
  onChange: props.onChange,
  value: props.value
}))`
  width: 100%;
  border: none;
  border-bottom: 2px solid black;
  font-size: 20px;
`;

export const SearchContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const SearchForm = styled.form.attrs(props => ({
  onSubmit: props.onSubmit
}))`
  display: flex;
  flex-basis: 0;
  background: #000;
  flex-grow: 2;
`;
