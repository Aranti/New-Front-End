import * as ActionTypes from './ActionTypes';

// export const getTrends = () => (dispatch) => {
//     dispatch(trendsLoading(true));

//     let urls = baseUrl + 'trends';

//     return axios({
//         method: "get",
//         url: urls
//     })
//     .then(response => {
//         if(response.ok) {
//             // dispatch(setTrends(response.data));
//             return response.data;
//         }
//         else {
//             var error = new Error(`Error ` + response.status + ': ' + response.statusText);
//             error.response = response;
//             throw error;
//         }
//     },
//     error => {
//         var errMess = new Error(error.message);
//         throw errMess;
//     })
//     // .then(response => response.json())
//     .then(input => dispatch(setDropdown(input)))
//     .then(input => dispatch(setCompare(input)))
//     .then(input => dispatch(setDuration(input)))
//     .then(input => dispatch(setOutliers(input)))
//     .then(input => dispatch(setAnomalies(input)))
//     .then(input => dispatch(setMulti(input)))
//     .catch(error => dispatch(trendsFailed(error.message)));
// }

/* Action Creators for handling user log in */
export const setUserLoggedIn = (boolean) => ({
    type: ActionTypes.IS_USER_LOGGED_IN,
    payload: boolean
});

export const setUser = (input) => ({
    type: ActionTypes.SET_USER,
    payload: input
});

export const setLoginError = (errMess) => ({
    type: ActionTypes.SET_LOGIN_ERROR,
    payload: errMess
});

export const setUsername = (name) => ({
    type: ActionTypes.SET_USERNAME,
    payload: name
});

export const setPassword = (password) => ({
    type: ActionTypes.SET_PASSWORD,
    payload: password
});

/* Action Creators for handling Change Password */
export const setChangePassword = (input) => ({
    type: ActionTypes.SET_CHANGE_PASSWORD,
    payload: input
});

export const setConfirmChangePassword = (input) => ({
    type: ActionTypes.SET_CHANGE_CONFIRM_PASSWORD,
    payload: input
});

export const setChangePasswordError = (errMess) => ({
    type: ActionTypes.SET_CHANGE_PASSWORD_ERROR,
    payload: errMess
});

export const setChangePasswordLoading = (boolean) => ({
    type: ActionTypes.SET_CHANGE_PASSWORD_LOADING,
    payload: boolean
});

export const setChangePasswordResponse = (input) => ({
    type: ActionTypes.SET_CHANGE_PASSWORD_RESPONSE,
    payload: input
});

/* Action Creator for setting default ship */
export const setDefaultShip = (value) => ({
    type: ActionTypes.SET_DEFAULT_SHIP,
    payload: value
});

/* Action Creator for setting current ship */
export const setCurrentShip = (value) => ({
    type: ActionTypes.SET_CURRENT_SHIP,
    payload: value
});

/* Action Creator for setting daily input */
export const setDailyInput = (value) => ({
    type: ActionTypes.SET_DAILY_INPUT,
    payload: value
});

export const setDailyInputType = (value) => ({
    type: ActionTypes.SET_DAILY_INPUT_TYPE,
    payload: value
});

/* Action Creators for Spreadsheet Component */
export const setSpreadsheetLoading = (boolean) => ({
    type: ActionTypes.SET_SPREADSHEET_LOADING,
    payload: boolean
});

export const setSpreadsheetError = (errMess) => ({
    type: ActionTypes.SET_SPREADSHEET_ERROR,
    payload: errMess
});

export const setSpreadsheetData = (input) => ({
    type: ActionTypes.SET_SPREADSHEET_DATA,
    payload: input
});

export const setSpreadsheetMetadata = (input) => ({
    type: ActionTypes.SET_SPREADSHEET_METADATA,
    payload: input
});

export const setSpreadsheetNames = (input) => ({
    type: ActionTypes.SET_SPREADSHEET_NAMES,
    payload: input
});

/* Action Creators for Save Changes Button */
export const setTemplateLoading = (boolean) => ({
    type: ActionTypes.SET_TEMPLATE_LOADING,
    payload: boolean
});

export const setTemplateError = (errMess) => ({
    type: ActionTypes.SET_TEMPLATE_ERROR,
    payload: errMess
});

export const setTemplateResponse = (response) => ({
    type: ActionTypes.SET_TEMPLATE_RESPONSE,
    payload: response
});

/* Action Creators for Send To Server Changes Button */
export const setSendBackendLoading = (boolean) => ({
    type: ActionTypes.SET_SEND_BACKEND_LOADING,
    payload: boolean
});

export const setSendBackendError = (errMess) => ({
    type: ActionTypes.SET_SEND_BACKEND_ERROR,
    payload: errMess
});

export const setSendBackendResponse = (response) => ({
    type: ActionTypes.SET_SEND_BACKEND_RESPONSE,
    payload: response
});

/* Action Creator for Collapsible Component in Daily Report */
export const setCollapsibleValue = (value) => ({
    type: ActionTypes.SET_COLLAPSIBLE_CATEGORY,
    payload: value
});

/* Action Creator for the sister vessel react select component*/
export const setSisterVessel = (value) => ({
    type: ActionTypes.SET_SISTER_VESSELS,
    payload: value
});

/* Action Creator for the similar vessel react select component*/
export const setSimilarVessel = (value) => ({
    type: ActionTypes.SET_SIMILAR_VESSELS,
    payload: value
});

/* Action Creator for the independent parameters react select component*/
export const setIndependentParameters = (value) => ({
    type: ActionTypes.SET_INDEPENDENT_PARAMETERS,
    payload: value
});

/* Action Creator for the sliders dropdown*/
export const setSlider1 = (value) => ({
    type: ActionTypes.SET_SLIDER_1,
    payload: value
});

export const setSlider2 = (value) => ({
    type: ActionTypes.SET_SLIDER_2,
    payload: value
});

export const setSlider3 = (value) => ({
    type: ActionTypes.SET_SLIDER_3,
    payload: value
});

export const setSlider4 = (value) => ({
    type: ActionTypes.SET_SLIDER_4,
    payload: value
});

export const setSlider5 = (value) => ({
    type: ActionTypes.SET_SLIDER_5,
    payload: value
});

export const setSlider6 = (value) => ({
    type: ActionTypes.SET_SLIDER_6,
    payload: value
});
/* Action Creator for the dependent parameters react select component*/
export const setDependentParameters = (value) => ({
    type: ActionTypes.SET_DEPENDENT_PARAMETERS,
    payload: value
});

/* Action Creator for the dependent parameters for Z axis react select component*/
export const setDependentParametersForZaxis = (value) => ({
    type: ActionTypes.SET_DEPENDENT_PARAMETERS_FOR_Z_AXIS,
    payload: value
});

/* Action Creator for the Ship Options react select component*/
export const setShipOptions = (value) => ({
    type: ActionTypes.SET_SHIP_OPTIONS,
    payload: value
});

/* Action Creator for the Dry Dock Period Options react select component in Trends page */
export const setDryDockPeriodOptions= (value) => ({
    type: ActionTypes.SET_DRY_DOCK_PERIOD_OPTIONS,
    payload: value
});

/* Action Creator for the Evaluation Period Options react select component in Trends page */
export const setEvaluationPeriodOptions = (value) => ({
    type: ActionTypes.SET_EVALUATION_PERIOD_OPTIONS,
    payload: value
});

/*Trends Action Creators */
export const setTrends = (value) => ({
    type: ActionTypes.GET_TRENDS,
    payload: value
});

export const setDropdown = (value) => ({
    type: ActionTypes.SET_DROPDOWN,
    payload: value
});

export const setCompare = (value) => ({
    type: ActionTypes.SET_COMPARE,
    payload: value
});

export const setDuration = (value) => ({
    type: ActionTypes.SET_DURATION,
    payload: value
});

export const setOutliers = (value) => ({
    type: ActionTypes.SET_OUTLIERS,
    payload: value
});

export const setAnomalies = (value) => ({
    type: ActionTypes.SET_ANOMALIES,
    payload: value
});

export const setMulti = (value) => ({
    type: ActionTypes.SET_MULTI,
    payload: value
});

export const setEquipmentMulti = (value) => ({
    type: ActionTypes.SET_EQUIPMENT_MULTI,
    payload: value
});

export const setIndexMulti = (value) => ({
    type: ActionTypes.SET_INDEX_MULTI,
    payload: value
});

export const setShipImo = (value) => ({
    type: ActionTypes.SET_SHIP_IMO,
    payload: value
});

export const setNoonOrLogs = (value) => ({
    type: ActionTypes.SET_NOON_OR_LOGS,
    payload: value
});

export const trendsLoading = (input) => ({
    type: ActionTypes.TRENDS_LOADING,
    payload: input
});

export const trendsFailed = (errMess) => ({
    type: ActionTypes.TRENDS_FAILED,
    payload: errMess
});

export const setIndividualParams = (data) => ({
    type: ActionTypes.SET_INDIVIDUAL_PARAMS,
    payload: data
});

export const setIndividualEquip = (data) => ({
    type: ActionTypes.SET_INDIVIDUAL_EQUIP,
    payload: data
});

export const setIndividualIndex = (data) => ({
    type: ActionTypes.SET_INDIVIDUAL_INDEX,
    payload: data
});

export const setGenericGroups = (data) => ({
    type: ActionTypes.SET_GENERIC_GROUPS,
    payload: data
});

export const setDryDockPeriod = (data) => ({
    type: ActionTypes.SET_DRY_DOCK_PERIOD,
    payload: data
});

export const setEvaluationPeriod = (data) => ({
    type: ActionTypes.SET_EVALUATION_PERIOD,
    payload: data
});

export const setPerformanceType = (data) => ({
    type: ActionTypes.SET_PERFORMANCE_TYPE,
    payload: data
});

export const setGroupSelection = (data) => ({
    type: ActionTypes.SET_GROUP_SELECTION,
    payload: data
});

export const setDryDockOptionSelection = (data) => ({
    type: ActionTypes.SET_DRY_DOCK_OPTION_SELECTION,
    payload: data
});

export const setEvaluationOptionSelection = (data) => ({
    type: ActionTypes.SET_EVALUATION_OPTION_SELECTION,
    payload: data
});

/* Hover Data Action Creators */
export const setHover = (data) => ({
    type: ActionTypes.SET_HOVERDATA,
    payload: data
});

export const setOutlierHover = (data) => ({
    type: ActionTypes.SET_OUTLIER_HOVER,
    payload: data
});

export const setMLHover = (data) => ({
    type: ActionTypes.SET_ML_HOVER,
    payload: data
});

export const setInteractiveHover = (data) => ({
    type: ActionTypes.SET_INTERACTIVE_HOVER,
    payload: data
});

export const setMessagesHover = (data) => ({
    type: ActionTypes.SET_MESSAGES_HOVER,
    payload: data
});

export const setOutlierMessagesHover = (data) => ({
    type: ActionTypes.SET_OUTLIER_MESSAGES,
    payload: data
});

export const getHover = () => ({
    type: ActionTypes.GET_HOVERDATA
});

export const setHoverForFuelCons = (data) => ({
    type: ActionTypes.SET_HOVERDATA_FOR_FUEL_CONS,
    payload: data
});

export const getHoverForFuelCons = () => ({
    type: ActionTypes.GET_HOVERDATA_FOR_FUEL_CONS
});

export const getNamesOfOutlierHover = (input) => ({
    type: ActionTypes.GET_NAMES_OF_OUTLIER_HOVER,
    payload: input
});

export const setWeatherHover = (input) => ({
    type: ActionTypes.SET_WEATHER_ON_HOVER,
    payload: input
});

export const setDryDockHover = (input) => ({
    type: ActionTypes.SET_DRY_DOCK_HOVER,
    payload: input
});

/*Daily Report Action Creators */
export const setDailyData = (data) => ({
    type: ActionTypes.SET_DAILY_DATA,
    payload: data
});

export const setDailyLoading = (boolean) => ({
    type: ActionTypes.DAILY_DATA_LOADING,
    payload: boolean
});

export const setDailyError = (errMess) => ({
    type: ActionTypes.DAILY_DATA_ERROR,
    payload: errMess
});

/*Daily Issues Action Creators */
export const setDailyIssues = (data) => ({
    type: ActionTypes.SET_DAILY_ISSUES,
    payload: data
});

export const setDailyIssuesLoading = (boolean) => ({
    type: ActionTypes.DAILY_ISSUES_LOADING,
    payload: boolean
});

export const setDailyIssuesError = (errMess) => ({
    type: ActionTypes.DAILY_ISSUES_ERROR,
    payload: errMess
});

/*Interactive Action Creators */
export const interactiveLoading = (boolean) => ({
    type: ActionTypes.INTERACTIVE_LOADING,
    payload: boolean
});

export const interactiveFailed = (errMess) => ({
    type: ActionTypes.INTERACTIVE_ERROR,
    payload: errMess
});

export const setInteractive = (value) => ({
    type: ActionTypes.SET_INTERACTIVE_DATA,
    payload: value
});

export const setInteractiveStatsData = (value) => ({
    type: ActionTypes.SET_INTERACTIVE_STATS_DATA,
    payload: value
});

export const setInteractiveCompare = (value) => ({
    type: ActionTypes.SET_INTERACTIVE_COMPARE,
    payload: value
});

export const setInteractiveDuration = (value) => ({
    type: ActionTypes.SET_INTERACTIVE_DURATION,
    payload: value
});

export const setXAxis = (value) => ({
    type: ActionTypes.SET_X_AXIS,
    payload: value
});

export const setYAxis = (value) => ({
    type: ActionTypes.SET_Y_AXIS,
    payload: value
});

export const setZAxis = (value) => ({
    type: ActionTypes.SET_Z_AXIS,
    payload: value
});

export const setColor = (value) => ({
    type: ActionTypes.SET_COLOR,
    payload: value
});

export const setSize = (value) => ({
    type: ActionTypes.SET_SIZE,
    payload: value
});

export const setShape = (value) => ({
    type: ActionTypes.SET_SHAPE,
    payload: value
});

export const setDimensions = (value) => ({
    type: ActionTypes.SET_DIMENSIONS,
    payload: value
});

export const setCombo = (value) => ({
    type: ActionTypes.SET_COMBOS,
    payload: value
});

export const setBasic = (value) => ({
    type: ActionTypes.SET_BASIC,
    payload: value
});

export const setMultiParametric = (value) => ({
    type: ActionTypes.SET_MULTIPARAMETRIC,
    payload: value
});

export const setFeature1 = (value) => ({
    type: ActionTypes.SET_FEATURE_1,
    payload: value
});

export const setFeature2 = (value) => ({
    type: ActionTypes.SET_FEATURE_2,
    payload: value
});

export const setFeature3 = (value) => ({
    type: ActionTypes.SET_FEATURE_3,
    payload: value
});

export const setFeature4 = (value) => ({
    type: ActionTypes.SET_FEATURE_4,
    payload: value
});

export const setFeature5 = (value) => ({
    type: ActionTypes.SET_FEATURE_5,
    payload: value
});

export const setFeature6 = (value) => ({
    type: ActionTypes.SET_FEATURE_6,
    payload: value
});

export const setFeatureInput1 = (value) => ({
    type: ActionTypes.SET_FEATURE_INPUT_1,
    payload: value
});

export const setFeatureInput2 = (value) => ({
    type: ActionTypes.SET_FEATURE_INPUT_2,
    payload: value
});

export const setFeatureInput3 = (value) => ({
    type: ActionTypes.SET_FEATURE_INPUT_3,
    payload: value
});

export const setFeatureInput4 = (value) => ({
    type: ActionTypes.SET_FEATURE_INPUT_4,
    payload: value
});

export const setFeatureInput5 = (value) => ({
    type: ActionTypes.SET_FEATURE_INPUT_5,
    payload: value
});

export const setFeatureInput6 = (value) => ({
    type: ActionTypes.SET_FEATURE_INPUT_6,
    payload: value
});

export const setWindDirection = (value) => ({
    type: ActionTypes.SET_WIND_DIRECTION,
    payload: value
});

export const setSwellDirection = (value) => ({
    type: ActionTypes.SET_SWELL_DIRECTION,
    payload: value
});

export const setBallastOrLoaded = (value) => ({
    type: ActionTypes.SET_BALLAST_OR_LOADED,
    payload: value
});

export const setTypeOfInput = (value) => ({
    type: ActionTypes.INTERACTIVE_TYPE_OF_INPUT,
    payload: value
});

/* Overview Action Creators */
export const setOverviewData = (data) => ({
    type: ActionTypes.SET_OVERVIEW_DATA,
    payload: data
});

export const setOverviewLoading = (boolean) => ({
    type: ActionTypes.SET_OVERVIEW_LOADING,
    payload: boolean
});

export const setOverviewError = (errMess) => ({
    type: ActionTypes.SET_OVERVIEW_ERROR,
    payload: errMess
});

/* AIS Action Creators */
export const setAisData = (data) => ({
    type: ActionTypes.SET_AIS_DATA,
    payload: data
});

export const setAisLoading = (boolean) => ({
    type: ActionTypes.SET_AIS_LOADING,
    payload: boolean
});

export const setAisError = (errMess) => ({
    type: ActionTypes.SET_AIS_ERROR,
    payload: errMess
});

/* Create Intervention Action Creators */
export const setFromDate = (input) => ({
    type: ActionTypes.SET_FROM_DATE,
    payload: input
});

export const setToDate = (input) => ({
    type: ActionTypes.SET_TO_DATE,
    payload: input
});

export const setIVCategory = (input) => ({
    type: ActionTypes.SET_INTERVENTION_CATEGORY,
    payload: input
});

export const setCategoryCode = (input) => ({
    type: ActionTypes.SET_CATEGORY_CODE,
    payload: input
});

export const setCategoryDescription = (input) => ({
    type: ActionTypes.SET_CATEGORY_DESCRIPTION,
    payload: input
});

export const setInterventionType = (input) => ({
    type: ActionTypes.SET_INTERVENTION_TYPE,
    payload: input
});

export const setLocation = (input) => ({
    type: ActionTypes.SET_LOCATION,
    payload: input
});

export const setJobList = (input) => ({
    type: ActionTypes.SET_JOB_LIST,
    payload: input
});

export const setEquipmentList = (input) => ({
    type: ActionTypes.SET_EQUIPMENT_LIST,
    payload: input
});

/* Action Creators for Reports */
export const setReportType = (input) => ({
    type: ActionTypes.SET_REPORT_TYPE,
    payload: input
});

export const setDryDockPeriodForReports = (input) => ({
    type: ActionTypes.SET_DRY_DOCK_PERIOD_FOR_REPORTS,
    payload: input
});

export const setEvalutionPeriodForReports = (input) => ({
    type: ActionTypes.SET_EVALUATION_PERIOD_FOR_REPORTS,
    payload: input
});

export const toggleOpenWindow = (bool) => ({
    type: ActionTypes.SET_OPEN_NEW_WINDOW,
    payload: bool
});

export const setVoyage = (input) => ({
    type: ActionTypes.SET_VOYAGE,
    payload: input
});

export const setVoyageOptions = (input) => ({
    type: ActionTypes.SET_VOYAGE_OPTIONS,
    payload: input
});

export const setVoyagePerformanceReport = (input) => ({
    type: ActionTypes.SET_VOYAGE_PERFORMANCE_REPORT,
    payload: input
});

export const setReportsLoading = (bool) => ({
    type: ActionTypes.SET_REPORTS_LOADING,
    payload: bool
});

export const setReportsError = (errMess) => ({
    type: ActionTypes.SET_REPORTS_ERROR,
    payload: errMess
});

export const setSelectedPeriodFromDate = (input) => ({
    type: ActionTypes.SET_SELECTED_PERIOD_FROM_DATE,
    payload: input
});

export const setSelectedPeriodToDate = (input) => ({
    type: ActionTypes.SET_SELECTED_PERIOD_TO_DATE,
    payload: input
});

export const setSelectedPeriodData = (input) => ({
    type: ActionTypes.SET_SELECTED_PERIOD_DATA,
    payload: input
});

export const setAvailableDates = (input) => ({
    type: ActionTypes.SET_AVAILABLE_DATES,
    payload: input
});

export const setOutlierDates = (input) => ({
    type: ActionTypes.SET_OUTLIER_DATES,
    payload: input
});

export const setOperationalDates = (input) => ({
    type: ActionTypes.SET_OPERATIONAL_DATES,
    payload: input
});

export const setSpeDates = (input) => ({
    type: ActionTypes.SET_SPE_DATES,
    payload: input
});

/* Action Creators for Performance */
export const setBaselineActualFoc = (input) => ({
    type: ActionTypes.SET_BASELINE_ACTUAL_FOC,
    payload: input
});

export const setBaselineActualFocSpeed = (input) => ({
    type: ActionTypes.SET_BASELINE_ACTUAL_FOC_SPEED,
    payload: input
});

export const setPerformanceDeviation = (input) => ({
    type: ActionTypes.SET_PERFORMANCE_DEVIATION,
    payload: input
});

export const setPerformanceTable = (input) => ({
    type: ActionTypes.SET_PERFORMANCE_TABLE,
    payload: input
});

/* Action Creators for Plotly Graph URLs */
export const baselineActualFocUrlBallast = (input) => ({
    type: ActionTypes.SET_ACTUAL_BASELINE_FOC_URL_BALLAST_STRING,
    payload: input
});

export const baselineActualFocUrlLoaded = (input) => ({
    type: ActionTypes.SET_ACTUAL_BASELINE_FOC_URL_LOADED_STRING,
    payload: input
});

export const baselineActualFocSpeedUrlBallast = (input) => ({
    type: ActionTypes.SET_ACTUAL_BASELINE_FOC_SPEED_URL_BALLAST_STRING,
    payload: input
});

export const baselineActualFocSpeedUrlLoaded = (input) => ({
    type: ActionTypes.SET_ACTUAL_BASELINE_FOC_SPEED_URL_LOADED_STRING,
    payload: input
});

export const percentageDifferenceUrlBallast = (input) => ({
    type: ActionTypes.SET_PERCENTAGE_DEVIATION_URL_BALLAST_STRING,
    payload: input
});

export const percentageDifferenceUrlLoaded = (input) => ({
    type: ActionTypes.SET_PERCENTAGE_DEVIATION_URL_LOADED_STRING,
    payload: input
});