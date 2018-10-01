import axios from "axios";

export function get_videos(token, user_id) {
    return function(dispatch) {
        dispatch({type : "QUERYING_WATCHED"})

        axios.get("http://localhost:8000/api/videos/", {
            params : {user_id: user_id},
            headers : {Authorization : token}
        }).then((response) => {
            dispatch({
                type : "GOT_MOVIES",
                payload : response.data
            })
        })
    }
}

export function get_profile(token, user_id) {

    return function(dispatch) {
        axios.get("http://localhost:8000/api/users/profile/", {
            params : {user_id: user_id},
            headers : {Authorization : token}
        }).then((response) => {
            dispatch({
                type : "LOGGED_IN",
                payload : response.data
            })
        })
    }
}