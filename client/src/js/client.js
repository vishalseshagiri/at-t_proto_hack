import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Route, Switch, HashRouter } from 'react-router-dom';

import Profile from "./components/Profile"
import Login from "./components/Login"
import Friends from "./components/Friends"
import store from "./store"
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/style.css'

const app = document.getElementById('app')

ReactDOM.render(
<HashRouter> 
<Provider store={store}>
<Switch>
    <Route exact path="/" component={Login}/>
    <Route path="/movies" component={Profile}/>
    <Route path="/friends" component={Friends}/>
  </Switch>
</Provider>
</HashRouter>, app);
