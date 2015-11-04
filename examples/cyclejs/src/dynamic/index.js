import model from './model';
import view from './view';

export default function DynamicComponent() {
  const state$ = model();
  const vtree$ = view(state$);

  return vtree$;
}
