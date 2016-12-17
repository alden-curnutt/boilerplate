var app = angular.module('fmp-app');

app

/*
 * Recipe Type Controller
 *
 * Main controller for recipe interactivity
 *   - Creating recipes
 *   - Editing recipes
 *   - Saving recipes
 *   - Deleting recipes
 **/
.controller('recipeTypeController', function($scope, $rootScope, $http, $routeParams, ngDialog, growl) {
	console.log('Recipe type controller running');

	$scope.new = {};

	$http.get('/api/recipe-type')
		.success(function(response) {
			$scope.recipeTypes = response;
		}
	);

	// Default dialog close func
	$scope.closeThis = function() {
		ngDialog.close();
	};

	$scope.findOinA = function(array, key) {
		for ( var a = 0; a < array.length; a++ ) {
			if ( array[a]._id == key ) { return a; }
		}
	};

	$scope.newRecipeTypeDialog = function() {
		ngDialog.open({
			templateUrl: '../dialogs/recipe-type/new.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-recipe-type-create',
		});
	};

	// Creating an idividual type
	$scope.createRecipeType = function() {
		$http({
			method: 'POST',
			url: '/api/recipe-type',
			data: $scope.new
		}).then(function successCallback(response) {
			console.log('success: ' + response);
			$scope.recipeTypes.push( response.data );
			growl.success('Successfully created recipe type');
			$scope.new = {};
		}, function errorCallback(response) {
			console.log('error: ', response);
			growl.error('Unable to create recipe type');
		});

		ngDialog.close();
	};


	// Editing an individual type
	$scope.editThis = function(type) {
		var url = '/api/recipe-type/' + type._id;
		console.log(url);

		ngDialog.open({
			templateUrl: '../dialogs/recipe-type/edit.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-recipe-type-edit'
		});

		$http({
			method: 'GET',
			url: url,
		}).then(function successCallback(response) {
			console.log('success: ' + response.status);
			$scope.type = response.data;
		}, function errorCallback(response) {
			console.log('error: ', response.status);
		});

	};


	// Editing an individual type
	$scope.saveThis = function(type) {
		var itemIndex = $scope.findOinA($scope.recipeTypes, type._id);
		
		console.log('index is ' + itemIndex);
		console.log('recipeTypes ' + $scope.recipeTypes.length);


		var url = '/api/recipe-type/' + type._id;
		console.log(url);

		$http({
			method: 'PUT',
			url: url,
			data: type
		}).then(function successCallback(response) {
			
			console.log('before ' + $scope.recipeTypes[itemIndex]);
			$scope.recipeTypes[itemIndex] = response.data;
			console.log('after ' + $scope.recipeTypes[itemIndex]);

			growl.success('Successfully saved recipe type');
		}, function errorCallback(response) {
			console.log('error: ', response.status);
			growl.error('Unable to save recipe type');
		});
		ngDialog.close();

	};


	// Editing an individual type
	$scope.deleteThis = function(item) {
		$scope.confirmDelete = false;
		var itemIndex = $scope.recipeTypes.indexOf(item);

		var url = '/api/recipe-type/' + item._id;

		console.log(url);

		ngDialog.open({
			templateUrl: '../dialogs/general/confirm-delete.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-confirm-delete'
		});
		
		$scope.confirmDelete = function(doDelete) {
			if ( doDelete ) {
				var url = '/api/recipe-type/' + item._id;
				
				$http({
					method: 'DELETE',
					url: url
				}).then(function successCallback(response) {
					console.log('success: ' + response);
					$scope.recipeTypes.splice(itemIndex, 1);
					growl.success('Successfully deleted recipe type');
				}, function errorCallback(response) {
					console.log('error: ', response);
					growl.error('Unable to delete recipe type');
				});

				ngDialog.close();
			}
			else if ( !doDelete ) {
				ngDialog.close();
			}
		} // End confirmDelete
		
	};



});