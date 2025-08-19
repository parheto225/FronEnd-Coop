import { HrStyled, TitrePageStyled } from "../../../assets/style/LineStyle";
function TitrePage({ title }) {
    return (
        <div className="row">
            <div className="col-4"><TitrePageStyled>{title}</TitrePageStyled></div>
            <div className="col-8"><HrStyled /></div>
        </div>
    );
}
export default TitrePage;