import { combineReducers } from 'redux';
import { DECREMENT, INCREMENT } from './constants';

const initialState = [ 0, 0 ];

function values(state = initialState, action) {
  switch (action.type) {
    case DECREMENT:
      return [
        ...state.slice(0, action.index),
        --state[action.index],
        ...state.slice(action.index + 1)
      ];
    case INCREMENT:
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
  values
});
