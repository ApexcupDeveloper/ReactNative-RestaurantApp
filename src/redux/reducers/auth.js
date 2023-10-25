import * as types from '../types';

import { initialState } from './initialState'

export default function (state = initialState.auth, action) {
    switch (action.type) {
        case types.SET_LOADING:
            return { ...state, loading: action.payload };
        case types.SET_AUTH:
            return { ...state, authed: true };
        case types.SET_USER:
            return { ...state, user: action.payload, loading: false };
        case types.SET_TOKEN:
            return { ...state, token: action.payload, loading: false };
        case types.SET_LOCATION:
            return { ...state, location: action.payload };
        case types.LOG_OUT:
            return { ...state, authed: false, token: '', user: {} };
        default:
            return state;
    }
}
