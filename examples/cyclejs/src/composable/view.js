/** @jsx hJSX */

import { hJSX } from '@cycle/dom';

export default function view(state$, id) {
  return state$.map(state =>
    <div>
      <div className="component">{state.decrementSlider}</div>
      <div className="component">{state.incrementSlider}</div>
      <div className="component">{state.counter}</div>
    </div>
  );
}
