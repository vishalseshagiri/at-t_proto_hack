import React from "react"
import { connect } from "react-redux"
import {Redirect} from "react-router-dom"
import NavBar from "./NavBar"

import {get_videos, get_profile} from "../actions/profileActions"
import {getCookie} from 'redux-cookie'


@connect((store) => {
    return {
        user: store.user_login.user,
    }
})
export default class Friends extends React.Component {
    componentWillMount() {
        
        this.props.dispatch(get_profile(this.props.dispatch(getCookie('token')), this.props.dispatch(getCookie('user_id'))))
        // this.props.dispatch(get_videos(this.props.dispatch(getCookie('token')), this.props.dispatch(getCookie('user_id'))))
    }
    render() {
        const {user: {user}} = this.props
        console.log(this.props)
        return (
            <div>
            <NavBar/>
           <h4>{user}</h4>
           </div>
        )
    }
}