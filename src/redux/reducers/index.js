import { combineReducers } from "redux";
import authReducer from './auth';
import dataReducer from './data';

export default combineReducers({
    auth: authReducer,
    data: dataReducer,
  });
  
