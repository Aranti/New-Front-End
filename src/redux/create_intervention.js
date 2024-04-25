import * as ActionTypes from './ActionTypes';

export const Create_IV = (state = {
    fromDate: '',
    toDate: '',
    iv_category: '',
    category_code: '',
    category_desc: '',
    iv_type: '',
    location: '',
    job_list: [],
    equipment_list: []
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_FROM_DATE:
            return { ...state, fromDate: action.payload }
        case ActionTypes.SET_TO_DATE:
            return { ...state, toDate: action.payload }
        case ActionTypes.SET_INTERVENTION_CATEGORY:
            return { ...state, iv_category: action.payload }
        case ActionTypes.SET_CATEGORY_CODE:
            return { ...state, category_code: action.payload }
        case ActionTypes.SET_CATEGORY_DESCRIPTION:
            return { ...state, category_desc: action.payload }
        case ActionTypes.SET_INTERVENTION_TYPE:
            return { ...state, iv_type: action.payload }
        case ActionTypes.SET_LOCATION:
            return { ...state, location: action.payload }
        case ActionTypes.SET_JOB_LIST:
            return { ...state, job_list: action.payload }
        case ActionTypes.SET_EQUIPMENT_LIST:
            return { ...state, equipment_list: action.payload }
        default:
            return state;
    }
}