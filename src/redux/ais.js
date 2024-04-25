import * as ActionTypes from './ActionTypes';

export const Ais = (state = {
    aisData: null,
    loading: false,
    errMess: null
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_AIS_DATA:
            return { ...state, aisData: action.payload, loading: false, errMess: null}
        case ActionTypes.SET_AIS_ERROR:
            return { ...state, errMess: action.payload, loading: false, aisData: null}
        case ActionTypes.SET_AIS_LOADING:
            return { ...state, loading: action.payload, errMess: null, aisData: null}
        default:
            return state
    }
}