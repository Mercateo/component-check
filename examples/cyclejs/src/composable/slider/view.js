/** @jsx hJSX */

import { hJSX } from '@cycle/dom';

export default function view(state$, id) {
  return state$.map(state =>
    <label>
      <input type="range"
             className={`${id} slider`}
             min={state.min}
             max={state.max}
             value={state.value} />
      {state.value}
    </label>
  );
}
