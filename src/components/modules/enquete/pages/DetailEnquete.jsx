import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { EnqueteContext } from "../../../context";
import PropTypes from "prop-types";
import Content from "../../../Content";
import TextField from "../composants/formulaire/TextField";
import { useParams } from "react-router-dom";
import TitrePage from "../composants/TitrePage";
import SelectField from "../composants/formulaire/SelectField";
import FormContainer from "../composants/formulaire/FormContainer";
import "../../../assets/style/common.css";

function DetailEnquete() {
    const { id } = useParams();
     const {enquetes, setEnquetes} = useContext(EnqueteContext); 

     const enquete = enquetes?.find((e) => String(e.id) === id);

    const [formData, setFormData] = useState({
        libelle: enquete?.libelle || "",
        // description: enquete?.description || "",
    });

    useEffect(() => {
        setFormData({
            libelle: enquete?.libelle || "",
            identifiant: enquete?.identifiant || "",
        });
    }, [enquete]);

    const handleChange = (field) => (value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Content>
            <div>
                <TitrePage title="Détails de l'enquête" />
                <FormContainer formTitle={"Informations de l'enquête"} buttonTitle="Enregistrer" onSubmit={() => console.log("Enregistrer")}>
                   <div className="col-3">
                    <TextField
                        label="Identifiant"
                        value={formData.identifiant}
                        onChange={handleChange("identifiant")}
                    />
                   </div>
                   <div className="col-9">
                     <TextField
                        label="Intitulé"
                        value={formData.libelle}
                        onChange={handleChange("libelle")}
                    />
                   </div>
                   <div className="col-6">
                    <SelectField
                        label="Identifiant"
                        elements={[]}
                        onChange={handleChange("identifiant")}
                    />
                   </div>
                   <div className="col-6">
                     <TextField
                        label="Intitulé"
                        value={formData.libelle}
                        onChange={handleChange("libelle")}
                    />
                   </div>  
                   
                </FormContainer>
            </div>
        </Content>
    );
}

export default DetailEnquete;
