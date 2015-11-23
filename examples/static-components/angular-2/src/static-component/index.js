import { Component, View } from 'angular2/angular2';

export default class StaticComponent {
  static get annotations() {
    return [
      new Component({
        selector: 'static-component'
      }),
      new View({
        template: `<p>Static content.</p>`
      })
    ];
  }
}
