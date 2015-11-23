import angular from 'angular';
import ngRoute from 'angular-route';
import staticComponent from './static-component';

angular.module('example-app', [
  ngRoute,
  staticComponent
]).config($routeProvider => {
  $routeProvider.when('/', {
    template: `<static-component></<static-component>`
  });
});
