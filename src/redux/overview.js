import * as ActionTypes from './ActionTypes';

export const Overview = (state = {
    overview: null,
    isLoading: false,
    errMess: null
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_OVERVIEW_DATA:
            return {...state, overview: action.payload, isLoading: false, errMess: null}
        case ActionTypes.SET_OVERVIEW_LOADING:
            return {...state, overview: null, isLoading: action.payload, errMess: null}
        case ActionTypes.SET_OVERVIEW_ERROR:
            return {...state, overview: null, isLoading: false, errMess: action.payload}
        default:
            return state;
    }
}