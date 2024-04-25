import * as ActionTypes from './ActionTypes';

export const LoginAuth = (state = {
    isUserLoggedIn: false,
    user: null,
    loginerror: null,
    username: '',
    password: ''
}, action) => {
    switch(action.type) {
        case ActionTypes.IS_USER_LOGGED_IN:
            return {...state, isUserLoggedIn: action.payload}
        case ActionTypes.SET_USER:
            return {...state, user: action.payload, loginerror: null}
        case ActionTypes.SET_LOGIN_ERROR:
            return {...state, loginerror: action.payload, user: null, isUserLoggedIn: false}
        case ActionTypes.SET_USERNAME:
            return {...state, username: action.payload}
        case ActionTypes.SET_PASSWORD:
            return {...state, password: action.payload}
        default:
            return state;
    }
}