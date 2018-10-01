import React from "react"
import { connect } from "react-redux"
import {Redirect} from "react-router-dom"
import NavBar from "./NavBar"
import VideoDetails from "./VideoDetails"

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
        <div className="iframe_div">
        <div key={i} dangerouslySetInnerHTML={{__html:video.iframe_url}}></div>
            <button className="btn btn-default" data-target="#exampleModal">View</button>
        </div>);
        return (   
                <div>
                    <NavBar/>
                    <div className="scroll_view">
                            {watchedMovies}
                    </div>
                    <div className="modal fade" id="exampleModal">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <h4>test Modal</h4>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          </div>
                </div>
            )

    }
}