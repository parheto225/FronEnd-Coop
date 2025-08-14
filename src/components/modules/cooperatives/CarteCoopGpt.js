import React, { useEffect, useState, useMemo, useCallback } from 'react';
import markerIcon from '../../assets/marker-icon.png';
import loader from '../../assets/animation.gif';
import limit_ci from '../../data/limite_ci.json';
import limit_ghana from '../../data/map_ghana.json';
import { useTranslation } from "react-i18next";
import L from 'leaflet';
import { FeatureGroup, LayersControl, MapContainer, Marker, GeoJSON, ScaleControl, TileLayer, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapPrint from "./MapPrint";
import osm from '../../osm-providers';
import agroforest from '../../data/new_agroforets.json';
import contours from '../../data/capressa.json'
import classe from '../../data/new_fc.json';
import parc from '../../data/new_park.json';
import Buffer from '../../data/new_tampon.json';
import risque_eleve from '../../data/risque_eleve.json';
import risque_modere from '../../data/risque_modere.json';
// import risque_zero from '../../data/risque_zero.json';
import UserContext from '../../context/useContext';
import axios from 'axios';
import MarkerClusterGroup from 'react-leaflet-cluster';

import BaseUrl from "../../config/baseUrl";
import { MarkerCluster } from 'leaflet';

const url = BaseUrl();
const { BaseLayer, Overlay } = LayersControl;

const CarteCoopGpt = () => {
    const [geoData, setGeoData] = useState({
        limit_ci: limit_ci,
        limit_ghana: limit_ghana
    });
    const [baseMap, setBaseMap] = useState('gSatellelite');
    const [allpoints, setAllpoints] = useState([]);
    const { t } = useTranslation();
    const user = UserContext();
    const [loading, setLoading] = useState(true);
    const [layers, setLayers] = useState({
        limit_ci: true,
        limit_ghana: true,
        agroforest: true,
        contours: false,
        classe: true,
        parc: true,
        Buffer: false
    });


    const DefaultIcon = useMemo(() => L.icon({
        iconUrl: markerIcon,
        iconSize: [15, 20],
        iconAnchor: [15, 20],
        popupAnchor: [2, -41],
    }), []);
    
    useEffect(() => {
        L.Marker.prototype.options.icon = DefaultIcon;
    }, [DefaultIcon]);

    // Simuler le chargement des données (remplace ça par ton fetch API si nécessaire)
    useEffect(() => {
        setTimeout(() => {
            setLoading(false); // Désactiver le loader après chargement
        }, 2000); // Simule 2 sec de chargement (ajuste selon besoin)
    }, []);

    useEffect(() => {
        // Set initial geoData (limit_ci and limit_ghana only)
        setGeoData({ limit_ci, limit_ghana });
    }, []);

    //1. Optimisation du Chargement des Données | correction de la requêtes avec un meilleurs chargement des données
    useEffect(() => {
        if (!user) return;    
        setLoading(true);
        axios.get(`${url}/parcelles-carte/?manager=${user.id}`, { cache: true })
            .then(resp => {
                setAllpoints(resp.data.results);
            })
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }, [user]);
    

    const getColor = (layer) => {
        const colors = {
            limit_ci: 'black',
            limit_ghana: 'black',
            agroforest: "#FFFF00",
            classe: "#18bd38",
            parc: "#95A595",
            contours: '#189ab4',
            Buffer: 'white',
            risque_eleve: 'red',
            risque_modere: 'orange',
            // risque_zero: "white",
        };
        return colors[layer] || 'black';
    };

    // const onEachFeature = (feature, layer) => {
    //     if (feature.properties) {
    //         const name = feature.properties.NOM || feature.properties.Nom || "Inconnu";
    //         layer.bindPopup(`<b>NUMERO_ID:</b> ${feature.properties.NUMERO_ID_} <br><b>Code:</b> ${feature.properties.CODE} <br> <b>Nom:</b> ${name}<br><b>Contact:</b> ${feature.properties.NUM_TEL} Ha <br> <b>Super:</b> ${feature.properties.SUPERFICIE} Ha<br> <b>Année Création:</b> ${feature.properties.ANNEE_NAIS}`);
    //     }
    // };

    const onEachFeature = (feature, layer) => {
        if (feature.properties) {
            const name = feature.properties.NOM || feature.properties.Nom || "Inconnu";
            layer.bindPopup(`
                📌 <b>NUMERO_ID:</b> ${feature.properties.NUMERO_ID_}<br>
                🧾 <b>Code:</b> ${feature.properties.CODE}<br>
                🧑‍🌾 <b>Nom:</b> ${name}<br>
                📞 <b>Contact:</b> ${feature.properties.NUM_TEL}<br>
                📐 <b>Superficie:</b> ${feature.properties.SUPERFICIE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Ha<br>
                🗓️ <b>Année Création:</b> ${feature.properties.ANNEE_NAIS}
            `);
        }
    };

    const onEachFeatureAgroforet = (feature, layer) => {
        if (feature.properties) {
            const name = feature.properties.NAME || "Inconnu";
            layer.bindPopup(`<b>Catégorie:</b> ${feature.properties.CATEGORY} <br> <b>Nom:</b> ${name} <br> <b>Superficie:</b> ${feature.properties.AREA_HA.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Ha`);
        }
    };

    const renderGeoJSON = useMemo(() => {
        if (!geoData) return null;
        return (
            <>
                {layers.limit_ci && <GeoJSON data={geoData.limit_ci} style={{ color: 'black' }} />}
                {layers.limit_ghana && <GeoJSON data={geoData.limit_ghana} style={{ color: 'black' }} />}
                {layers.agroforest && <GeoJSON data={agroforest} style={{ color: "#FFFF00" }} onEachFeature={onEachFeatureAgroforet} />}
                {layers.classe && <GeoJSON data={classe} style={{ color: '#18bd38' }} onEachFeature={onEachFeatureAgroforet} />}
                {layers.parc && <GeoJSON data={parc} style={{ color: '#95A595' }} onEachFeature={onEachFeatureAgroforet} />}
                {layers.contours && <GeoJSON data={contours} style={{ color: '#189ab4' }} onEachFeature={onEachFeature} />}
                {layers.Buffer && <GeoJSON data={Buffer} style={{ color: 'white' }} onEachFeature={onEachFeatureAgroforet}/>}
                {layers.risque_eleve && <GeoJSON data={risque_eleve} style={{ color: 'red' }} onEachFeature={onEachFeature}/>}
                {layers.risque_modere && <GeoJSON data={risque_modere} style={{ color: 'orange' }} onEachFeature={onEachFeature}/>}
                {/* {layers.risque_zero && <GeoJSON data="" style={{ color: 'white' }} onEachFeature={onEachFeature}/>} */}

            </>
        );
    }, [geoData, layers]);
    

    const memoizedGeoJSON = useMemo(() => {
        if (!geoData || Object.keys(geoData).length === 0) return null;
    
        return Object.entries(layers).map(([key, isActive]) => {
            if (!isActive || !geoData[key]) return null;
            
            return (
                <GeoJSON 
                    key={key} 
                    data={geoData[key]} 
                    style={{ color: getColor(key) }} 
                    onEachFeature={onEachFeature} 
                />
            );
        });
    }, [geoData, layers]);
    
    

    // Fonction pour changer la carte de base
    const changeBaseMap = (mapType) => {
        setBaseMap(mapType);
    };

    const toggleLayer = useCallback((layer) => {
        setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    }, []);

    

    return (
        <div style={{ display: 'flex' }}>
            {/* Menu latéral */}
            <div style={{ width: '350px', backgroundColor: "#D6D8C7", padding: '10px', borderRight: '1px solid #ccc' }} className="mt-2 p-3 border-2 rounded-5 legend">
                <h4>{t("STATUT FONCIER")}</h4>
                <label>
                <input type="checkbox" checked={layers.agroforest} onChange={() => toggleLayer('agroforest')} />
                        <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Agroforêts")} </i></span>
                        <div style={{float: "right", marginRight: "10px"}}> 
                            <span className="superawesome" 
                                style={{
                                    border: "1px",
                                    solid: "#ccc",
                                    float: "left",
                                    width: "40px",
                                    height: "22px",
                                    margin: "2px",
                                    backgroundColor: "#FFFF00",
                                    marginLeft: '10px'
                                }}></span>
                        </div>    
                </label>
                <label>
                    <input type="checkbox" checked={layers.classe} onChange={() => toggleLayer('classe')} />
                    <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Forêt classée")} </i></span>
                    <div style={{float: "right", marginRight: "10px"}}> 
                        <span className="superawesome" 
                            style={{
                                border: "1px",
                                solid: "#ccc",
                                float: "left",
                                width: "40px",
                                height: "22px",
                                margin: "2px",
                                backgroundColor: "#18bd38",
                                marginLeft: '10px'
                            }}></span>
                    </div>    
                </label>
                <br />
                <label>
                    <input type="checkbox" checked={layers.parc} onChange={() => toggleLayer('parc')} />
                    <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Parc & réserve")} </i></span>
                    <div style={{float: "right", marginRight: "10px"}}> 
                        <span className="superawesome" 
                            style={{
                                border: "1px",
                                solid: "#ccc",
                                float: "left",
                                width: "40px",
                                height: "22px",
                                margin: "2px",
                                backgroundColor: "#95A595", 
                                marginLeft: '10px'
                            }}></span>
                    </div>    
                </label>
                <br />
                <label>
                    <input type="checkbox" checked={layers.contours} onChange={() => toggleLayer('contours')} />
                    <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Contours Parcelle")} </i></span>
                    <div style={{float: "right", marginRight: "10px"}}> 
                        <span className="superawesome" 
                            style={{
                                border: "1px",
                                solid: "#ccc",
                                float: "left",
                                width: "40px",
                                height: "22px",
                                margin: "2px",
                                backgroundColor: "#189ab4", 
                                marginLeft: '10px'
                            }}></span>
                    </div>    
                </label>
                <br />
                <label>
                    <input type="checkbox" checked={layers.Buffer} onChange={() => toggleLayer('Buffer')} />
                    <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Buffer 2KM")} </i></span>
                    <div style={{float: "right", marginRight: "10px"}}> 
                        <span className="superawesome" 
                            style={{
                                border: "1px",
                                solid: "#ccc",
                                float: "left",
                                width: "40px",
                                height: "22px",
                                margin: "2px",
                                backgroundColor: "white", 
                                marginLeft: '10px'
                            }}></span>
                    </div>    
                </label>
                <br />
                <hr style={{height: "2px", borderWidth: "0", color: "#000", backgroundColor: "#000"}} />
                <div className="legend" style={{listStyle: null, marginTop: "10px"}}>
                <h4 style={{marginTop: "0px"}}>{t("NIVEAU DE RISQUE (1 266)")}</h4>
                    <label>
                        <input type="checkbox" checked={layers.risque_eleve} onChange={() => toggleLayer('risque_eleve')} />
                        <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Risque élevé (1)")} </i></span>
                        <div style={{float: "right", marginRight: "10px"}}> 
                            <span className="superawesome" 
                                style={{
                                    border: "1px",
                                    solid: "#ccc",
                                    float: "left",
                                    width: "40px",
                                    height: "22px",
                                    margin: "2px",
                                    backgroundColor: "red", 
                                    marginLeft: '10px'
                                }}></span>
                        </div>    
                    </label>
                    <br />
                    <label>
                        <input type="checkbox" checked={layers.risque_modere} onChange={() => toggleLayer('risque_modere')} />
                        <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Risque modéré (169)")} </i></span>
                        <div style={{float: "right", marginRight: "10px"}}> 
                            <span className="superawesome" 
                                style={{
                                    border: "1px",
                                    solid: "#ccc",
                                    float: "left",
                                    width: "40px",
                                    height: "22px",
                                    margin: "2px",
                                    backgroundColor: "orange", 
                                    marginLeft: '10px'
                                }}></span>
                        </div>    
                    </label>
                    <br />
                    <label>
                    <input type="checkbox" checked={layers.risque_zero} onChange={() => toggleLayer('risque_zero')} />
                        <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Risque zéro (1 097)")} </i></span>
                        <div style={{float: "right", marginRight: "10px"}}> 
                            <span className="superawesome" 
                                style={{
                                    border: "1px",
                                    solid: "#ccc",
                                    float: "left",
                                    width: "40px",
                                    height: "22px",
                                    margin: "2px",
                                    backgroundColor: "white", 
                                    marginLeft: '10px'
                                }}></span>
                        </div>    
                    </label>
                    <br />
                    <label>
                        <input type="checkbox" onChange={() => toggleLayer('')} />
                        <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Données invalides")} </i></span>
                        <div style={{float: "right", marginRight: "10px"}}> 
                            <span className="superawesome" 
                                style={{
                                    border: "1px",
                                    solid: "#ccc",
                                    float: "left",
                                    width: "40px",
                                    height: "22px",
                                    margin: "2px",
                                    backgroundColor: "#ee6b6e", 
                                    marginLeft: '10px'
                                }}></span>
                        </div>    
                    </label>
                </div>
                <br />
                <hr style={{height: "2px", borderWidth: "0", color: "#000", backgroundColor: "#000"}} />
                {/* Section des basemaps */}
                <h4 style={{marginTop: "330px"}}>{t("BASEMAP")}</h4>
                {/* <label>
                    <input type="radio" name="basemap" checked={baseMap === 'gSatellelite'} onChange={() => changeBaseMap('gSatellelite ')} />
                    <span>Google Satellite</span>
                </label> */}
                <label>
                    <input type="radio" name="basemap" checked={baseMap === 'google'} onChange={() => changeBaseMap('google')} />
                    <span style={{fontWeight: "bold", fontSize: "20px",  padding: "10px"}}>Google Satellite</span>
                </label>
                <br />
                <label>
                    <input type="radio" name="basemap" checked={baseMap === 'google-street'} onChange={() => changeBaseMap('google-street')} />
                    <span style={{fontWeight: "bold", fontSize: "20px", padding: "10px"}}>Google Street</span>
                </label>
                <br />
                <label>
                    <input type="radio" name="basemap" checked={baseMap === 'osm'} onChange={() => changeBaseMap('osm')} />
                    <span style={{fontWeight: "bold", fontSize: "20px",  padding: "10px"}}>OpenStreetMap</span>
                </label>
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>

            {/* Map display */}
            <div style={{flex: 1, position: "relative", height: "90vh", overflow: "hidden"}}>
                <MapContainer center={[7.54, -5.55]} zoom={6.5} style={{ height: '75vh', width: '100%' }}>
                {/* Définir le basemap en fonction du choix */} gSatellelite
                    <TileLayer
                        url={
                            baseMap === 'gSatellelite' ? 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' :
                            baseMap === 'osm' ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' :
                            baseMap === 'google' ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' :
                            baseMap === 'google-street' ? 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' : ''
                        }
                    />
                    
                    {/* Afficher les GeoJSON par défaut */}
                    {geoData && (
                        <>
                            <GeoJSON data={geoData.limit_ci} style={{ color: 'black' }} />
                            <GeoJSON data={geoData.limit_ghana} style={{ color: 'black' }} />
                        </>
                    )}
                    {/* {memoizedGeoJSON} */}
                    {renderGeoJSON}

                    {loading ? (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <img src={loader} alt="chargement en cours Patienter SVP..." />
                        </div>
                    ): (
                        <MarkerClusterGroup chunkedLoading>
                            {allpoints.map((point, index) => (
                                <Marker key={point.id} position={[point.latitude, point.longitude]} icon={DefaultIcon}>
                                    <Popup className="p-4">
                                        <table class="table table-striped table-bordered">
                                            <thead style={{"align-items": "center"}}>
                                            {point.code_certif &&
                                                <tr className='bg-success'>
                                                    <b className='text-center'>{t("CERTIFIE")}</b>
                                                </tr>
                                            }
                                            <tr>
                                                <th scope="col" class="center">{t("ID")}</th>
                                                <th scope="col" class="center">{t("INFORMATIONS")}</th>
                                            </tr>
                                            </thead>
                                            <tbody style={{"align-items": "center"}}>
                                            <tr>
                                                <th scope="col"><b>{t("CODE")}</b></th>
                                                <td class="text-uppercase text-center">
                                                    {point.code_certif ?
                                                        <strong>{point.code_certif} / {point.code}</strong> :
                                                        <strong>{point.code}</strong>}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="col"><b>{t("PRODUCTEUR")}</b></th>
                                                <td class="text-uppercase text-center">
                                                    <strong>{point.producteur?.photo &&
                                                        <img src={point.producteur?.photo} width={30}
                                                                className='rounded-circle'/>} {point.producteur?.nomComplet}</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th scope="col"><b>{t("SECTION")}</b></th>
                                                <td class="text-uppercase text-center">
                                                    <strong>{point.producteur?.section?.libelle}</strong></td>
                                            </tr>
                                            <tr>
                                                <th scope="col"><b>{t("COORDONNEES")}</b></th>
                                                <td class="text-uppercase text-center">({point.latitude},{point.longitude})</td>
                                            </tr>

                                            <tr>
                                                <th scope="col"><b>{t("CULTURE")}</b></th>
                                                <td class="text-uppercase text-center">{point.culture?.libelle}</td>
                                            </tr>
                                            <tr>
                                                <th scope="col"><b>{t("SUPERFICIE")}</b></th>
                                                <td class="text-uppercase text-center">{point.superficie} (Ha)</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </Popup>
                                </Marker>
                            ))}     
                        </MarkerClusterGroup>
                    )}

                    <ScaleControl position="bottomright" />
                    <MapPrint />
                </MapContainer> 

                <div className="bg-white p-3 border-5 rounded-5" style={{ marginTop: "10px", height: "150px", marginBottom: "50px" }}>
                    <ul style={{marginTop: "0px", fontSize: "18px"}}>
                        <li>{t("Parcelles à Risque Elevé : Ensemble des parcelles qui chevauchent une Forêt classée / Parc & Réserve")}
                        </li>
                        <li>{t("Parcelles à Risque Modéré : Ensemble des parcelles situé à moins de 2 Km d'une forêt classée / parc & réserve")}
                        </li>
                        <li>{t("Parcelles à Risque zéro : Ensemble des parcelles situé à plus de 2 Km d'une forêt classée / parc & réserve")}
                        </li>
                        <li>{t("Données Invalides : Ensemble des parcelles ayant des irrégularités de polygones et de positionnement")}
                        </li>
                    </ul>
                </div>    
            </div>
        </div>
    );
};

export default CarteCoopGpt;