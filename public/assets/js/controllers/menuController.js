var app = angular.module('fmp-app');

app.controller('menuController', function($scope, $rootScope, $http, $routeParams, ngDialog, growl) {
	
	console.log('Menu controller running');
	
	$scope.getRecipeTypes = function() { // Assign recipe categories to scope variable
		$http.get('/api/recipe-type')
			.success(function(response) {
				$scope.recipeCategories = response;
			}
		);
	}();

	$http.get('/api/recipe')
		.success(function(response) {
			$scope.recipes = response;
		}
	);

	

});