import { useState } from "react";
import CompositionParcellaire from "./CompositionParcellaire";

export default function PopupParcelle({ feature }) {
const [isShowCompositionParcellaire, setIsShowCompositionParcellaire] = useState(false);

  const name = feature.properties.NOM || feature.properties.Nom || "Inconnu";
  const sup = feature.properties.SUPERFICIE ?? "";
  return (
    <div style={{ maxWidth: 500 }}>
      <div>📌 <b>NUMERO_ID:</b> {feature.properties.NUMERO_ID_}</div>
      <div>🧾 <b>Code:</b> {feature.properties.CODE}</div>
      <div>🧑‍🌾 <b>Nom:</b> {name}</div>
      <div>📞 <b>Contact:</b> {feature.properties.NUM_TEL}</div>
      <div>📐 <b>Superficie:</b> {String(sup).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Ha</div>
      <div>🗓️ <b>Année Création:</b> {feature.properties.ANNEE_NAIS}</div>
      <button style={{textDecoration:"none", background:"none", border:"none", color:"blue", cursor:"pointer", padding:0}} onClick={()=>setIsShowCompositionParcellaire(!isShowCompositionParcellaire)}>{isShowCompositionParcellaire ? "Cacher la composition de la parcelle" : "Afficher la composition de la parcelle"}</button>
     {isShowCompositionParcellaire && <CompositionParcellaire/>}
    </div>
  );
}