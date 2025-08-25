import{ useState, useContext } from "react";
import { EnqueteContext } from "../../../context";
import Content from "../../../Content";
import TextField from "../composants/formulaire/TextField";
import TitrePage from "../composants/TitrePage";
import SelectField from "../composants/formulaire/SelectField";
import FormContainer from "../composants/formulaire/FormContainer";
import {ButtonSubmit} from "../../../assets/style/Buttons";
import "../../../assets/style/common.css";

function EnregistrerEnquete() {
    const {pending, setPending} = useState(false);
    const {enquetes, setEnquetes} = useContext(EnqueteContext);

    //  const enquete = enquetes?.find((e) => String(e.id) === id);

    const [formData, setFormData] = useState({
        libelle:  "",
        identifiant:  "",
        campagne:  "",
        type_enquete:  "",
        projet:  "",
        statut:true,
        created_by:""
    });

    function sendData(formData) {
        setPending(true);
        fetch("http://localhost:8000/enquetes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success:", data);
                setEnquetes([...enquetes, data]);
                setPending(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setPending(false);
            });
    }

    const handleChange = (field) => (value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Content>
            <div>
                <TitrePage title="Créer une enquête" />
                <FormContainer formTitle={"Créer une enquête"}>
                    <form action={sendData} method="POST" className="row col-12">
                    <div className="col-12">
                     <TextField 
                        label="Intitulé de l'enquête"
                        name="libelle"
                        onChange={handleChange("libelle")}
                    />
                   </div>
                   <div className="col-6">
                    <SelectField
                        label="Campagne"
                        name="campagne"
                        elements={[].filter(Boolean)}
                        onChange={handleChange("campagne")}
                    />
                   </div>
                   <div className="col-6">
                     <SelectField
                        label="Type d'enquête"
                        name="type_enquete"
                        elements={[].filter(Boolean)}
                        onChange={handleChange("type_enquete")}
                    />
                   </div>
                   <div className="col-6">
                     <SelectField
                        label="Projet"
                        name="projet"
                        elements={[].filter(Boolean)}
                        onChange={handleChange("projet")}
                    />
                   </div> 
                    <div className="col-6">
                     <SelectField
                        label="Statut"
                        name="statut"
                        elements={[
                            { id: true, libelle: "Actif" },
                            { id: false, libelle: "Inactif" }
                        ]}
                        onChange={handleChange("statut")}
                    />
                   </div>
                   
                <div className="col-12 position-flex">
                    <ButtonSubmit type="submit" disabled={pending}>{pending ? "Enregistrement..." : "Enregistrer"}</ButtonSubmit>
                </div>
            
                  </form>
                </FormContainer>
            </div>
        </Content>
    );
}

export default EnregistrerEnquete;
