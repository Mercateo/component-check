import cuid  from 'cuid';
import intent from './intent';
import model from './model';
import view from './view';

export default function ComposableComponent(sources) {
  const id = cuid();

  const actions = intent(sources, id);
  const state$ = model(actions);
  const vtree$ = view(state$, id);

  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
