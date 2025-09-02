import Colors from "../../../../utils/colors";

function TitreEnquete({ title }) {
    return (
         <h4 style={{textAlign:"center", paddingTop:"15px", paddingBottom:"15px", color: Colors.primary }}>{title}</h4>           
    );
}
export default TitreEnquete;