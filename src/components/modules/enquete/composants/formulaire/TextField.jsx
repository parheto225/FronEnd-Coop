function TextField({ label, type="text", name, value, desabled=false, onChange }) {
    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <input
                disabled={desabled}
                type={type}
                className="form-control"
                placeholder="Entrez votre texte ici"
                name={name}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
export default TextField;