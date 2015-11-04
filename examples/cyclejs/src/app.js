/** @jsx hJSX */
import 'normalize.css';
import './style.css';
import { run } from '@cycle/core';
import { makeDOMDriver, hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import combineLatestObj from 'rx-combine-latest-obj';
import StaticComponent from './static';
import DynamicComponent from './dynamic';
import InteractiveComponent from './interactive';
import ConfigurableComponent from './configurable';
import ConfigurableComplexComponent from './configurable-complex';
import ComposableComponent from './composable';
import TransformableComponent from './transformable';

function main(sources) {
  const componentVtrees$ = combineLatestObj({
    staticComponent$: StaticComponent(),
    dynamicComponent1$: DynamicComponent(),
    dynamicComponent2$: DynamicComponent(),
    interactiveComponent1$: InteractiveComponent(sources),
    interactiveComponent2$: InteractiveComponent(sources),
    configurableComponent1$: ConfigurableComponent(sources),
    configurableComponent2$: ConfigurableComponent(sources, Observable.just(17)),
    configurableComplexComponent1$: ConfigurableComplexComponent(sources, Observable.just({ value: 5, decrement: -2 })),
    configurableComplexComponent2$: ConfigurableComplexComponent(sources, Observable.just({ value: 2, increment: 10 })),
    composableComponent1$: ComposableComponent(sources, Observable.just({ value: 20, decrementMin: -40, decrementMax: -5 })),
    composableComponent2$: ComposableComponent(sources, Observable.just({ value: 100, incrementValue: 15 })),
    transformableComponent1$: TransformableComponent(sources),
    transformableComponent2$: TransformableComponent(sources, Observable.just({ value: 17 }))
  });

  const vtree$ = componentVtrees$.map(state =>
    <div className="docs">
      <section className="example-section">
        <h1>Introduction</h1>
        <p>This document should show how components can be developed with Cycle.js. We will gradually
           create more complex components to find a <em>universal skeleton</em> for components.
           Every component is rendered inside a grey box, so they can be easily distinguished.</p>
        <p>We use Cycle.js' hungarian notation <code>$</code> for Observables and the convention to start
           functions which return a component with a capital letter, even though they aren't constructor.</p>
      </section>

      <section className="example-section">
        <h1>Static</h1>
        <p>The following examples shows how to render a component with static content. We just
           return a simple <code>vtree$</code>:</p>
        <div className="component">{state.staticComponent}</div>
      </section>

      <section className="example-section">
        <h1>Dynamic</h1>
        <p>The following examples shows how to render a component with dynamic content. We use a
           random start value to show that these components have an independent <code>state$</code> from
           which the <code>vtree$</code> is generated. These start value is incremented by one
           every two seconds:</p>
        <div className="component">{state.dynamicComponent1}</div>
        <div className="component">{state.dynamicComponent2}</div>
      </section>

      <section className="example-section">
        <h1>Interactive</h1>
        <p>The following examples shows how to interact with a component. We create an <code>id</code> to
           listen for DOM events in every component seperately. We need to pass <code>sources</code> to
           the component, so we can listen for events. These events are collected in <code>actions</code> which
           can influence the <code>state$</code> from which the <code>vtree$</code> will be generated:</p>
        <div className="component">{state.interactiveComponent1}</div>
        <div className="component">{state.interactiveComponent2}</div>
      </section>

      <section className="example-section">
        <h1>Configurable</h1>
        <p>This is the same example as "Interactive", but with a configurable start value. The start value
           is just an <code>Observable</code> of a number which we call <code>props$</code>:</p>
        <div className="component">{state.configurableComponent1}</div>
        <div className="component">{state.configurableComponent2}</div>
      </section>

      <section className="example-section">
        <h1>Configurable (Complex)</h1>
        <p>This is the same example as "Configurable", but with a complex configurable object
           as <code>props$</code> which we handle inside <code>model()</code>. Besides changing the
           start value we can change the increment and decrement amount:</p>
        <div className="component">{state.configurableComplexComponent1}</div>
        <div className="component">{state.configurableComplexComponent2}</div>
      </section>

      <section className="example-section">
        <h1>Composable</h1>
        <p>We can compose multiple components to a new one. In this example we created a new component
           called "slider" and the "counter" component we created earlier in the "Configurable (Complex)"
           section. We create two sliders which will change the amount we use for incrementing or
           decrementing the counter value. To do this the "slider" needs to return not only
           the <code>vtree$</code>, but the <code>state$</code> as well. We then use the <code>state$</code> from
           the sliders to change the <code>props$</code> for the "counter".</p>
        <div className="component">{state.composableComponent1}</div>
        <div className="component">{state.composableComponent2}</div>
      </section>

      <section className="example-section">
        <h1>Transformable</h1>
        <p>You can easily transform existing components into new ones by modifying the returned <code>vtree$</code>.
           Maybe you need this, if you use a 3rd-party component which you cannot change directly.
           This can be as easy as adding additional CSS classes or as complex as reordering the whole markup.
           (But be aware! This could lead to tight coupling.)<br/>
           In this example we just add <code>&lt;span&gt;←&lt;/span&gt;</code> inside our slider component.</p>
        <div className="component">{state.transformableComponent1}</div>
        <div className="component">{state.transformableComponent2}</div>
      </section>
    </div>
  );

  return {
    DOM: vtree$
  };
}

const drivers = {
  DOM: makeDOMDriver('#example')
};

run(main, drivers);
