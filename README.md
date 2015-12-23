# component-check

> A quick introduction to explore how components can be created in several frameworks.

In this project I want to compare the usage and development of components in several frameworks. To test these frameworks I'll create multiple components from simple to complex to show the differences between these frameworks. I currently plan to look into the following frameworks:

* [Angular 1](https://angularjs.org/)
* [Angular 2](https://angular.io/)
* [Ember](http://emberjs.com/)
* [Cycle.js](http://cycle.js.org/)
* [React](https://facebook.github.io/react/) with [Redux](http://redux.js.org/)

_Note_: I'll only focus on creating components, because this is an important part of our daily business. I won't deep dive into every technical detail of the frameworks. I want to tell you _just enough_ to understand what happens. Don't forget that Angular 2 is still in beta, Ember will introduce [routable and angle brackets components](http://emberjs.com/blog/2015/05/24/another-two-oh-status-update.html) soon, so there is allways a little catch up game to play. We are in JS land, right?

_Note 2_: I will not look into [Polymer](https://www.polymer-project.org/) which is very component-oriented and a good candidate for this comparison, because it doesn't support IE9 which is a requirement for our projects.

So what is a component? Let us keep the definition short and generic and treat them as reusable and composable pieces of HTML, CSS and/or JavaScript code which are mostly used for GUI elements.

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
- [Introducing: CSS Modules](#introducing-css-modules)
- [Dynamic components](#dynamic-components)
  - [Angular 1](#angular-1-1)
  - [Angular 2](#angular-2-1)
  - [Ember](#ember-1)
  - [Cycle.js](#cyclejs-1)
  - [Redux](#redux)
- [Interactive components](#interactive-components)
  - [Angular 1](#angular-1-2)
  - [Angular 2](#angular-2-2)
  - [Ember](#ember-2)
  - [Cycle.js](#cyclejs-2)
  - [Redux](#redux-1)
- [Composable components](#interactive-components)
  - [Angular 1](#angular-1-3)
  - [Angular 2](#angular-2-3)
  - [Ember](#ember-3)
  - [Cycle.js](#cyclejs-3)
  - [Redux](#redux-2)
- [Conclusion](#conclusion)

# Goals

- compare how components are written in the frameworks mentioned above
- find generic skeletons and patterns for components
- battle test a single tooling against these frameworks

# Usage

I'll create an example for every component and every framework. You'll need to install the dependencies for these examples with `$ npm install`. You can then run an example with `$ npm start` and open [http://localhost:8080/](http://localhost:8080/) in your browser.

# A word about tooling

I recommend to install a recent version of [Node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) before you start. I'll try to _not_ use [Bower](http://bower.io/) as a second package manager, because it is mostly superfluous nowadays. All frameworks mentioned above should be easily usable with npm only.

For frameworks using virtual DOM libraries I'll use [JSX](https://facebook.github.io/jsx/), which is a syntax extension to JavaScript which I _personally_ find more readable than using the libraries directly. However I'll show an example without JSX first, before I'll introduce JSX. Recommending JSX is highly subjective. Some people like it, some people don't. Time will tell, if there is a place for it in the future.

We'll compile JSX with [Babel](https://babeljs.io/) which also offers us the opportunity to write our code in [ES2015](https://babeljs.io/docs/learn-es2015/).

I really tried to use [TypeScript](http://www.typescriptlang.org/) in my examples, too. I like the idea behind it and that you'll catch bugs earlier and get a better auto-completion in editors. I think I tested TypeScript every year since its release in different projects and always hit a dead end somewhere. Be it the combination of JSX+TS+non-React-frameworks, old or false TypeScript definitions files, _another_ package manager just for type definitions called `tsd`, a GitHub API rate limit which prevents me from downloading more type definitions... Just recently TypeScript added a way to add type definitions to your `package.json` with a `typings` property. This could _kill_ `tsd` in the future... if just... I think TypeScript needs a loose mode which basically allows a module _without_ a `typings` property in `package.json` to export everything as an `any` type. That way we could get rid of `tsd` and gradually get better type checks, if module authors add `typings` to `package.json`. But for now you would just get missing import errors...

All examples will be built with [webpack](https://webpack.github.io/). It is currently my favorite way to build applications.

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

Of course we need to install webpack now to use this loader. Alongside with webpack we install [webpack-dev-server](https://github.com/webpack/webpack-dev-server). This server serves our app (surprise) and reloads the browser, if a code change is detected.

```bash
$ npm install --save-dev webpack webpack-dev-server
```

To use the modules we add two commands to our `package.json` in the `"scripts"` property:

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
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
};
```

We place our source code in a folder called `src/` and our compiled app will be output in a folder called `dist/`. Our development server uses `dist/` as its base. The entry point of our app will be a file called `src/app.js`. All JavaScript files are loaded by Babel and we'll generate a [Source Map](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/?redirect_from_locale=de).

Alongside with our compiled JavaScript we generate a `src/index.html`. Its template looks like this:

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

Let's start with a static component. I'll show examples in the order the frameworks are mentioned at the beginning of this article. That means we'll start with Angular 1 which _of course_ deviates from our generic setup I just introduced. 😉

Inside our `src/index.html` you must change one line:

```diff
-<main id="example-app">Loading...</main>
+<main ng-app="example-app"><ng-view>Loading...</ng-view></main>
```

This is needed because the entry point for an Angular application is defined with the `ng-app` attribute and an application name like `example-app` as its value. You'll also see the `<ng-view>` element. Both - the `ng-app` attribute and `<ng-view>` element - are so-called [_directives_](https://docs.angularjs.org/guide/directive), which is how components are called in Angular. `ng-app` comes with Angular core module, `<ng-view>` from the [angular-route](https://docs.angularjs.org/api/ngRoute) module. For a seasoned Angular developer it could look like overkill to use angular-route in this basic example which I need to show the entry template/view which holds our components (an easier way could be the [ng-include](https://docs.angularjs.org/api/ng/directive/ngInclude) directive), but I think this example can be easier compared to the other frameworks in that way.
Now we need to install Angular 1 and angular-route:

```bash
$ npm install --save angular angular-route
```

With this out of the way we can start developing. Our `src/app.js` looks like this:

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

Create a new file `src/static-component/index.js` which looks like this:

```javascript
import angular from 'angular';

export default angular.module('static-component', []).directive('staticComponent', () => {
  return {
    template: `<p>Static content.</p>`
  };
}).name;
```

Simple: We create a new module `static-component`, create a new directive `staticComponent` (camelCased so it is written as `<static-component>` in HTML) and return a plain object containing the template without logic. At the end our module name is exported, so it can be imported from our app and be used as a dependency.

Let's see our updated `src/app.js`:

```diff
import angular from 'angular';
import ngRoute from 'angular-route';
+import staticComponent from './static-component';

angular.module('example-app', [
  ngRoute,
+  staticComponent
]).config($routeProvider => {
  $routeProvider.when('/', {
    template: `<static-component></static-component>`
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

Just as with Angular 1 we need to slightly adapt our `src/index.html`, so change this line:

```diff
-<main id="example-app">Loading...</main>
+<main><example-app>Loading...</example-app></main>
```

`<example-app>` will be the entry point for our application. As you can see our application is treated like a component on its own. This will be our app skeleton:

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
        template: `<static-component></static-component>`
      })
    ];
  }
}

bootstrap(ExampleApp);
```

Components are declared as classes which are written in PascalCase. You can name them like you want, so `ExampleApp` is _not_ translated to `<example-app>` in our HTML. `static get annotations` is our fallback, because we can't use decorators. Decorators/annotations are used to configure the component. We create a new `Component` instance and set a `selector`. _This_ selector refers to `<example-app>` in our `index.html`. We also create a new `View` instance which holds the same `template` as our previous example.

If you run `$ npm start` you will see the _"Loading..."_ text disappear. We have to define our `<static-component>` again.

To do so create a new file `src/static-component/index.js`:

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

```diff
import 'reflect-metadata';
import { Component, View, bootstrap } from 'angular2/angular2';
+import StaticComponent from './static-component';

class ExampleApp {
  static get annotations() {
    return [
      new Component({
        selector: 'example-app'
      }),
      new View({
+        directives: [ StaticComponent ],
        template: `<static-component></static-component>`
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

Because Ember uses [Handlebars](http://handlebarsjs.com/) templates (or more precisely [HTMLBars](https://github.com/tildeio/htmlbars)) for views, we'll need to add a new loader to our `webpack.config.js`. (Note: This is exactly the job which ember-cli solves. You don't need to create your own build config. This is great! But if you want to reuse an existing build config as in our case, this can be troublesome.)

First install [ember-templates-loader](https://github.com/shama/ember-templates-loader):

```bash
$ npm install --save-dev ember-templates-loader
```

And add a the new loader for Handlebars templates to `webpack.config.js`:

```diff
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
      },
+      {
+        test: /\.hbs$/,
+        loader: 'ember-templates'
+      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
};
```

Now we will install Ember itself. Sadly Ember is the only framework in this list, which doesn't use npm officially. However we can use the build created for Bower by using the tarball directly:

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

This is how our initial `src/app.js` will look like:

```javascript
import Ember from './ember-shim';
import applicationTemplate from './templates/application.hbs';

// register templates
Ember.TEMPLATES.application = applicationTemplate;

const ExampleApp = Ember.Application.create({
  ready() {
    document.getElementById('example-app').remove();
  }
});
```

And we need `src/application.hbs` as our initial template:

```handlebars
{{static-component}}
```

In this small code example you'll already see some of Embers conventions. Ember expects a template called `application` as the initially rendered template. We need to manually add it to `Ember.TEMPLATES`, because we use webpack. This would be done automatically if we would use ember-cli. We then `create` a new `Ember.Application`. Our application will be rendered as a child element into `body`. We need to remove `#example-app` on our own, when our application is `ready`. I couldn't figure out how to render the application directly into `#example-app` like other frameworks.

As always: our application loads, _"Loading..."_ disappears... and nothing happens. We still need our static component which is rendered as `{{static-component}}`.

It looks like this (`src/static-component/index.js`):

```javascript
import Ember from '../ember-shim';
import template from './template.hbs';

Ember.TEMPLATES['components/static-component'] = template;
export default Ember.Component.extend({});
```

And has this template (`src/static-component/template.hbs`) which needs to be manually added to `Ember.TEMPLATES`, too:

```handlebars
<p>Static content.</p>
```

Now add your newly created component to your `src/app.js` like this:

```diff
import Ember from './ember-shim';
import applicationTemplate from './application.hbs';
+import StaticComponent from './static-component';

// register templates
Ember.TEMPLATES.application = applicationTemplate;

const ExampleApp = Ember.Application.create({
  ready() {
    document.getElementById('example-app').remove();
  }
});

+// register components
+ExampleApp.StaticComponentComponent = StaticComponent;
```

Like our templates we need to register the component to our application. Again - this is something which happens automatically, if you use ember-cli. To register a component you add its name (in this case `StaticComponent`) with a `Component` suffix to `ExampleApp`. So yeah... You _need_ to name it `StaticComponentComponent`.

Call `$ npm start` now. _"Loading..."_ disappears and _"Static content."_ is rendered.

## Cycle.js

Cycle.js is a framework which introduces several concepts which deviate from the MVC frameworks from the last year. I recommend to read the [documentation of Cycle.js](http://cycle.js.org/) before you start, because I can't explain them here in detail. It is a relatively small framework so you don't have to learn a lot of code, but you need to learn a new paradigm to write a good Cycle application.

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

This time we don't need to change our `src/index.html`. We can look directly into our `src/app.js`:

```javascript
import { run } from '@cycle/core';
import { makeDOMDriver, div } from '@cycle/dom';
import { Observable } from 'rx';

function main(sources) {
  const vtree = div();
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
  const vtree = div();
  const vtree$ = Observable.just(vtree);
```

As we work solely on observables, we don't generate DOM markup directly (which is the job of `@cycle/dom`). Instead we the function `div` (or `h2`, `h3`, `ul`, `li`, etc, each corresponding to their respective DOM elements) which allows us to create a virtual DOM (using the [virtual-dom library](https://github.com/Matt-Esch/virtual-dom)). In this case `div()` creates an empty `<div></div>`. This virtual DOM is often called `vtree`. The DOM driver however needs an observable to operate on, not just the virtual DOM. So we wrap our `vtree` into an observable with `Observable.just`. This function returns an observable which we call `vtree$`. The `$` suffix is an hungarian notation which is used in the Cycle community to mark observables.

If you run `$ npm start` now you see the _"Loading..."_ text disappear. Success! Now we need to create our static component. This step deviates from other frameworks as a component is _just a function_. You will not find any `<static-component>` markup here. Again: Cycle comes with a lot of new concepts and paradigms. These are quite powerful (e.g. a single function can be easily tested), but you need to learn more to get started. Anyway... let's try it.

Create a file `src/static-component/index.js`:

```javascript
import { p } from '@cycle/dom';
import { Observable } from 'rx';

export default function StaticComponent(sources) {
  const sinks = {
    DOM: Observable.just(
      p('Static content.')
    )
  };
  return sinks;
}
```

This looks nearly identical to our application skeleton, but instead of creating an empty `<div>` we create `<p>Static content.</p>`. We even pass `sources` to our component even though we don't use it (yet). However this will be needed by future components.

Our `src/app.js` now looks like this:

```diff
import { run } from '@cycle/core';
import { makeDOMDriver, h } from '@cycle/dom';
import { Observable } from 'rx';
+import StaticComponent from './static-component';

function main(sources) {
-  const vtree = div();
-  const vtree$ = Observable.just(vtree);
+  const staticComponent = StaticComponent(sources);
+  const vtree$ = staticComponent.DOM.map(staticVTree => div(staticVTree));
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

Run `$ npm start` now and you see the _"Static content."_.

## React

At this time you would probably expect an introduction to Redux, which is a framework for handling state changes in an application. Because we only look into static components for now - which don't have state changes - we can focus on React and will introduce Redux at a later step.

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

If you run `$ npm start` now the _"Loading..."_ text will disappear. So let us create a static component with React now in a new file `src/static-component/index.js`. It is literally a one-liner:

```javascript
import React from 'react';

export default () => React.DOM.p(null, 'Static content.');
```

We create a new [stateless functional component](https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components) by creating a function which just returns our static markup and export this as our component. We now import this component into our `src/app.js` and create an element from it.

```diff
import React from 'react';
import { render } from 'react-dom';
+import StaticComponent from './static-component';

render(
-  React.DOM.div(null, ''),
+  React.createElement(StaticComponent),
  document.getElementById('example-app')
);
```

Call `$ npm start` and... _Success!_ You'll see _"Static content."_.

# Introducing: JSX

For all frameworks using a virtual DOM library I'll use [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html) in the next examples. As said earlier JSX has pros and cons. It is quite popular in the React and Redux community, but the Cycle community acutally recommends to use the [hyperscript-helpers](https://github.com/ohanhi/hyperscript-helpers) available through the DOM driver (e.g. `div()`, `p()`). I personally find JSX easier to read and I'll use it for this research project, but this is not a general recommendation. Anyway... let us recreate the static components examples for Cycle.js and React with JSX.

First we need to enable Babel to read and transform JSX syntax. Install these two Babel plugins:

```bash
$ npm install --save-dev babel-plugin-syntax-jsx babel-plugin-transform-react-jsx
```

And change the `.babelrc`:

```diff
{
+  "plugins": [
+    "transform-react-jsx"
+  ],
  "presets": [
    "es2015"
  ]
}
```

Let us first look into our React example. With JSX this is how our new `src/static-component/index.js` looks like:

```diff
import React from 'react';

-export default () => React.DOM.p(null, 'Static content.');
+export default () => <p>Static content.</p>;
```

And this our `app.js`:

```diff
import React from 'react';
import { render } from 'react-dom';
import StaticComponent from './static-component';

render(
-  React.createElement(StaticComponent),
+  <StaticComponent />,
  document.getElementById('example-app')
);
```

And now to our Cycle.js example. Install the same Babel plugins, but now modify your `.babelrc` to look like this:

```diff
{
  "plugins": [
-    "transform-react-jsx"
+    [ "transform-react-jsx", { "pragma": "DOM.hJSX" } ]
  ],
  "presets": [
    "es2015"
  ]
}
```

This change is necessary, because `transform-react-jsx` expects React as the default library for our virtual DOM (hence the name).

Our `src/static-component/index.js` now looks like this:

```diff
+/** @jsx hJSX */
-import { p } from '@cycle/dom';
+import { hJSX } from '@cycle/dom';
import { Observable } from 'rx';

export default function StaticComponent(sources) {
  const sinks = {
    DOM: Observable.just(
-      p('Static content.')
+      <p>Static content.</p>
    )
  };
  return sinks;
}
```

And this our `src/app.js`:

```diff
+/** @jsx hJSX */
import { run } from '@cycle/core';
-import { makeDOMDriver, div } from '@cycle/dom';
+import { makeDOMDriver, hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import StaticComponent from './static-component';

function main(sources) {
  const staticComponent = StaticComponent(sources);
-  const vtree$ = staticComponent.DOM.map(staticVTree => h('div', staticVTree));
+  const vtree$ = staticComponent.DOM.map(staticVTree => <div>{staticVTree}</div>);
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

The next thing will we setup before we move on are CSS Modules. I think no one would deny that styling is an integral part of component development, but it hasn't got the attention it needed in the last years. CSS styling can be quite hard and the main reason for this is, that CSS styling is done globally. If you have two components using the same CSS class names, you'll probably get styling errors. [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM) can help with that (CSS is scoped to a single component), but it has its own problems (no server-side rendering, lack of support, etc.). Most JS frameworks only focus on the _behavior_ of a component and not on its _look_, so we need a little bit of tooling on this side. Meet [CSS Modules](https://github.com/css-modules/css-modules)!

With CSS Modules two components can use the same CSS class name without styling errors, because every CSS class name is _hashed_ in a unique way. This happens when a component imports a CSS file. Importing a CSS file into a JS file? That sounds like a job for webpack! To do that we need to install two new modules:

- [css-loader](https://github.com/webpack/css-loader): This module loads our CSS files, hashes the CSS class names and generates Source Maps.
- [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin): This webpack plugin extracts every loaded CSS file and bundle the styles into a single CSS file.


```bash
$ npm install --save-dev css-loader extract-text-webpack-plugin
```

To use these modules we need to configure our `webpack.config.js` to load CSS files and save them in a single file:

```diff
var HtmlWebpackPlugin = require('html-webpack-plugin');
+var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
      },
+      {
+        test: /\.css$/,
+        loader: ExtractTextPlugin.extract('css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
+      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
+    new ExtractTextPlugin('styles.css')
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist'
  }
};
```

As you can see the css-loader module is configured via query parameter and the `localIdentName` value determines our hash pattern (`[name]__[local]___[hash:base64:5]` - with `name` as the file name of the CSS file and `local` as the CSS class name).

We also need to change our `src/index.html` template to load our CSS files just like it loads our JS files:

```diff
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Framework • example</title>

+  {% for (var css in o.htmlWebpackPlugin.files.css) { %}
+  <link href="{%= o.htmlWebpackPlugin.files.css[css] %}" rel="stylesheet">
+  {% } %}
</head>
<body>
  <main id="example-app">Loading...</main>

  {% for (var chunk in o.htmlWebpackPlugin.files.chunks) { %}
  <script src="{%= o.htmlWebpackPlugin.files.chunks[chunk].entry %}"></script>
  {% } %}
</body>
</html>
```

You can create a `src/static-component/static-component.css` file now, which looks identically for every framework:

```css
.p {
  color: red;
}
```

We use the generic class name `.p` which will style our `<p>` element we used in all of our static components, so its text color becomes red. Even if we would create a second component usind the _same_ class name and a text color of blue, our static component would still have red text, because our `.p` becomes hashed to something like `.static-component__p___3YbjK`. That's why I recommend to name your CSS file exactly like your component, because the name shows up in your hashed class name which is easier to read. But even you name your file to something generic like `style.css` you'll have great Source Map support, which always shows you the original file.

Even though the CSS file looks the same for every framework, the way it is loaded is slightly different every time. So let us try to break it down and begin with Angular 1 and its `src/static-component/index.js`:

```diff
import angular from 'angular';
+import styles from './static-component.css';

export default angular.module('static-component', []).directive('staticComponent', () => {
  return {
-    template: `<p>Static content.</p>`
+    template: `<p class="${styles.p}">Static content.</p>`
  };
}).name;
```

This is Angular 2 and its `src/static-component/index.js`:

```diff
import { Component, View } from 'angular2/angular2';
+import styles from './static-component.css';

export default class StaticComponent {
  static get annotations() {
    return [
      new Component({
        selector: 'static-component'
      }),
      new View({
-        template: `<p>Static content.</p>`
+        template: `<p class="${styles.p}">Static content.</p>`
      })
    ];
  }
}
```

This is Ember and its `src/static-component/index.js` _and_ its `src/static-component/template.hbs` :

```diff
import Ember from '../ember-shim';
import template from './template.hbs';
+import styles from './static-component.css';

Ember.TEMPLATES['components/static-component'] = template;
-export default Ember.Component.extend({});
+export default Ember.Component.extend({ styles });
```

```diff
-<p>Static content.</p>
+<p class="{{styles.p}}">Static content.</p>
```

This is Cycle and its `src/static-component/index.js`:

```diff
/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { Observable } from 'rx';
+import styles from './static-component.css';

export default function StaticComponent(sources) {
  const sinks = {
    DOM: Observable.just(
-      <p>Static content.</p>
+      <p className={styles.p}>Static content.</p>
    )
  };
  return sinks;
}
```

This is React and its `src/static-component/index.js`:

```diff
import React from 'react';
import styles from './static-component.css';

-export default () => <p>Static content.</p>;
+export default () => <p className={styles.p}>Static content.</p>;
```

Awesome! Thank you for reading so far and thank yourself, too! You now have a very nice setup for creating great components. We can now move on to examples showing you how to create more complex components.

# Dynamic components

Before we move on: all of the future examples use the same `webpack.config.js`, `.babelrc` and `src/index.html` dependent on the frameworks as before. The directory structure is always very similar to the current structure, we just rename files or directories like `static-component` to `dynamic-component`, etc. Our dynamic components use this CSS file for all examples (`src/dynamic-component/dynamic-component.css`):

```css
.container {
  background: #eee;
  padding: 10px 5px;
  border-radius: 5px;
  margin-bottom: 10px;
}
```

The goal of this example is to create a component which counts seconds starting with a random value between 1 and 100. We do that so we can create two instances of this component and see that they run independently.

## Angular 1

Our `src/app.js` is nearly unchanged. Just a little bit of renaming and we use our component two times:

```javascript
import angular from 'angular';
import ngRoute from 'angular-route';
import dynamicComponent from './dynamic-component';

angular.module('example-app', [
  ngRoute,
  dynamicComponent
]).config($routeProvider => {
  $routeProvider.when('/', {
    template: `
      <dynamic-component></dynamic-component>
      <dynamic-component></dynamic-component>
    `
  });
});
```

And this is our new `<dynamic-component>` in `src/dynamic-component/index.js`:

```javascript
import angular from 'angular';
import styles from './dynamic-component.css';

export default angular.module('dynamic-component', []).directive('dynamicComponent', () => {
  return {
    scope: true,
    controller($interval) {
      this.seconds = Math.ceil(Math.random() * 100);
      $interval(() => this.seconds++, 1000);
    },
    controllerAs: 'ctrl',
    template: `<div class="${styles.container}">I count {{ ctrl.seconds }} seconds.</div>`
  };
}).name;
```

Let us break this down. First we set a `scope` property to `true`. This is Angulars way to say, that every `<dynamic-component>` will have its own unique state. If you omit this line every `<dynamic-component>` will show the same value, because they share the same state. After that we add a `controller` to our directive which will hold and manipulate the component state. We inject the `$interval` service (you remember [injection?](https://docs.angularjs.org/guide/di)) into the `controller`. `$interval` is a service offered by Angular itself. It is similar to the native `setInterval`, but will automatically update Angulars data-binding. The callback we pass to `$interval` will be called every `1000` ms and will count up the variable `this.seconds` with `this` being the `controller`. `this.seconds` is initialized with a random value between 1 and 100. After that we give the controller the name `ctrl` with `controllerAs`. This is need to access the `controller` in our `template`. We can now access our variable `this.seconds` inside our `template` with `{{ ctrl.seconds }}`. The `{{}}` notation is Angulars way to say _Every time `{{ ctrl.seconds }}` changes, re-render our `template`._

## Angular 2

Our `src/app.js` looks like this:

```javascript
import 'zone.js';
import 'reflect-metadata';
import { Component, View, bootstrap } from 'angular2/angular2';
import DynamicComponent from './dynamic-component';

class ExampleApp {
  static get annotations() {
    return [
      new Component({
        selector: 'example-app'
      }),
      new View({
        directives: [ DynamicComponent ],
        template: `
          <dynamic-component></dynamic-component>
          <dynamic-component></dynamic-component>
        `
      })
    ];
  }
}

bootstrap(ExampleApp);
```

Note that we imported [zone.js](https://github.com/angular/zone.js) in the first line. This is a dependency of Angular 2 so you should already have this installed. I think it is a little bit hard to explain what a Zone is. The docs say: _"A Zone is an execution context that persists across async tasks."_ What that means is, that we can use a regular `setInterval`, something which knows nothing about Angular 2 (and the other way around, too), but Angular 2 can determine when an async `setInterval` callback is executed thanks to a "safe execution context", so it can update its state. This happens automatically if import zone.js and use `setInterval`, so we don't need a specific service like `$interval`.

Our `src/dynamic-component/index.js` looks like this:

```javascript
import { Component, View } from 'angular2/angular2';
import styles from './dynamic-component.css';

export default class DynamicComponent {
  constructor() {
    this.seconds = Math.ceil(Math.random() * 100);
    setInterval(() => this.seconds++, 1000);
  }

  static get annotations() {
    return [
      new Component({
        selector: 'dynamic-component'
      }),
      new View({
        template: `<div class="${styles.container}">I count {{ seconds }} seconds.</div>`
      })
    ];
  }
}
```

We use the `constructor` of our `DynamicComponent` `class` to specify our logic. This is basically what `controller` does in our Angular 1 example, but without `$interval`. We can then access our `this.seconds` variable in our template with `{{ seconds }}`. Note that Angular 2 doesn't use a `scope` concept anymore - every component has its own state by default.

Call `$ npm start` and you see the seconds increment.

## Ember

Our `src/app.js` are nearly unchanged. We just need to rename all occurrences of `static` to `dynamic` and use `{{dynamic-component}}` twice in our `src/application.hbs`.

This is our `src/dynamic-component/index.js`:

```javascript
import Ember from '../ember-shim';
import template from './template.hbs';
import styles from './dynamic-component.css';

Ember.TEMPLATES['components/dynamic-component'] = template;
export default Ember.Component.extend({
  styles,
  init() {
    this._super(...arguments);
    this.set('seconds', Math.ceil(Math.random() * 100));
    this.count();
  },
  count() {
    Ember.run.later(this, () => {
      this.set('seconds', this.get('seconds') + 1);
      this.count();
    }, 1000);
  }
});
```

`init` is a special function which will be called automatically when our component will be created. [We need to call `this._super(...arguments);`](http://guides.emberjs.com/v1.10.0/object-model/classes-and-instances/#toc_initializing-instances) inside `init` to pass any `arguments` to `_super` which handles any default initialisation logic. We use `this.set` and `this.get` to write and read properties like `seconds` in our component. These are available, because we `extend` from `Ember.Component` and they notify Ember about our state changes. That way we can initialize `seconds` with a random value between 1 and 100. We also call `count` which does what you think: it counts up `seconds`. You'll notice that we use `Ember.run.later` instead of `setInterval` which is [recommended by the docs](http://emberjs.com/api/classes/Ember.run.html#method_later) to avoid any strange effects.

Our `src/dynamic-component/template.hbs` looks like this:

```handlebars
<div class="{{styles.container}}">I count {{seconds}} seconds.</div>
```

## Cycle.js

To handle multiple components more easily we install a small helper called [`combineLatestObj`](https://github.com/staltz/combineLatestObj).

```bash
$ npm install --save rx-combine-latest-obj
```

This will collect the most recent state of all components in one object, so we know, when we need to re-render our application. We use it like this in our `src/app.js`:

```javascript
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

  const vtree$ = componentVtrees$.map(vtrees =>
    <div>
      {vtrees.dynamicComponent1}
      {vtrees.dynamicComponent2}
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
```

As you can see `combineLatestObj` collects multiple streams and collects them in one object (here `componentVtrees$`). We then return a new single vtree via `componentVtrees$.map` every time a component changes its own vtree.

This is our `src/dynamic-component/index.js`:

```javascript
/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import styles from './dynamic-component.css';

export default function DynamicComponent(sources) {
  const seconds$ = Observable.interval(1000)
    .startWith(Math.ceil(Math.random() * 100))
    .scan(seconds => ++seconds);

  const vtree$ = seconds$.map(seconds =>
    <div className={styles.container}>
      I count {seconds} seconds.
    </div>
  );

  return {
    DOM: vtree$
  };
}
```

As said earlier you'll be writing more RxJS code in a Cycle application than Cycle-specific code itself. The hardest thing to understand in this code snippet is probably `seconds$` - especially if you never used observables before. First we create an observable which is triggered every second (`Observable.interval(1000)`), then we prepend to it a random number between 1 and 100 (`.startWith(Math.ceil(Math.random() * 100))`). Now we have an observable with an initial value which can _do something_ every second. The _do_ part will be counting up which is done with `scan`. With `scan` we can operate on a _previous value_. E.g. we use our random start value and after a second we increment it. After another second we get our random start value which was incremented once and increment it again. Now it is incremented twice. This step is repeated every second and this stream of values is saved in `seconds$`. Now we produce new markup if `seconds$` gets a new value with `seconds$.map`.

## Redux

Finally we arrived at Redux. Probably the most popular framework in conjunction with React right now. Like Cycle Redux has a very unique way of designing an app. The code in the following example may seem a little bit verbose for displaying two random counters, but this approach really shines when your app grows.

So, what do you need to know about Redux? Instead of declaring some components and set the state of each component separately, we declare the state _first_ and dependent on the state what components should be rendered. We also don't have a state for every component, but a _global_ state ("global" = inside one Redux application). This global state is called [_store_](http://redux.js.org/docs/basics/Store.html). But of course we don't want manage a big, complex single state for our application. With [_reducers_](http://redux.js.org/docs/basics/Reducers.html) we can manage only small slices of our store. They will update our state by creating _a new one_, because our state is [immutable](https://en.wikipedia.org/wiki/Immutable_object). That is important to keep in mind. We can't update an old state, we can only create a new one. This allows will give us nice [debugging features](https://github.com/gaearon/redux-devtools) and performance gains, because states can be compared by pointer references instead of by value. The reducers are triggered by dispatching [_actions_](http://redux.js.org/docs/basics/Actions.html).

An action describes our state change. The reducer will make this change. The store holds the state. A reducer therefore has a very simple signature: it accepts a state and an action and returns a new state (`(state, action) -> newState`).

While Redux is often used with React, it doesn't have to. It is a standalone framework to manage state in an app. But because React is only concerned about our view and not our state they complement each other very well. So take the [_React example for static components_](#react) and install Redux itself as well as a small helper package to use Redux more easily with React:

```bash
$ npm install --save redux react-redux
```

This our app skeleton in `src/app.js`:

```javascript
import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import ExampleApp from './example-app';

const store = createStore(reducers);

render(
  <Provider store={store}>
    <ExampleApp />
  </Provider>,
  document.getElementById('example-app')
);
```

Uups! A bunch of things we've never seen. As said a store holds our application state. It is created with `createStore` (surprise!) and by passing our reducers, we'll soon look into. Don't forget: a reducer changes the state by creating a new one. The store is passed to a component called `<Provider>` offered by `react-redux`. With `<Provider>` we can access our store inside a child component no matter how deeply nested it is. One child component is `<ExampleApp />` which is a _smart container_. A smart container is a React component which knows about Redux and our store - they control a part of our view logic and are more coupled to our app. The other type of React component we'll use are _dumb component_ which don't know about Redux and our state and just render the data we give them. They aren't coupled to our app. You'll soon see a _dumb component_. Separating your app into _smart containers_ and _dumb containers_ is a very common concept in Redux application (and React in general). But note that this is a soft convention and these two types of React components are not strictly needed to create a Redux application. They just help you to organize your app. They can also overlap - you can have a React component which is _mostly_ smart, but also contains a little bit of _dumb_ rendering logic.

Before we look into `<ExampleApp />` we'll look into our `reducers`, because as I said earlier the state determines what will be rendered.

This is our `src/reducers.js`:

```javascript
import { combineReducers } from 'redux';
import { INCREMENT_SECOND } from './constants';

function randomSecond() {
  return Math.ceil(Math.random() * 100);
}

const initialState = [ randomSecond(), randomSecond() ];

function seconds(state = initialState, action) {
  switch (action.type) {
    case INCREMENT_SECOND:
      return [
        ...state.slice(0, action.index),
        ++state[action.index],
        ...state.slice(action.index + 1)
      ];
    default:
      return state;
  }
}

export default combineReducers({
  seconds
});
```

And the small `src/constants.js`:

```javascript
export const INCREMENT_SECOND = 'INCREMENT_SECOND';
```

`combineReducers` is a helper from Redux which allows us to augment multiple small reducers to a single one, because Redux expects a single reducer working on a single store. For our example we just create one reducer called `seconds` which will operate on a property called `seconds` on our store. We default `seconds` to `initialState` which is an array with two random values between 1 and 100. The reducer determines what to do with `action.type`. For now our reducer only knows one `action.type`: `INCREMENT_SECOND`. If an action with this type is encountered, we return a _new_ array of seconds (_new_ because our store is immutable) containing all seconds we already have and incrementing the second value specified by `action.index`. (You'll soon see how the action itself is created.) If our reducer encounters an unknown `action.type` we just return the old state.

I want to shortly explain this code snippet, if you're unfamiliar with ES2015:

```javascript
[
  ...state.slice(0, action.index),
  ++state[action.index],
  ...state.slice(action.index + 1)
];
```

This creates a new array (`[]`). It contains all values (`...`) from `0` to the index specified by `action.index` (`state.slice(0, action.index)`). It counts up one value specified at `action.index` (`++state[action.index]`). It contains all values (`...`) after `action.index` (`state.slice(action.index + 1)`).

Now look into our `<ExampleApp />` specified in `src/example-app/index.js`:

```javascript
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DynamicComponent from '../dynamic-component';
import { incrementSecond } from '../action-creators';

class ExampleApp extends Component {
  render() {
    const { seconds, actions: { incrementSecond } } = this.props;
    return (
      <div>
        {seconds.map((second, index) => (
          <DynamicComponent
            key={index}
            index={index}
            second={second}
            incrementSecond={incrementSecond} />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    seconds: state.seconds
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ incrementSecond }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExampleApp);
```

We create a new `ExampleApp` class extending from Reacts `Component`. It has a `render` function which will be called by React on state changes. This `render` function will create a `<div>` and two _dumb components_ called `<DynamicComponent />`. This component is dumb, because we pass _all data_ it needs to know directly into the component as properties. (Note that _key_ is a property [needed by React](https://facebook.github.io/react/docs/multiple-components.html#dynamic-children), not something we need for our application.) We pass `index` which will be the `action.index` we allready saw in our reducer. We pass `second` which is the value our `<DynamicComponent />` should render. And we pass `incrementSecond`. This is a function which will create an action and is therefor called an _action creator_.

After our `ExampleApp` class you'll see two functions: `mapStateToProps` and `mapDispatchToProps`. Remember that we wrapped our `<ExampleApp>` in a `<Provider>` earlier? The `<Provider>` allows us to access our store in `<ExampleApp>`, but we want to control exactly what data can be accessed, because our store can become really big in a complex app. This is what `mapStateToProps` and `mapDispatchToProps` do. We can specify exactly what parts of the store can be accessed in our `<ExampleApp>`. In this case it is just `state.seconds` (see `mapStateToProps`). And we can specify which actions we want to eventually dispatch in our `<ExampleApp>`. In this case it is the `incrementSecond` action (see `mapDispatchToProps`). This mapping is `connect`ed with our `ExampleApp` class with the [`connect`](https://github.com/rackt/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) helper offered by `react-redux` which makes our React `Component` aware of our Redux store.

Our action creator is very simple (`src/action-creators.js`):

```javascript
import { INCREMENT_SECOND } from './constants';

export function incrementSecond(index) {
  return {
    type: INCREMENT_SECOND,
    index
  }
}
```

As said earlier an action creator is just a function returning an action and an action is just a simple JavaScript object. This object has a `type` by convention to identify it. In this case our `incrementSecond` action creator returns an action with the `type` set to `INCREMENT_SECOND`. It just has one other property `index`. With the `index` specified our reducer knows which second should be incremented. We allready saw that.

There is just one missing piece now: our dumb component `<DynamicComponent>` created in `src/dynamic-component/index.html`.

```javascript
import React, { Component } from 'react';
import styles from './dynamic-component.css';

class DynamicComponent extends Component {
  componentDidMount() {
    const { incrementSecond, index } = this.props;
    setInterval(() => incrementSecond(index), 1000);
  }

  render() {
    const { second } = this.props;
    return (
      <div className={styles.container}>
        I count {second} seconds.
      </div>
    )
  }
}

export default DynamicComponent;
```

You'll notice that this component isn't `connect`ed with Redux by using `mapStateToProps` and `mapDispatchToProps`. This is a good indicator to distinguish _dumb components_ from _smart_ containers. The only interesting thing in this `DynamicComponent` class is `componentDidMount`. This is part of [Reacts lifecycle for `Component`s](https://facebook.github.io/react/docs/component-specs.html#mounting-componentdidmount) and it is called once when a `Component` was correctly setup (aka _mounted_, immediately after the first rendering). We call `setInterval` here to call `incrementSecond` every second. Because we passed `index` from our `<ExampleApp>` to our `<DynamicComponent>` earlier, we can now pass it to our action so our reducers know which second should be incremented.

And this is our working Redux example! You can see it by running `$ npm start`. Again... this example may seem a little bit verbose, but it scales well to more complex ones. If you need more data on your store you create a new reducer which also sets a default value to your data. You can access this data in _smart containers_ which are basically React `Component`s `connect`ed to a Redux store. The data than is passed from _smart containers_ to _dumb components_ which are React `Component`s _not_ `connect`ed to a Redux store, so they can be rendered.

# Interactive components

In our interactive components example we'll create a component containing two buttons and a value starting with `0`. A click on one button will decrement our value while a click on the other button will increment our value.

We'll reuse the same CSS file, but rename it from `src/dynamic-component/dynamic-component.css` to `src/interactive-component/interactive-component.css`.

## Angular 1

Our `src/app.js` is straightforward and nearly unchanged to the previous example. Just a little bit of renaming:

```javascript
import angular from 'angular';
import ngRoute from 'angular-route';
import interactiveComponent from './interactive-component';

angular.module('example-app', [
  ngRoute,
  interactiveComponent
]).config($routeProvider => {
  $routeProvider.when('/', {
    template: `
      <interactive-component></interactive-component>
      <interactive-component></interactive-component>
    `
  });
});
```

This is how `<interactive-component>` is implemented in `src/interactive-component/index.js`:

```javascript
import angular from 'angular';
import styles from './interactive-component.css';

export default angular.module('interactive-component', []).directive('interactiveComponent', () => {
  return {
    scope: true,
    controller() {
      this.value = 0;
      this.decrement = () => this.value--;
      this.increment = () => this.value++;
    },
    controllerAs: 'ctrl',
    template: `
      <div class="${styles.container}">
        <button ng-click="ctrl.decrement()">Decrement</button>
        Current value: {{ ctrl.value }}
        <button ng-click="ctrl.increment()">Increment</button>
      </div>
    `
  };
}).name;
```

This is very similar to our previous example. Inside our `controller` we initialize `this.value` with `0`. We also add two functions: `decrement` and `increment`. They will manipulate `this.value` accordingly. The interesting part is _how_ you call these functions. This is done on our two `<button>`s by using a special directive called `ng-click`, which is offered by Angular itself. This will call `decrement` or `increment` on every click and the state change is immediately reflected in our view.

## Angular 2

For Angular 2 the `src/app.js` is also nearly untouched:

```javascript
import 'zone.js';
import 'reflect-metadata';
import { Component, View, bootstrap } from 'angular2/angular2';
import InteractiveComponent from './interactive-component';

class ExampleApp {
  static get annotations() {
    return [
      new Component({
        selector: 'example-app'
      }),
      new View({
        directives: [ InteractiveComponent ],
        template: `
          <interactive-component></interactive-component>
          <interactive-component></interactive-component>
        `
      })
    ];
  }
}

bootstrap(ExampleApp);
```

And this is `<interactive-component>` in `src/interactive-component/index.js`:

```javascript
import { Component, View } from 'angular2/angular2';
import styles from './interactive-component.css';

export default class InteractiveComponent {
  constructor() {
    this.value = 0;
    this.decrement = () => this.value--;
    this.increment = () => this.value++;
  }

  static get annotations() {
    return [
      new Component({
        selector: 'interactive-component'
      }),
      new View({
        template: `
          <div class="${styles.container}">
            <button (click)="decrement()">Decrement</button>
            Current value: {{ value }}
            <button (click)="increment()">Increment</button>
          </div>
        `
      })
    ];
  }
}
```

The `constructor` is identical to our `controller` in Angular 1. The difference is _how_ you call `decrement` and `increment`. In Angular 2 you no longer use a directive called `ng-click`. Event handling is more of a language feature now. To set a click handler in Angular 2 you use `(click)` on an element. _Yes_, this is valid HTML. If you don't like it you can use the alternative syntax `on-click`, but all official examples will use the canonical `(click)`.

## Ember

Again... `src/app.js` is also nearly untouched as well as `src/application.hbs`. I'll not write them again. Let's dive straight into `src/interactive-component/index.js`:

```javascript
import Ember from '../ember-shim';
import template from './template.hbs';
import styles from './interactive-component.css';

Ember.TEMPLATES['components/interactive-component'] = template;
export default Ember.Component.extend({
  styles,
  value: 0,
  actions: {
    decrement() {
      this.decrementProperty('value');
    },
    increment() {
      this.incrementProperty('value');
    }
  }
});
```

We use the helper methods `this.incrementProperty` and `this.decrementProperty` to update our `value`. The important part is, that our `decrement` and `increment` functions are methods on a special object called `actions`. This way we can use them with the `{{action}}` helper in our `src/interactive-component/template.hbs` template:

```handlebars
<div class="{{styles.container}}">
  <button {{action "decrement"}}>Decrement</button>
  Current value: {{value}}
  <button {{action "increment"}}>Increment</button>
</div>
```

## Cycle.js

For Cycle.js our `src/app.js` is nearly unchanged, too. Other than the typical renaming of our component, we also introduced a new module, `@cycle/isolate`. This will keep our component instances independent to each other, as we will see.

```diff
/** @jsx hJSX */
import { run } from '@cycle/core';
import { makeDOMDriver, hJSX } from '@cycle/dom';
import { Observable } from 'rx';
+import isolate from '@cycle/isolate';
import combineLatestObj from 'rx-combine-latest-obj';
-import DynamicComponent from './dynamic-component';
+import InteractiveComponent from './interactive-component';

function main(sources) {
  const componentVtrees$ = combineLatestObj({
-    dynamicComponent1$: DynamicComponent(sources).DOM,
-    dynamicComponent2$: DynamicComponent(sources).DOM
+    interactiveComponent1$: isolate(InteractiveComponent)(sources).DOM,
+    interactiveComponent2$: isolate(InteractiveComponent)(sources).DOM
  });

  const vtree$ = componentVtrees$.map(vtrees =>
    <div>
-      {vtrees.dynamicComponent1}
-      {vtrees.dynamicComponent2}
+      {vtrees.interactiveComponent1}
+      {vtrees.interactiveComponent2}
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
```

`isolate(Component)` takes a `Component` function and returns a new component function, which is now "isolated". What isolation means will make sense later on when we capture user events.

The component itself is totally restructured. I changed the directory and file structure to a more canonical pattern:

```
src/interactive-component/index.js
src/interactive-component/intent.js
src/interactive-component/model.js
src/interactive-component/view.js
```

This structure follows the [Model-View-Intent](http://cycle.js.org/model-view-intent.html) architecture (or short: MVI) which is heavily used in Cycle.js applications. You probably know model and view from MVC. So what is an intent? An intent is an _"intepreted DOM event as the user's intended action"_. This is done by querying DOM events.

To say it in different words: Check if element `Foo` was clicked (= intent) and if it was clicked change our state (= model), so the user sees a result (= view).

That's also the reason why I introduce MVI in our interactive component example: no interaction, no intent.

So how does it look like? See our `src/interactive-component/index.js`:

```javascript
import intent from './intent';
import model from './model';
import view from './view';

export default function InteractiveComponent(sources) {
  const actions = intent(sources);
  const state$ = model(actions);
  const vtree$ = view(state$);

  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
```

This component skeleton will be very similar in all components you'll write in Cycle. The `sources` is passed to our `intent`. Inside `intent` we query for DOM events in our component and interpret them as `actions` which is returned by `intent`. The `actions` are passed to `model` to change our `state$` which is returned as an observable by `model`. We pass `state$` to our `view` to render our `state$` in our component template. `view` returns `vtree$` which itself can be used in our application. Let's look into `intent`, `model` and `view` now.

`src/interactive-component/intent.js` is the only real new concept here:

```javascript
export default function intent({ DOM }) {
  return {
    decrement$: DOM.select('.decrement').events('click').map(event => -1),
    increment$: DOM.select('.increment').events('click').map(event => +1)
  };
}
```

As I said we query our `DOM` by events. This done with basic CSS selectors (`.decrement` and `.increment`). These events are turned into observables describing the intended action (`decrement$` and `increment$`).

Since this gives us all click events that happen on every `'.decrement'` and `'.increment'` element on the DOM, the first component would be getting clicks from the second component, and vice versa. That is why we used `isolate()` in `src/app.js`. The two interactive components can now safely query for `.select('.decrement').events('click')` knowing that it will only give events from the current component instance.

This is `src/interactive-component/model.js`:

```javascript
import { Observable } from 'rx';

export default function model(actions) {
  return Observable.just(0)
    .merge(actions.decrement$)
    .merge(actions.increment$)
    .scan((value, delta) => value + delta);
}
```

We just create a new `Observable` initialized with `0`. We then `merge` our two action streams `decrement$` and `increment$` into this other stream and increment or decrement the value accordingly (`.scan((value, delta) => value + delta)`).

And this is `src/interactive-component/view.js`:

```javascript
/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import styles from './interactive-component.css';

export default function view(state$) {
  return state$.map(value =>
    <div className={styles.container}>
      <button className="decrement">Decrement</button>
      &nbsp;
      Current value: {value}
      &nbsp;
      <button className="increment">Increment</button>
    </div>
  );
}
```

Nothing fancy here. You'll also notice the use of `&nbsp;`. Because JSX normalizes whitespace differently than HTML, you need to explicitly declare a non-breaking space. (You can either see this as a benefit or downside of JSX. It is up to you.)

## Redux

`src/app.js` is completely unchanged. But we define two new action types in `src/constants.js`:

```javascript
export const DECREMENT = 'DECREMENT';
export const INCREMENT = 'INCREMENT';
```

Our `src/action-creators.js` are updated accordingly:

```javascript
import { DECREMENT, INCREMENT } from './constants';

export function decrement(index) {
  return {
    type: DECREMENT,
    index
  };
}

export function increment(index) {
  return {
    type: INCREMENT,
    index
  };
}
```

Our `src/reducers.js` should look very similar too. We initialize our state as an array with two `0`s and act up on incoming `action`s.

```javascript
import { combineReducers } from 'redux';
import { DECREMENT, INCREMENT } from './constants';

const initialState = [ 0, 0 ];

function values(state = initialState, action) {
  switch (action.type) {
    case DECREMENT:
      return [
        ...state.slice(0, action.index),
        --state[action.index],
        ...state.slice(action.index + 1)
      ];
    case INCREMENT:
      return [
        ...state.slice(0, action.index),
        ++state[action.index],
        ...state.slice(action.index + 1)
      ];
    default:
      return state;
  }
}

export default combineReducers({
  values
});
```

The `src/example-app/index.js` is also very similar to the previous example, besides we are managing two actions now:

```javascript
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import InteractiveComponent from '../interactive-component';
import { decrement, increment } from '../action-creators';

class ExampleApp extends Component {
  render() {
    const { values, actions: { decrement, increment } } = this.props;
    return (
      <div>
        {values.map((value, index) => (
          <InteractiveComponent
            key={index}
            index={index}
            value={value}
            decrement={decrement}
            increment={increment} />
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    values: state.values
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ decrement, increment }, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ExampleApp);
```

And this is our _dumb component_ `<InteractiveComponent />` in `src/interactive-component/index.js`:

```javascript
import React, { Component } from 'react';
import styles from './interactive-component.css';

class InteractiveComponent extends Component {
  render() {
    const { index, value, decrement, increment } = this.props;
    return (
      <div className={styles.container}>
        <button onClick={() => decrement(index)}>Decrement</button>
        &nbsp;
        Current value: {value}
        &nbsp;
        <button onClick={() => increment(index)}>Increment</button>
      </div>
    )
  }
}

export default InteractiveComponent;
```

The click hander is set by `onClick` which will just call `decrement` or `increment` (passed by `<ExampleApp />` to `<InteractiveComponent />`) passing an `index` to identify the component.

# Composable components

In our last example we build a complex widget composed out of two components. One will be our `<dynamic-component>` which we'll slightly adapt and the other one will be `<composable-component>` which will be a little bit like `<interactive-component>`, but instead of decrementing or incrementing a counter we'll add or remove instances of `<dynamic-component>`. Because `<dynamic-component>` can be destroyed at runtime I'll show you how to clean-up your component correctly. In this case we'll need to cancel our interval correctly. I also remove the random start value from `<dynamic-component>` and just start at 0 seconds.

`<composable-component>` will use this CSS style. It looks very similar to the `container` class we used earlier, just with a different `background`. That way you can easily distinguish the `<dynamic-component>` instances inside `<composable-component>`. You'll also see that the styles won't clash with each other even though both use `container` as a class name. Thank you CSS modules! 💕

```css
.container {
  background: #ddd;
  padding: 10px 5px;
  border-radius: 5px;
  margin-bottom: 10px;
}
```

## Angular 1

Let us start by look into our `src/app.js`. Nothing interesting so far:

```javascript
import angular from 'angular';
import ngRoute from 'angular-route';
import composableComponent from './composable-component';

angular.module('example-app', [
  ngRoute,
  composableComponent
]).config($routeProvider => {
  $routeProvider.when('/', {
    template: `
      <composable-component></composable-component>
    `
  });
});
```

The interesting part is our `src/composable-component/index.js`:

```javascript
import angular from 'angular';
import dynamicComponent from '../dynamic-component';
import styles from './composable-component.css';

var id = 0;

export default angular.module('composable-component', [
  dynamicComponent
]).directive('composableComponent', () => {
  return {
    scope: true,
    controller() {
      this.ids = [];
      this.removeDynamicComponent = (index) => this.ids.splice(index, 1);
      this.addDynamicComponent = () => this.ids.push(id++);
    },
    controllerAs: 'ctrl',
    template: `
      <div class="${styles.container}">
        <button ng-click="ctrl.addDynamicComponent()">Add dynamic component</button>
        <hr>
        <div ng-repeat="id in ctrl.ids">
          <dynamic-component></dynamic-component>
          <button ng-click="ctrl.removeDynamicComponent($index)">Remove dynamic component</button>
          <hr ng-if="!$last">
        </div>
      </div>
    `
  };
}).name;
```

As said earlier we want to add and remove instances of `<dynamic-component>`. To do that we need a way to display a component multiple times in a dynamic way. This is typically done with a directive called `ng-repeat` which repeats the element on which it is used _n_-times. Sadly we can't tell `ng-repeat` _directly_ to run _n_-times, but instead use an array with the length of _n_. For [performance reasons](https://docs.angularjs.org/api/ng/directive/ngRepeat) `ng-repeat` needs a way to track the values in the array. The default behavior of `ng-repeat` to do this is to _not_ allow duplicated values in our array. So we create a new `id` for every `<dynamic-component>` which is added. This `id` is saved in an array called `ids`. You can see how this is done in the `controller`. `ng-repeat` can now use this array like this: `ng-repeat="id in ctrl.ids"`.

Inside `ng-repeat` we have access to multiple special variables. Two of them are `$index` which behaves exactly like an index inside a `[].map` function and the other one is `$last` which is a boolean to indicate if the last component is currently rendered. We pass `$index` to our `removeDynamicComponent` function declared in our `controller` so we know which component should be removed. We use `$last` to place a `<hr>` between every `<dynamic-component>` _except_ the last one. This is done with another directive called `ng-if`. If you pass a _truthy_ value to `ng-if` the element on which it is used will be rendered. If the value is _falsy_ the element will not be placed inside the DOM. It looks like this: `<hr ng-if="!$last">`.

But don't forget to look inside `src/dynamic-component/index.js`:

```diff
import angular from 'angular';
import styles from './dynamic-component.css';

export default angular.module('dynamic-component', []).directive('dynamicComponent', () => {
  return {
    scope: true,
-    controller($interval) {
-      this.seconds = Math.ceil(Math.random() * 100);
-      $interval(() => this.seconds++, 1000);
+    controller($interval, $scope) {
+      this.seconds = 0;
+      const intervalId = $interval(() => this.seconds++, 1000);
+      $scope.$on('$destroy', () => $interval.cancel(intervalId));
    },
    controllerAs: 'ctrl',
    template: `
      <div class="${styles.container}">I count {{ ctrl.seconds }} seconds.</div>
    `
  };
}).name;
```

We inject the `$scope` object into our `controller` which holds our state. A special event called `$destroy` is triggered on this object when our component is removed, so we can do some clean-up work. When calling `$interval` an `intervalId` is returned. If this `intervalId` is passed to `$interval.cancel` the interval will be correctly canceled, so our seconds aren't counted forever without anyone seeing them.

Congratulate yourself! You've created a complex component in Angular 1.

## Angular 2

Again `src/app.js` hasn't changed much:

```javascript
import 'zone.js';
import 'reflect-metadata';
import { Component, View, bootstrap } from 'angular2/angular2';
import ComposableComponent from './composable-component';

class ExampleApp {
  static get annotations() {
    return [
      new Component({
        selector: 'example-app'
      }),
      new View({
        directives: [ ComposableComponent ],
        template: `
          <composable-component></composable-component>
        `
      })
    ];
  }
}

bootstrap(ExampleApp);
```

This is our `src/composable-component/index.js`:

```javascript
import { Component, View } from 'angular2/angular2';
import DynamicComponent from '../dynamic-component';
import styles from './composable-component.css';

var id = 0;

export default class ComposableComponent {
  constructor() {
    this.ids = [];
    this.removeDynamicComponent = (index) => this.ids.splice(index, 1);
    this.addDynamicComponent = () => this.ids.push(id++);
  }

  static get annotations() {
    return [
      new Component({
        selector: 'composable-component'
      }),
      new View({
        directives: [ DynamicComponent ],
        template: `
        <div class="${styles.container}">
          <button (click)="addDynamicComponent()">Add dynamic component</button>
          <hr>
          <div *ng-for="#id of ids; #$index = index, #$last = last">
            <dynamic-component></dynamic-component>
            <button (click)="removeDynamicComponent($index)">Remove dynamic component</button>
            <hr *ng-if="!$last">
          </div>
        </div>
        `
      })
    ];
  }
}
```

This component is similar to the Angular 1 version, but the built-in directives like `ng-repeat` and `ng-if` have slightly changed. `ng-repeat` is now called `ng-for` and you don't pass a value like `foo in foos`, but `#foo of foos`. This matches the [for-of loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) used in JavaScript. The `#` is needed to create a new local variable. You can also use `$index` and `$last` with `ng-for`, but they aren't accessible by default like in Angular 1. You explicitly say to use them which allows you to rename them, if you like: `#$index = index, #$last = last`. Again `#` is needed to create the variables. The last gotcha is an `*` before `ng-for`. This is needed to mark this part of the template as dynamic. The same is needed for `ng-if`, because it is dynamic, too. (Sometimes a `<hr>` is placed in the DOM, sometimes not.)

```diff
-<div ng-repeat="id in ctrl.ids">
+<div *ng-for="#id of ids; #$index = index, #$last = last">

-<hr ng-if="!$last">
+<hr *ng-if="!$last">
```

Now look into `src/dynamic-component/index.js`:

```diff
import { Component, View } from 'angular2/angular2';
import styles from './dynamic-component.css';

export default class DynamicComponent {
  constructor() {
-    this.seconds = Math.ceil(Math.random() * 100);
-    setInterval(() => this.seconds++, 1000);
+    this.seconds = 0;
+    this.intervalId = setInterval(() => this.seconds++, 1000);
  }

+  onDestroy() {
+    clearInterval(this.intervalId);
+  }

  static get annotations() {
    return [
      new Component({
        selector: 'dynamic-component'
      }),
      new View({
        template: `<div class="${styles.container}">I count {{ seconds }} seconds.</div>`
      })
    ];
  }
}
```

We learned earlier that Angular 2 doesn't use scopes anymore, so we don't have a `$scope` object on which a `$destroy` event could be triggered. Instead we just declare a `onDestroy` method on our `DynamicComponent` which will be automatically called, when `<dynamic-component>` is removed from the DOM. Because we don't use `$interval` in Angular 2, we use JavaScripts native methods to cancel the interval.

## Ember

Don't forget to register both components in `src/app.js`:

```javascript
import Ember from './ember-shim';
import applicationTemplate from './application.hbs';
import ComposableComponent from './composable-component';
import DynamicComponent from './dynamic-component';

// register templates
Ember.TEMPLATES.application = applicationTemplate;

const ExampleApp = Ember.Application.create({
  ready() {
    document.getElementById('example-app').remove();
  }
});

// register components
ExampleApp.DynamicComponentComponent = DynamicComponent;
ExampleApp.ComposableComponentComponent = ComposableComponent;
```

This is `src/composable-component/index.js` and `src/composable-component/template.hbs`:

```javascript
import Ember from '../ember-shim';
import template from './template.hbs';
import styles from './composable-component.css';

var id = 0;

Ember.TEMPLATES['components/composable-component'] = template;
export default Ember.Component.extend({
  styles,
  init() {
    this._super(...arguments);
    this.set('ids', []);
  },
  actions: {
    removeDynamicComponent(index) {
      this.set('ids', this.get('ids').filter((_, i) => index !== i));
    },
    addDynamicComponent() {
      this.set('ids', [ ...this.get('ids'), id++ ]);
    }
  }
});
```

```handlebars
<div class="{{styles.container}}">
  <button {{action "addDynamicComponent"}}>Add dynamic component</button>
  <hr />
  {{#each ids as |id index|}}
    {{dynamic-component}}
    <button {{action "removeDynamicComponent" index}}>Remove dynamic component</button>
  {{/each}}
</div>
```

We create an `ids` array here, very similar to the Angular examples, but using Embers `get` and `set` helper. The `removeDynamicComponent` and `addDynamicComponent` methods are added to `actions` again.

We use the built-in Handlebars plugin `{{#each}}` to loop over the `ids` array. Like Angular we can access an `index` inside `{{#each}}{{/each}}`. Sadly there is no equivalent to `$last` in Ember. While there is a built-in `{{#if}}` Handlebars plugin, we can't do calculations like `index + 1 === ids.length` inside it which would mirror the `$last` variable. To be honest... I couldn't find an easy way to conditionally show the `<hr>` in Ember. If _you_, dear reader, know an easy way to do this, write me.

One additional thing to notice is the way params are passed to `action` handlers: `{{action "removeDynamicComponent" index}}`.

Now to the changes in `src/dynamic-component/index.js`:

```diff
import Ember from '../ember-shim';
import template from './template.hbs';
import styles from './dynamic-component.css';

Ember.TEMPLATES['components/dynamic-component'] = template;
export default Ember.Component.extend({
  styles,
  init() {
    this._super(...arguments);
-    this.set('seconds', Math.ceil(Math.random() * 100));
+    this.set('seconds', 0);
    this.count();
  },
  count() {
    Ember.run.later(this, () => {
+      if (!this.isDestroyed) {
        this.set('seconds', this.get('seconds') + 1);
        this.count();
+      }
    }, 1000);
  }
});
```

We haven't used `setInterval` in Ember, but `Ember.run.later`. I don't think it is possible to cancel the callback, so we need to check if our component was destroyed with `if (!this.isDestroyed)`, before we make changes in our state and call `count` again.

## Cycle.js

Our `src/app.js`:

```javascript
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
```

Now the `src/composable-component/index.js` with its `./intent.js`, `./model.js` and `./view.js`:

```javascript
import intent from './intent';
import model from './model';
import view from './view';

export default function ComposableComponent(sources) {
  const actions = intent(sources);
  const state$ = model(actions);
  const vtree$ = view(state$);

  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
```

```javascript
import DynamicComponent from '../dynamic-component';

export default function intent(sources) {
  return {
    addDynamicComponent$: sources.DOM.select('.addDynamicComponent')
      .events('click')
      .map(() => DynamicComponent(sources).DOM),
    removeDynamicComponent$: sources.DOM.select('.removeDynamicComponent')
      .events('click')
      .map(event => parseInt(event.target.value))
  };
}
```

```javascript
import { Observable } from 'rx';

export default function model({ addDynamicComponent$, removeDynamicComponent$ }) {
  return Observable.just([])
    // map `addDynamicComponent$` values to a callback which adds `vtree$` to existing `vtree$s`
    .merge(addDynamicComponent$.map(
      vtree$ => vtree$s => [ ...vtree$s, vtree$ ]
    ))
    // map `removeDynamicComponent$` values to a callback which removes the `vtree` matching the index
    .merge(removeDynamicComponent$.map(
      index => vtree$s => vtree$s.filter((_, i) => index !== i)
    ))
    // call callback (either returned from `addDynamicComponent$` or `removeDynamicComponent$`) and pass `vtree$s`
    .scan((vtree$s, callback) => callback(vtree$s));
}
```

```javascript
/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import styles from './composable-component.css';

export default function view(state$) {
  return state$.map(dynamicComponents =>
    <div className={styles.container}>
      <button className="addDynamicComponent">Add dynamic component</button>
      <hr />
      {dynamicComponents.map((dynamicComponent, index) =>
        <div>
          {dynamicComponent}
          <button value={index} className="removeDynamicComponent">Remove dynamic component</button>
          {index + 1 !== dynamicComponents.length ? <hr /> : null}
        </div>
      )}
    </div>
  );
}
```

This is quite complex. I'll try to break it down. The `sources` are passed to `intent`. We query the `DOM` for `click` events on `.addDynamicComponent` and `.removeDynamicComponent` to generate the streams `addDynamicComponent$` and `removeDynamicComponent$`. `addDynamicComponent$` contains a new `vtree$` of a `DynamicComponent` for every click (`DynamicComponent(sources).DOM`) while `removeDynamicComponent$` contains the `index` parsed with `parseInt(event.target.value)` from the clicked element.

The two `actions` are then passed to our `model`. We basically want our `state$` to be an array containing all `vtree$`s of our `DynamicComponent`s. It is an array containing streams, that's why I called it `vtree$s`. (A stream containing an array would be `foos$` and a stream containing other streams would be `foo$$`, just to make things clearer by using conventions.) We `merge` `addDynamicComponent$` and `removeDynamicComponent$` into our `state$` - but not directly! Instead the return (with `map`) a callback function to add a new `vtree$` to our `vtree$s` array or to remove a `vtree$` from our `vtree$s` array. These callbacks are used inside `scan`, which passes `vtree$s` (initialized as an empty array) to the `callback` (which is either the `callback` from `addDynamicComponent$` or `removeDynamicComponent$`).

The usage in the `view` is simple. We just `map` over our array (`dynamicComponents`) and place the `vtree$`s (`{dynamicComponent}`) in our virtual DOM.

Note that we conditionally dislay the `<hr />` between every `DynamicComponent` in this line: `{index + 1 !== dynamicComponents.length ? <hr /> : null}`.

The changes to `src/dynamic-component/index.js` are a little bit more complicated this time. Thank you @laszlokorte for helping me here.

```diff
/** @jsx hJSX */
import { hJSX } from '@cycle/dom';
import { Observable } from 'rx';
import styles from './dynamic-component.css';

export default function DynamicComponent(sources) {
-  const seconds$ = Observable.just(Math.ceil(Math.random() * 100))
-    .merge(Observable.interval(1000))
-    .scan(seconds => ++seconds);

+  const timer$ = Observable.timer(0, 1000).publish();
+  timer$.connect();

+  const seconds$ = timer$.shareReplay(1).scan(seconds => ++seconds);

  const vtree$ = seconds$.map(seconds =>
    <div className={styles.container}>
      I count {seconds} seconds.
    </div>
  );

  const sinks = {
    DOM: vtree$
  };
  return sinks;
}
```

A concept of observables I haven't explained are _hot_ and _cold_ observables. _Hot_ observables produce values even if no one is subscribed on them. _Cold_ observables produce values only if someone has subscribed on them. An observable is cold by _default_. The way we handle our `vtree$`s leads to a re-subscription every time we add or remove a `DynamicComponent`. (I don't fully understand _why_ this happens. I only know _that_ it happens and what it implies.) Because of this re-subscription every `DynamicComponent` would be reset to
`0`, if we add or remove a `DynamicComponent`. So we need a _hot_ observable. This done with `publish` and `connect` on a separate observable I called `timer$` which produces a new value every second. With `shareReplay` the same sequence of emitted values will be shared even if the subscripion happens _after_ the first values have been emitted. That way our `DynamicComponent` won't be reset to `0` even after a re-subscription.

## Redux

Our `src/app.js` is untouched. Let's start by looking into `src/constants.js` in which our action types are defined. They should be self-explanatory:

```javascript
export const ADD_SECOND = 'ADD_SECOND';
export const REMOVE_SECOND = 'REMOVE_SECOND';
export const INCREMENT_SECOND = 'INCREMENT_SECOND';
```

Our `src/action-creators.js`. Also pretty straightforward:

```javascript
import { ADD_SECOND, REMOVE_SECOND, INCREMENT_SECOND } from './constants';

export function addSecond(index) {
  return {
    type: ADD_SECOND
  };
}

export function removeSecond(index) {
  return {
    type: REMOVE_SECOND,
    index
  };
}

export function incrementSecond(index) {
  return {
    type: INCREMENT_SECOND,
    index
  };
}
```

And the `src/reducers.js`:

```javascript
import { combineReducers } from 'redux';
import { ADD_SECOND, REMOVE_SECOND, INCREMENT_SECOND } from './constants';

const initialState = [];

function seconds(state = initialState, action) {
  switch (action.type) {
    case ADD_SECOND:
      return [ ...state, 0 ];
    case REMOVE_SECOND:
      return state.filter((_, i) => action.index !== i);
    case INCREMENT_SECOND:
      return [
        ...state.slice(0, action.index),
        ++state[action.index],
        ...state.slice(action.index + 1)
      ];
    default:
      return state;
  }
}

export default combineReducers({
  seconds
});
```

Nothing fancy so far. All in all we have a state containing an array called `seconds` which is initially empty. On an `ADD_SECOND` action we'll add a new value to `seconds` which is `0` by default. Seconds can be incremented on `INCREMENT_SECOND` or removed on `REMOVE_SECOND` with a given `index`.

This time the `src/example-app/index.js` is extremely simple, because all the logic is placed in our `<ComposableComponent />`:

```javascript
import React, { Component } from 'react';
import ComposableComponent from '../composable-component';

class ExampleApp extends Component {
  render() {
    return (
      <ComposableComponent />
    );
  }
}

export default ExampleApp;
```

This is `src/composable-component/index.js`:

```javascript
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DynamicComponent from '../dynamic-component';
import * as actionCreators from '../action-creators';
import styles from './composable-component.css';

class ComposableComponent extends Component {
  render() {
    const { seconds, actions: { addSecond, removeSecond, incrementSecond } } = this.props;
    return (
      <div className={styles.container}>
        <button onClick={() => addSecond()}>Add dynamic component</button>
        <hr />
        {seconds.map((second, index) => (
          <div key={index}>
            <DynamicComponent
              index={index}
              second={second}
              incrementSecond={incrementSecond} />
            <button onClick={() => removeSecond(index)}>Remove dynamic component</button>
            {index + 1 !== seconds.length ? <hr /> : null}
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    seconds: state.seconds
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComposableComponent);
```

Many things are happening here, but it is not that different from `<ExampleApp />` actually. With `mapStateToProps` we say that `ComposableComponent` wants to read `seconds` in our state and with `mapDispatchToProps` we say that `ComposableComponent` wants to access all `actionCreators`. We `map` over `seconds` in the `render` function to create `<DynamicComponent />` instances and pass all properties it needs.

And this is `src/dynamic-component/index.js`:

```diff
import React, { Component } from 'react';
import styles from './dynamic-component.css';

class DynamicComponent extends Component {
  componentDidMount() {
    const { incrementSecond, index } = this.props;
-    setInterval(() => incrementSecond(index), 1000);
+    this.intervalId = setInterval(() => incrementSecond(index), 1000);
  }

+  componentWillUnmount() {
+    clearInterval(this.intervalId);
+  }

  render() {
    const { second } = this.props;
    return (
      <div className={styles.container}>
        I count {second} seconds.
      </div>
    )
  }
}

export default DynamicComponent;
```

This is really the only new part for Redux (or more precisely React) in this example. To clear your interval you add a method called `componentWillUnmount` to your `Component`. It will be called shortly before your `Component` will be destroyed.

Wow! Great. We actually finished all of our examples.

# Conclusion

So what is the best framework to write components? No, really. I ask _you_. What do you think is the best framework? It probably depends a lot on your projects and your experience. I can't make a recommendation for you. Don't forget that these are very small examples. I know from my own experiences how hard managing state in Angular 1 components gets as your app grows. This is actually the number one reason why I look into other frameworks. We didn't look into many important parts of writing components like testability, animations, i18n, etc. It is not possible to look _deeply_ into every framework. But by now you should have a good overview how it could be to write bigger components in one of our frameworks.

Thank you for reading.

I hope you learned something. I did! And I'll conclude with what _I_ learned:
- I like TypeScript, but I can't integrate it easily in my daily workflow. I hope this changes in the future.
- I like webpack, Babel and CSS modules. Really good for building applications!
- I still prefer JSX, but it wouldn't be mandatory for me.
- Angular 1 in ES6 isn't _that_ bad.
- Angular 2 is okay. I'm not entirely sold to its concepts and syntax. `zone.js` seems a little bit magical.
- You can write Ember applications without ember-cli! This is really nice. But it has edges...
- Cycle.js is conceptionally maybe the best framework currently. "Best" in the sense of bug free, testability and logical structure. But for me it is _really_ hard to write and understand. Too hard actually. I hope this changes in the future, too.
- React and Redux were nice to use. A little bit verbose in the beginning, but very readable. I will look more into Redux in the future, because it was the framework I was most productive with.
