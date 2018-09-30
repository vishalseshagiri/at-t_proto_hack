import React from "react"
import { connect } from "react-redux"
import {Redirect} from "react-router-dom"

@connect((store) => {
    return {
        user: store.user_login.user
    }
})
export default class Profile extends React.Component {

    render() {
        const {user} = this.props;
        console.log(user)
        if (!user.token) {
            return <Redirect to="/"></Redirect>
        }
        console.log(user);
        // return (<h4>test</h4>)
        const watchedMovies = user.watched.map((video_id,i) => <li key={i}>{video_id}</li>);
        return (   <div>
                    <h4>
                        {user.email}
                    </h4>
                    <ul>
                        {watchedMovies}
                    </ul>
                </div>
            )

    }
}