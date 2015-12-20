/** @jsx hJSX */
import { run } from '@cycle/core';
import { makeDOMDriver, hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import isolate from '@cycle/isolate';
import combineLatestObj from 'rx-combine-latest-obj';
import ComposableComponent from './composable-component';

function main(sources) {
  const componentVtrees$ = combineLatestObj({
    composableComponent$: isolate(ComposableComponent)(sources).DOM
  });

  const vtree$ = componentVtrees$.map(vtrees =>
    <div>
      {vtrees.composableComponent}
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
