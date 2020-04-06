import React from 'react';
import './custom.scss';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Button, Col, Container, Nav, Row} from "react-bootstrap";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <Container className={"p-3"}>
                        <Row>
                            <Col lg={6}>
                                <h1>
                                    #IoConto
                                </h1>
                                <p>
                                    In Italia e nel Mondo abbiamo di fronte un futuro incerto.
                                    <br/>
                                    Perché questo futuro possa essere indirizzato in senso positivo, è necessario che si
                                    prendano ora decisioni basate sulla analisi di dati completi, verificati e che siano
                                    stati raccolti in modo omogeneo relativamente
                                    alla diffusione delle infezioni, ospedalizzazioni e decessi causati dal virus
                                    SARS-Cov-2.
                                    <br/>
                                    IoConto vuole fornire, a tutti gli enti e anche a singoli individui, un sistema
                                    semplice da usare, efficiente, pubblico per raccogliere i dati, normalizzarli e
                                    distribuirli a chiunque ne abbia bisogno al fine di disegnare scenari, prendere
                                    decisioni oculate e informare. <a href="https://github.com/ioconto/covid19">Uniti ce
                                    la faremo.</a>
                                </p>
                                <Nav.Link
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSe_gJ1vM_2WXYkCNoyGwWRjLJcSlvEf9DwZAfpwR3IXLqbwSw/viewform">
                                    <Button variant="primary" size={"sm"} block>Segnalare Dati Comunali</Button>
                                </Nav.Link>
                                <Nav.Link
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSfbs90muj6Fe30pb2fi12kZDznBrvYhPSnB8nmSWjWP58jKuA/viewform">
                                    <Button variant="primary" size={"sm"} block>Segnalare Dati Ospedalieri</Button>
                                </Nav.Link>
                                <Nav.Link
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSd6_80C6IPNAyyMrIM5Z6MoUMtmTiEi56Ex9H_4rFvkgp9CvQ/viewform">
                                    <Button variant="primary" size={"sm"} block>Segnalare Voglio Partecipare</Button>
                                </Nav.Link>
                            </Col>
                            <Col sm={6}>
                                <iframe width="100%" height="100%"
                                        frameBorder="0"
                                        allowFullScreen
                                        title="IoConto.org"
                                        src="https://umap.openstreetmap.fr/en/map/morti-marzo-2020_440940#7/44.308/10.750?scaleControl=true&miniMap=false&scrollWheelZoom=true&zoomControl=true&allowEdit=false&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=undefined&captionBar=false">

                                </iframe>
                                <p className={"text-center"}>
                                    <Nav.Link
                                        href="//umap.openstreetmap.fr/en/map/morti-marzo-2020_440940#7/44.308/10.750">
                                        <small>Visualizzazione a schermo intero</small>
                                    </Nav.Link>
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
