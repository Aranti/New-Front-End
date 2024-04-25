import * as ActionTypes from './ActionTypes';

export const DefaultShip = (state = {
    defaultShip: {}
}, action) => {
    switch(action.type) {
        case ActionTypes.SET_DEFAULT_SHIP:
            return {...state, defaultShip: action.payload}
        default:
            return state
    }
}