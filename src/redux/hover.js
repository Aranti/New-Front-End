import * as ActionTypes from './ActionTypes';

export const Hover = (state = {
    hover: null,
    outlierhover: null,
    mlhover:null,
    outliernames: null,
    interactivehover: null,
    messageshover: null,
    outliermessages: null,
    weather: null,
    drydockhover: null
    // draft_mean: '',
    // trim: '',
    // real_slip: '',
    // speed_sog: '',
    // speed_stw: '',
    // rpm: '',
    // main_hfo: '',
    // rep_dt: ''
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_HOVERDATA:
            return {...state, hover: action.payload}
        case ActionTypes.SET_OUTLIER_HOVER:
            return {...state, outlierhover: action.payload}
        case ActionTypes.SET_ML_HOVER:
            return {...state, mlhover: action.payload}
        case ActionTypes.SET_INTERACTIVE_HOVER:
            return {...state, interactivehover: action.payload}
        case ActionTypes.SET_MESSAGES_HOVER:
            return {...state, messageshover: action.payload};
        case ActionTypes.SET_OUTLIER_MESSAGES:
            return {...state, outliermessages: action.payload};
        case ActionTypes.GET_HOVERDATA:
            return state.hover;
        case ActionTypes.GET_NAMES_OF_OUTLIER_HOVER:
            return {...state, outliernames: action.payload};
        case ActionTypes.SET_WEATHER_ON_HOVER:
            return {...state, weather: action.payload};
        case ActionTypes.SET_DRY_DOCK_HOVER:
            return {...state, drydockhover: action.payload};
        default:
            return state;
    }
}