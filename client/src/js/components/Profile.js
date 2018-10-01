import React from "react"
import { connect } from "react-redux"
import {Redirect} from "react-router-dom"
import NavBar from "./NavBar"

import {get_videos, get_profile} from "../actions/profileActions"
import {getCookie} from 'redux-cookie'

@connect((store) => {
    return {
        user: store.user_login.user,
        videos : store.profile.videos
    }
})
export default class Profile extends React.Component {

    componentWillMount() {
        
        this.props.dispatch(get_profile(this.props.dispatch(getCookie('token')), this.props.dispatch(getCookie('user_id'))))
        this.props.dispatch(get_videos(this.props.dispatch(getCookie('token')), this.props.dispatch(getCookie('user_id'))))
    }

    
    render() {
        const {user} = this.props;
        const {videos} = this.props

        if (!getCookie('token')) {
            return <Redirect to="/"></Redirect>
        }

        
        const watchedMovies = videos.map((video,i) => 
        <div className="iframe_div" key={i} dangerouslySetInnerHTML={{__html:video.iframe_url}}></div>);
        return (   
                <div>
                    <NavBar/>
                    <div className="scroll_view">
                            {watchedMovies}
                    </div>
                </div>
            )

    }
}