import Ember from './ember-shim';
import applicationTemplate from './application.hbs';
import InteractiveComponent from './interactive-component';

// register templates
Ember.TEMPLATES.application = applicationTemplate;

const ExampleApp = Ember.Application.create({
  rootElement: '#example-app',
  ready() {
    document.getElementById('example-app').innerHTML = '';
  }
});

// register components
ExampleApp.InteractiveComponentComponent = InteractiveComponent;
