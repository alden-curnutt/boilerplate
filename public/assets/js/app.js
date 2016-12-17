var app = angular.module('fmp-app', ['ngRoute', 'ngDialog', 'angular-growl', 'ui.select']);


app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: '/partials/landing.html',
      controller: 'navController'
    })
    .when('/recipes', {
      templateUrl: 'partials/recipes.html',
      controller: 'recipeController',
      contollerAs: 'recipes'
    })
    .when('/recipes/:recipeId', {
      templateUrl: 'partials/recipe-details.html',
      controller: 'recipeDetailsController',
    })
    .when('/recipe-types', {
      templateUrl: 'partials/recipe-type.html',
      controller: 'recipeTypeController',
      contollerAs: 'recipeType'
    })
    .when('/measurements', {
      templateUrl: 'partials/measurements.html',
      controller: 'measurementController',
      contollerAs: 'measurement'
    })
    .when('/measurement-sizes', {
      templateUrl: 'partials/measurement-sizes.html',
      controller: 'measurementSizeController',
      contollerAs: 'measurementSize'
    })
    .when('/pantry', {
      templateUrl: 'partials/pantry-categories.html',
      controller: 'pantryCategoryController',
      contollerAs: 'pantryCategory'
    })
    .when('/menu', {
      templateUrl: 'partials/menu.html',
      controller: 'menuController',
      contollerAs: 'menu'
    })
    .otherwise({
    	redirectTo: '/',
    	templateUrl: 'partials/landing.html',
    });
})


.filter('recipeFilter', function() {
    return function( input, activeCategories ) {
        var output = new Array;
        if ( input ) {
            if ( activeCategories.length != 0 ) {
                for ( var i = 0; i < input.length; i++ ) {
                    for ( var j = 0; j < activeCategories.length; j++ ) {
                        if ( input[i].recipe_category == activeCategories[j] ) {
                            output.push( input[i] );
                        }
                    }
                }
            }
            else { output = input; }
        }
        else { output = input }
        return output;
    }
})

.filter('calcTotalTime', function() {
    return function( input ) {
      var time = {
        total: 0,
        totalString: '',
        hours: 0,
        minutes: 0
      };

      if ( input.preparation.hours ) { time.total += (input.preparation.hours * 60) }   
      if ( input.preparation.minutes ) { time.total += input.preparation.minutes }
      if ( input.cook.hours ) { time.total += (input.cook.hours * 60); }
      if ( input.cook.minutes ) { time.total += input.cook.minutes }

      time.totalString = time.total + ' mins';
      return time.totalString;
    }
});







