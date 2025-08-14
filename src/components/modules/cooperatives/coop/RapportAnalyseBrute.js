import React, {Fragment} from 'react';
import {useEffect, useState} from "react";
import RAPPORT_UPDATE from "../../../data/rapport_brute.pdf"
import UserContext from "../../../context/useContext";

function RapportAnalyseBrute() {
    const [cooperatives,setCooperatives] = useState([]);
    const user =  UserContext();

    // useEffect(()=>{
    //
    // },[user,sideID])
    return (
        <Fragment>
            <div>
                <iframe
                    src={RAPPORT_UPDATE}
                    width="100%"
                    height="1000px"
                    allow="autoplay"
                    title="RAPPORT D'ANALYSE"
                />
            </div>
        </Fragment>
    )

}


export default RapportAnalyseBrute;