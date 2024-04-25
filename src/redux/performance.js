import * as ActionTypes from './ActionTypes';

export const Performance = (state = {
    baseline_actual_foc: null,
    baseline_actual_foc_speed: null,
    performance_deviation: null,
    performance_table: null
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_BASELINE_ACTUAL_FOC:
            return { ...state, baseline_actual_foc: action.payload}
        case ActionTypes.SET_BASELINE_ACTUAL_FOC_SPEED:
            return { ...state, baseline_actual_foc_speed: action.payload}
        case ActionTypes.SET_PERFORMANCE_DEVIATION:
            return { ...state, performance_deviation: action.payload}
        case ActionTypes.SET_PERFORMANCE_TABLE:
            return { ...state, performance_table: action.payload}
        default:
            return state;
    }
}