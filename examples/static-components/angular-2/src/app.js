import 'reflect-metadata';
import { Component, View, bootstrap } from 'angular2/angular2';
import StaticComponent from './static-component';

class ExampleApp {
  static get annotations() {
    return [
      new Component({
        selector: 'example-app'
      }),
      new View({
        directives: [ StaticComponent ],
        template: `<static-component></<static-component>`
      })
    ];
  }
}

bootstrap(ExampleApp);
