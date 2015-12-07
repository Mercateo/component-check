import { Component, View } from 'angular2/angular2';
import styles from './static-component.css';

export default class StaticComponent {
  static get annotations() {
    return [
      new Component({
        selector: 'static-component'
      }),
      new View({
        template: `<p class="${styles.p}">Static content.</p>`
      })
    ];
  }
}
