import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './pages/App.js';
import Map from './pages/Map.js';

class Router extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={App}></Route>
                    <Route path="/map" exact component={Map}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Router;