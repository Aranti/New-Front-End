import * as ActionTypes from './ActionTypes';

export const PlotlyGraphUrls = (state = {
    actual_baseline_foc_ballast: "",
    actual_baseline_foc_loaded: "",
    actual_baseline_foc_speed_ballast: "",
    actual_baseline_foc_speed_loaded: "",
    percentage_difference_ballast: "",
    percentage_difference_loaded: ""
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_ACTUAL_BASELINE_FOC_URL_BALLAST_STRING:
            return { ...state, actual_baseline_foc_ballast: action.payload}
        case ActionTypes.SET_ACTUAL_BASELINE_FOC_URL_LOADED_STRING:
            return { ...state, actual_baseline_foc_loaded: action.payload}
        case ActionTypes.SET_ACTUAL_BASELINE_FOC_SPEED_URL_BALLAST_STRING:
            return { ...state, actual_baseline_foc_speed_ballast: action.payload}
        case ActionTypes.SET_ACTUAL_BASELINE_FOC_SPEED_URL_LOADED_STRING:
            return { ...state, actual_baseline_foc_speed_loaded: action.payload}
        case ActionTypes.SET_PERCENTAGE_DEVIATION_URL_BALLAST_STRING:
            return { ...state, percentage_difference_ballast: action.payload}
        case ActionTypes.SET_PERCENTAGE_DEVIATION_URL_LOADED_STRING:
            return { ...state, percentage_difference_loaded: action.payload}
        default:
            return state;
    }
}