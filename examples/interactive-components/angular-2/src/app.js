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
