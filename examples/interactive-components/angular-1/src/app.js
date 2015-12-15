import angular from 'angular';
import ngRoute from 'angular-route';
import interactiveComponent from './interactive-component';

angular.module('example-app', [
  ngRoute,
  interactiveComponent
]).config($routeProvider => {
  $routeProvider.when('/', {
    template: `
      <interactive-component></interactive-component>
      <interactive-component></interactive-component>
    `
  });
});
