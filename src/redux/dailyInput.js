import * as ActionTypes from './ActionTypes';

export const DailyInput = (state = {
    daily_input: 'noon',
    daily_input_type: 'fuel',
    loading: true,
    loadingForTemplate: false,
    loadingForSendBackend: false,
    errMess: null,
    errMessForTemplate: null,
    errMessForSendBackend: null,
    spreadsheetData: null,
    spreadsheetMetadata: null,
    spreadsheetNames: null,
    responseForTemplate: null,
    responseForSendBackend: null
}, action) => {
    switch(action.type) {
        // For the radio buttons in Inputs
        case ActionTypes.SET_DAILY_INPUT:
            return {...state, daily_input: action.payload, loading: false, errMess: null, loadingForTemplate: false, loadingForSendBackend: false, errMessForTemplate: null, errMessForSendBackend: null, responseForTemplate: null, responseForSendBackend: null}
        case ActionTypes.SET_DAILY_INPUT_TYPE:
            return {...state, daily_input_type: action.payload, loading: false, errMess: null, loadingForTemplate: false, loadingForSendBackend: false, errMessForTemplate: null, errMessForSendBackend: null, responseForTemplate: null, responseForSendBackend: null}
        //For the Spreadsheet Component in Inputs
        case ActionTypes.SET_SPREADSHEET_LOADING:
            return {...state, loading: action.payload, errMess: null, spreadsheetData: null, spreadsheetMetadata: null}
        case ActionTypes.SET_SPREADSHEET_ERROR:
            return {...state, loading: false, errMess: action.payload, spreadsheetData: null, spreadsheetMetadata: null}
        case ActionTypes.SET_SPREADSHEET_DATA:
            return {...state, loading: false, errMess: null, spreadsheetData: action.payload}
        case ActionTypes.SET_SPREADSHEET_METADATA:
            return {...state, loading: false, errMess: null, spreadsheetMetadata: action.payload}
        case ActionTypes.SET_SPREADSHEET_NAMES:
            return {...state, loading: false, errMess: null, spreadsheetNames: action.payload}
        //For the Save Changes button in Inputs
        case ActionTypes.SET_TEMPLATE_LOADING:
            return {...state, loadingForTemplate: action.payload, errMessForTemplate: null, responseForTemplate: null}
        case ActionTypes.SET_TEMPLATE_ERROR:
            return {...state, loadingForTemplate: false, errMessForTemplate: action.payload, responseForTemplate: null}
        case ActionTypes.SET_TEMPLATE_RESPONSE:
            return {...state, loadingForTemplate: false, errMessForTemplate: null, responseForTemplate: action.payload}
        //For the Save to Server button in Inputs
        case ActionTypes.SET_SEND_BACKEND_LOADING:
            return {...state, loadingForSendBackend: action.payload, errMessForSendBackend: null, responseForSendBackend: null}
        case ActionTypes.SET_SEND_BACKEND_ERROR:
            return {...state, loadingForSendBackend: false, errMessForSendBackend: action.payload, responseForSendBackend: null}
        case ActionTypes.SET_SEND_BACKEND_RESPONSE:
            return {...state, loadingForSendBackend: false, errMessForSendBackend: null, responseForSendBackend: action.payload}
        default:
            return state;
    }
}