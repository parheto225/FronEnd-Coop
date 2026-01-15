import { useState, useEffect} from "react";
import Chart from 'react-apexcharts';
import { Loader } from '../../../assets/style/Loader';
import '../style_legendes.css';

import axios from "axios";
import { secondBaseUrl } from "../../../config/baseUrl";

function CompositionParcellaire({codeParcelle, onClose}) {

     const [isLoading, setLoading] = useState(false);
           const [composition, setComposition] = useState([]);   
           
           
         async function fetchCompositionParcellaire(){
            try {
                const resp =  await axios.get(`${secondBaseUrl}/ocs/occupation-du-sol-parcelle/?code_parcelle=${codeParcelle}`);
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
                 setLoading(true);
                  fetchCompositionParcellaire();
            }, [codeParcelle]);
   
   
    const options = {
       
       colors: composition.map(item =>String(item.ClasseCouleur)),
       
      labels: composition.map(item => item.ClasseNom),
       dataLabels: {
            enabled: true,
            style:{colors: ['#fff']},
       },
    };
        const series = composition.map(item => item.Proportion);
       



    return (
        (
         <>
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                  <div className="modal-dialog modal-dialog-scrollable modal-lg" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title text-align-center">Occupation du sol - Parcelle : {codeParcelle}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                      </div>
                      <div className="modal-body">
                            {isLoading ? (
                                <center><Loader /></center>
                            ) : (
                                <Chart options={options} series={series} type="pie" widthMax={380} />
                                // <table>
                                //     <thead>
                                //         <tr>Catégorie</tr>
                                //         <tr>Pourcentage</tr>
                                //     </thead>
                                //     <tbody style={{border:"1"}}>
                                    
                                //         {composition.map((item)=>
                                //             <tr key={item.ClasseID}>
                                //                 <td>{item.ClasseNom}</td>
                                //                 <td>{item.Proportion} %</td>
                                //             </tr>
                                //         )}
                                //     </tbody>
                                // </table>
                            )}
                      </div>
                      
                    </div>
                  </div>
                </div>
            </>
        
        
        )
    );
        
} export default CompositionParcellaire;