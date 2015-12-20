import { p } from '@cycle/dom';
import { Observable } from 'rx';

export default function StaticComponent(sources) {
  const sinks = {
    DOM: Observable.just(
      p('Static content.')
    )
  };
  return sinks;
}
