import { combineReducers } from 'redux';
import { ADD_SECOND, REMOVE_SECOND, INCREMENT_SECOND } from './constants';

const initialState = [];

function seconds(state = initialState, action) {
  switch (action.type) {
    case ADD_SECOND:
      return [ ...state, 0 ];
    case REMOVE_SECOND:
      return state.filter((_, i) => action.index !== i);
    case INCREMENT_SECOND:
      return [
        ...state.slice(0, action.index),
        ++state[action.index],
        ...state.slice(action.index + 1)
      ];
    default:
      return state;
  }
}

export default combineReducers({
  seconds
});
