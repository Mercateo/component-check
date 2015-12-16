import angular from 'angular';
import ngRoute from 'angular-route';
import composableComponent from './composable-component';

angular.module('example-app', [
  ngRoute,
  composableComponent
]).config($routeProvider => {
  $routeProvider.when('/', {
    template: `
      <composable-component></composable-component>
    `
  });
});
