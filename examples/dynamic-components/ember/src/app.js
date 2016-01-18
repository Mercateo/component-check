import Ember from './ember-shim';
import applicationTemplate from './application.hbs';
import DynamicComponent from './dynamic-component';

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
