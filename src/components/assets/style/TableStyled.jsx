import styled from "styled-components";

export const TableStyled = styled.table`
  table-layout: fixed;
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
  vertical-align: middle;
  width: 250px;
  }

  & td {
  decoration: none;
  }

  & tbody tr:nth-child(even) {
  background-color: #FCFFEA;
  }

  & tbody tr:hover {
  background-color: #e0e0e0;
 }
`