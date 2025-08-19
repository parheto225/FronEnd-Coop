import styled from "styled-components";

export const TableStyled = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: Inter;
  margin-top: 20px;
  background-color: #FCFFEA;

  & thead {
  background-color: #FCFFEA;
  color: black;
  }

  & tbody {
  background-color: #fff;
  }

  & th,
  & td {
  padding: 10px;
  text-align: center;
  }

  & tbody tr:nth-child(even) {
  background-color: #FCFFEA;
  }

  & tbody tr:hover {
  background-color: #e0e0e0;
 }
`