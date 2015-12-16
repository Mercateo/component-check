import { Component, View } from 'angular2/angular2';
import DynamicComponent from '../dynamic-component';
import styles from './composable-component.css';

var id = 0;

export default class ComposableComponent {
  constructor() {
    this.ids = [];
    this.removeDynamicComponent = (index) => this.ids.splice(index, 1);
    this.addDynamicComponent = () => this.ids.push(id++);
  }

  static get annotations() {
    return [
      new Component({
        selector: 'composable-component'
      }),
      new View({
        directives: [ DynamicComponent ],
        template: `
        <div class="${styles.container}">
          <button (click)="addDynamicComponent()">Add dynamic component</button>
          <hr>
          <div *ng-for="#id of ids; #$index = index, #$last = last">
            <dynamic-component></dynamic-component>
            <button (click)="removeDynamicComponent($index)">Remove dynamic component</button>
            <hr *ng-if="$last">
          </div>
        </div>
        `
      })
    ];
  }
}
