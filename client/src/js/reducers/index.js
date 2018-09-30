import { combineReducers } from "redux"

import user_login from "./loginReducer"
import profile from "./profileReducer"

export default combineReducers({
  user_login,
  profile
})
