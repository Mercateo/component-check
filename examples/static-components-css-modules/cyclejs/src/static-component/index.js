import { hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import styles from './static-component.css';

export default function StaticComponent(sources) {
  const vtree = <p className={styles.p}>Static content.</p>;
  const vtree$ = Observable.just(vtree);
  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
