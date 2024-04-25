import * as ActionTypes from './ActionTypes';

export const DailyData = (state = {
    dailyData: null,
    loading: true,
    errMess: null
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_DAILY_DATA:
            return {...state, dailyData: action.payload, loading: false, errMess: null}
        case ActionTypes.DAILY_DATA_LOADING:
            return {...state, dailyData: null, loading: action.payload, errMess: null}
        case ActionTypes.DAILY_DATA_ERROR:
            return {...state, dailyData: null, loading: false, errMess: action.payload}
        default:
            return state;
    }
}