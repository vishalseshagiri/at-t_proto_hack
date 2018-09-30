import axios from "axios";

export function login(payload) {
    return function(dispatch) {
        dispatch({type : "LOGGING_IN"})

        axios.post("http://localhost:8000/api/users/login", payload)
            .then((response) => {
                dispatch({
                    type : "LOGGED_IN",
                    payload : response.data.user
                })
            })
            .catch((err) => {
                dispatch({type: "LOGIN_FAILED", payload: err})
              })

    }
}

export function valueChange(payload) {
    return function(dispatch) {
        dispatch
    }
}