import styled from "styled-components";

export const IconAction = styled.i`
 font-weight: bold;
  color: ${props => props.color || "#94A91B"};
  cursor: pointer;
  transition: color 0.3s ease;
  margin: 0 5px;
`;