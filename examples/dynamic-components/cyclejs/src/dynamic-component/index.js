/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import styles from './dynamic-component.css';

export default function DynamicComponent(sources) {
  const seconds$ = Observable.just(Math.ceil(Math.random() * 100))
    .merge(Observable.interval(1000))
    .scan(seconds => seconds + 1);

  const vtree$ = seconds$.map(seconds => <div className={styles.container}>
    I count {seconds} seconds.
  </div>);

  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
