function TextField({ label, value, desabled=false, onChange }) {
    return (
        <div className="mb-3">
            <label className="form-label">{label}</label>
            <input
                disabled={desabled}
                type="text"
                className="form-control"
                placeholder="Entrez votre texte ici"
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
export default TextField;