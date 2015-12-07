import Ember from './ember-shim';
import applicationTemplate from './application.hbs';
import StaticComponent from './static-component';

// register templates
Ember.TEMPLATES.application = applicationTemplate;

const ExampleApp = Ember.Application.create({
  ready() {
    document.getElementById('example-app').remove();
  }
});

// register components
ExampleApp.StaticComponentComponent = StaticComponent;
