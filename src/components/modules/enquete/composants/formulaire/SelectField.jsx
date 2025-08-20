function SelectField({ elements, label, onChange }) {

    const handleChange = (event) => {
        onChange(event);
    };

    return (
        <div className="mb-3">
            {/* <label className="form-label">{label}</label> */}
            <select className="select-form" onChange={handleChange}>
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