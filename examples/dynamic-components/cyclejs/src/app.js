/** @jsx hJSX */
import { run } from '@cycle/core';
import { makeDOMDriver, hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import combineLatestObj from 'rx-combine-latest-obj';
import DynamicComponent from './dynamic-component';

function main(sources) {
  const componentVtrees$ = combineLatestObj({
    dynamicComponent1$: DynamicComponent(sources).DOM,
    dynamicComponent2$: DynamicComponent(sources).DOM
  });
  const vtree$ = componentVtrees$.map(vtrees => <div>
    {vtrees.dynamicComponent1}
    {vtrees.dynamicComponent2}
  </div>);
  const sinks = {
    DOM: vtree$
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#example-app')
};

run(main, drivers);
