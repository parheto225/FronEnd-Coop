import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { secondBaseUrl } from "../../../config/baseUrl";
import PropTypes from "prop-types";
import { useContext } from "react";
import { EnqueteContext } from "../../../context";
import Content from "../../../Content";
import "../../../assets/style/SelectCampagne.css";
import "../../../assets/style/icon.css";
import {ButtonAdd, ButtonDownload} from "../../../assets/style/Buttons";
import { TableStyled } from "../../../assets/style/TableStyled";
import TitrePage from "../composants/TitrePage";
import { Loader } from "../../../assets/style/Loader";
import ModalDelete from "../composants/ModalDelete";
import TextField from "../composants/formulaire/TextField";
import {IconAction} from "../../../assets/style/Icon";
import { ButtonSimple } from '../../../assets/style/Buttons';
import Colors from '../../../../utils/colors';
import {listToString, stringToList} from "../../../../utils/stringHandling.jsx";
import TitreEnquete from "../composants/TitreEnquete.jsx";
import "../../../assets/style/common.css";

function ChargerQuestion() {
    const { identifiant } = useParams();
      const {enquetes, setEnquetes} = useContext(EnqueteContext);
      const enquete = enquetes?.find((e) => String(e.identifiant) === identifiant);
      const [questions, setQuestions] = useState([]);
      const [isDataLoading, setDataLoading] = useState(false);
      const [formQuestion, setFormQuestion] = useState({});
      const [questionToEdit, setQuestionToEdit] = useState(null);
      const [isEditModalOpen, setEditModalOpen] = useState(false);
      const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    setDataLoading(true);
    fetchQuestions();
    setDataLoading(false);
  }, []
);

async  function fetchQuestions() {
    try {
         const resp  = await axios.get(`${secondBaseUrl}/question/questions/?enquete_identifiant=${enquete.identifiant}`);
        const  listeEnq  = resp.data;
        setQuestions(listeEnq.data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
  }

  async function handleDeleteQuestion(questionId) {
    try {
         const resultat  = await axios.delete(`${secondBaseUrl}/question/delete/?id_question=${questionId}`);
        if(resultat.data.result){
           setQuestions(questions.filter((q) => q.id !== questionId));
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
   
  }

  function openEditModal(question) {
   setFormQuestion(question);
   setQuestionToEdit(question);
   setEditModalOpen(true);
}

function closeEditModal() {
  setEditModalOpen(false);
  setQuestionToEdit(null);
  setFormQuestion({});
}

  function openDeleteModal(question) {
   setQuestionToEdit(question);
   setDeleteModalOpen(true);
   setFormQuestion({});
}

function closeDeleteModal() {
  setDeleteModalOpen(false);
  setQuestionToEdit(null);
  setFormQuestion({});
}

  async function handleUpdateQuestion(questionId) {
    // console.log('Updated question data:', formQuestion);
    //  setQuestions(questions.map((q) => (q.id === questionId ? { ...q, ...formQuestion } : q)));
    try {
         const resultat  = await axios.put(`${secondBaseUrl}/question/update/?id_question=${questionId}`, formQuestion);
        if(resultat.data.result){
           setQuestions(questions.map((q) => (q.id === questionId ? { ...q, ...formQuestion } : q)));
        }else{
          console.error('Update failed:', resultat.data.message);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

  }

  function handleFormChange(event) {
    const { name, value } = event.target;
    if(name === "est_obligatoire") {
      setFormQuestion((prev) => ({ ...prev, [name]: event.target.checked }));
    } else if(name === "choix") {
      setFormQuestion((prev) => ({ ...prev, [name]: stringToList(value) }));
    } else {
      setFormQuestion((prev) => ({ ...prev, [name]: value }));
    }
  }

  return (
    
    <Content>
        <div className="row col-12">
            <TitrePage title="Importation de questions" />
            <div className="row">
                <div className="col-9 centered">
                    <TitreEnquete title={enquete.libelle} />
                </div>

                {/* <div className="col-4 centered">
                    <ButtonAdd > <i className="fas fa-plus icon-style"></i> <span>Ajouter une question</span></ButtonAdd>
                </div> */}
                <div className="col-3 centered">
                    <ButtonDownload > <i className="fas fa-upload icon-style2"></i><span>Enregister</span></ButtonDownload>
                </div>
            </div> 
        </div>
        <div className="centered" style={{ height: '50vh', width: '100%', padding: '20% ' }}>
            <div className="input-group">
  <input type="file" className="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload"/>
  <button className="btn" style={{ backgroundColor: Colors.primary, color: 'white' }} type="button" id="inputGroupFileAddon04">Charger</button>
</div>
        </div>
      {isEditModalOpen && questionToEdit && (
        <ModalDelete
          title="Modifier la question"
          size={`${["CHOIX UNIQUE", "CHOIX MULTIPLE"].includes(formQuestion.type_question.libelle) ? "xl":"lg"}`}
          show={isEditModalOpen}
          onConfirm={() => { handleUpdateQuestion(questionToEdit.id);}}
          onClose={closeEditModal}
        >
          <div className="row col-12">
            <div className={`row ${["CHOIX UNIQUE", "CHOIX MULTIPLE"].includes(formQuestion.type_question.libelle) ? "col-6" : "col-12"}`}>
               <div className="col-12">
                <TextField
                  label="Intitulé de la question"
                  value={formQuestion.libelle}
                  onChange={handleFormChange}
                  name="libelle"
                />
               </div>
              <div className="row col-12">
                <div className="col-6">
                  <TextField
                  label="Type"
                  value={formQuestion.type_question?.libelle || ""}
                  onChange={handleFormChange}
                  name="type"
                />
                </div>
                <div className="col-6">
                  <div className="col-12">
                    <div className="mb-3">
                      <label className="form-label">La question est :</label>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" name="est_obligatoire" checked={formQuestion.est_obligatoire} onChange={handleFormChange} id={`flexSwitchCheckChecked-${formQuestion.id}`} />
                        <label className="form-check-label" htmlFor={`flexSwitchCheckChecked-${formQuestion.id}`}>{formQuestion.est_obligatoire ? "Obligatoire" : "Facultative"}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {
              formQuestion.type_question && ["CHOIX UNIQUE", "CHOIX MULTIPLE"].includes(formQuestion.type_question.libelle) && (
                <div className="row col-6">
              <div className="col-12">
                <h6>Options de choix</h6>
                <p>Ajouter des options de choix pour la question</p>
              </div>
              <div className="col-12">
                <textarea name="choix"  onChange={handleFormChange} id="" style={{ width: '100%', height: '100%' }}>
                  {
                  listToString(formQuestion.choix)
                  }
                </textarea>
              </div>
              
            </div>
              )
            }
            
           
          </div>
        </ModalDelete>
      )}
                  {isDeleteModalOpen && questionToEdit && (
                    <ModalDelete title="Supprimer la question" show={isDeleteModalOpen} onConfirm={() => handleDeleteQuestion(questionToEdit.id)} onClose={closeDeleteModal}>
                      <div  style={{ textAlign: 'center' }}>
                        <p>Êtes-vous sûr de vouloir supprimer cette question ?</p>
                      <q style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{questionToEdit.libelle}</q>
                      </div>
                    </ModalDelete>
                  )}
    </Content>
  );
}
export default ChargerQuestion;

ChargerQuestion.propTypes = {
    enquetes: PropTypes.array,
    setEnquetes: PropTypes.func,
};
