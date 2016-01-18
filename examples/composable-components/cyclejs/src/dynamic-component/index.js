/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import styles from './dynamic-component.css';

export default function DynamicComponent(sources) {
  const timer$ = Observable.timer(0, 1000).publish();
  timer$.connect();

  const seconds$ = timer$.shareReplay(1).scan(seconds => seconds + 1);

  const vtree$ = seconds$.map(seconds =>
    <div className={styles.container}>
      I count {seconds} seconds.
    </div>
  );

  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
