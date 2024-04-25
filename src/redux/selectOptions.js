import * as ActionTypes from './ActionTypes';

export const Options = (state = {
    sisterVessels: [],
    similarVessels: [],
    independentParameters: [],
    slider1: [],
    slider2: [],
    slider3: [],
    slider4: [],
    slider5: [],
    slider6: [],
    dependentParameters: [],
    dependentParametersForZaxis: [],
    shipoptions: [],
    voyage_options: [],
    dry_dock_period_options: [],
    evaluation_period_options: []
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_SISTER_VESSELS:
            return {...state, sisterVessels: action.payload}
        case ActionTypes.SET_SIMILAR_VESSELS:
            return {...state, similarVessels: action.payload}
        case ActionTypes.SET_INDEPENDENT_PARAMETERS:
            return {...state, independentParameters: action.payload}
        case ActionTypes.SET_SLIDER_1:
            return {...state, slider1: action.payload}
        case ActionTypes.SET_SLIDER_2:
            return {...state, slider2: action.payload}
        case ActionTypes.SET_SLIDER_3:
            return {...state, slider3: action.payload}
        case ActionTypes.SET_SLIDER_4:
            return {...state, slider4: action.payload}
        case ActionTypes.SET_SLIDER_5:
            return {...state, slider5: action.payload}
        case ActionTypes.SET_SLIDER_6:
            return {...state, slider6: action.payload}
        case ActionTypes.SET_DEPENDENT_PARAMETERS:
            return {...state, dependentParameters: action.payload}
        case ActionTypes.SET_DEPENDENT_PARAMETERS_FOR_Z_AXIS:
            return {...state, dependentParametersForZaxis: action.payload}
        case ActionTypes.SET_SHIP_OPTIONS:
            return {...state, shipoptions: action.payload}
        case ActionTypes.SET_VOYAGE_OPTIONS:
            return {...state, voyage_options: action.payload}
        case ActionTypes.SET_DRY_DOCK_PERIOD_OPTIONS:
            return {...state, dry_dock_period_options: action.payload}
        case ActionTypes.SET_EVALUATION_PERIOD_OPTIONS:
            return {...state, evaluation_period_options: action.payload}
        default:
            return state;
    }
}