import { run } from '@cycle/core';
import { makeDOMDriver, div } from '@cycle/dom';
import { Observable } from 'rx';
import StaticComponent from './static-component';

function main(sources) {
  const staticComponent = StaticComponent(sources);
  const vtree$ = staticComponent.DOM.map(staticVTree => div(staticVTree));
  const sinks = {
    DOM: vtree$
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#example-app')
};

run(main, drivers);
