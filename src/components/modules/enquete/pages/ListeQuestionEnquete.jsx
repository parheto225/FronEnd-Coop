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
import {IconAction} from "../../../assets/style/Icon";
import TitrePage from "../composants/TitrePage";
import { Loader } from "../../../assets/style/Loader";
import Colors from "../../../../utils/colors";

function ListeQuestionEnquete() {
    const { identifiant } = useParams();
      const {enquetes, setEnquetes} = useContext(EnqueteContext);
      const enquete = enquetes?.find((e) => String(e.identifiant) === identifiant);
      const [questions, setQuestions] = useState([]);
      const [isDataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    setDataLoading(true);
    fetchQuestions();
    setDataLoading(false);
  }, [questions]
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

  return (
    <Content>
        <div className="row col-12">
            <TitrePage title="Liste des questions" />
            <div className="position-flex-end">
                {/* <div className="col-5">
                <SelectCampagne campagnes={enquetes.reduce((acc, curr) => {
                    if (curr.campagne && !acc.find(item => item.id === curr.campagne.id)) {
                        acc.push(curr.campagne);
                    }
                    return acc;
                }, [])} onChange={handleSelectChange} />
                </div> */}
                <div className="col-4">
                    <ButtonAdd > <i className="fas fa-plus icon-style"></i> <span>Ajouter une question</span></ButtonAdd>
                </div>
                <div className="col-3">
                    <ButtonDownload > <i className="fas fa-upload icon-style2"></i><span> Charger une liste</span></ButtonDownload>
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
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            {isDataLoading ? (<Loader/>  ) : (
            <tbody>
              {questions && questions.map((question, idx) => (
                <tr key={question.id}>
                  <td>{idx+1}</td>
                  <td>{question.libelle}</td>
                  <td>{question.type_question.libelle}</td>
                  <td>{enquete.est_obligatoire ? "Obligatoire" : "Facultatif"}</td>
                  <td>
                    <Link to={`#`}><IconAction className="fa fa-pencil"></IconAction></Link>
                    <Link to={`#`}><IconAction className="fa-solid fa-trash"  color={Colors.red}></IconAction></Link>
                    {/* <Link to={`#`}><IconAction className="fa-solid fa-comment"></IconAction></Link> */}
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
export default ListeQuestionEnquete;

ListeQuestionEnquete.propTypes = {
    enquetes: PropTypes.array,
    setEnquetes: PropTypes.func,
};
