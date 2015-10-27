import cuid  from 'cuid';
import { Observable } from 'rx';
import intent from './intent';
import model from './model';
import view from './view';

export default function main(sources, props$ = Observable.just({})) {
  const id = cuid();

  const actions = intent(sources, id);
  const state$ = model(props$, actions);
  const vtree$ = view(state$, id);

  return vtree$;
}
