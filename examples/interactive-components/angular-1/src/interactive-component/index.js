import angular from 'angular';
import styles from './interactive-component.css';

export default angular.module('interactive-component', []).directive('interactiveComponent', () => {
  return {
    scope: true,
    controller() {
      this.value = 0;
      this.decrement = () => this.value--;
      this.increment = () => this.value++;
    },
    controllerAs: 'ctrl',
    template: `
      <div class="${styles.container}">
        <button ng-click="ctrl.decrement()">Decrement</button>
        Current value: {{ ctrl.value }}
        <button ng-click="ctrl.increment()">Increment</button>
      </div>
    `
  };
}).name;
