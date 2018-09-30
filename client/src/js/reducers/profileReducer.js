export default function reducer(state = {
    videos: []
}, action) {
    switch (action.type) {
        case "QUERYING_WATCHED":
            return {...state}
        case "GOT_MOVIES":
            return {...state, videos : action.payload}
    }

    return state
}