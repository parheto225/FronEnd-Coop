import { useEffect, useState } from "react";
import Content from "../../../Content";
import axios from "axios";
import { secondBaseUrl } from "../../../config/baseUrl";
import "../../../assets/style/SelectCamapgne.css";
import "../../../assets/style/icon.css";
import {ButtonAdd, ButtonDownload} from "../../../assets/style/Buttons";
import { TableStyled } from "../../../assets/style/TableStyled";

import SelectCampagne from "../composants/SelectCampagne";
import TitrePage from "../composants/TitrePage";

function ListeEnquetes() {
      const [enquetes, setEnquetes] = useState([]);
      const [filteredEnquetes, setFilteredEnquetes] = useState([]);

  useEffect(() => {
    try {
      fetchEnquetes();
    } catch (error) {
      console.log("Error fetching enquetes:", error);
    }
  }, []);


  async function fetchEnquetes(){
  const resp  = await axios.get(`${secondBaseUrl}/enquete/get_enquetes/?technicien_tel=0767623025`);
  const  listeEnq  = resp.data;
  setEnquetes(listeEnq.data);
  setFilteredEnquetes(listeEnq.data);
};

function handleSelectChange(event) {
    const selectedCampagneId = parseInt(event.target.value);
    const filtered = selectedCampagneId === 0 ? enquetes : enquetes.filter(enquete => {
        return enquete.campagne.id === selectedCampagneId;
    });
    setFilteredEnquetes(filtered);
}

  return (
    <Content>
        <div className="row col-12">
            <TitrePage title="Liste des Enquêtes" />
            <div className="col-5">
                <SelectCampagne campagnes={enquetes.reduce((acc, curr) => {
                    if (curr.campagne && !acc.find(item => item.id === curr.campagne.id)) {
                        acc.push(curr.campagne);
                    }
                    return acc;
                }, [])} onChange={handleSelectChange} />
            </div>
            <div className="col-4">
                <ButtonAdd > <i className="fas fa-plus icon-style"></i> <span>Ajouter une enquête</span></ButtonAdd>
            </div>
            <div className="col-3">
                <ButtonDownload > <i className="fas fa-download icon-style2"></i><span> Exporter la liste</span></ButtonDownload>
            </div>
        </div>
      <div>
        {/* <h1>Liste des Enquêtes</h1> */}
        <div className="table-responsive">
          <TableStyled className="table">
            <thead>
              <tr>
                <th>Identifiant</th>
                <th>Intitulé</th>
                <th>Campagne</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnquetes && filteredEnquetes.map((enquete, idx) => (
                <tr key={enquete.id}>
                  <td>{enquete.identifiant}</td>
                  <td>{enquete.libelle}</td>
                  <td>{enquete.campagne.libelle}</td>
                  <td>{enquete.est_ouverte ? "Ouverte" : "Fermée"}</td>
                  <td>
                    <button className="btn btn-success btn-sm">Voir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableStyled>
        </div>
      </div>
    </Content>
  );
}
export default ListeEnquetes;