import axios from "axios";
import { secondBaseUrl } from "../config/baseUrl";
import { createContext, useState , useEffect} from "react";

export const EnqueteContext = createContext()

export const EnqueteProvider = ( {children})=>{
  const [enquetes, setEnquetes] = useState([]);
    
  useEffect(() => {
    try {
      fetchEnquetes();
    } catch (error) {
      console.log("Error fetching enquetes:", error);
    }
  }, []);

  async function fetchEnquetes(){
  const resp  = await axios.get(`${secondBaseUrl}/enquete/get_enquetes/?technicien_tel=0767623025`);
  const  listeEnq  = resp.data;
  setEnquetes(listeEnq.data);
};

    return <EnqueteContext.Provider value={{enquetes, setEnquetes}}>
        {children}
    </EnqueteContext.Provider>
}