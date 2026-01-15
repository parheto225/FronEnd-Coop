import axios from "axios";
import { secondBaseUrl } from "../config/baseUrl";
import { createContext, useState , useEffect, useContext, useCallback, useMemo} from "react";
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

export const OCSContext = createContext({
    codeParcelle: null,         // La valeur par défaut pour codeParcelle
    setCodeParcelle: () => {},  // Une fonction vide sécurisée pour setCodeParcelle
    isLoading: false,           // Valeur par défaut pour isLoading
    composition: []             // Valeur par défaut pour composition
})
export const OCSProvider = ( {children})=>{
  const [codeParcelle, setCodeParcelle] = useState(null);
      const [isLoading, setLoading] = useState(false);
       const [composition, setComposition] = useState([]);    
     async function fetchCompositionParcellaire(){
        try {
            const resp =  await axios.get(`${secondBaseUrl}/ocs/occupation-du-sol/`);
            const  proportions  = resp.data;
            setComposition(proportions.data);
            console.log(proportions.data)
        } catch (error) {
             console.error(error);  
        } finally{
          setLoading(false);
        }    
     }

      useEffect(() => {  
            if (codeParcelle !== null) {
              setLoading(true);
              fetchCompositionParcellaire();
              console.log("Code parcelle dans le provider OCS :", codeParcelle);
            }
        }, [codeParcelle]);

    return <OCSContext.Provider value={{codeParcelle, setCodeParcelle, fetchCompositionParcellaire, isLoading, composition}}>
        {children}
    </OCSContext.Provider>
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