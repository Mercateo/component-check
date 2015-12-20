/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import styles from './dynamic-component.css';

export default function DynamicComponent(sources) {
  const seconds$ = Observable.interval(1000)
    .startWith(Math.ceil(Math.random() * 100))
    .scan(seconds => ++seconds);

  const vtree$ = seconds$.map(seconds =>
    <div className={styles.container}>
      I count {seconds} seconds.
    </div>
  );

  return {
    DOM: vtree$
  };
}
