import { combineReducers } from 'redux';
import { INCREMENT_SECOND } from './constants';

function randomSecond() {
  return Math.ceil(Math.random() * 100);
}

const initialState = [ randomSecond(), randomSecond() ];

function seconds(state = initialState, action) {
  switch (action.type) {
    case INCREMENT_SECOND:
      return [
        ...state.slice(0, action.index),
        state[action.index] + 1,
        ...state.slice(action.index + 1)
      ];
    default:
      return state;
  }
}

export default combineReducers({
  seconds
});
