# component-check

> A quick introduction to explore how components can be created in several frameworks.

In this project I want to compare the usage and development of components in several frameworks. To test these frameworks I'll create multiple components from simple to complex to show the differences between these frameworks. I currently plan to look into the following frameworks:

* [Angular 1](https://angularjs.org/)
* [Angular 2](https://angular.io/)
* [Ember](http://emberjs.com/)
* [Redux](http://redux.js.org/)
* [Cycle.js](http://cycle.js.org/)
* [React](https://facebook.github.io/react/) with [Freezer](https://github.com/arqex/freezer) (inspired by [_React.js the simple way_](https://medium.com/@arqex/react-the-simple-way-cabdf1f42f12))

_Note_: This is a _work-in-progress_ and don't forget that Angular 2 is still in beta, Ember will introduce [routable and angle brackets components](http://emberjs.com/blog/2015/05/24/another-two-oh-status-update.html) soon and Cycle will introduce [isolated components](https://github.com/cyclejs/isolate) in the next release.
I will not explain every framework in detail. I'll focus on creating components.
I will not look into [Polymer](https://www.polymer-project.org/) which is very component-oriented, because it doesn't support IE9 which is a requirement for our projects.

So what is a component? Let us keep the definition short and generic and treat them as re-usable and composable pieces of HTML, CSS and/or JavaScript code mostly used for GUI elements.

## Goals

- compare the usage and development of the same components written in the frameworks mentioned above
- find _universal skeletons_ for components
- find a common tooling around these frameworks

## Usage

I'll create an example for every component and every framework. You'll need to install the dependencies for these examples with `$ npm install`. You can than run an example with `$ npm start` and open [http://localhost:8080/](http://localhost:8080/) in your browser.

## A word on tooling

I recommend to install a recent version of [Node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) before you start. I'll try to _not_ use [Bower](http://bower.io/) as a second package manager, because it is mostly superfluous nowadays. All frameworks mentioned above should be easily usable with npm only.

For frameworks using virtual DOM libraries I'll use [JSX](https://facebook.github.io/jsx/), which is a syntax extension to JavaScript which I _personally_ find more readable than using the libraries directly. However I'll show an example without JSX first, before I'll introduce JSX. Recommending JSX is highly subjective. Some people like it, some people don't. Time will tell, if there is a place for it in the future.

I'll also use [TypeScript](http://www.typescriptlang.org/) in my examples. Like JSX this isn't a general recommendation. It is mostly because I want to look into it (again) myself.

Even if TypeScript supports JSX-compilation, I'll compile JSX with [Babel](https://babeljs.io/), because TypeScripts compilation only supports React by default and no other virtual DOM libraries.

All examples will be build with [webpack](https://webpack.github.io/). It is currently my favorite way to build applications.

Webpack allows the usage of [CSS Modules](https://github.com/css-modules/css-modules) which will keep us safe from global CSS class name clashes. Again... I don't recommend to use CSS Modules for your own projects (at least for now), but as this is a research project and I want to learn more about CSS Modules I'll use them here.

_Note_: I personally like JSX, TypeScript, Babel and CSS Modules as they make my code safer, easier to write and more readable. But don't forget that these are additional compilation steps which _can_ introduce bugs or confuse new developers.

## Introducing: webpack

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
    new HtmlWebpackPlugin({ template: './src/index.html' })
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
  <main id="example">Loading...</main>

  {% for (var chunk in o.htmlWebpackPlugin.files.chunks) { %}
  <script src="{%= o.htmlWebpackPlugin.files.chunks[chunk].entry %}"></script>
  {% } %}
</body>
</html>

```

## Static components

### Angular 1

Let's start with a static component. I'll show examples in the order how the frameworks are mention at the beginning of this article. That means we'll start with Angular 1 which _of course_ deviates from our generic setup I just introduced. 😉

Inside our `index.html` you must change the line:

```html
<main id="example">Loading...</main>
```

to

```html
<main ng-app="example"><ng-view>Loading...</ng-view></main>
```

because the entry point for an Angular application is defined with the `ng-app` attribute and a application name like `example` as its value. You'll also see the `<ng-view>` element. Both - the `ng-app` attribute and `<ng-view>` element - are so-called [_directives_](https://docs.angularjs.org/guide/directive), which is how components are called in Angular. `ng-app` comes with Angular core module, `<ng-view>` from the [angular-route](https://docs.angularjs.org/api/ngRoute) module. For a seasoned Angular developer it could look like overkill to use angular-route in this basic example which I need to show the entry template/view which holds our components (an easier way could be the [ng-include](https://docs.angularjs.org/api/ng/directive/ngInclude) directive), but I think this example can be easier compared to the other frameworks in that way.
Now we need to install Angular 1 and angular-route:

```bash
$ npm install --save angular angular-route
```

With this out of the way we can start developing. Our `app.js` looks like this:

```javascript
import angular from 'angular';
import ngRoute from 'angular-route';

angular.module('example', [
  ngRoute
]).config($routeProvider => {
  $routeProvider.when('/', {
    template: `<static-component></static-component>`
  });
});
```

We load `angular` and `angular-route`. We create our module called `example` (the value from the `ng-app` attribute) and say it depends on `ngRoute`. In our `config` callback we [_inject_](https://docs.angularjs.org/guide/di) `$routeProvider` and say that it should render the `<static-component>` element, if you visit [http://localhost:8080/](http://localhost:8080/). Try it with running `$ npm start`! You'll see that the _"Loading..."_ text disappears... and nothing happens. That is expected, because we never declared a `<static-component>` element anywhere.

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

angular.module('example', [
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

## Introducing: JSX

TODO

## Introducing: TypeScript

TODO

## Introducing: CSS Modules

TODO

## Dynamic components

TODO

## Interactive components

TODO

## Configurable components

TODO

## Composable components

TODO

## Transformable components

TODO
