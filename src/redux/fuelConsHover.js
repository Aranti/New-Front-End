import * as ActionTypes from './ActionTypes';

export const FuelConsHover = (state = {
    fuelConsHover: null
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_HOVERDATA_FOR_FUEL_CONS:
            return {...state, fuelConsHover: action.payload}
        case ActionTypes.GET_HOVERDATA_FOR_FUEL_CONS:
            return state.fuelConsHover;
        default:
            return state;
    }
}