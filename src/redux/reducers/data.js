import * as types from '../types';

import { initialState } from './initialState'

export default function (state = initialState.data, action) {
    switch (action.type) {
        case types.SET_VENDOR:
            return { ...state, vendors: action.payload };
        case types.SET_DEAL:
            return { ...state, deals: action.payload };
        case types.SET_CATEGORY:
            return { ...state, categories: action.payload };
        case types.SET_GIFTCARD:
            return { ...state, giftcards: action.payload };
        case types.SET_REWARD:
            return { ...state, rewards: action.payload };
        case types.SET_FAVORITE:
            return { ...state, favorites: action.payload };
        case types.SET_NOTIFICATION:
            return { ...state, notifiations: action.payload };
        case types.SET_NOTIFICATION_TYPE:
            return { ...state, notifiationTypes: action.payload };
        case types.SET_USER_DEAL:
            return { ...state, userDeals: action.payload };
        case types.SET_USER_REWARD:
            return { ...state, userRewards: action.payload };
        case types.SET_USER_STAMP:
            return { ...state, userStamps: action.payload };
        case types.SET_USER_GIFTCARD:
            return { ...state, userGiftcards: action.payload };
        case types.SET_USER_VENUES:
            return { ...state, userVenues: action.payload };
        case types.SET_DATA_LOADING:
            return { ...state, loading: action.payload };
        default:
            return state;
    }
}
