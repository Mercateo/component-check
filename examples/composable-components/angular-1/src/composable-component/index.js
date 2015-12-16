import angular from 'angular';
import dynamicComponent from '../dynamic-component';
import styles from './composable-component.css';

var id = 0;

export default angular.module('composable-component', [
  dynamicComponent
]).directive('composableComponent', () => {
  return {
    scope: true,
    controller() {
      this.ids = [];
      this.removeDynamicComponent = (index) => this.ids.splice(index, 1);
      this.addDynamicComponent = () => this.ids.push(id++);
    },
    controllerAs: 'ctrl',
    template: `
      <div class="${styles.container}">
        <button ng-click="ctrl.addDynamicComponent()">Add dynamic component</button>
        <hr>
        <div ng-repeat="id in ctrl.ids">
          <dynamic-component></dynamic-component>
          <button ng-click="ctrl.removeDynamicComponent($index)">Remove dynamic component</button>
          <hr ng-if="!$last">
        </div>
      </div>
    `
  };
}).name;
