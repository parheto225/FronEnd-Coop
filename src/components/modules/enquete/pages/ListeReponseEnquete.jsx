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
import { ButtonDownload} from "../../../assets/style/Buttons";
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

  function setValue (value){
    return [null, undefined, "null"].includes(value) ? "-" : value;
  }

  function getReponseMap(details) {
  // details = [{question: id, valeur: ...}, ...]
  const map = {};
  details.forEach(detail => {
    map[detail.question] = detail.valeur;
  });
  return map;
}

  return (
    <Content>
        <div className="row col-12">
            <TitrePage title="Liste des reponses" />
            <div className="row">
                <div className="col-9 centered">
                    <TitreEnquete title={enquete.libelle} />
                </div>
                {/* <div className="col-4">
                    <ButtonAdd > <i className="fas fa-plus icon-style"></i> <span>Ajouter une enquête</span></ButtonAdd>
                </div> */}
                {
                   questions.length > 0 ? (
                            <div className="col-3 centered">
                    <ButtonDownload > <i className="fas fa-download icon-style2"></i><span> Exporter la liste</span></ButtonDownload>
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
                        {questions && questions.map((question)=><th key={question.id}>{question.libelle}</th>)}
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
