import { Observable } from 'rx';

export default function model(props$, actions) {
  return props$
    .merge(actions.decrement$)
    .merge(actions.increment$)
    .scan((value, delta) => value + delta);
}
