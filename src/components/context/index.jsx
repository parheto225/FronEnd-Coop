import axios from "axios";
import { secondBaseUrl } from "../config/baseUrl";
import { createContext, useState , useEffect, useContext} from "react";
import UserContext from "../context/useContext";


export const EnqueteContext = createContext()

export const EnqueteProvider = ( {children})=>{
   const {user, setUser} = useContext(UtilisateurContext);
  const [enquetes, setEnquetes] = useState([]);
    
  useEffect(() => {
    try {
      if(user && user.id){
        fetchEnquetes();
      }
    } catch (error) {
      console.log("Error fetching enquetes:", error);
    }
  }, [user]);

  async function fetchEnquetes(){
  const resp  = await axios.get(`${secondBaseUrl}/enquete/all/?user_id=${user.id}`);
  const  listeEnq  = resp.data;
  setEnquetes(listeEnq.data);
};

    return <EnqueteContext.Provider value={{enquetes, setEnquetes}}>
        {children}
    </EnqueteContext.Provider>
}

export const CampagneContext = createContext()

export const CampagneProvider = ( {children})=>{
  const {user, setUser} = useContext(UtilisateurContext);
  const [campagnes, setCampagnes] = useState([]);

  useEffect(() => {
    try {
      if (user && user.id) {
        fetchCampagnes();
      }
    } catch (error) {
      console.log("Error fetching campagnes:", error);
    }
  }, [user]);

  async function fetchCampagnes(){
   const queryParms = {
    id_utilisateur: user.id,
   }
  const resp  = await axios.get(`${secondBaseUrl}/campagne/get_all_active_campagne_by_user/`, { params: queryParms });
  const  resultat  = resp.data;
  setCampagnes(resultat.data);
};

    return <CampagneContext.Provider value={{campagnes, setCampagnes}}>
        {children}
    </CampagneContext.Provider>
}

export const UtilisateurContext = createContext()

export const UtilisateurProvider = ( {children})=>{
  const utilisateur = UserContext();
    const [user,setUser] = useState(null);

    useEffect(()=>{
            try {
              if(utilisateur && utilisateur.id){
               setUser(utilisateur);
              }
            } catch (error) {
                console.log(error);
            }
        

    },[utilisateur]);
     return <UtilisateurContext.Provider value={{user, setUser}}>
        {children}
    </UtilisateurContext.Provider>

}