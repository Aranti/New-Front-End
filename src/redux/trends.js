import * as ActionTypes from './ActionTypes';
import { TRENDS } from '../shared/trends';

export const Trends = (state = {
    isLoading: true,
    errMess: null,
    trendsData: {},
    compare: null,
    // duration: "30Days",
    duration: "1Year",
    outliers: false,
    anomalies: true,
    noonorlogs: "noon",
    group: "",
    ship_imo: 9591301,
    selectedOptions: [],
    equipmentOptions: [],
    indexOptions: [],
    individual_params: [],
    individual_equip: [],
    individual_index: [],
    generic_groups: null,
    dry_dock_period: null,
    evaluation_period: null,
    performance_type: null,
    group_selection: null,
    dry_dock_option_selection: null,
    evaluation_option_selection: null
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_DROPDOWN:
            return {...state, isLoading: false, errMess: null, group: action.payload}
        case ActionTypes.SET_COMPARE:
            return {...state, isLoading: false, errMess: null, compare: action.payload}
        case ActionTypes.SET_DURATION:
            return {...state, isLoading: false, errMess: null, duration: action.payload}
        case ActionTypes.SET_OUTLIERS:
            return {...state, isLoading: false, errMess: null, outliers: action.payload}
        case ActionTypes.SET_ANOMALIES:
            return {...state, isLoading: false, errMess: null, anomalies: action.payload}
        case ActionTypes.SET_MULTI:
            return {...state, isLoading: false, errMess: null, selectedOptions: action.payload}
        case ActionTypes.SET_EQUIPMENT_MULTI:
            return {...state, isLoading: false, errMess: null, equipmentOptions: action.payload}
        case ActionTypes.SET_INDEX_MULTI:
            return {...state, isLoading: false, errMess: null, indexOptions: action.payload}
        case ActionTypes.SET_SHIP_IMO:
            return {...state, isLoading: false, errMess: null, ship_imo: action.payload}
        case ActionTypes.SET_NOON_OR_LOGS:
            return {...state, isLoading: false, errMess: null, noonorlogs: action.payload}
        case ActionTypes.GET_TRENDS:
            return {...state, isLoading: false, errMess: null, trendsData: action.payload}
        case ActionTypes.TRENDS_LOADING:
            return {...state, isLoading: action.payload, errMess: null}
        case ActionTypes.TRENDS_FAILED:
            return {...state, isLoading: false, errMess: action.payload}
        case ActionTypes.SET_INDIVIDUAL_PARAMS:
            return {...state, isLoading: false, errMess: null,  individual_params: action.payload}
        case ActionTypes.SET_INDIVIDUAL_EQUIP:
            return {...state, isLoading: false, errMess: null, individual_equip: action.payload}
        case ActionTypes.SET_INDIVIDUAL_INDEX:
            return {...state, isLoading: false, errMess: null,  individual_index: action.payload}
        case ActionTypes.SET_GENERIC_GROUPS:
            return {...state, isLoading: false, errMess: null,  generic_groups: action.payload}
        case ActionTypes.SET_DRY_DOCK_PERIOD:
            return {...state, isLoading: false, errMess: null,  dry_dock_period: action.payload}
        case ActionTypes.SET_EVALUATION_PERIOD:
            return {...state, isLoading: false, errMess: null,  evaluation_period: action.payload}
        case ActionTypes.SET_PERFORMANCE_TYPE:
            return {...state, isLoading: false, errMess: null,  performance_type: action.payload}
        case ActionTypes.SET_GROUP_SELECTION:
            return {...state, isLoading: false, errMess: null,  group_selection: action.payload}
        case ActionTypes.SET_DRY_DOCK_OPTION_SELECTION:
            return {...state, isLoading: false, errMess: null,  dry_dock_option_selection: action.payload}
        case ActionTypes.SET_EVALUATION_OPTION_SELECTION:
            return {...state, isLoading: false, errMess: null,  evaluation_option_selection: action.payload}
        default:
            return state;
    }
};