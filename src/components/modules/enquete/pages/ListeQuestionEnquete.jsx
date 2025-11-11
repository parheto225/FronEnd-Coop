import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

import * as XLSX from "xlsx";

function ListeQuestionEnquete() {
    const { identifiant } = useParams();
      const {enquetes, setEnquetes} = useContext(EnqueteContext);
      const enquete = enquetes?.find((e) => String(e.identifiant) === identifiant);
      const [questions, setQuestions] = useState([]);
      const [isDataLoading, setDataLoading] = useState(false);
      const [formQuestion, setFormQuestion] = useState({});
      const [questionToEdit, setQuestionToEdit] = useState(null);
      const [isEditModalOpen, setEditModalOpen] = useState(false);
      const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
      const [isPreviewModalOpen, setPreviewModalOpen] = useState(false);
      const [previewQuestions, setPreviewQuestions] = useState([]);

  useEffect(() => {
    
    fetchQuestions();
   
  }, []
);

async  function fetchQuestions() {
  setDataLoading(true);
    try {
         const resp  = await axios.get(`${secondBaseUrl}/question/questions/?enquete_identifiant=${enquete.identifiant}`);
        const  listeEnq  = resp.data;
        setQuestions(listeEnq.data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
     setDataLoading(false);
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

    async function handlePreviewQuestions() {
    // setQuestions([...questions, ...previewQuestions]);
    try {
         const resultat  = await axios.post(`${secondBaseUrl}/question/multiple-insert-web/`, {identifiant_enquete: enquete.identifiant, questions: previewQuestions});
        if(resultat.data.result){
           fetchQuestions();
        }else{
          console.error('Update failed:', resultat.data.message);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

  }

function closePreviewModal() {
  setPreviewModalOpen(false);
  setQuestionToEdit(null);
  setFormQuestion({});
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

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      const questionsToPreview = jsonData.map((row) => ({
        libelle: row["LIBELLE"],
        type_question: { libelle: row["TYPE"] },
        est_obligatoire: row["EST_OBLIGATOIRE"] === "OUI" ? true : false,
        choix: stringToList(row["CHOIX"])
      }));
      setPreviewQuestions(questionsToPreview);
    };
    reader.readAsArrayBuffer(file);
  }
}



  return (
    
    <Content>
        <div className="row col-12">
            <TitrePage title="Liste des questions" />
            <div className="row">
                <div className="col-4 centered">
                    <TitreEnquete title={enquete.libelle} />
                </div>

                <div className="col-3 centered">
                    <ButtonAdd > <i className="fas fa-plus icon-style"></i> <span>Ajouter une question</span></ButtonAdd>
                </div>
                <div className="col-5 centered">
                  <div className="input-group">
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload"/>
                    <button className="btn" style={{ backgroundColor: Colors.primary, color: 'white' }} onClick={() => {setPreviewModalOpen(true);}} type="button" id="inputGroupFileAddon04">Afficher</button>
                  </div>
                  {/* <Link className="nav-link" to={`/enquetes/${enquete.identifiant}/questions/upload`} data-bs-toggle="" aria-expanded="false">
                    <ButtonDownload > <i className="fas fa-upload icon-style2"></i><span> Charger une liste</span></ButtonDownload>
                  </Link> */}
                </div>
            </div> 
        </div>
      <div>
        <div className="table-responsive">
          <TableStyled className="table">
            <thead>
              <tr>
                <th>N</th>
                <th>Libellé</th>
                <th>Type</th>
                <th>Obligatoire</th>
                <th>Actions</th>
              </tr>
            </thead>
            {isDataLoading ? (<tbody><tr><td colSpan="5"><div className="centered"><Loader/></div></td></tr></tbody>) : questions.length === 0 ? (
              <tbody><tr><td colSpan="5">Aucune question trouvée</td></tr></tbody>) : (
            <tbody>
              {questions && questions.map((question, idx) => (
                <tr key={question.id}>
                  <td>{idx+1}</td>
                  <td>{question.libelle}</td>
                  <td>{question.type_question.libelle}</td>
                  <td>
                    {/* {question.est_obligatoire ? "Obligatoire" : "Facultatif"} */}
                    <span className={`badge ${question.est_obligatoire ? "bg-danger" : "bg-success"}`}>
                      {question.est_obligatoire ? "Oui" : "Non"}
                    </span>
                    
             
                  </td>
                  <td>
                     <ButtonSimple onClick={() => openEditModal(question)} data-bs-toggle="tooltip" title="Modifier la question">
                       <IconAction className="fa-solid fa-pencil" color={Colors.primary} />
                     </ButtonSimple>
                      <ButtonSimple onClick={() =>openDeleteModal(question)} data-bs-toggle="tooltip" title="Supprimer la question">
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


                        {isPreviewModalOpen && (
        <ModalDelete
          title="Aperçu des questions à enregistrer"
          size="xl"
          show={isPreviewModalOpen}
          onConfirm={() => { handlePreviewQuestions(); }}
          onClose={closePreviewModal}
        >
          <div>
             <div className="table-responsive">
          <TableStyled className="table">
            <thead>
              <tr>
                <th>N</th>
                <th>Libellé</th>
                <th>Type</th>
                <th>Obligatoire</th>
                {/* <th>Actions</th> */}
              </tr>
            </thead>
            { previewQuestions.length === 0 ? (
              <tbody><tr><td colSpan="5">Aucune question trouvée</td></tr></tbody>) : (
            <tbody>
              {previewQuestions && previewQuestions.map((question, idx) => (
                <tr key={question.id}>
                   <td>{idx+1}</td>
                  <td>{question.libelle}</td>
                  <td>{question.type_question.libelle}</td>
                  <td>
                    {/* {question.est_obligatoire ? "Obligatoire" : "Facultatif"} */}
                    <span className={`badge ${question.est_obligatoire ? "bg-danger" : "bg-success"}`}>
                      {question.est_obligatoire ? "Oui" : "Non"}
                    </span>
                    
             
                  </td>
                  {/* <td>
                     <ButtonSimple onClick={() => openEditModal(question)}>
                       <IconAction className="fa-solid fa-pencil" color={Colors.primary} />
                     </ButtonSimple>
                      <ButtonSimple onClick={() =>openDeleteModal(question)}>
                        <IconAction className="fa-solid fa-trash" color={Colors.red} />
                      </ButtonSimple>
                    
                  </td> */}
                </tr>
              ))}
            </tbody>
            )}
            
          </TableStyled>
        </div>
            {/* {previewQuestions.map((question, index) => (
              <div key={index}>
                <h6>{question.libelle}</h6>
                <p>Type: {question.type_question?.libelle || "N/A"}</p>
                <p>Obligatoire: {question.est_obligatoire ? "Oui" : "Non"}</p>
                {["CHOIX UNIQUE", "CHOIX MULTIPLE"].includes(question.type_question.libelle) && (
                  <div>
                    <h6>Options de choix</h6>
                    <p>{listToString(question.choix)}</p>
                  </div>
                )}
              </div>
            ))} */}
          </div>
        </ModalDelete>
      )}
    </Content>
  );
}
export default ListeQuestionEnquete;

ListeQuestionEnquete.propTypes = {
    enquetes: PropTypes.array,
    setEnquetes: PropTypes.func,
};
