import React from "react"
import { connect } from "react-redux"
import {Redirect} from "react-router-dom"
import NavBar from "./NavBar"

import {get_videos, get_profile} from "../actions/profileActions"
import {getCookie} from 'redux-cookie'

export default class VideoDetails extends React.Component {

    render() {
        return (
           <h4></h4>
        )
    }
}