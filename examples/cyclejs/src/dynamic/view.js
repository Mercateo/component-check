/** @jsx hJSX */

import { hJSX } from '@cycle/dom';

export default function view(state$) {
  return state$.map(state =>
    <p>Use random start value between 1 and 10 and count up every two seconds: {state}</p>
  );
}
