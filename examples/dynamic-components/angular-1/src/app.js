import angular from 'angular';
import ngRoute from 'angular-route';
import dynamicComponent from './dynamic-component';

angular.module('example-app', [
  ngRoute,
  dynamicComponent
]).config($routeProvider => {
  $routeProvider.when('/', {
    template: `
      <dynamic-component></dynamic-component>
      <dynamic-component></dynamic-component>
    `
  });
});
