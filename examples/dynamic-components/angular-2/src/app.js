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
