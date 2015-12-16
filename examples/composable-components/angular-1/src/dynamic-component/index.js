import angular from 'angular';
import styles from './dynamic-component.css';

export default angular.module('dynamic-component', []).directive('dynamicComponent', () => {
  return {
    scope: true,
    controller($interval, $scope) {
      this.seconds = 0;
      const intervalId = $interval(() => this.seconds++, 1000);
      $scope.$on('$destroy', () => $interval.cancel(intervalId));
    },
    controllerAs: 'ctrl',
    template: `
      <div class="${styles.container}">I count {{ ctrl.seconds }} seconds.</div>
    `
  };
}).name;
