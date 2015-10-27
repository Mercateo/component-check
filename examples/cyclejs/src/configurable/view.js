/** @jsx hJSX */

import { hJSX } from '@cycle/dom';

export default function view(state$, id) {
  return state$.map(state =>
    <p>
      <button className={`${id} decrement`}>-1</button>
      <span>{state}</span>
      <button className={`${id} increment`}>+1</button>
    </p>
  );
}
