import * as ActionTypes from './ActionTypes';

export const Reports = (state = {
    report_type: "",
    dry_dock_period: "",
    evaluation_period: "",
    open: false,
    voyage: "",
    voyage_performance_report: null,
    loading: false,
    errMess: null,
    selected_period_from_date: null,
    selected_period_to_date: null,
    selected_period_data: null,
    available_dates: null,
    outlier_dates: null,
    operational_dates: null,
    spe_dates: null
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_REPORT_TYPE:
            return { ...state, report_type: action.payload}
        case ActionTypes.SET_DRY_DOCK_PERIOD_FOR_REPORTS:
            return { ...state, dry_dock_period: action.payload}
        case ActionTypes.SET_EVALUATION_PERIOD_FOR_REPORTS:
            return { ...state, evaluation_period: action.payload}
        case ActionTypes.SET_OPEN_NEW_WINDOW:
            return { ...state, open: action.payload}
        case ActionTypes.SET_VOYAGE:
            return { ...state, voyage: action.payload}
        case ActionTypes.SET_VOYAGE_PERFORMANCE_REPORT:
            return { ...state, voyage_performance_report: action.payload, loading: false, errMess: null}
        case ActionTypes.SET_REPORTS_LOADING:
            return { ...state, loading: action.payload, errMess: null, voyage_performance_report: null,
                open: false
            }
        case ActionTypes.SET_REPORTS_ERROR:
            return { ...state, loading: false, errMess: action.payload, voyage_performance_report: null,
                open: false
            }
        case ActionTypes.SET_SELECTED_PERIOD_FROM_DATE:
            return { ...state, loading: false, errMess: null, dry_dock_period: "", evaluation_period: "",
                open: false, voyage_performance_report: null, voyage: "", selected_period_from_date: action.payload
            }
        case ActionTypes.SET_SELECTED_PERIOD_TO_DATE:
            return { ...state, loading: false, errMess: null, dry_dock_period: "", evaluation_period: "",
                open: false, voyage_performance_report: null, voyage: "", selected_period_to_date: action.payload
            }
        case ActionTypes.SET_SELECTED_PERIOD_DATA:
            return { ...state, loading: false, errMess: null, dry_dock_period: "", evaluation_period: "",
                open: false, voyage_performance_report: null, voyage: "", selected_period_data: action.payload
            }
        case ActionTypes.SET_AVAILABLE_DATES:
            return { ...state, loading: false, errMess: null, dry_dock_period: "", evaluation_period: "",
                open: false, voyage_performance_report: null, voyage: "", available_dates: action.payload
            }
        case ActionTypes.SET_OUTLIER_DATES:
            return { ...state, loading: false, errMess: null, dry_dock_period: "", evaluation_period: "",
                open: false, voyage_performance_report: null, voyage: "", outlier_dates: action.payload
            }
        case ActionTypes.SET_OPERATIONAL_DATES:
            return { ...state, loading: false, errMess: null, dry_dock_period: "", evaluation_period: "",
                open: false, voyage_performance_report: null, voyage: "", operational_dates: action.payload
            }
        case ActionTypes.SET_SPE_DATES:
            return { ...state, loading: false, errMess: null, dry_dock_period: "", evaluation_period: "",
                open: false, voyage_performance_report: null, voyage: "", spe_dates: action.payload
            }
        default:
            return state;
    }
}