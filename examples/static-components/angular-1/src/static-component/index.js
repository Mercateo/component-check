import angular from 'angular';

export default angular.module('static-component', []).directive('staticComponent', () => {
  return {
    template: `<p>Static content.</p>`
  };
}).name;
