/** @jsx hJSX */
import { run } from '@cycle/core';
import { makeDOMDriver, hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import combineLatestObj from 'rx-combine-latest-obj';
import InteractiveComponent from './interactive-component';

function main(sources) {
  const componentVtrees$ = combineLatestObj({
    interactiveComponent1$: InteractiveComponent(sources).DOM,
    interactiveComponent2$: InteractiveComponent(sources).DOM
  });
  const vtree$ = componentVtrees$.map(vtrees =>
    <div>
      {vtrees.interactiveComponent1}
      {vtrees.interactiveComponent2}
    </div>
  );
  const sinks = {
    DOM: vtree$
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#example-app')
};

run(main, drivers);
