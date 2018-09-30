import React from "react"
import { connect } from "react-redux"

import {login} from "../actions/loginActions"

import {Redirect} from "react-router-dom"
@connect((store) => {
    return {
        user_login: store.user_login
    }
})
export default class Login extends React.Component {
    constructor(props) {
        super(props)
        this.username = ""
        this.password = ""
    }

    login() {
        console.log(this)
        var payload = {
            "user" :  {
                "email" : this.username,
                "password" : this.password
            }
        }
        this.props.dispatch(login(payload))
    }

    handleChange(event) {
        this[event.target.name] = event.target.value;
    }

    render() {
        const {user_login} = this.props;
        console.log("here");
        console.log(user_login);

        if (!user_login.loggedIn) {
            return (<div>
                <h1>LOGIN PAGE</h1>
                <input className="input" type="text" name="username" onChange={this.handleChange.bind(this)}></input>
                <input className="input" type="password" name="password" onChange={this.handleChange.bind(this)}></input>
                <button onClick={this.login.bind(this)}>Login</button>
            </div>)
        }
        
    return <Redirect to="/profile" push/>
    // return <h4>testLogin</h4>
    }
}

// export default withRouter(Login)