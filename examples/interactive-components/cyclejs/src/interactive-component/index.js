import intent from './intent';
import model from './model';
import view from './view';

export default function InteractiveComponent(sources) {
  const actions = intent(sources);
  const state$ = model(actions);
  const vtree$ = view(state$);

  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
