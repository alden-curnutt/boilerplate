var app = angular.module('nodejs-boilerplate', ['ngRoute']);


app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: '/partials/main.html',
      controller: 'navController'
    })
    .otherwise({
    	redirectTo: '/',
    	templateUrl: 'partials/main.html',
    });
});







