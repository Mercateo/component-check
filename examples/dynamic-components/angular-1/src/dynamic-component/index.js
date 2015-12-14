import angular from 'angular';
import styles from './dynamic-component.css';

export default angular.module('dynamic-component', []).directive('dynamicComponent', () => {
  return {
    scope: true,
    controller($interval) {
      this.seconds = Math.ceil(Math.random() * 100);
      $interval(() => this.seconds++, 1000);
    },
    controllerAs: 'ctrl',
    template: `<div class="${styles.container}">I count {{ ctrl.seconds }} seconds.</div>`
  };
}).name;
