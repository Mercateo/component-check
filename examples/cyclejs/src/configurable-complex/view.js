/** @jsx hJSX */

import { hJSX } from '@cycle/dom';

export default function view(state$, id) {
  return state$.map(state =>
    <p>
      <button type="button"
              className={`${id} decrement`}
              value={state.decrement}>
        {state.decrement}
      </button>
      <span>{state.value}</span>
      <button type="button"
              className={`${id} increment`}
              value={state.increment}>
        {state.increment}
      </button>
    </p>
  );
}
