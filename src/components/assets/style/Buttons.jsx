import styled from "styled-components";

export const ButtonAdd = styled.button`
  color: black;
  background-color: #CBD49A;
  border: none;
  border-radius: 100px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 10px;
  cursor: pointer;
  display: flex;

  &:hover {
    background-color: #94A91B;
     color: white;
  }

  & span {
  font-weight: bold;
  font-size: 16px;
  margin-top: 6px;
  margin-left: 8px;
  }
`;

export const ButtonDownload = styled.button`
  color: black;
  background-color: transparent;
  border: 1px solid #94A91B;
  border-radius: 100px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 10px;
  cursor: pointer;
  display: flex;

  &:hover {
    background-color: #94A91B;
     color: white;
  }

  & span {
  font-size: 16px;
  font-weight: bold;
  margin-top: 6px;
  margin-left: 8px;
  }
`;

export const ButtonSubmit = styled.button`
  color: black;
  background-color: transparent;
  border: 1px solid #94A91B;
  border-radius: 100px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 6px;
  margin-left: 8px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
  padding-right: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: #94A91B;
     color: white;
  }

`;

