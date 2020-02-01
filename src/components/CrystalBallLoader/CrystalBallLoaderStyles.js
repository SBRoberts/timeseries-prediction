import styled from "styled-components";
import SVG from "react-inlinesvg";

export const CrystalBall = styled(SVG)`
  min-width: 50px;
  max-width: 5%;
  transform-origin: center;
  path {
    transform-origin: center;
  }
`;

export const LoaderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

export const LoadStateTextContainer = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  margin: 10px 0 0;
`;

export const LoadStateText = styled.h3`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 1rem;
  line-height: 1em;
  /* width: 100%; */
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 0.3s ease-out;
  margin: 0;
`;
