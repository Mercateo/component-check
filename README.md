# component-check

> A quick introduction to explore how components can be created in several frameworks.

In this project I want to compare the usage and development of components in several frameworks. To test these frameworks I'll create multiple components from simple to complex to show the differences between these frameworks. I currently plan to look into the following frameworks:

* [Angular 1](https://angularjs.org/)
* [Angular 2](https://angular.io/)
* [Ember](http://emberjs.com/)
* [Redux](http://redux.js.org/)
* [Cycle.js](http://cycle.js.org/)
* [React](https://facebook.github.io/react/) with [Freezer](https://github.com/arqex/freezer) (inspired by [_React.js the simple way_](https://medium.com/@arqex/react-the-simple-way-cabdf1f42f12))

_Note_: This is a _work-in-progress_ and don't forget that Angular 2 is still an alpha, Ember will introduce [routable and angle brackets components](http://emberjs.com/blog/2015/05/24/another-two-oh-status-update.html) soon and Cycle will introduce [isolated components](https://github.com/cyclejs/isolate) in the next release.
I will not explain every framework in detail. I'll focus on creating components.
I will not look into [Polymer](https://www.polymer-project.org/) which is very component-oriented, because it doesn't support IE9 which is a requirement for our projects.

So what is a component? Let us keep the definition short and generic and treat them as re-usable and composable pieces of HTML, CSS and/or JavaScript code mostly used for GUI elements.

#Table of contents

- [Goals](#goals)
- [Usage](#usage)
- [A word about tooling](#a-word-about-tooling)
- [Introducing: webpack](#introducing-webpack)
- [Static components](#static-components)
  - [Angular 1](#angular-1)
  - [Angular 2](#angular-2)
  - [Ember](#ember)
  - [Cycle.js](#cyclejs)
  - [React](#react)
- [Introducing: JSX](#introducing-jsx)

# Goals

- compare the usage and development of the same components written in the frameworks mentioned above
- find _universal skeletons_ for components
- find a common tooling around these frameworks

# Usage

I'll create an example for every component and every framework. You'll need to install the dependencies for these examples with `$ npm install`. You can than run an example with `$ npm start` and open [http://localhost:8080/](http://localhost:8080/) in your browser.

# A word about tooling

I recommend to install a recent version of [Node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) before you start. I'll try to _not_ use [Bower](http://bower.io/) as a second package manager, because it is mostly superfluous nowadays. All frameworks mentioned above should be easily usable with npm only.

For frameworks using virtual DOM libraries I'll use [JSX](https://facebook.github.io/jsx/), which is a syntax extension to JavaScript which I _personally_ find more readable than using the libraries directly. However I'll show an example without JSX first, before I'll introduce JSX. Recommending JSX is highly subjective. Some people like it, some people don't. Time will tell, if there is a place for it in the future.

We'll compile JSX with [Babel](https://babeljs.io/) which also offers us the opportunity to write our code in [ES2015](https://babeljs.io/docs/learn-es2015/).

I really tried to use [TypeScript](http://www.typescriptlang.org/) in my examples, too. I like the idea behind it and that you'll catch bugs earlier and get a better auto-completion. I think I test TypeScript once in a year in different projects and always hit a dead end somewhere. Be it the combination of JSX+TS+non-React-framework, old or false TypeScript definitions files, _another_ package manager just for type definitions called `tsd`, a GitHub API rate limit which prevents me from downloading more type definitions... Just recently TypeScript added a way to add type definitions to your `package.json` with a `typings` property. This could _kill_ `tsd` in the future... if just... I think TypeScript needs a loose mode which basically allows a module _without_ a `typings` property in `package.json` to export everything as an `any` type. That way we could get rid of `tsd` and gradually get better type checks, if module authors add `typings` to `package.json`. But for now you would just get missing import errors...

All examples will be build with [webpack](https://webpack.github.io/). It is currently my favorite way to build applications.

Webpack allows the usage of [CSS Modules](https://github.com/css-modules/css-modules) which will keep us safe from global CSS class name clashes. Again... I don't recommend to use CSS Modules for your own projects (at least for now), but as this is a research project and I want to learn more about CSS Modules I'll use them here.

_Note_: I personally like JSX, Babel and CSS Modules as they make my code safer, easier to write and more readable. But don't forget that these are additional compilation steps which _can_ introduce bugs or confuse new developers.

# Introducing: webpack

Webpack is a tool which allows bundling _and_ processing of dependencies. It can handle nearly any kind of dependency - code or non-code assets like images, fonts, etc. You can break down the dependency to a specific component, so we can declare _which_ component needs a specific image, instead of loading all our needed images somewhere globally. The core concept behind this functionality is the so-called _loader_.

For our first example [_static components_](#static-components) we mostly need one loader: [babel-loader](https://github.com/babel/babel-loader). This loader allows us to compile ES.next to ES.current features (e.g. you can use ES6 or ES7 features in browsers which only support ES5) with Babel. We install it with some peer dependencies to use a recent version of Babel:

```bash
$ npm install --save-dev babel-loader babel-core babel-preset-es2015
```

And we need a small config file called `.babelrc` for Babel, so it uses the ES2015 preset:

```json
{
  "presets": [
    "es2015"
  ]
}
```

Of course we need to install webpack now to use this loader. Alongside with webpack we install [webpack-dev-server](https://github.com/webpack/webpack-dev-server). This server serves our app (suprise) and reloads the browser, if a code change is detected.

```bash
$ npm install --save-dev webpack webpack-dev-server
```

To use the modules we add two commands to our `package.json` in the `"scrips"` property:

```json
{
  "scripts": {
    "start": "webpack-dev-server --inline",
    "build": "webpack"
  }
}
```

To run our app and use it in a browser on [http://localhost:8080/](http://localhost:8080/) we'll call `$ npm start`, but be prepared: no app will be generated, because of `--inline`! At least not on the file system. The server compiles our app on the fly for faster changes. If you want to generate the app on the file system you must call `$ npm run build`.

You configure webpack in a file called `webpack.config.js` so it knows which loaders should be used. The file will be mostly identical between all frameworks, but I'll highlight differences.

There is just one last missing part: webpack works on the basis of JavaScript modules, but the entry point for a single page application is typically a `index.html` file. This is an [open issue](https://github.com/webpack/webpack/issues/536) for webpack. For now we'll need another module called [html-webpack-plugin](https://github.com/ampedandwired/html-webpack-plugin) to solve this problem:

```bash
$ npm install --save-dev html-webpack-plugin
```

Our generic `webpack.config.js` looks like this:

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: './dist',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist'
  }
};
```

We place our source code in a folder called `src/` and our compiled app will be outputted in a folder called `dist/`. Our development server uses `dist/` as its base. The entry point of our app will be a file called `src/app.js`. All JavaScript files are loaded by Babel and we'll generate a ["cheap" Source Map](https://webpack.github.io/docs/configuration.html#devtool) (only preserving lines).

Alongside with our compiled JavaScript we generate a `index.html`. Its template looks like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Framework • example</title>
</head>
<body>
  <main id="example-app">Loading...</main>

  {% for (var chunk in o.htmlWebpackPlugin.files.chunks) { %}
  <script src="{%= o.htmlWebpackPlugin.files.chunks[chunk].entry %}"></script>
  {% } %}
</body>
</html>

```

# Static components

## Angular 1

Let's start with a static component. I'll show examples in the order how the frameworks are mention at the beginning of this article. That means we'll start with Angular 1 which _of course_ deviates from our generic setup I just introduced. 😉

Inside our `index.html` you must change the line:

```html
<main id="example-app">Loading...</main>
```

to

```html
<main ng-app="example-app"><ng-view>Loading...</ng-view></main>
```

because the entry point for an Angular application is defined with the `ng-app` attribute and a application name like `example-app` as its value. You'll also see the `<ng-view>` element. Both - the `ng-app` attribute and `<ng-view>` element - are so-called [_directives_](https://docs.angularjs.org/guide/directive), which is how components are called in Angular. `ng-app` comes with Angular core module, `<ng-view>` from the [angular-route](https://docs.angularjs.org/api/ngRoute) module. For a seasoned Angular developer it could look like overkill to use angular-route in this basic example which I need to show the entry template/view which holds our components (an easier way could be the [ng-include](https://docs.angularjs.org/api/ng/directive/ngInclude) directive), but I think this example can be easier compared to the other frameworks in that way.
Now we need to install Angular 1 and angular-route:

```bash
$ npm install --save angular angular-route
```

With this out of the way we can start developing. Our `app.js` looks like this:

```javascript
import angular from 'angular';
import ngRoute from 'angular-route';

angular.module('example-app', [
  ngRoute
]).config($routeProvider => {
  $routeProvider.when('/', {
    template: `<static-component></static-component>`
  });
});
```

We load `angular` and `angular-route`. We create our module called `example-app` (the value from the `ng-app` attribute) and say it depends on `ngRoute`. In our `config` callback we [_inject_](https://docs.angularjs.org/guide/di) `$routeProvider` and say that it should render the `<static-component>` element, if you visit [http://localhost:8080/](http://localhost:8080/). Try it with running `$ npm start`! You'll see that the _"Loading..."_ text disappears... and nothing happens. That is expected, because we never declared a `<static-component>` element anywhere.

Create a new file `static-component/index.js` which looks like this:

```javascript
import angular from 'angular';

export default angular.module('static-component', []).directive('staticComponent', () => {
  return {
    template: `<p>Static content.</p>`
  };
}).name;
```

Simple: We create a new module `static-component`, create a new directive `staticComponent` (camelCased so it is written as `<static-component>` in HTML) and return a plain object containing the template without logic. At the end our module name is exported, so it can be imported from our app and be used as a dependency.

Let's see our updated `app.js`:

```javascript
import angular from 'angular';
import ngRoute from 'angular-route';
import staticComponent from './static-component';

angular.module('example-app', [
  ngRoute,
  staticComponent
]).config($routeProvider => {
  $routeProvider.when('/', {
    template: `<static-component></<static-component>`
  });
});
```

The browser should be refreshed by now and instead of a blank page you should see the text _"Static content."_ in a `<p>` element.

_Note_: As you can see Angular 1 uses its own module system and not _just_ ES6 modules. You basically declare dependencies by passing module names, but these modules aren't loaded from the file system. We need ES6 modules for that (or a similar technique).

## Angular 2

Angular 2 uses ES6/7 features heavily. Some features like decorators are still in flux (just like Angular 2 itself). Sadly decorators are broken in the current version of Babel, so we use a fallback which needs the [reflect-metadata package](https://www.npmjs.com/package/reflect-metadata). Because Angular 2 can also break easily, we use a specific version for our example (`2.0.0-alpha.46`). Just install both modules with this command:

```bash
$ npm install --save angular2@2.0.0-alpha.46 reflect-metadata
```

Just as with Angular 1 we need to slightly adapt our `index.html`. Change

Inside our `index.html` you must change the line:

```html
<main id="example-app">Loading...</main>
```

to

```html
<main><example-app>Loading...</example-app></main>
```

`<example-app>` will be the entry point for our application. As you can see our application is treated like a component on its own. This will be our skeleton:

```javascript
import 'reflect-metadata';
import { Component, View, bootstrap } from 'angular2/angular2';

class ExampleApp {
  static get annotations() {
    return [
      new Component({
        selector: 'example-app'
      }),
      new View({
        template: `<static-component></<static-component>`
      })
    ];
  }
}

bootstrap(ExampleApp);
```

Components are declared as classes which are written in PascalCase. You can name them like you want, so `ExampleApp` is _not_ translated to `<example-app>` in our HTML. `static get annotations` is our fallback, because we can't use decorators. Decorators/annotations are used to configure the component. We create a new `Component` instance and set a `selector`. _This_ selector refers to `<example-app>` in our `index.html`. We also create a new `View` instance which holds the same `template` as our previous example.

If you run `$ npm start` you will see the _"Loading..."_ text disappear. We have to define our `<static-component>` again.

To do so create a new file `static-component/index.js`:

```javascript
import { Component, View } from 'angular2/angular2';

export default class StaticComponent {
  static get annotations() {
    return [
      new Component({
        selector: 'static-component'
      }),
      new View({
        template: `<p>Static content.</p>`
      })
    ];
  }
}
```

As you can see we export this component class. Our application needs to import this component definition and use it in its template. Just add a `directive` property to your view configuration holding an array of component classes, which should be used.

```javascript
import 'reflect-metadata';
import { Component, View, bootstrap } from 'angular2/angular2';
import StaticComponent from './static-component';

class ExampleApp {
  static get annotations() {
    return [
      new Component({
        selector: 'example-app'
      }),
      new View({
        directives: [ StaticComponent ],
        template: `<static-component></<static-component>`
      })
    ];
  }
}

bootstrap(ExampleApp);
```

Save your changes. You should now see the text _"Static content."_ in your browser.

## Ember

Ember is a framework which focuses a lot on productivity and conventions in multiple projects. Upside: If you're an Ember developer you can easily switch between multiple Ember projects. Downside: If you have heterogeneous projects or a lot of developers coming from other frameworks it can be troublesome to understand the internal logic which is sometimes hidden by Embers conventions. (At least in my opinion.)

If you want to start an Ember project do yourself a favor and use [ember-cli](http://ember-cli.com/)! It is the official build tool for Ember which is used by _everyone_ in the Ember community. For this research however I tried to use Ember with webpack. I personally find that easier to use (nearly the same build process for _any_ framework) and easier to compare to other frameworks. Besides that I learned a lot about Ember by _not_ using ember-cli.

Note: Ember will soon introduce angle brackets components, so you can write a component like this: `<static-component></static-component>`. I couldn't create a running example, because angle brackets components can only be used in canary builds of Ember. In these examples we use traditional curly braces components written as `{{static-component}}`. They will not just differ in syntax, but also in functionality. Angle brackets components will use one-way data-binding by default.

Because Ember uses [Handlebars](http://handlebarsjs.com/) templates (or more precisely [HTMLBars](https://github.com/tildeio/htmlbars)) for views, we'll need to add a new loader to our `webpack.config.js`. (Note: This is exactly the job which ember-cli solves. You don't need to create your own build config. This is great! But if you want to re-use an existing build config as in our case, this can be troublesome.)

First install [ember-templates-loader](https://github.com/shama/ember-templates-loader):

```bash
$ npm install --save-dev ember-templates-loader
```

And add a new loader to `webpack.config.js`:

```javascript
// existing babel loader for .js files
{
  test: /\.js$/,
  exclude: /node_modules/,
  loader: 'babel'
},
// new handlebars loader for .hbs files
{
  test: /\.hbs$/,
  loader: 'ember-templates'
}
```

Now we will install Ember itself. Sadly Ember is the only framework in this list, which doesn't use npm officialy. However we can use the build created for Bower by using the tarball directly:

```bash
$ npm install --save https://github.com/components/ember/tarball/2.2.0
```

This will also download [jQuery](https://jquery.com/) which is a dependency of Ember. Because Ember doesn't use npm we need to create small [shims](https://en.wikipedia.org/wiki/Shim_(computing)) to easily import Ember. First create a `src/jquery-shim.js`:

```javascript
import jQuery from 'jquery';
window.jQuery = jQuery;
```

Now create a `src/ember-shim.js`:

```javascript
import './jquery-shim';
import 'components-ember';
export default window.Ember;
```

If you now `import Ember from './ember-shim';` both Ember and jQuery are correctly imported and can be treated like the other frameworks in this list.

This is how our initial `app.js` will look like:

```javascript
import Ember from './ember-shim';
import applicationTemplate from './templates/application.hbs';

// register templates
Ember.TEMPLATES.application = applicationTemplate;

const ExampleApp = Ember.Application.extend({});

ExampleApp.create({
  ready() {
    document.getElementById('example-app').remove();
  }
});
```

And we need `src/templates/application.hbs` as our initial template:

```handlebars
{{static-component}}
```

In this small code example you'll already see some of Embers conventions. Ember expects a template called `application` as the initially rendered template. We need to manually add it to `Ember.TEMPLATES`, because we use webpack. This would be done automatically if we would use ember-cli. We then `create` a new `Ember.Application`. Our application will be rendered as a child element into `body`. We need to remove `#example-app` on our own, when our application is `ready`. I couldn't figure out how to render the application directly into `#example-app` like other frameworks.

As always: our application loads, _"Loading..."_ disappears... and nothing happens. We still need our static component which is rendered as `{{static-component}}`.

It looks like this (`src/components/static-component/component.js`):

```javascript
import Ember from '../../ember-shim';
import template from './template.hbs';

Ember.TEMPLATES['components/static-component'] = template;
export default Ember.Component.extend({});
```

And has this template (`src/components/static-component/template.hbs`) which needs to be manually added to `Ember.TEMPLATES`, too:

```handlebars
<p>Static content.</p>
```

Add it to your `app.js` like this:

```javascript
import Ember from './ember-shim';
import applicationTemplate from './templates/application.hbs';
import StaticComponent from './components/static-component/component';

// register templates
Ember.TEMPLATES.application = applicationTemplate;

const ExampleApp = Ember.Application.extend({});

// register components
ExampleApp.StaticComponentComponent = StaticComponent;

ExampleApp.create({
  ready() {
    document.getElementById('example-app').remove();
  }
});
```

Like our templates we need to register the component to our application. Again - this is something which happens automatically, if you use ember-cli. To register a component you add its name (in this case `StaticComponent`) with a `Component` suffix to `ExampleApp`. So yeah... You _need_ to name it `StaticComponentComponent`.

Call `$ npm start` now. _"Loading..."_ disappears and _"Static content."_ is rendered.

## Cycle.js

Cycle.js is a framework which introduces several concepts which deviate from the MVC frameworks from the last year. I recommend to read the [documentation of Cycle.js](http://cycle.js.org/) before you start, because I can't explain them here in detail. It is is a relatively small framework so you don't have to learn a lot of code, but you need to learn a new paradigm to write a good Cycle application.

I'll try to break down the general idea:

A Cycle application has a `main` function which accepts a `sources` object and returns a `sinks` object. These objects can hold several [observables](http://reactivex.io/intro.html) which are provided by or passed to [drivers](http://cycle.js.org/drivers.html). You can think of an observable as an [_"asynchronous immutable array"_](https://medium.com/@andrestaltz/2-minute-introduction-to-rx-24c8ca793877). Drivers are _"side-effectful functions with Observables as input (for reading from the external world) and Observables as output (for writing side effects)"_ ([source](http://cycle.js.org/drivers.html)).

A practical explanation could sound like this: You have a _DOM driver_ which passes events created by the user (like click events on a button) as an observable to the `main` function. The `main` function reads these observables and computes an output (like the markup for a button which is disabled after the first click) which is returned as an observable. The _DOM driver_ now renders the output.

For a basic app skeleton we need three modules:
- [`@cycle/core`](https://github.com/cyclejs/cycle-core): This package has just one function called `run` which _connects_ our `main` function with drivers.
- [`@cycle/dom`](https://github.com/cyclejs/cycle-dom): This is a driver which allows our `main` function to interact with the DOM.
- [`rx`](https://github.com/Reactive-Extensions/RxJS): RxJS is a library written around observables. If you write a Cycle application, you'll really write RxJS code 90% of the time.

```bash
$ npm install --save rx @cycle/core @cycle/dom
```

This time we don't need to change our `index.html`. We can look directly into our `app.js`:

```javascript
import { run } from '@cycle/core';
import { makeDOMDriver, h } from '@cycle/dom';
import { Observable } from 'rx';

function main(sources) {
  const vtree = h('div');
  const vtree$ = Observable.just(vtree);
  const sinks = {
    DOM: vtree$
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#example-app')
};

run(main, drivers);
```

We create a `main` function and a `drivers` object. Both are passed to `run`. The `drivers` object holds a DOM driver instance which uses the element with the ID `example-app` as the entry point to our application. The `main` function gets a `sources` object which we don't use right now, but it holds an `DOM` object and it returns a `sinks` object, which also holds a `DOM` object. `sources.DOM` and `sinks.DOM` are the input and output observables we pass to out `DOM` driver instance as explained earlier. But what is this?:

```javascript
  const vtree = h('div');
  const vtree$ = Observable.just(vtree);
```

As we work soly on observables, we don't generate DOM markup directly (which is the job of `@cycle/dom`). Instead the function `h` allows us to create a virtual DOM (using the [virtual-dom library](https://github.com/Matt-Esch/virtual-dom)). In this case `h('div')` creates an empty `<div></div>`. This virtual DOM is often called `vtree`. The DOM driver however needs an observable to operate on, not just the virtual DOM. So we wrap our `vtree` into an observable with `Observable.just`. This function returns an observable which we call `vtree$`. The `$` suffix is an hungarian notation which is used in the Cycle community to mark observables.

If you run `$ ws start` now you see the _"Loading..."_ text disappear. Success! Now we need to create our static component. This step deviates from other frameworks as a component is _just a function_. You will not find any `<static-component>` markup here. Again: Cycle comes with a lot of new concepts and paradigms. These are quit powerful (e.g. a single function can be easily tested), but you need to learn more to get started. Anyway... let's try it.

Create a file `static-component/index.js`:

```javascript
import { h } from '@cycle/dom';
import { Observable } from 'rx';

export default function StaticComponent(sources) {
  const vtree = h('p', 'Static content.');
  const vtree$ = Observable.just(vtree);
  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
```

This looks nearly identical to our application skeleton, but instead of creating an empty `<div>` we create `<p>Static content.</p>`. We even pass `sources` to our component even though we don't use it (yet). However this will be needed by future components.

Our `app.js` now looks like this:

```javascript
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
```

We import `StaticComponent` and create a new component by calling it. We then `map` over `staticComponent.DOM` which will be called every time our markup changes (which is just _once_, because it is a static component) and place our virtual DOM from the component into a `<div>`.

Run `$ ws start` now and you see the _"Static conent."_.

## React

At this time you would probably expect an introduction to Redux or freezer with a [flux-like architecture](https://medium.com/@arqex/react-the-simple-way-cabdf1f42f12). Both are needed to handle state changes in an application. Because we only look into static components for now we can focus on React and will introduce Redux and freezer at a later step.

First install `react` and `react-dom`:

```bash
$ npm install --save react react-dom
```

Our app skeleton is very easy. This is our `src/app.js`:

```javascript
import React from 'react';
import { render } from 'react-dom';

render(
  React.DOM.div(null, ''),
  document.getElementById('example-app')
);
```

`React.DOM` has several helper functions to create ([virtual](http://tonyfreed.com/blog/what_is_virtual_dom)) DOM elements like a `div`. The first argument is an object to set attributes on the DOM element (in this case we pass `null`, because the generated `<div>` has no attributes), the second argument is the content of the element (in this case an empty string). Then we say `render` the configured element into `#example-app`.

If you run `$ npm start` now the _"Loading..."_ text will disappear. So let us create a static component with React now in a new file `static-component/index.js`. It is literally a one-liner:

```javascript
import React from 'react';

export default () => React.DOM.p(null, 'Static content.');
```

We create a new [stateless functional component](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components) by creating a function which just returns our static markup and export this as our component. We now import this component into our app and create an element from it.

```javascript
import React from 'react';
import { render } from 'react-dom';
import StaticComponent from './static-component';

render(
  React.createElement(StaticComponent),
  document.getElementById('example-app')
);
```

Call `$ npm start` and... _Success!_ You'll see _"Static content."_.

# Introducing: JSX

For all frameworks using a virtual DOM library I'll use [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) in the next examples. As said earlier JSX has pros and cons. I personally find it easier to read and I'll use it for this research project, but this is not a general recommendation. Anyway... let us recreate the static components examples for Cycle.js and React with JSX.

First we need to enable Babel to read and transform JSX syntax. Install these two Babel plugins:

```bash
$ npm install --save-dev babel-plugin-syntax-jsx babel-plugin-transform-react-jsx
```

And change the `.babelrc`:

```json
{
  "plugins": [
    "transform-react-jsx"
  ],
  "presets": [
    "es2015"
  ]
}
```

Let us first look into our React example. With JSX this is how our new `static-component/index.js` looks like:

```javascript
import React from 'react';

export default () => <p>Static content.</p>;
```

And this our `app.js`:

```javascript
import React from 'react';
import { render } from 'react-dom';
import StaticComponent from './static-component';

render(
  <StaticComponent />,
  document.getElementById('example-app')
);
```

And now to our Cycle.js example. Install the same Babel plugins, but now modify your `.babelrc` to look like this:

```json
{
  "plugins": [
    [ "transform-react-jsx", { "pragma": "DOM.hJSX" } ]
  ],
  "presets": [
    "es2015"
  ]
}
```

This change is necessary, because `transform-react-jsx` expects React as the default library for our virtual DOM (hence the name).

Our `static-component/index.js` now looks like this:

```javascript
/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { Observable } from 'rx';

export default function StaticComponent(sources) {
  const vtree = <p>Static content.</p>;
  const vtree$ = Observable.just(vtree);
  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
```

And this our `app.js`:

```javascript
/** @jsx hJSX */
import { run } from '@cycle/core';
import { makeDOMDriver, hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import StaticComponent from './static-component';

function main(sources) {
  const staticComponent = StaticComponent(sources);
  const vtree$ = staticComponent.DOM.map(staticComponent => <div>{staticComponent}</div>);
  const sinks = {
    DOM: vtree$
  };
  return sinks;
}

const drivers = {
  DOM: makeDOMDriver('#example-app')
};

run(main, drivers);
```

# Introducing: CSS Modules

TODO

# Dynamic components

TODO

# Interactive components

TODO

# Configurable components

TODO

# Composable components

TODO

# Transformable components

TODO
