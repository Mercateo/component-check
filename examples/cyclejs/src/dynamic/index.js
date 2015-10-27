import model from './model';
import view from './view';

export default function main() {
  const state$ = model();
  const vtree$ = view(state$);

  return vtree$;
}
