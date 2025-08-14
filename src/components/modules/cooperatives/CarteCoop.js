import React, {Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import { extractShapes } from '../utils';
import markerIcon from '../../assets/marker-icon.png';
import loader from '../../assets/animation.gif';
import limit_ci from '../../data/limite_ci.json';
import limit_ghana from '../../data/map_ghana.json';
import { useTranslation } from "react-i18next";


import {
    Circle,
    FeatureGroup,
    LayerGroup,
    LayersControl,
    MapContainer,
    Marker,
    Popup,
    Rectangle,
    TileLayer,
    useMap,
    GeoJSON,
    Tooltip,
} from 'react-leaflet';
import MapPrint from "./MapPrint";
import Content from '../../Content';
import osm from '../../osm-providers';
import forets from '../../data/SHAPE.json';
import Shapefile from '../shapefiles';
import toGeoJSON from 'togeojson';
import L from "leaflet";
import { Icon } from 'leaflet';
import Sidebar from '../Sidebar';
import NavBar from '../Navbar';

// import agroforest from '../../data/foret_Agro.json';
// import classe from '../../data/foret_classées.json';
// import parc from '../../data/parcs.json';


import Parcelle_Buffer from '../../data/Parcelle_risque_Modere_Agrial.json';
import Risque_Zero from '../../data/Parcelle__Agrial_risque_zero_new.json';
import Data_Invalid from '../../data/Parcelle_Agrial_invalide_new.json';
import TAMPON from '../../data/Zone_tampon_Agrial.json';
import Infra from '../../data/Infrastructure.json'

// Data CoopaaHS
// import Coopaahs_Zone_Tampon2 from '../../data/Tampon_Coopaahs2.json';
import Buffer from '../../data/new_tampon.json';

import agroforest from '../../data/new_agroforets.json';
import classe from '../../data/new_fc.json';
import parc from '../../data/new_park.json';
import contours from '../../data/capressa.json'


import UserContext from '../../context/useContext';
import axios from 'axios';
import MarkerClusterGroup from 'react-leaflet-cluster';
import moment from 'moment';
import {useParams} from "react-router-dom";

import BaseUrl from "../../config/baseUrl";

// const baseUrl = 'http://127.0.0.1:8000/api';
const url = BaseUrl();

// wrap `PrintControl` component with `withLeaflet` HOC
// const PrintControl = PrintControlDefault;

function CarteCoop(){
    const {t} = useTranslation();
    const [baseMap, setBaseMap] = useState('gSatellelite');
    const user = UserContext();
    const [loading, setLoading] = useState(true);
    const [kmlData, setKMLData] = useState(null);
    const [cooperativeList,setCooperativeList] = useState([]);
    const [prodList,setProdList] = useState([]);
    const [search, setSearch] = useState("");
    const [totalPoint,setTotalPoint] = useState([]);
    const [totalSectPoint,setTotalSectPoint] = useState([]);
    // const {coopID} = useParams();const {coopID} = useParams();
    const [allpoints, setAllpoints] = useState([]);
    const [dataIsloading, setDataIsLoading] = useState(false);
    const [activeNav,setActiveNav] = useState('tous');
    const [idIndex,setIdIndex] = useState({
        'code':'',
        'index':''
    });
    const [plantingList,setPlantingList] = useState([]);
    const [detailPlantingList,setDetailPlantingList] = useState([]);
    const [sectionList,setSectionList] = useState([]);
    const [color, setColor] = useState("#ffff00");
    const [layers, setLayers] = useState({
        agroforest: true,
        classe: true,
        parc: true,
        Buffer: false,
        contours: false,
    });

    const center = [5.316667, -4.033333]

    let DefaultIcon = L.icon({
      iconUrl: markerIcon,
      iconSize: [15, 20],
      iconAnchor: [15, 20],
      popupAnchor: [2, -41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    const onEachFeature = (feature, layer) => {
        if (feature.properties) {
            const name = feature.properties.NAME || feature.properties.Nom || "Inconnu";
            layer.bindPopup(`<b>Code:</b> ${feature.properties.Code} <br> <b>Nom:</b> ${name} <br> <b>Super:</b> ${feature.properties.Area} Ha`);
        }
    };

    const onEachFeatureAgroforet = (feature, layer) => {
        if (feature.properties) {
            const name = feature.properties.NAME || "Inconnu";
            layer.bindPopup(`<b>Catégorie:</b> ${feature.properties.CATEGORY} <br> <b>Nom:</b> ${name} <br> <b>Superficie:</b> ${feature.properties.AREA_HA} Ha`);
        }
    };


    const onEachContours = (feature, layer) => {
        if (feature.properties) {
            const name = feature.properties.NAME || feature.properties.NOM || "Inconnu";
            layer.bindPopup(`<b>Code:</b> <b>${feature.properties.CODE}</b> <br> <b>Producteur:</b> ${feature.properties.NOM} <br> <b>Superficie:</b> ${feature.properties.SUPERFICIE} Ha`);
        }
    };

    const renderGeoJSON = useMemo(() => {
        return (
            <>
                {layers.agroforest && <GeoJSON data={agroforest} style={{ color: "#FFFF00" }} onEachFeature={onEachFeatureAgroforet} />}
                {layers.classe && <GeoJSON data={classe} style={{ color: '#18bd38' }} onEachFeature={onEachFeatureAgroforet} />}
                {layers.parc && <GeoJSON data={parc} style={{ color: '#95A595' }} onEachFeature={onEachFeatureAgroforet} />}
                {layers.Buffer && <GeoJSON data={Buffer} style={{ color: 'white' }} onEachFeature={onEachFeatureAgroforet}/>}
                {layers.contours && <GeoJSON data={contours} style={{ color: "#6497b1" }} onEachFeature={onEachContours}/>}
            </>
        )
    })


    // Simuler le chargement des données (remplace ça par ton fetch API si nécessaire)
    useEffect(() => {
        setTimeout(() => {
            setLoading(false); // Désactiver le loader après chargement
        }, 2000); // Simule 2 sec de chargement (ajuste selon besoin)
    }, []);

    const toggleLayer = useCallback((layer) => {
        setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    }, [])


    useEffect(()=>{
        if(user){
            fetchDataCoop();
        }
    },[user,idIndex]);


    function fetchDataCoop(){
        //setDataIsLoading(true);
        setActiveNav('tous');
        try {
            setLoading(true);
            axios.get(url+'/cooperative-list/?userID='+user.id).then((resp)=>{
                setCooperativeList(resp.data);
                console.log(resp.data)
                axios.get(url+'/section-list/?coopID='+resp.data[0].id).then((reponse)=>
                // axios.get(url+'/section-list/?coopID='+resp.data.id).then((reponse)=>
                    {
                        setSectionList(reponse.data);
                        console.log(reponse.data)
                    }
                )
            });

            axios.get(url+'/parcelles-carte/?manager='+user.id).then((resp)=>{
                //setDataIsLoading(false);
                setAllpoints(resp.data.results);
                setTotalPoint(resp.data.count)
                console.log(resp.data)
              })

        } catch (error) {
            console.log(error);
        }
    }

    const handleFileUpload = (e) => {
        setDataIsLoading(true);
        const file = e.target.files[0];
        
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const kmlText = event.target.result;
            const kmlDom = new DOMParser().parseFromString(kmlText, 'text/xml');
            const geoJSON = toGeoJSON.kml(kmlDom);
           // console.log(geoJSON)
            setKMLData(geoJSON);
          };
          reader.readAsText(file);
        }
        setDataIsLoading(false);
    };


    const OnEachCountry = (country, layer) => {
        const countryName = country.properties.NAME;
        layer.bindPopup(countryName);
    };

    const OnEachCountryBuffer = (country, layer) => {
        const countryName = country.properties.Name;
        layer.bindPopup(countryName);
    };

    const OnEachCountryInfra = (country, layer) => {
        const countryName = country.properties.POINT;
        layer.bindPopup(countryName);
    };

    const OnEachCountryTampon = (country, layer) => {
        // const countryName = country.coordinates.NAME;
        const countryName = country.properties.NAME;
        // console.log(countryName);
        layer.bindPopup(countryName);
    };

     const changeCountryColor = (event) => {
        event.target.setStyle({
          color: color,
          fillColor: setColor(color),
          fillOpacity: 1,
        });
      };

      const countryStyle = {
        fillColor: "",
        fillOpacity: 0,
        color: "black",
        weight: 2.5,
        opacity: 0.5,
    };

    const allPointSection=(id,lib)=>{
        setDataIsLoading(true);
        setActiveNav(lib);
        try {
            axios.get(url+'/parcelles-carte/?sectionID='+id).then((resp)=>{
              setDataIsLoading(false);
              setAllpoints(resp.data.results);
              setTotalSectPoint(resp.data.count)
            })
          } catch (error) {
            console.log(error);
          }
    }




    const voirSuiviofParc=(code,idx)=>{

        //setIdIndex(idx);
        window.$(`#openModalPlanting${idx}`).modal('show');
         try {
            axios.get(url+'/planting-list/?parcId='+code).then((resp)=>{
                setPlantingList(resp.data);
            });
        } catch (error) {
            console.log(error);
        } 
    }


    const DetailPlantModal=(plant,i)=>{
        setIdIndex({
            'code':plant,
            'index':i
        });
        setDetailPlantingList([]);

        window.$(`#addEventModalDetailPlant${i}`).modal('show');

        try {
          axios.get(url+'/detail-planting-list/?plantCode='+plant).then((resp)=>{
            setDetailPlantingList(resp.data);
          })
        } catch (error) {
          console.log(error);
        }
    }


      if (dataIsloading === true) {
        return (
  
        <div id="preloader-active bg-white">
                <div style={{ marginTop: "150px", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <img src={loader} alt="chargement en cours Patienter SVP..." />
                </div>
        </div>
        );
    }
    
    // Fonction pour changer la carte de base
    const changeBaseMap = (mapType) => {
        setBaseMap(mapType);
    };

    // const toggleLayer = useCallback((layer) => {
    //     setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
    // }, []);

    


   return (
    <Fragment>
        <main className="main mt-5" id="top" style={{backgroundColor: "#EEF1DE"}}>
            <nav className="navbar navbar-vertical navbar-expand-lg" style={{backgroundColor: "#EEF1DE"}}>
            <div className="collapse navbar-collapse" id="navbarVerticalCollapse">
                <div className="navbar-vertical-content" style={{backgroundColor: "#EEF1DE"}}>
                    <ul className="navbar-nav flex-column" id="navbarVerticalNav">
                    <a className={activeNav == 'tous' ? "nav-link active" : "nav-link"} href="#" data-bs-toggle="" aria-expanded="false" onClick={()=>fetchDataCoop()}>
                        <div className="d-flex align-items-center">
                            <span className="" style={{fontWeight: "bold", fontSize: 28, marginTop: "20px"}}>{t("TOUS")} <span className="text-white" style={{backgroundColor: 'red', borderRadius: 15}}>({totalPoint})</span> </span>
                        </div>
                    </a>
                    {cooperativeList.map((cooperative,index)=> 
                        <li className="nav-item" >
                        <div className="nav-item-wrapper">
                            <a className="nav-link dropdown-indicator label-1" href="#nv-home" role="button" data-bs-toggle="collapse" aria-expanded="true" aria-controls="nv-home">
                                <div className="d-flex align-items-center">
                                <div className="dropdown-indicator-icon">
                                    <span className="fas fa-caret-right"></span>
                                </div>
                                <span className="nav-link-icon">
                                    <span data-feather="pie-chart"></span>
                                </span>
                                <span className="nav-link-text text-1000 text-uppercase">
                                    {cooperative.nomCoop} 
                                </span>
                                </div>
                            </a>
                            <div className="parent-wrapper label-1">
                                <ul className="nav collapse parent show" data-bs-parent="#navbarVerticalCollapse" id="nv-home">
                                {sectionList.map((section,index)=>
                                        <li className="nav-item ">
                                        <a className={activeNav == section.libelle ? "nav-link active" : "nav-link"} data-bs-toggle="" aria-expanded="false" onClick={()=>allPointSection(section.id,section.libelle)}>
                                            <div className="d-flex align-items-center">
                                                <span className="">{section.libelle}</span>
                                            </div>
                                        </a>
                                    </li>
                                )}                        
                                </ul>
                            </div>                        
                        </div>
                    </li>
                    )}                    
                    </ul>
                </div>
            </div>
        </nav>
        <NavBar />


        <div className="content" style={{backgroundColor: "#EEF1DE"}}>
            <div style={{marginLeft: "-37px", marginTop: "-35px", marginRight: "-35px"}}>
                <div className="row">
                    <div className="col-sm-8">
                        <div className="mb-1">
                            <label className="form-label" htmlFor="customFile">{t("Importer un fichier KML")}</label>
                            <input onChange={handleFileUpload} className="form-control" id="customFile" type="file"/>
                        </div>
                    </div>
                    <div className="col-sm-4 flex-end-center">
                        <label className="form-label" htmlFor="customFile">{t("Trouver un Producteur")}</label>
                        <div className="col col-auto">
                            <div className="search-box">
                                <form>
                                    <input className="form-control search-input search" type="text" aria-label="Search"
                                           onChange={(e) => setSearch(e.target.value)}
                                           placeholder={t("Nom, Code")}
                                    />
                                    <span className="fas fa-search search-box-icon"></span>                                   
                                </form>                            
                            </div>
                        </div>
                    </div>
                </div>
                <MapContainer
                    center={center}
                    zoom={6.4}
                    style={{height: '840px', width: '100%', backgroundColor:"#EEF1DE"}}
                    scrollWheelZoom={true}
                >

                    <TileLayer
                        url={
                            baseMap === 'gSatellelite' ? 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' :
                            baseMap === 'osm' ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' :
                            baseMap === 'google' ? 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}' :
                            baseMap === 'google-street' ? 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' : ''
                        }
                    />
                    <TileLayer
                        url={osm.googleMap.url}
                        attribution={osm.googleMap.attribution}
                    />
                    <GeoJSON
                        style={countryStyle}
                        data={limit_ci}
                        //onEachFeature={OnEachCountry}
                    />

                    <GeoJSON
                        style={countryStyle}
                        data={limit_ghana}
                        //onEachFeature={OnEachCountry}
                    />

                    <LayersControl>
                        <LayersControl.Overlay checked name={t("Agroforêts")}>
                            <GeoJSON
                                // style={{"color":"#FFFF00"}}
                                style={{
                                    border: "1px",
                                    solid: "#ccc",
                                    float: "left",
                                    width: "40px",
                                    height: "22px",
                                    margin: "2px",
                                    color: "#FFFF00"
                                }}
                                data={agroforest}
                                onEachFeature={OnEachCountry}
                            />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay checked name={t("Forêts classées")}>
                            <GeoJSON
                                // style={{"color":"#3AF24B"}}
                                style={{
                                    border: "1px",
                                    solid: "#ccc",
                                    float: "left",
                                    width: "40px",
                                    height: "22px",
                                    margin: "2px",
                                    color: "#18bd38"
                                }}
                                data={classe}
                                onEachFeature={OnEachCountry}
                            />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay checked name={t("Parcs & Réserves nationals")}>
                            <GeoJSON
                                // style={{"color":"#95A595"}}
                                style={{
                                    border: "1px",
                                    solid: "#ccc",
                                    float: "left",
                                    width: "40px",
                                    height: "22px",
                                    margin: "2px",
                                    color: "#95A595"
                                }}
                                data={parc}
                                onEachFeature={OnEachCountry}
                            />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name={t("Zone tampon à 2 Km")}>
                            <GeoJSON
                                style={{"color": "#fff"}}
                                data={Buffer}
                                onEachFeature={OnEachCountryTampon}
                            />
                        </LayersControl.Overlay>
                        <LayersControl.Overlay name={t("Contours")}>
                            <GeoJSON
                                style={{"color": "#6497b1"}}
                                data={contours}
                                onEachFeature={onEachContours}
                            />
                        </LayersControl.Overlay>
                    </LayersControl>

                    {renderGeoJSON}

                    {user && user?.id === 8 ?
                        <LayersControl>
                            <LayersControl.Overlay name={t("Zone tampon à 2 Km")}>
                                <GeoJSON
                                    style={{"color": "#fff"}}
                                    data={Buffer}
                                    onEachFeature={OnEachCountryTampon}
                                />
                            </LayersControl.Overlay>

                        </LayersControl>
                        :
                        ""
                    }

                    {user && user?.id === 11 ?
                        <LayersControl>
                            <LayersControl.Overlay name={t("Zone tampon à 2 Km")}>
                                <GeoJSON
                                    style={{"color": "#fff"}}
                                    data={Buffer}
                                    onEachFeature={OnEachCountryTampon}
                                />
                            </LayersControl.Overlay>

                        </LayersControl>
                        :
                        ""
                    }

                    {loading ? (
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <img src={loader} alt="chargement en cours Patienter SVP..." />
                        </div>
                    ): (
                        <MarkerClusterGroup chunkedLoading>
                            {allpoints.filter((point) => {
                                return search.toLowerCase() === ""
                                    ? point
                                    : point.code.toLowerCase().includes(search) || point.producteur?.nomComplet.toLowerCase().includes(search);
                            }).map((point, index) => {
                                if (point.latitude && point.longitude) {
                                    return (
                                        <Marker
                                            key={point.id}
                                            icon={DefaultIcon}
                                            position={[
                                                point.latitude,
                                                point.longitude
                                            ]}
                                        >
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
                                    )
                                }
                            })}
                        </MarkerClusterGroup>
                    )}
                    {kmlData && <MarkerClusterGroup chunkedLoading><GeoJSON data={kmlData}/></MarkerClusterGroup>}

                    <MapPrint position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Print" />
                    <MapPrint position="topleft" sizeModes={['Current', 'A4Portrait', 'A4Landscape']} hideControlContainer={false} title="Export as PNG" exportOnly />


                </MapContainer>
                <div className="mt-2 bg-white p-3 border-2 rounded-5 legend" style={{listStyle: null, marginBottom: "5px", height: "80px",}}>
                    <h4 style={{marginTop: "0px"}}>{t("STATUT FONCIER")}</h4>
                    <div style={{float: "left", marginRight: "10px"}}><span className="superawesome" style={{
                        border: "1px",
                        solid: "#ccc",
                        float: "left",
                        width: "40px",
                        height: "22px",
                        margin: "2px",
                        backgroundColor: "#FFFF00"
                    }}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Agroforêt")}</i></span></div>
                    <div style={{float: "left", marginRight: "10px"}}><span className="awesome" style={{
                        border: "1px",
                        solid: "#ccc",
                        float: "left",
                        width: "40px",
                        height: "22px",
                        margin: "2px",
                        backgroundColor: "#18bd38"
                    }}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Forêt classée")}</i></span></div>
                    <div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{
                        border: "1px",
                        solid: "#ccc",
                        float: "left",
                        width: "40px",
                        height: "22px",
                        margin: "2px",
                        backgroundColor: "#95A595"
                    }}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Parc & réserve")}</i></span></div>
                </div>
                <div className="legend" style={{listStyle: null, marginTop: "10px", marginLeft: "20px"}}>

                    <h4 style={{marginTop: "0px"}}>{t("NIVEAU DE RISQUE")}</h4>
                    <div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{
                        border: "1px",
                        solid: "#ccc",
                        float: "left",
                        width: "40px",
                        height: "22px",
                        margin: "2px",
                        backgroundColor: "#ee6b6e"
                    }}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Données invalides")}</i></span>
                    </div>
                    <div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{
                        border: "1px",
                        solid: "#ccc",
                        float: "left",
                        width: "40px",
                        height: "22px",
                        margin: "2px",
                        backgroundColor: "#FFFFFF"
                    }}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Risque zéro")}</i></span></div>
                    <div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{
                        border: "1px",
                        solid: "#ccc",
                        float: "left",
                        width: "40px",
                        height: "22px",
                        margin: "2px",
                        backgroundColor: "#D56E1B"
                    }}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Risque modéré")}</i></span></div>
                    <div style={{float: "left", marginRight: "10px"}}><span className="kindaawesome" style={{
                        border: "1px",
                        solid: "#ccc",
                        float: "left",
                        width: "40px",
                        height: "22px",
                        margin: "2px",
                        backgroundColor: "#a20317"
                    }}></span> <span style={{fontWeight: "bold", fontSize: "20px"}}><i> {t("Risque élevé")}</i></span></div>
                    {/*<li style={{float: "left", marginRight: "10px"}}><span className="notawesome" style={{border: "1px", solid: "#ccc", float: "left", width: "12px", height: "12px", margin: "2px", backgroundColor: "#000000"}}></span> Not Awesome</li>*/}
                </div>
                <br/>
                <br/>
                {/*<button className="btn btn-primary" onClick={browserControl}>Print</button>*/}
                <div className="bg-white p-3 border-5 rounded-5" style={{marginTop: "-10px", marginBottom: "-50px", height: "120px"}}>
                    <ul style={{marginTop: "0px"}}>
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
        </main>
    </Fragment>
   )

}

export default CarteCoop;