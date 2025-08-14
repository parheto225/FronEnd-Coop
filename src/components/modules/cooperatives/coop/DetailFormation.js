import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Content from "../../../Content";
import BaseUrl from "../../../config/baseUrl";
import { useTranslation } from "react-i18next";
import { useParams, Link, } from "react-router-dom";

const url = BaseUrl();

function DetailFormations() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [formation, setFormation] = useState([]);
  const [totalParticipant, setTotalParticipants] = useState(0);

  useEffect(() => {
    axios.get(`${url}/formations/${id}/`)
      .then(response => {
        setFormation(response.data);
        setTotalParticipants(response.data.participants ? response.data.participants.length : 0);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des formations', error);
      });
  }, [id]);

  if (!formation) return <p>Chargement...</p>;

  return (
    <Content sideID={"cooperatives"} parent={"generalite"}>
      <div className="mb-5 bg-white p-3 border-2 rounded-2 ">
          <div className="row">
              <div className="col-md-4">
                  <div className="card">
                      <h5 className="card-header bg-info text-white p-2 text-center">
                          Thématique
                      </h5>
                      <div className="card-body p-2">
                          <h3 className="card-title text-center text-warning"><Link
                              to={`/formations/`}>{formation.intitule_libelle}</Link></h3>
                      </div>
                  </div>
              </div>
              <div className="col-md-4">
                  <div className="card">
                      <h5 className="card-header bg-success text-white p-2 text-center">
                          Localité
                      </h5>
                      <div className="card-body p-2">
                          <h3 className="card-title text-center text-success">{formation.localite}</h3>
                      </div>
                  </div>
              </div>

              <div className="col-md-4">
                  <div className="card">
                      <h5 className="card-header bg-info text-white p-2 text-center">
                          Nb Participants
                      </h5>
                      <div className="card-body p-2">
                          <h3 className="card-title text-center text-warning">{totalParticipant}</h3>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      {/* <h2 className="text-bold text-1100 mb-5">
        {t("Liste des Participants")} ()
      </h2> */}

      <div className="table-responsive">
        <table className="table fs--1 mb-0">
          <thead>
            <tr style={{ backgroundColor: "#EE9F27", color: "#fff", fontWeight: "bold" }}>
              <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-uppercase text-center" scope="col">{t("Coopérative")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Thématique")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Campagne")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Nom et Prénoms")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Contact")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Présence")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Avis")}</th>              
            </tr>
          </thead>
          <tbody>
            {formation.participants && formation.participants.map((f, index) => (
              <tr key={index}>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.entite_nom}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.formation_intitule}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.annee_creation}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.nom}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.contact}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.presence ? "Oui" : "Non"}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.critere}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <div ref={loaderRef} className="h-10"></div>
        {loading && <p className="text-center py-3">Chargement...</p>} */}
      </div>
    </Content>
  );
}

export default DetailFormations;
