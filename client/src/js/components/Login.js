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
    login(payload) {
        this.props.dispatch(login(payload))
        // this.props.history.push("/profile")
    }

    render() {
        const {user_login} = this.props;
        console.log("here");
        console.log(user_login);

        if (!user_login.loggedIn) {
            return (<div>
                <h1>LOGIN PAGE</h1>
                <button onClick={this.login.bind(this, {"user":{"email": "vishal@gmail.com","password": "ammailu"}})}>Login</button>
            </div>)
        }
        
    return <Redirect to="/profile" push/>
    // return <h4>testLogin</h4>
    }
}

// export default withRouter(Login)