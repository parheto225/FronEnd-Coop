import PropTypes from "prop-types";
import TextField from "./formulaire/TextField";
import "../../../assets/style/common.css";

function DetailEnquete({enquete}) {

    return (
            <div className="row col-12">
                    <div className="col-12">
                     <TextField 
                        label="Intitulé de l'enquête"
                        desabled={true}
                        value={enquete?.libelle}
                       
                    />
                   </div>
                   <div className="col-6">
                    <TextField
                        label="Identifiant"
                        desabled={true}
                        value={enquete?.identifiant}
                    />
                   </div>
                   
                   <div className="col-6">
                    <TextField
                        label="Campagne"
                        desabled={true}
                        value={enquete?.campagne.libelle}
                    />
                   </div>
                   <div className="col-6">
                     <TextField
                        label="Type d'enquête"
                        desabled={true}
                        value={enquete?.type_enquete?.libelle || ""}
                       
                    />
                   </div>
                   <div className="col-6">
                     <TextField
                        label="Projet"
                        desabled={true}
                        value={enquete?.projet?.nomProjet || ""}
                       
                    />
                   </div> 
                    <div className="col-6">
                     <TextField
                        label="Statut"
                        desabled={true}
                        value={enquete?.est_ouverte ? "Ouverte" : "Fermée"}
                       
                    />
                   </div>
                   <div className="col-6">
                     <TextField
                        label="Créée par"
                        desabled={true}
                        value={enquete?.created_by?.nom + " "+enquete?.created_by?.prenom}
                       
                    />
                   </div> 
            </div>
    );
}
export default DetailEnquete;

DetailEnquete.propTypes = {
    enquete: PropTypes.object.isRequired,
};
