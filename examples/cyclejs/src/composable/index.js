import cuid  from 'cuid';
import { Observable } from 'rx';
import combineLatestObj from 'rx-combine-latest-obj';
import slider from './slider';
import counter from '../configurable-complex';
import intent from './intent';
import model from './model';
import view from './view';

export default function main(sources, props$ = Observable.just({})) {
  const id = cuid();

  const actions = intent(sources, id);
  const state$ = model(props$, actions);

  const decrementProps$ = state$.map(state => {
    return {
      value: state.decrementValue,
      min: state.decrementMin,
      max: state.decrementMax
    }
  });
  const decrementSlider = slider(sources, decrementProps$);

  const incrementProps$ = state$.map(state => {
    return {
      value: state.incrementValue,
      min: state.incrementMin,
      max: state.incrementMax
    }
  });
  const incrementSlider = slider(sources, incrementProps$);

  const counterProps$ = state$.combineLatest(decrementSlider.state$, incrementSlider.state$, (state, decrementState, incrementState) => {
    return {
      value: state.value,
      decrement: decrementState.value,
      increment: incrementState.value
    }
  });
  const counter$ = counter(sources, counterProps$);

  const componentVtrees$ = combineLatestObj({
    decrementSlider$: decrementSlider.vtree$,
    incrementSlider$: incrementSlider.vtree$,
    counter$
  });
  const vtree$ = view(componentVtrees$, id);

  return vtree$;
}
