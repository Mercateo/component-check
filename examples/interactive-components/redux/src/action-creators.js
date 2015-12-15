import { DECREMENT, INCREMENT } from './constants';

export function decrement(index) {
  return {
    type: DECREMENT,
    index
  };
}

export function increment(index) {
  return {
    type: INCREMENT,
    index
  };
}
