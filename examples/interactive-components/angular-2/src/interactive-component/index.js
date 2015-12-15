import { Component, View } from 'angular2/angular2';
import styles from './interactive-component.css';

export default class InteractiveComponent {
  constructor() {
    this.value = 0;
    this.decrement = () => this.value--;
    this.increment = () => this.value++;
  }

  static get annotations() {
    return [
      new Component({
        selector: 'interactive-component'
      }),
      new View({
        template: `
          <div class="${styles.container}">
            <button (click)="decrement()">Decrement</button>
            Current value: {{ value }}
            <button (click)="increment()">Increment</button>
          </div>
        `
      })
    ];
  }
}
