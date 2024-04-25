import * as ActionTypes from './ActionTypes';

export const Interactive = (state = {
    isLoading: false,
    errMess: null,
    interactiveData: [],
    statsData: null,
    compare: "None",
    duration: "1Year",
    x_axis: '',
    y_axis: '',
    z_axis: '',
    color: '',
    size: '',
    shape: 'ballast',
    dimensions: '2D',
    combo: '',
    basic: '',
    multiparam: 'ParameterAnalysis',
    feature_1: 'rpm',
    feature_2: 'draft_mean',
    feature_3: 'trim',
    feature_4: 'w_force',
    feature_5: 'sea_st',
    feature_6: 'None',
    feature_input1: 60,
    feature_input2: 7,
    feature_input3: 0,
    feature_input4: 3,
    feature_input5: 2,
    feature_input6: 0,
    wind_direction: '',
    swell_direction: '',
    load: 'any',
    typeofinput: 'input'
}, action) => {
    switch(action.type) {
        case ActionTypes.INTERACTIVE_LOADING:
            return { ...state, isLoading: action.payload}
        case ActionTypes.INTERACTIVE_ERROR:
            return { ...state, isLoading: false, errMess: action.payload}
        case ActionTypes.SET_INTERACTIVE_DATA:
            return { ...state, isLoading: false, errMess: null, interactiveData: action.payload}
        case ActionTypes.SET_INTERACTIVE_STATS_DATA:
            return { ...state, isLoading: false, errMess: null, statsData: action.payload}
        case ActionTypes.SET_INTERACTIVE_COMPARE:
            return { ...state, isLoading: false, errMess: null, compare: action.payload}
        case ActionTypes.SET_INTERACTIVE_DURATION:
            return { ...state, isLoading: false, errMess: null, duration: action.payload}
        case ActionTypes.SET_X_AXIS:
            return { ...state, isLoading: false, errMess: null, x_axis: action.payload}
        case ActionTypes.SET_Y_AXIS:
            return { ...state, isLoading: false, errMess: null, y_axis: action.payload}
        case ActionTypes.SET_Z_AXIS:
            return { ...state, isLoading: false, errMess: null, z_axis: action.payload}
        case ActionTypes.SET_COLOR:
            return { ...state, isLoading: false, errMess: null, color: action.payload}
        case ActionTypes.SET_SIZE:
            return { ...state, isLoading: false, errMess: null, size: action.payload}
        case ActionTypes.SET_SHAPE:
            return { ...state, isLoading: false, errMess: null, shape: action.payload}
        case ActionTypes.SET_DIMENSIONS:
            return { ...state, isLoading: false, errMess: null, dimensions: action.payload}
        case ActionTypes.SET_COMBOS:
            return { ...state, isLoading: false, errMess: null, combo: action.payload}
        case ActionTypes.SET_BASIC:
            return { ...state, isLoading: false, errMess: null, basic: action.payload}
        case ActionTypes.SET_MULTIPARAMETRIC:
            return { ...state, isLoading: false, errMess: null, multiparam: action.payload}
        case ActionTypes.SET_FEATURE_1:
            return { ...state, isLoading: false, errMess: null, feature_1: action.payload}
        case ActionTypes.SET_FEATURE_2:
            return { ...state, isLoading: false, errMess: null, feature_2: action.payload}
        case ActionTypes.SET_FEATURE_3:
            return { ...state, isLoading: false, errMess: null, feature_3: action.payload}
        case ActionTypes.SET_FEATURE_4:
            return { ...state, isLoading: false, errMess: null, feature_4: action.payload}
        case ActionTypes.SET_FEATURE_5:
            return { ...state, isLoading: false, errMess: null, feature_5: action.payload}
        case ActionTypes.SET_FEATURE_6:
            return { ...state, isLoading: false, errMess: null, feature_6: action.payload}
        case ActionTypes.SET_FEATURE_INPUT_1:
            return { ...state, isLoading: false, errMess: null, feature_input1: action.payload}
        case ActionTypes.SET_FEATURE_INPUT_2:
            return { ...state, isLoading: false, errMess: null, feature_input2: action.payload}
        case ActionTypes.SET_FEATURE_INPUT_3:
            return { ...state, isLoading: false, errMess: null, feature_input3: action.payload}
        case ActionTypes.SET_FEATURE_INPUT_4:
            return { ...state, isLoading: false, errMess: null, feature_input4: action.payload}
        case ActionTypes.SET_FEATURE_INPUT_5:
            return { ...state, isLoading: false, errMess: null, feature_input5: action.payload}
        case ActionTypes.SET_FEATURE_INPUT_6:
            return { ...state, isLoading: false, errMess: null, feature_input6: action.payload}
        case ActionTypes.SET_WIND_DIRECTION:
            return { ...state, isLoading: false, errMess: null, wind_direction: action.payload}
        case ActionTypes.SET_SWELL_DIRECTION:
            return { ...state, isLoading: false, errMess: null, swell_direction: action.payload}
        case ActionTypes.SET_BALLAST_OR_LOADED:
            return { ...state, isLoading: false, errMess: null, load: action.payload}
        case ActionTypes.INTERACTIVE_TYPE_OF_INPUT:
            return { ...state, isLoading: false, errMess: null, typeofinput: action.payload}
        default:
            return state;
    }
}