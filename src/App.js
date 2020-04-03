import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <header className="App-header">
                        <p className="mission">
                        In Italia e nel Mondo abbiamo di fronte un futuro incerto.<br />
Le decisioni critiche che lo influenzeranno in senso positivo devono essere basate sulla analisi di dati completi, verificati e che siano stati raccolti in modo omogeneo, relativamente alla diffusione delle infezioni, ospedalizzazioni e decessi causati dal virus SARS-Cov-2.<br />
IoConto vuole fornire, a tutti gli enti e anche a singoli individui, un sistema semplice da usare, efficiente, pubblico per raccogliere i dati, normalizzarli e distribuirli a chiunque ne abbia bisogno per disegnare scenari, prendere decisioni oculate e informare.<br />
<br /><a href="https://github.com/ioconto-org/datasets">Uniti ce la faremo</a>.
                        </p>
                        <p>
                            #IoConto
                        </p>
                    </header>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
