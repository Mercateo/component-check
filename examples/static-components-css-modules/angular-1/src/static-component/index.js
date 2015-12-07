import angular from 'angular';
import styles from './static-component.css';

export default angular.module('static-component', []).directive('staticComponent', () => {
  return {
    template: `<p class="${styles.p}">Static content.</p>`
  };
}).name;
