import { Observable } from 'rx';

export default function model(actions) {
  return Observable.just(0)
    .merge(actions.decrement$)
    .merge(actions.increment$)
    .scan((value, delta) => value + delta);
}
