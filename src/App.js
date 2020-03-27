import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/">
                    <header className="App-header">
                        <p>
                            #IoConto.org
                        </p>
                    </header>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
