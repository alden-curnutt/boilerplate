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
.controller('measurementSizeController', function($scope, $rootScope, $http, $routeParams, ngDialog, growl) {
	console.log('measurement size controller running');

	$scope.new = {};

	$http.get('/api/measurement-size')
		.success(function(response) {
			$scope.sizes = response;
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


	$scope.newMeasurementSizeDialog = function() {
		ngDialog.open({
			templateUrl: '../dialogs/measurement-size/new.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-measurement-size-create',
		});
	};


	// Creating an idividual type
	$scope.createMeasurementSize = function() {
		$http({
			method: 'POST',
			url: '/api/measurement-size',
			data: $scope.new
		}).then(function successCallback(response) {
			console.log('success: ' + response);
			$scope.sizes.push( response.data );
			$scope.new = {};
			growl.success('Successfully added a new measurement size');
		}, function errorCallback(response) {
			console.log('error: ', response);
			growl.error('Unable to create measurement size');
		});

		ngDialog.close();
	};


	// Editing an individual type
	$scope.editThis = function(size) {

		var url = '/api/measurement-size/' + size._id;
		console.log(url);

		ngDialog.open({
			templateUrl: '../dialogs/measurement-size/edit.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-measurement-size-edit'
		});

		$http({
			method: 'GET',
			url: url,
		}).then(function successCallback(response) {
			console.log('success: ' + response.status);
			$scope.size = response.data;
		}, function errorCallback(response) {
			console.log('error: ', response.status);
			growl.error('Unable to retrieve measurement size');
		});

	};


	// Editing an individual type
	$scope.saveThis = function(size) {
		var itemIndex = $scope.findOinA($scope.sizes, size._id);
		var url = '/api/measurement-size/' + size._id;
		//console.log(url);

		$http({
			method: 'PUT',
			url: url,
			data: size
		}).then(function successCallback(response) {
			$scope.sizes[itemIndex] = response.data;
			growl.success('Successfully saved measurement size');
		}, function errorCallback(response) {
			console.log('error: ', response.status);
			growl.error('Unable to edit measurement size');
		});
		ngDialog.close();

	};


	// Editing an individual type
	$scope.deleteThis = function(item) {
		var itemIndex = $scope.sizes.indexOf(item);

		$scope.confirmDelete = false;
		var url = '/api/measurement-size/' + item._id;

		console.log(url);

		ngDialog.open({
			templateUrl: '../dialogs/general/confirm-delete.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-confirm-delete'
		});
		
		$scope.confirmDelete = function(doDelete) {
			if ( doDelete ) {
				var url = '/api/measurement-size/' + item._id;
				
				$http({
					method: 'DELETE',
					url: url
				}).then(function successCallback(response) {
					console.log('success: ' + response);
					$scope.sizes.splice(itemIndex, 1);
					growl.success('Successfully deleted measurement size');
				}, function errorCallback(response) {
					console.log('error: ', response);
					growl.error('Unable to delete measurement size');
				});

				ngDialog.close();
			}
			else if ( !doDelete ) {
				ngDialog.close();
			}
		} // End confirmDelete
		
	};



});