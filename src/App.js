import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <header className="App-header">
                        <div className="content">
                        <div className="col-6">
                            <p className="mission">
                            In Italia e nel Mondo abbiamo di fronte un futuro incerto.<br />
    Le decisioni critiche che lo influenzeranno in senso positivo devono essere basate sulla analisi di dati completi, verificati e che siano stati raccolti in modo omogeneo, relativamente alla diffusione delle infezioni, ospedalizzazioni e decessi causati dal virus SARS-Cov-2.<br />
    IoConto vuole fornire, a tutti gli enti e anche a singoli individui, un sistema semplice da usare, efficiente, pubblico per raccogliere i dati, normalizzarli e distribuirli a chiunque ne abbia bisogno per disegnare scenari, prendere decisioni oculate e informare.<br />
    <br /><a href="https://github.com/ioconto-org/datasets">Uniti ce la faremo</a>.
                            </p>
                            <p className="mission">
                                #IoConto
                            </p>
                            <a className="button" href="https://docs.google.com/forms/d/e/1FAIpQLSe_gJ1vM_2WXYkCNoyGwWRjLJcSlvEf9DwZAfpwR3IXLqbwSw/viewform">Segnalare Dati Comunali</a>
                            <a className="button" href="https://docs.google.com/forms/d/e/1FAIpQLSfbs90muj6Fe30pb2fi12kZDznBrvYhPSnB8nmSWjWP58jKuA/viewform">Segnalare Dati Ospedalieri</a>
                            <a className="button" href="https://docs.google.com/forms/d/e/1FAIpQLSd6_80C6IPNAyyMrIM5Z6MoUMtmTiEi56Ex9H_4rFvkgp9CvQ/viewform">Voglio Partecipare</a>
                        </div>
                        <div className="col-6">
                            <iframe width="100%" height="100%" frameborder="0" allowfullscreen src="//umap.openstreetmap.fr/en/map/morti-marzo-2020_440940#7/41.796/12.415?scaleControl=true&miniMap=false&scrollWheelZoom=true&zoomControl=true&allowEdit=false&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=undefined&captionBar=false"></iframe><p><a href="//umap.openstreetmap.fr/en/map/morti-marzo-2020_440940">Visualizzazione a schermo intero</a></p>
                        </div>
                        </div>
                    </header>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
