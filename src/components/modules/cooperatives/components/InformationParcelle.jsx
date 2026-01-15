import { useState, useContext } from "react";
import { OCSContext } from "../../../context";

 function PopupParcelle({ children }) {
 

  return (
    <div style={{ maxWidth: 500 }}>
      {children}
    </div>
  );
} export default PopupParcelle;