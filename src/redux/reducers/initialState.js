export const initialState = {
    auth: {
        loading: false,
        user: {},
        authed: false,
        token: '',
        location: {}
    },
    data: {
        loading: false,
        vendors: [],
        deals: [],
        categories: [],
        giftcards: [],
        rewards: [],
        favorites: {},
        notifiations: [],
        userDeals: [],
        userRewards: [],
        userStamps: [],
        userGiftcards: [],
        userVenues: []
    }
}