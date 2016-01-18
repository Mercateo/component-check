import Ember from './ember-shim';
import applicationTemplate from './application.hbs';
import ComposableComponent from './composable-component';
import DynamicComponent from './dynamic-component';
import isLastHelper from './helpers/is-last';

// register templates
Ember.TEMPLATES.application = applicationTemplate;

const ExampleApp = Ember.Application.create({
  rootElement: '#example-app',
  ready() {
    document.getElementById('example-app').innerHTML = '';
  }
});

// register components
ExampleApp.DynamicComponentComponent = DynamicComponent;
ExampleApp.ComposableComponentComponent = ComposableComponent;

// register helpers
ExampleApp.IsLastHelper = isLastHelper;
