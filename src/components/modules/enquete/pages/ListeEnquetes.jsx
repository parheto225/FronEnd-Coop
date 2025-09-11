import axios from "axios";
import { secondBaseUrl } from "../../../config/baseUrl";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { EnqueteContext } from "../../../context";
import Content from "../../../Content";
import "../../../assets/style/SelectCampagne.css";
import "../../../assets/style/icon.css";
import {ButtonAdd} from "../../../assets/style/Buttons";
import { TableStyled } from "../../../assets/style/TableStyled";
import {IconAction} from "../../../assets/style/Icon";

import SelectCampagne from "../composants/SelectCampagne";
import TitrePage from "../composants/TitrePage";
import { Loader } from "../../../assets/style/Loader";
import ModalDelete from "../composants/ModalDelete";
import TextField from "../composants/formulaire/TextField";
import Colors from '../../../../utils/colors';
import { ButtonSimple } from '../../../assets/style/Buttons';

function ListeEnquetes() {
      const {enquetes, setEnquetes} = useContext(EnqueteContext);
      const [filteredEnquetes, setFilteredEnquetes] = useState([]);
      const [isDataLoading, setDataLoading] = useState(false);
      const [formEnquete, setFormEnquete] = useState({});
      const [enqueteToEdit, setEnqueteToEdit] = useState(null);
      const [isEditModalOpen, setEditModalOpen] = useState(false);
      const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

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

    function openEditModal(enquete) {
   setFormEnquete(enquete);
   setEnqueteToEdit(enquete);
   setEditModalOpen(true);
}

function closeEditModal() {
  setEditModalOpen(false);
  setEnqueteToEdit(null);
  setFormEnquete({});
}

  function openDeleteModal(enquete) {
    setDeleteModalOpen(true);
   setEnqueteToEdit(enquete);
}

function closeDeleteModal() {
  setDeleteModalOpen(false);
  setEnqueteToEdit(null);
}


  async function handleUpdateEnquete(enqueteId) {
    // console.log('Updated question data:', formQuestion);
    //  setEnquetes(enquetes.map((q) => (q.id === enqueteId ? { ...q, ...formEnquete } : q)));
    try {
         const resultat  = await axios.patch(`${secondBaseUrl}/enquete/update/?id_enquete=${enqueteId}`, formEnquete);
        if(resultat.data.result){
               setEnquetes(enquetes.map((q) => (q.id === enqueteId ? { ...q, ...formEnquete } : q)));
        }else{
          console.error('Update failed:', resultat.data.message);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    if(name === "est_ouverte") {
      setFormEnquete((prev) => ({ ...prev, [name]: event.target.checked }));
    } else{
       setFormEnquete((prev) => ({ ...prev, [name]: value }));
    }
   
  }

    async function handleDeleteEnquete(enqueteId) {
    try {
         const resultat  = await axios.delete(`${secondBaseUrl}/enquete/delete/?id_enquete=${enqueteId}`);
        if(resultat.data.result){
           setEnquetes(enquetes.filter((e) => e.id !== enqueteId));
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
   
  }

  return (
    <Content>
        <div className="row col-12">
            <TitrePage title="Liste des Enquêtes" />
            <div className="row">
              <div className="col-5 centered">
                 
              </div>
              <div className="col-4 centered">
                  <SelectCampagne campagnes={enquetes.reduce((acc, curr) => {
                      if (curr.campagne && !acc.find(item => item.id === curr.campagne.id)) {
                          acc.push(curr.campagne);
                      }
                      return acc;
                  }, [])} onChange={handleSelectChange} />
              </div>
              <div className="col-3 centered">
                <Link className="nav-link" to="/enquetes/new" data-bs-toggle="" aria-expanded="false">
                     <ButtonAdd > <i className="fas fa-plus icon-style"></i> <span>Ajouter une enquête</span></ButtonAdd>           
                </Link>
                  {/* <ButtonDownload > <i className="fas fa-download icon-style2"></i><span> Exporter la liste</span></ButtonDownload> */}
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
            {isDataLoading ? (<tbody><tr><td colSpan="5"><div className="centered"><Loader/></div></td></tr></tbody>) : filteredEnquetes.length === 0 ? (
              <tbody><tr><td colSpan="5">Aucune enquête trouvée</td></tr></tbody>) : (
              <tbody>
              {filteredEnquetes && filteredEnquetes.map((enquete, idx) => (
                <tr key={enquete.id}>
                  <td>{enquete.identifiant}</td>
                  <td>{enquete.libelle}</td>
                  <td>{enquete.campagne.libelle}</td>
                  <td> <span className={`badge ${enquete.est_ouverte ? "bg-success" : "bg-danger"}`}>
                      {enquete.est_ouverte ? "Ouverte" : "Fermée"}
                    </span></td>
                  <td >
                    <ButtonSimple onClick={() => openEditModal(enquete)} data-bs-toggle="tooltip" title="Modifier l'enquête">
                       <IconAction className="fa-solid fa-pencil" color={Colors.primary} />
                     </ButtonSimple>
                    {/* <Link to={`/enquetes/${enquete.id}`}><IconAction className="fa fa-eye icon-action-style"></IconAction></Link> */}
                    <Link to={`/enquetes/${enquete.identifiant}/questions`}  data-bs-toggle="tooltip" title="Modifier les questions"><IconAction className="fa-solid fa-question"></IconAction></Link>
                    <Link to={`/enquetes/${enquete.identifiant}/reponses`} data-bs-toggle="tooltip" title="Modifier les réponses"><IconAction className="fa-solid fa-comment"></IconAction></Link>
                    <ButtonSimple onClick={() =>openDeleteModal(enquete)} data-bs-toggle="tooltip" title="Supprimer l'enquête">
                        <IconAction className="fa-solid fa-trash" color={Colors.red} />
                      </ButtonSimple>
                  </td>
                </tr>
              ))}
            </tbody>
            )}
            
          </TableStyled>
        </div>
      </div>
       {isEditModalOpen && enqueteToEdit && (
        <ModalDelete
          title="Modifier l'enquête"
          show={isEditModalOpen}
          onConfirm={() => { handleUpdateEnquete(enqueteToEdit.id);}}
          onClose={closeEditModal}
        >
          <div className="row col-12">
                    <div className="col-12">
                     <TextField 
                        label="Intitulé de l'enquête"
                        name="libelle"
                        value={formEnquete?.libelle}
                        onChange={handleFormChange}
                    />
                   </div>
                   <div className="col-6">
                    <TextField
                        label="Identifiant"
                        desabled={true}
                        value={formEnquete?.identifiant}
                    />
                   </div>
                   
                   <div className="col-6">
                    <TextField
                        label="Campagne"
                        desabled={true}
                        value={formEnquete?.campagne.libelle}
                    />
                   </div>
                   <div className="col-6">
                     <TextField
                        label="Type d'enquête"
                        desabled={true}
                        value={formEnquete?.type_enquete?.libelle || ""}
                       
                    />
                   </div>
                   <div className="col-6">
                     <TextField
                        label="Projet"
                        desabled={true}
                        value={formEnquete?.projet?.nomProjet || ""}
                       
                    />
                   </div> 
                    <div className="col-6">
                     <div className="mb-3">
                      <label className="form-label">Cette enquête est :</label>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" name="est_ouverte" checked={formEnquete.est_ouverte} onChange={handleFormChange} id={`flexSwitchCheckChecked-${formEnquete.id}`} />
                        <label className="form-check-label" htmlFor={`flexSwitchCheckChecked-${formEnquete.id}`}>{formEnquete.est_ouverte ? "Ouverte" : "Fermée"}</label>
                      </div>
                    </div>
                   </div>
                   <div className="col-6">
                     <TextField
                        label="Créée par"
                        desabled={true}
                        value={formEnquete?.created_by?.nom + " "+formEnquete?.created_by?.prenom}
                       
                    />
                   </div> 
            </div>
        </ModalDelete>
      )}

      {isDeleteModalOpen && enqueteToEdit && (
                          <ModalDelete title="Supprimer l'enquête" show={isDeleteModalOpen} onConfirm={() => handleDeleteEnquete(enqueteToEdit.id)} onClose={closeDeleteModal}>
                            <div  style={{ textAlign: 'center' }}>
                              <p>Êtes-vous sûr de vouloir supprimer cette enquête ?</p>
                            <q style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{enqueteToEdit.libelle}</q>
                            </div>
                          </ModalDelete>
                        )}
    </Content>
  );
}
export default ListeEnquetes;

ListeEnquetes.propTypes = {
    enquetes: PropTypes.array,
    setEnquetes: PropTypes.func,
};
