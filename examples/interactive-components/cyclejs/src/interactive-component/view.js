/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import styles from './interactive-component.css';

export default function view(state$) {
  return state$.map(value =>
    <div className={styles.container}>
      <button className="decrement">Decrement</button>
      &nbsp;
      Current value: {value}
      &nbsp;
      <button className="increment">Increment</button>
    </div>
  );
}
