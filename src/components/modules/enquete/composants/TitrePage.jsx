import { HrStyled, TitrePageStyled } from "../../../assets/style/LineStyle";
import "../../../assets/style/common.css";
function TitrePage({ title }) {
    return (
        <div className="row">
            <div className="col-3 centered"><TitrePageStyled>{title}</TitrePageStyled></div>
            <div className="col-9 centered"><HrStyled /></div>
        </div>
    );
}
export default TitrePage;