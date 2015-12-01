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
