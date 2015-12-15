import Ember from './ember-shim';
import applicationTemplate from './application.hbs';
import InteractiveComponent from './interactive-component';

// register templates
Ember.TEMPLATES.application = applicationTemplate;

const ExampleApp = Ember.Application.create({
  ready() {
    document.getElementById('example-app').remove();
  }
});

// register components
ExampleApp.InteractiveComponentComponent = InteractiveComponent;
