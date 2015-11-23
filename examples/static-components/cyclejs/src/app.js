import { run } from '@cycle/core';
import { makeDOMDriver, h } from '@cycle/dom';
import { Observable } from 'rx';
import StaticComponent from './static-component';

function main(sources) {
  const staticComponent = StaticComponent(sources);
  const vtree$ = staticComponent.DOM.map(staticComponent => h('div', staticComponent));
  const sinks = {
    DOM: vtree$
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#example-app')
};

run(main, drivers);
