import axios from "axios";

export function login(token) {
    return function(dispatch) {
        dispatch({type : "LOGGING_IN"})

        axios.get("http://localhost:8000/api/users", {
          headers : {Authorization : token}
        })
            .then((response) => {
                dispatch({
                    type : "FETCH_USERS",
                    payload : response.data.user
                })
            })

    }
}

export function fetchUser() {
  return {
    type: "FETCH_USER_FULFILLED",
    payload: {
      name: "Will", 
      age: 35,
    }
  }
}

export function setUserName(name) {
  return {
    type: 'SET_USER_NAME',
    payload: name,
  }
}

export function setUserAge(age) {
  return {
    type: 'SET_USER_AGE',
    payload: age,
  }
}
