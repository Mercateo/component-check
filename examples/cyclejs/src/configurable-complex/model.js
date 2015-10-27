import { Observable } from 'rx';

const defaultProps = {
  value: 0,
  decrement: -1,
  increment: 1
};

export default function model(props$, actions) {
  // save delta
  const delta$ = Observable.just(0)
    .merge(actions.decrement$)
    .merge(actions.increment$)
    .scan((value, delta) => value + delta);

  // merge with defaults
  return props$.map(props => ({ ...defaultProps, ...props }))
    // add delta to value
    .combineLatest(delta$, (props, delta) => ({ ...props, value: props.value + delta }));
}
