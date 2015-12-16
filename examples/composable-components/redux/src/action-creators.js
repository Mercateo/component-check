import { ADD_SECOND, REMOVE_SECOND, INCREMENT_SECOND } from './constants';

export function addSecond(index) {
  return {
    type: ADD_SECOND
  };
}

export function removeSecond(index) {
  return {
    type: REMOVE_SECOND,
    index
  };
}

export function incrementSecond(index) {
  return {
    type: INCREMENT_SECOND,
    index
  };
}
