import React from "react"
import { connect } from "react-redux"
import {Redirect} from "react-router-dom"

import {get_videos} from "../actions/profileActions"

@connect((store) => {
    return {
        user: store.user_login.user,
        videos : store.profile.videos
    }
})
export default class Profile extends React.Component {
    componentWillMount() {
        this.props.dispatch(get_videos(this.props.user.token, this.props.user._id))
    }

    render() {
        const {user} = this.props;
        const {videos} = this.props
        if (!user.token) {
            return <Redirect to="/"></Redirect>
        }
        console.log(user);
        const watchedMovies = videos.map((video,i) => 
        <div className="iframe_div" key={i} dangerouslySetInnerHTML={{__html:video.iframe_url}}></div>);
        return (   
                <div>
                    
                    <div className="scroll_view">
                            {watchedMovies}
                    </div>
                </div>
            )

    }
}