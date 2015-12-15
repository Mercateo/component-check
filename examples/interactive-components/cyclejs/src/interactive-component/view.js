/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import styles from './interactive-component.css';

export default function view(state$, id) {
  return state$.map(value =>
    <div className={styles.container}>
      <button className={`${id} decrement`}>Decrement</button>
      &nbsp;
      Current value: {value}
      &nbsp;
      <button className={`${id} increment`}>Increment</button>
    </div>
  );
}
