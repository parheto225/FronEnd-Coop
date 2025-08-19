import {Routes as Switch, Route} from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import Connexion from './auth/Connexion';
import Login from './auth/Login';
import Home from './modules/Home';
import SimulationCarbon from './modules/carbone/Simulation';
import CreateProjet from './parametres/projets/Create';
import DashCoop from './modules/cooperatives/DashCoop';
import ListeProj from './parametres/projets/Liste';
import ViewProj from './parametres/projets/Views';
import ViewsCoop from './modules/cooperatives/coop/Views';
import ViewsProd from './modules/cooperatives/producteur/Views';
import ProducteurList from './modules/cooperatives/producteur/Liste';
import ListCoop from './modules/cooperatives/coop/Liste';
import CampagneList from './parametres/campagnes/Liste';
import RecolteProdList from './modules/cooperatives/producteur/RecolteList';
import HistoriqueCoopList from './modules/cooperatives/coop/HistoriqueCoopList';
import ProdCoopList from './modules/cooperatives/coop/ProdList';
import ParcList from './modules/cooperatives/coop/ParcList';
import CarteProjet from './modules/cooperatives/Carte';
import CarteCoop from './modules/cooperatives/CarteCoop';
import CarteCoopGpt from './modules/cooperatives/CarteCoopGpt'
import CarteProducteur from './modules/cooperatives/producteur/CarteProd';
import Analyse from "./modules/rdue/Analyses";
import RapideGrah from "./modules/rdue/RapidGrah";
import HautDodo from "./modules/rdue/HtDodo";
import Scio from "./modules/rdue/Scio";
import Decret from './modules/rdue/Decrets';
import ParcListInf4ha from "./modules/cooperatives/coop/ParcList_inf_4ha";
import ParcListSup4ha from "./modules/cooperatives/coop/ParcList_sup_4ha";
import RapportAnalyseAgrial from "./modules/cooperatives/coop/RapportAnalyseAgrial";
import RapportAnalyseBrute from "./modules/cooperatives/coop/RapportAnalyseBrute";
import RapportAnalyseCoopaahs from "./modules/cooperatives/coop/RapportAnalyseCOOPAAHS";
import CarteParcelle from "./modules/cooperatives/CarteParcelles";
import ParcListModere from "./modules/cooperatives/coop/ParcListModere";
import ParcListSup4haNonMapper from './modules/cooperatives/coop/ParcList_sup_4ha_non_mapper';
import ProductionList from './modules/cooperatives/coop/ProductionList';
import AllFormations from './modules/cooperatives/coop/AllFormations';
import DetailFormations from './modules/cooperatives/coop/DetailFormation';
// import NewConnexion from './auth/NewLogin';

// import NewConnexion from './auth/NewLogin';
import LoadingScreen from './auth/LoadingScreen';

import Points from './modules/cooperatives/Points';
import ListeEnquetes from './modules/enquete/pages/ListeEnquetes';

// Lazy load uniquement pour Login
const NewConnexion = lazy(() => import('./auth/NewLogin'));

function Main(){
    return (
        <div>
             <Switch>
                <Route path="/dashboard/" element={<Home />} />
                {/* <Route path="/" element={<NewConnexion />} /> */}
                {/* <Route path="/" element={<Connexion />} /> */}

                {/* Utilisation de Suspense uniquement pour Login */}
                <Route
                    path="/"
                    element={
                        <Suspense fallback={LoadingScreen}>
                            <NewConnexion />
                        </Suspense>
                    }
                />
                <Route path="/login/" element={<Login />} />
                <Route path="/simulation-carbon/" element={<SimulationCarbon />} />

                {/* cooperatives */}
                <Route path="/dash-coop/" element={<DashCoop />} />
                <Route path="/carte-coops/" element={<CarteCoop />} />
                <Route path="/carte-coops-new/" element={<CarteCoopGpt />} />
                <Route path="/carte-parcelles/" element={<CarteParcelle />} />
                <Route path="/producteur-recoltes-views/:prodCode/" element={<RecolteProdList /> } />
                <Route path="/views-coop/:coopID/" element={<ViewsCoop />} />
                <Route path="/views-producteur/:prodID/" element={<ViewsProd />} />
                <Route path="/list-producteur/" element={<ProducteurList />} />
                <Route path="/list-coop/" element={<ListCoop />} />
                <Route path="/historiques-synchronisation-list/" element={<HistoriqueCoopList />} />
                <Route path="/coops/producteur-list/:coopID/" element={<ProdCoopList />} />
                <Route path="/coops/parcelles-list/:coopID/" element={<ParcList />} />

                <Route path="/carte-producteur-parcelle/:prodCode/" element={<CarteProducteur />} />
                <Route path="/rapport-traite/" element={<RapportAnalyseAgrial />} />
                <Route path="/decret-rapide-grah/" element={<RapideGrah />} />
                <Route path="/decret-haut-dodo" element={<HautDodo />} />
                <Route path="/decret-scio" element={<Scio />} />
                <Route path="/analyseCOOPAAHS/" element={<RapportAnalyseCoopaahs />} />
                <Route path="/decret-agrogorets/" element={<Decret />} />
                <Route path="/decret-rapid-grah/" element={<RapideGrah />} />
                <Route path="/decret-haut-dodo/" element={<HautDodo />} />
                <Route path="/decret-scio/" element={<Scio />} />
                <Route path="/rapport/" element={<RapportAnalyseAgrial />} />
                <Route path="/rapport-brute/" element={<RapportAnalyseBrute />} />

                {/* Paramètres */}
                <Route path="/create-projets/" element={<CreateProjet />} />
                <Route path="/list-projets/" element={<ListeProj />} />
                <Route path="/views-projet/:projetID/" element={<ViewProj />} />
                <Route path="/list-campagnes/" element={<CampagneList />} />

                 {/*ANALYSE RDUE*/}
                <Route path="/analyses/" element={<Analyse />} />
                <Route path="/coops/parcelles-list-inf-4ha/:coopID/" element={<ParcListInf4ha />} />
                <Route path="/coops/parcelles-list-sup-4ha/:coopID/" element={<ParcListSup4ha />} />
                <Route path="/coops/parcelles-list-sup-4ha-non-mapper/:coopID/" element={<ParcListSup4haNonMapper />} />
                <Route path="/coops/parcelles-list-modere/:coopID/" element={<ParcListModere />} />
                <Route path="/coops/productions-list/:coopID/" element={<ProductionList />} />

                <Route path="/points" element={<Points />} />
                <Route path="/formations/" element={<AllFormations />} />
                <Route path="/formations/:id" element={<DetailFormations />} />
                {/*MODULE ENQUETE*/}
                <Route path="/enquetes/" element={<ListeEnquetes />} />
            </Switch>
        </div>
    )
}

export default Main;