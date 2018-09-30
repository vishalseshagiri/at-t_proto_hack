import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { Route, Switch, HashRouter } from 'react-router-dom';

import Profile from "./components/Profile"
import Login from "./components/Login"
import store from "./store"

const app = document.getElementById('app')

ReactDOM.render(
<HashRouter> 
<Provider store={store}>
<Switch>
    <Route exact path="/" component={Login}/>
    <Route path="/profile" component={Profile}/>
  </Switch>
</Provider>
</HashRouter>, app);
