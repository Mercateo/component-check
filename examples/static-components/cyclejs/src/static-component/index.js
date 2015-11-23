import { h } from '@cycle/dom';
import { Observable } from 'rx';

export default function StaticComponent(sources) {
  const vtree = h('p', 'Static content.');
  const vtree$ = Observable.just(vtree);
  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
