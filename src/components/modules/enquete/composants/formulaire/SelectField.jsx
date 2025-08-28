import "../../../../assets/style/SelectCampagne.css"
function SelectField({ elements, name, label, onChange }) {

    return (
        <div className="mb-3">
            <label className="col-12 form-label">{label}</label>
            <select className="col-12 select-form select-campagne" name={name}  onChange={onChange}>
                <option selected disabled>{label}</option>
                {elements.map(element => (
                    <option key={element.id} value={element.id}>
                        {element.libelle}
                    </option>
                ))}
            </select>
        </div>
    );
}
export default SelectField;