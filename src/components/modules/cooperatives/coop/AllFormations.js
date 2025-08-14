import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Content from "../../../Content";
import BaseUrl from "../../../config/baseUrl";
import { useTranslation } from "react-i18next";

const url = BaseUrl();

function AllFormations() {
  const { t } = useTranslation();
  const [formations, setFormations] = useState([]);
  const [totalFormations, setTotalFormations] = useState(0);

  useEffect(() => {
    axios.get(`${url}/formations/`)
      .then(response => {
        setFormations(response.data);
        setTotalFormations(response.data.length);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des formations', error);
      });
  }, []);

  return (
    <Content sideID={"cooperatives"} parent={"generalite"}>
      <h2 className="text-bold text-1100 mb-5">
        {t("Liste des Formations")} ({totalFormations})
      </h2>

      <div className="table-responsive">
        <table className="table fs--1 mb-0">
          <thead>
            <tr style={{ backgroundColor: "#EE9F27", color: "#fff", fontWeight: "bold" }}>
              <th className="sort white-space-nowrap align-middle pe-3 ps-0 text-uppercase text-center" scope="col">{t("Coopérative")}</th>
              <th className="sort align-middle pe-6 text-uppercase " scope="col" data-sort="amount">{t("Formateur")}</th>
              <th className="sort align-middle pe-6 text-uppercase " scope="col" data-sort="amount">{t("Structure")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Catégorie")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Thématique")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Campagne")}</th>              
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Date début")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Date fin")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Durée (Jour)")}</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">PV</th>
              <th className="sort align-middle text-center text-uppercase" scope="col" data-sort="stage">{t("Participants")}</th>              
            </tr>
          </thead>
          <tbody>
            {formations.map((f, index) => (
              <tr key={index} className="text-center">
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.entite_nom}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.formateur}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.structure_formateur}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.categorie_intitule}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.intitule_libelle}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.campagne_libelle}</td>                
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.debut}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.fin}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">{f.duree}</td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">
                  <a
                    className="btn btn-sm btn-danger" 
                    // style={{marginTop : "-10px"}}
                    // href={``}
                     href={`${url}/formations/${f.id}/export-pdf/`}
                    rel="noreferrer"
                  >
                    {t("PDF")}
                  </a>
                </td>
                <td className="description align-middle white-space-nowrap fw-bold text-center text-700 py-2 pe-6">
                  <a
                    className="btn btn-sm btn-success" 
                    // style={{marginTop : "-10px"}}
                    href={`/formations/${f.id}`}
                    rel="noreferrer"
                  >
                    {t("Participants")}
                  </a>
                </td>
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

export default AllFormations;
