import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader } from '../../../assets/style/Loader';
import { secondBaseUrl } from "../../../config/baseUrl";



function CompositionParcellaire() {
     const [isLoading, setLoading] = useState(false);
     const [composition, setComposition] = useState([]);
    const options = {
       
       colors: composition.map(item =>String(item.ClasseCouleur)),
       
      labels: composition.map(item => item.ClasseNom),
       dataLabels: {
            enabled: false,
            style:{colors: ['#fff']},
       },
    };
        const series = composition.map(item => item.Proportion);
       


     async function fetchCompositionParcellaire(){
        try {
          const resp =  await axios.get(`${secondBaseUrl}/geoportail/get_geospatial_data`);
            const  proportions  = resp.data;
            setComposition(proportions.data);
        } catch (error) {
             console.error(error)
        }
              
     }

      useEffect(() => {  
            setLoading(true);
            fetchCompositionParcellaire();
            // setComposition([{"ClasseID": 9, "ClasseNom": "Plantation de Cacao", "ClasseCouleur": "#bf812d", "NombrePixels": 31, "Proportion": 62.0}, {"ClasseID": 15, "ClasseNom": "Mangrove", "ClasseCouleur": "#78c679", "NombrePixels": 16, "Proportion": 32.0}, {"ClasseID": 21, "ClasseNom": "Habitat humain, Infrastructures", "ClasseCouleur": "#252525", "NombrePixels": 3, "Proportion": 6.0}]);
            setLoading(false);
        }, []);


    return (
        <div style={{ width: 400 }}>
            {isLoading ? (
                <Loader />
            ) : (
                <Chart
                    options={options}
                    series={series}
                    type="pie"
                    width="100%"
                />
            )}
        </div>
    );
        
} export default CompositionParcellaire;