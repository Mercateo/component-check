import view from './view';

export default function StaticComponent() {
  const vtree$ = view();

  return vtree$;
}
