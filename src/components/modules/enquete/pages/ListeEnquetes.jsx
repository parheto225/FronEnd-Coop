import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { EnqueteContext } from "../../../context";
import Content from "../../../Content";
import "../../../assets/style/SelectCampagne.css";
import "../../../assets/style/icon.css";
import {ButtonAdd, ButtonDownload} from "../../../assets/style/Buttons";
import { TableStyled } from "../../../assets/style/TableStyled";
import {IconAction} from "../../../assets/style/Icon";

import SelectCampagne from "../composants/SelectCampagne";
import TitrePage from "../composants/TitrePage";
import { Loader } from "../../../assets/style/Loader";
import ModalDetail from "../composants/ModalDetail";
import DetailEnquete from "../composants/DetailEnquete";

function ListeEnquetes() {
      const {enquetes, setEnquetes} = useContext(EnqueteContext);
      const [filteredEnquetes, setFilteredEnquetes] = useState([]);
      const [isDataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    setDataLoading(true);
    setFilteredEnquetes(enquetes);
    setDataLoading(false);
  }, [enquetes]);

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
            <div className="position-flex-end">
              <div className="col-5">
                  <SelectCampagne campagnes={enquetes.reduce((acc, curr) => {
                      if (curr.campagne && !acc.find(item => item.id === curr.campagne.id)) {
                          acc.push(curr.campagne);
                      }
                      return acc;
                  }, [])} onChange={handleSelectChange} />
              </div>
              <div className="col-4">
                <Link className="nav-link" to="/enquetes/new" data-bs-toggle="" aria-expanded="false">
                     <ButtonAdd > <i className="fas fa-plus icon-style"></i> <span>Ajouter une enquête</span></ButtonAdd>           
                </Link> 
              </div>
              <div className="col-3">
                  <ButtonDownload > <i className="fas fa-download icon-style2"></i><span> Exporter la liste</span></ButtonDownload>
              </div>
            </div>
        </div>
      <div>
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
            {isDataLoading ? (<Loader/>  ) : filteredEnquetes.length === 0 ? (
              <tbody><tr><td colSpan="5">Aucune enquête trouvée</td></tr></tbody>) : (
              <tbody>
              {filteredEnquetes && filteredEnquetes.map((enquete, idx) => (
                <tr key={enquete.id}>
                  <td>{enquete.identifiant}</td>
                  <td>{enquete.libelle}</td>
                  <td>{enquete.campagne.libelle}</td>
                  <td>{enquete.est_ouverte ? "Ouverte" : "Fermée"}</td>
                  <td >
                    <ModalDetail title={enquete.libelle}>
                      <DetailEnquete index={idx} enquete={enquete}/>
                    </ModalDetail>
                    {/* <Link to={`/enquetes/${enquete.id}`}><IconAction className="fa fa-eye icon-action-style"></IconAction></Link> */}
                    <Link to={`/enquetes/${enquete.identifiant}/questions`}><IconAction className="fa-solid fa-question"></IconAction></Link>
                    <Link to={`/enquetes/${enquete.identifiant}/reponses`}><IconAction className="fa-solid fa-comment"></IconAction></Link>
                  </td>
                </tr>
              ))}
            </tbody>
            )}
            
          </TableStyled>
        </div>
      </div>
    </Content>
  );
}
export default ListeEnquetes;

ListeEnquetes.propTypes = {
    enquetes: PropTypes.array,
    setEnquetes: PropTypes.func,
};
