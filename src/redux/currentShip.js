import * as ActionTypes from './ActionTypes';

export const CurrentShip = (state = {
    currentShip: {}
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_CURRENT_SHIP:
            return {...state, currentShip: action.payload}
        default:
            return state
    }
}