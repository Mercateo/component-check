import { INCREMENT_SECOND } from './constants';

export function incrementSecond(index) {
  return {
    type: INCREMENT_SECOND,
    index
  }
}
