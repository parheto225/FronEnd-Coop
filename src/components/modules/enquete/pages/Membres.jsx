import axios from "axios";
import { secondBaseUrl } from "../../../config/baseUrl";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
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

function ListeMembres() {
  const [membres, setMembres] = useState([]);
  const [filteredMembres, setFilteredMembres] = useState([]);
  const [isDataLoading, setDataLoading] = useState(false);
  const [formMembre, setFormMembre] = useState({});
  const [membreToEdit, setMembreToEdit] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    setDataLoading(true);
    setFilteredMembres(membres);
    setDataLoading(false);
  }, [membres]);

  function handleSelectChange(event) {
    const selectedCampagneId = parseInt(event.target.value);
    const filtered = selectedCampagneId === 0 ? membres : membres.filter(membre => {
      return membre.campagne.id === selectedCampagneId;
    });
    setFilteredMembres(filtered);
  }

  function openEditModal(membre) {
    setFormMembre(membre);
    setMembreToEdit(membre);
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setMembreToEdit(null);
    setFormMembre({});
  }

  function openDeleteModal(membre) {
    setDeleteModalOpen(true);
    setMembreToEdit(membre);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setMembreToEdit(null);
  }

  async function handleUpdateMembre(membreId) {
    try {
      const resultat = await axios.patch(`${secondBaseUrl}/enquete/update/?id_enquete=${membreId}`, formMembre);
      if (resultat.data.result) {
        setMembres(membres.map((m) => (m.id === membreId ? { ...m, ...formMembre } : m)));
      } else {
        console.error('Update failed:', resultat.data.message);
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    if (name === "est_ouverte") {
      setFormMembre((prev) => ({ ...prev, [name]: event.target.checked }));
    } else {
      setFormMembre((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleDeleteMembre(membreId) {
    try {
      const resultat = await axios.delete(`${secondBaseUrl}/enquete/delete/?id_enquete=${membreId}`);
      if (resultat.data.result) {
        setMembres(membres.filter((m) => m.id !== membreId));
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  return (
    <Content>
      <div className="row col-12">
        <TitrePage title="Liste des membres" />
        <div className="row">
          <div className="col-5 centered"></div>
          <div className="col-4 centered">
            <SelectCampagne
              campagnes={membres.reduce((acc, curr) => {
                if (curr.campagne && !acc.find(item => item.id === curr.campagne.id)) {
                  acc.push(curr.campagne);
                }
                return acc;
              }, [])}
              onChange={handleSelectChange}
            />
          </div>
          <div className="col-3 centered">
            <Link className="nav-link" to="/membres/new" data-bs-toggle="" aria-expanded="false">
              <ButtonAdd>
                <i className="fas fa-plus icon-style"></i>
                <span>Ajouter un membre</span>
              </ButtonAdd>
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="table-responsive">
          <TableStyled className="table">
            <thead>
              <tr>
                <th>Identifiant</th>
                <th>Nom</th>
                <th>Campagne</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            {isDataLoading ? (
              <tbody>
                <tr>
                  <td colSpan="5">
                    <div className="centered"><Loader /></div>
                  </td>
                </tr>
              </tbody>
            ) : filteredMembres.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan="5">Aucun membre trouvé</td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {filteredMembres && filteredMembres.map((membre, idx) => (
                  <tr key={membre.id}>
                    <td>{membre.identifiant}</td>
                    <td>{membre.nom}</td>
                    <td>{membre.campagne.libelle}</td>
                    <td>
                      <span className={`badge ${membre.est_ouverte ? "bg-success" : "bg-danger"}`}>
                        {membre.est_ouverte ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td>
                      <ButtonSimple onClick={() => openEditModal(membre)} data-bs-toggle="tooltip" title="Modifier le membre">
                        <IconAction className="fa-solid fa-pencil" color={Colors.primary} />
                      </ButtonSimple>
                      <ButtonSimple onClick={() => openDeleteModal(membre)} data-bs-toggle="tooltip" title="Supprimer le membre">
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
      {isEditModalOpen && membreToEdit && (
        <ModalDelete
          title="Modifier le membre"
          show={isEditModalOpen}
          onConfirm={() => { handleUpdateMembre(membreToEdit.id); }}
          onClose={closeEditModal}
        >
          <div className="row col-12">
            <div className="col-12">
              <TextField
                label="Nom du membre"
                name="nom"
                value={formMembre?.nom}
                onChange={handleFormChange}
              />
            </div>
            <div className="col-6">
              <TextField
                label="Identifiant"
                disabled={true}
                value={formMembre?.identifiant}
              />
            </div>
            <div className="col-6">
              <TextField
                label="Campagne"
                disabled={true}
                value={formMembre?.campagne?.libelle}
              />
            </div>
            <div className="col-6">
              <div className="mb-3">
                <label className="form-label">Statut :</label>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" name="est_ouverte" checked={formMembre.est_ouverte} onChange={handleFormChange} id={`flexSwitchCheckChecked-${formMembre.id}`} />
                  <label className="form-check-label" htmlFor={`flexSwitchCheckChecked-${formMembre.id}`}>{formMembre.est_ouverte ? "Actif" : "Inactif"}</label>
                </div>
              </div>
            </div>
          </div>
        </ModalDelete>
      )}

      {isDeleteModalOpen && membreToEdit && (
        <ModalDelete title="Supprimer le membre" show={isDeleteModalOpen} onConfirm={() => handleDeleteMembre(membreToEdit.id)} onClose={closeDeleteModal}>
          <div style={{ textAlign: 'center' }}>
            <p>Êtes-vous sûr de vouloir supprimer ce membre ?</p>
            <q style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{membreToEdit.nom}</q>
          </div>
        </ModalDelete>
      )}
    </Content>
  );
}
export default ListeMembres;

ListeMembres.propTypes = {
  membres: PropTypes.array,
  setMembres: PropTypes.func,
};
