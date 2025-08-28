import axios from "axios";
import { useNavigate } from "react-router-dom";
import { secondBaseUrl } from "../../../config/baseUrl";
import{ useState, useContext, useEffect } from "react";
import { CampagneContext, UtilisateurContext, EnqueteContext } from "../../../context";
import Content from "../../../Content";
import TextField from "../composants/formulaire/TextField";
import TitrePage from "../composants/TitrePage";
import SelectField from "../composants/formulaire/SelectField";
import FormContainer from "../composants/formulaire/FormContainer";
import {ButtonSubmit} from "../../../assets/style/Buttons";
import "../../../assets/style/common.css";
import BaseUrl from "../../../config/baseUrl";

const baseUrl = BaseUrl();


function EnregistrerEnquete() {
    const navigate = useNavigate();
    const {user} = useContext(UtilisateurContext);
    const {setEnquetes} = useContext(EnqueteContext);
    const {campagnes, setCampagnes} = useContext(CampagneContext);
    const [pending, setPending] = useState(false);
    const [typesEnquete, setTypesEnquete] = useState([]);
    const [projets, setProjets] = useState([]);
   

    const [formData, setFormData] = useState({
        libelle:  "",
        campagne:  "",
        type_enquete:  "",
        projet:  "",
        est_ouverte:true,
        created_by:null
    });

    async function fetchTypesEnquete(){
        const resp  = await axios.get(`${secondBaseUrl}/enquete/get_types_enquete/`);
        const  resultat  = resp.data;
        setTypesEnquete(resultat.data);
    };

    async function fetchProjets(){
        if(user && user.id){
            const queryParams = {
                userID: user.id
            }
            try {
                await axios.get(baseUrl+'/proj-list/', { params: queryParams }).then((resp)=>{
                    setProjets(resp.data.map((element) => ({
                        id: element.id,
                        libelle: element.nomProjet
                    })));
                })
            } catch (error) {
                console.log(error);
            }
        }
    };

    function sendData() {
        setPending(true);
        formData.created_by = user.id;
        try {
            axios.post(`${secondBaseUrl}/enquete/register/`, formData)
            .then((response) => {
                setPending(false);
                if (response.data.result) {
                    setEnquetes((prevEnquetes) => [...prevEnquetes, response.data.data]);
                    navigate('/enquetes/')
                }
                else{
                    console.log("Failed:", response.data.message);
                    navigate('/enquetes/new');
                }
            })
        } catch (error) {
            console.error("Error:", error);
                setPending(false);
                 navigate('/enquetes/');
        }
        
            
    }
         


    const handleChange =  (event) => {
        
        setFormData({ ...formData, [event.target.name]:event.target.value });
    };

    useEffect(() => {
        fetchTypesEnquete();
        
    }, []);

       useEffect(() => {
        fetchProjets();
    }, [user]);

    return (
        <Content>
            <div>
                <TitrePage title="Créer une enquête" />
                <FormContainer formTitle={"Créer une enquête"}>
                   
                    <div className="col-12">
                     <TextField 
                        label="Intitulé de l'enquête"
                        name="libelle"
                        onChange={handleChange}
                    />
                   </div>
                   <div className="col-6">
                    <SelectField
                        label="Campagne"
                        name="campagne"
                        elements={[...campagnes].filter(Boolean)}
                        onChange={handleChange}
                    />
                   </div>
                   <div className="col-6">
                     <SelectField
                        label="Type d'enquête"
                        name="type_enquete"
                        elements={[...typesEnquete].filter(Boolean)}
                        onChange={handleChange}
                    />
                   </div>
                   <div className="col-6">
                     <SelectField
                        label="Projet"
                        name="projet"
                        elements={[...projets].filter(Boolean)}
                        onChange={handleChange}
                    />
                   </div> 
                    <div className="col-6">
                     <SelectField
                        label="Statut"
                        name="est_ouverte"
                        elements={[
                            { id: true, libelle: "Actif" },
                            { id: false, libelle: "Inactif" }
                        ]}
                        onChange={handleChange}
                    />
                   </div>
                   
                <div className="col-12 position-flex">
                    <ButtonSubmit type="submit" onClick={sendData} disabled={pending}>{pending ? "Enregistrement..." : "Enregistrer"}</ButtonSubmit>
                </div>

                <div>
                </div>
            </FormContainer>
        </div>
    </Content>
);
}

export default EnregistrerEnquete;
