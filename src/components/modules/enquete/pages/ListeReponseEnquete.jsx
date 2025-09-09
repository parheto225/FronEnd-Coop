import * as XLSX from 'xlsx';
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
import { TableStyled } from "../../../assets/style/TableStyled";

import TitrePage from "../composants/TitrePage";
import { Loader } from "../../../assets/style/Loader";
import TitreEnquete from "../composants/TitreEnquete.jsx";
import { stringReponseToList } from "../../../../utils/stringHandling.jsx";

function ListeReponseEnquete() {
    const { identifiant } = useParams();
      const {enquetes, setEnquetes} = useContext(EnqueteContext);
      const enquete = enquetes?.find((e) => String(e.identifiant) === identifiant);
      const [isDataLoading, setDataLoading] = useState(false);
      const [questions, setQuestions] = useState([]);
      const [reponses, setReponses] = useState([]);
      const [questionsExport, setQuestionsExport] = useState([]);
      const [formatExport, setFormatExport] = useState("xlsx");


  useEffect(() => {
    setDataLoading(true);
    fetchQuestions();
    fetchReponses();
    setDataLoading(false);
  }, []
);

async  function fetchQuestions() {
    try {
         const resp  = await axios.get(`${secondBaseUrl}/question/questions/?enquete_identifiant=${enquete.identifiant}`);
        const  listeEnq  = resp.data;
        setQuestions(listeEnq.data);
        setQuestionsExport(listeEnq.data.map((question) => {
          return { "question_id": question.id, "export": false };
        }));
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
  }

  async  function fetchReponses() {
    try {
         const resp  = await axios.get(`${secondBaseUrl}/reponses/all/?enquete_identifiant=${enquete.identifiant}`);
        const  listeEnq  = resp.data;
        setReponses(listeEnq.data);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
  }

  function setValue (value, defaultValue = "-") {
    return [null, undefined, "null"].includes(value) ? defaultValue : value;
  }

  function getReponseMap(details) {
  // details = [{question: id, valeur: ...}, ...]
  const map = {};
  details.forEach(detail => {
    map[detail.question] = detail.valeur;
  });
  return map;
}

  function handleQuestionExportChange(event) {
    const { name } = event.target;
    setQuestionsExport((prev) => (prev.map((item) => parseInt(item.question_id) === parseInt(name) ? 
    { ...item, export: event.target.checked } : item
  )));
  }


  function formatageReponse() {
     const selectedQuestions = questionsExport.filter(q => q.export);
     return reponses.map((reponse) => {
      const reponseMap = getReponseMap(reponse.reponses.details);
      const obj = { Sujet: reponse.reponses.sujet };
      Object.keys(reponseMap).forEach((key) => {
        if (selectedQuestions.some(q => parseInt(q.question_id) === parseInt(key) && q.export)) {
          const question =questions.find(q => q.id === parseInt(key));
          obj[`${question.libelle}`] =  question.type_question.libelle === "CHOIX MULTIPLE" ? stringReponseToList(setValue(reponseMap[question.id])): setValue(reponseMap[key], "");
        }
      });
      return obj;
    })
  }

  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(
      formatageReponse()
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reponses');
    XLSX.writeFile(workbook, `${enquete.identifiant}_reponses.xlsx`);
  }

  function exportToCSV(){
     const worksheet = XLSX.utils.json_to_sheet(
      formatageReponse()
    );
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const csvblob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(csvblob);
    link.download = `${enquete.identifiant}_reponses.csv`;
    link.click();
  }

  function exportation() {
    const selectedQuestions = questionsExport.filter(q => q.export);
   if (selectedQuestions.length > 0) {
   formatExport === "xlsx" && exportToExcel()
    formatExport === "csv" && exportToCSV()
    setQuestionsExport(questions.map((question) => {
          return { "question_id": question.id, "export": false };
        }));
   }
    
  }

  return (
    <Content>
        <div className="row col-12">
            <TitrePage title="Liste des reponses" />
            <div className="row">
                <div className="col-8 centered">
                    <TitreEnquete title={enquete.libelle} />
                </div>
                {/* <div className="col-4">
                    <ButtonAdd > <i className="fas fa-plus icon-style"></i> <span>Ajouter une enquête</span></ButtonAdd>
                </div> */}
                {
                   questions.length > 0 ? (
                    
                <div className="row col-4 g-3">
                  <div className="col-auto">
                      <select className="form-control" name="format" id="" value={formatExport} onChange={(e) => setFormatExport(e.target.value)}>
                        <option disabled>Choisir un format</option>
                        <option value="csv" selected={formatExport === "csv"}>CSV</option>
                        <option value="xlsx" selected={formatExport === "xlsx"}>EXCEL</option>
                        <option value="pdf" selected={formatExport === "pdf"}>PDF</option>
                      </select>
                      {/* <input type="password" class="" id="inputPassword2" placeholder="Password"/> */}
                  </div>
                  <div className="col-auto">
                    <button type="submit" onClick={() => exportation()} className="btn mb-3 simple-bouton">Exporter</button>
                  </div>
                  {/* <ButtonDownload onClick={() => exportation()} > <i className="fas fa-download icon-style2"></i><span> Exporter la liste</span></ButtonDownload> */}
                </div>
                        ) : null
                    
                }
                
            </div>
        </div>
      <div>
        {isDataLoading ? (
            <tbody><tr><td colSpan="5"><div className="centered"><Loader/></div></td></tr></tbody>  )  : (
            <div className="table-responsive">
                <TableStyled className="table">
                    <thead>
                    <tr>
                        <th> {questions.length>0 ? "Sujet" : "Aucune question trouvée"}</th>
                        {questions && questions.map((question)=><th key={question.id}> <input type="checkbox" name={question.id} onChange={handleQuestionExportChange} id="" /> {question.libelle}</th>)}
                        {/* <th>Actions</th> */}
                    </tr>
                    </thead>
                    <tbody>
                        {reponses && reponses.map((reponse) => {
                            const reponseMap = getReponseMap(reponse.reponses.details);
                            return (
                            <tr key={reponse.id}>
                                <td>{reponse.reponses.sujet}</td>
                                {questions.map((question) => (
                                <td key={question.id}>
                                    { question.type_question.libelle === "CHOIX MULTIPLE" ? stringReponseToList(setValue(reponseMap[question.id])).map((item, index) => <span className="badge bg-success m-1" key={index}>
                      {item}
                    </span>) : setValue(reponseMap[question.id])}
                                </td>
                                ))}
                            </tr>
                            );
                        })}
                    </tbody>
                </TableStyled>
            </div>
        ) }
        
      </div>
    </Content>
  );
}
export default ListeReponseEnquete;

ListeReponseEnquete.propTypes = {
    enquetes: PropTypes.array,
    setEnquetes: PropTypes.func,
};
