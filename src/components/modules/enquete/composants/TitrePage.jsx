import { HrStyled, TitrePageStyled } from "../../../assets/style/LineStyle";
function TitrePage({ title }) {
    return (
        <div className="row">
            <div className="col-3"><TitrePageStyled>{title}</TitrePageStyled></div>
            <div className="col-9"><HrStyled /></div>
        </div>
    );
}
export default TitrePage;