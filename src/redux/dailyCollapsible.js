import * as ActionTypes from './ActionTypes';

export const DailyCollapsible = (state = {
    // dailyData: null,
    // loading: true
    collapsibleValue: 'MAIN ENGINE-All'
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_COLLAPSIBLE_CATEGORY:
            return {...state, collapsibleValue: action.payload}
        default:
            return state;
    }
}