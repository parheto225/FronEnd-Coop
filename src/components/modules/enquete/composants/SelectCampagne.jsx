import { useState } from "react";

function SelectCampagne({ campagnes, onChange }) {

    const handleChange = (event) => {
        onChange(event);
    };

    return (
        <select className="select-campagne" onChange={handleChange}>
            <option value="" selected disabled>Choisir une campagne</option>
            <option value="0">Toutes les campagnes</option>
            {campagnes.map(campagne => (
                <option key={campagne.id} value={campagne.id}>
                    {campagne.libelle}
                </option>
            ))}
        </select>
    );
}
export default SelectCampagne;
