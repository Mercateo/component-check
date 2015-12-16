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
