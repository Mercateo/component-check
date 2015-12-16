/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import styles from './composable-component.css';

export default function view(state$, id) {
  return state$.map(dynamicComponents =>
    <div className={styles.container}>
      <button className={`${id} addDynamicComponent`}>Add dynamic component</button>
      <hr />
      {dynamicComponents.map((dynamicComponent, index) =>
        <div>
          {dynamicComponent}
          <button value={index} className={`${id} removeDynamicComponent`}>Remove dynamic component</button>
          {index + 1 !== dynamicComponents.length ? <hr /> : null}
        </div>
      )}
    </div>
  );
}
