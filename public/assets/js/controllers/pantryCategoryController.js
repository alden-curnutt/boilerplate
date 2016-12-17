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
.controller('pantryCategoryController', function($scope, $rootScope, $http, $routeParams, ngDialog, growl) {
	console.log('pantry category controller running');

	$scope.new = {};

	$http.get('/api/pantry-category')
		.success(function(response) {
			$scope.pantryCategories = response;
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

	$scope.newPantryCategoryDialog = function() {
		ngDialog.open({
			templateUrl: '../dialogs/pantry-category/new.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-pantry-category-create',
		});
	};

	// Creating an idividual type
	$scope.createPantryCategory = function() {
		$http({
			method: 'POST',
			url: '/api/pantry-category',
			data: $scope.new
		}).then(function successCallback(response) {
			console.log('success: ' + response);
			$scope.pantryCategories.push( response.data );
			$scope.new = {};
			growl.success('Successfully created pantry category');
		}, function errorCallback(response) {
			console.log('error: ', response);
			growl.error('Unable to create pantry category');
		});

		ngDialog.close();
	};


	// Editing an individual type
	$scope.editThis = function(category) {

		var url = '/api/pantry-category/' + category._id;
		console.log(url);

		ngDialog.open({
			templateUrl: '../dialogs/pantry-category/edit.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-pantry-category-edit'
		});

		$http({
			method: 'GET',
			url: url,
		}).then(function successCallback(response) {
			console.log('success: ' + response.status);
			$scope.category = response.data;
		}, function errorCallback(response) {
			console.log('error: ', response.status);
			growl.error('Unable to edit pantry category');
		});

	};


	// Editing an individual type
	$scope.saveThis = function(category) {
		var itemIndex = $scope.findOinA($scope.pantryCategories, category._id);
		var url = '/api/pantry-category/' + category._id;
		console.log(url);

		$http({
			method: 'PUT',
			url: url,
			data: category
		}).then(function successCallback(response) {
			$scope.pantryCategories[itemIndex] = response.data;
			growl.success('Successfully saved pantry category');
		}, function errorCallback(response) {
			console.log('error: ', response.status);
			growl.error('Unable to save pantry category');
		});
		ngDialog.close();

	};


	// Editing an individual type
	$scope.deleteThis = function(item) {
		$scope.confirmDelete = false;
		var itemIndex = $scope.pantryCategories.indexOf(item);

		var url = '/api/pantry-category/' + item._id;

		console.log(url);

		ngDialog.open({
			templateUrl: '../dialogs/general/confirm-delete.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-confirm-delete'
		});
		
		$scope.confirmDelete = function(doDelete) {
			if ( doDelete ) {
				var url = '/api/pantry-category/' + item._id;
				
				$http({
					method: 'DELETE',
					url: url
				}).then(function successCallback(response) {
					console.log('success: ' + response);
					$scope.pantryCategories.splice(itemIndex, 1);
					growl.success('Successfully deleted pantry category');
				}, function errorCallback(response) {
					console.log('error: ', response);
					growl.error('Unable to delete pantry category');
				});

				ngDialog.close();
			}
			else if ( !doDelete ) {
				ngDialog.close();
			}
		} // End confirmDelete
		
	};



});