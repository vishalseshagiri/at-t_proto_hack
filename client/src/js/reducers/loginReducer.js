export default function reducer(state = {
    loggingIn : false,
    loggedIn : false,
    user : {}
}, action) {
    switch (action.type) {
        case "LOGGING_IN" :
            return {...state, loggingIn: true}

        case "LOGGED_IN":
            return {...state, loggedIn:true, loggingIn: false, user: action.payload}
        case "LOGIN_FAILED":
            return {...state, loggingIn: false, error: action.payload}
    }
    return state
}