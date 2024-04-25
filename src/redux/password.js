import * as ActionTypes from './ActionTypes';

export const Password = (state = {
    change_password: "",
    confirm_change_password: "",
    change_password_error: null,
    change_password_loading: false,
    change_password_response: null
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_CHANGE_PASSWORD:
            return {...state, change_password: action.payload, change_password_error: null, change_password_loading: false, change_password_response: null}
        case ActionTypes.SET_CHANGE_CONFIRM_PASSWORD:
            return {...state, confirm_change_password: action.payload, change_password_error: null, change_password_loading: false, change_password_response: null}
        case ActionTypes.SET_CHANGE_PASSWORD_ERROR:
            return {...state, change_password: "", confirm_change_password: "", change_password_error: action.payload, change_password_loading: false, change_password_response: null}
        case ActionTypes.SET_CHANGE_PASSWORD_LOADING:
            return {...state, change_password_error: null, change_password_loading: action.payload, change_password_response: null}
        case ActionTypes.SET_CHANGE_PASSWORD_RESPONSE:
            return {...state, change_password_error: null, change_password_loading: false, change_password_response: action.payload, change_password: "", confirm_change_password: ""}
        default:
            return state
    }
}