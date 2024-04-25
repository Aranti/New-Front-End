import * as ActionTypes from './ActionTypes';

export const DailyIssues = (state = {
    dailyIssues: null,
    loading: true,
    errMess: null
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_DAILY_ISSUES:
            return {...state, dailyIssues: action.payload, loading: false, errMess: null}
        case ActionTypes.DAILY_ISSUES_LOADING:
            return {...state, dailyIssues: null, loading: action.payload, errMess: null}
        case ActionTypes.DAILY_ISSUES_ERROR:
            return {...state, dailyIssues: null, loading: false, errMess: action.payload}
        default:
            return state;
    }
}