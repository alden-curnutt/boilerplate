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
.controller('measurementController', function($scope, $rootScope, $http, $routeParams, ngDialog, growl) {
	console.log('measurement type controller running');

	$scope.new = {};

	$http.get('/api/measurement')
		.success(function(response) {
			$scope.measurements = response;
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

	$scope.newMeasurementDialog = function() {
		ngDialog.open({
			templateUrl: '../dialogs/measurement/new.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-measurement-create',
		});
	};

	// Creating an idividual type
	$scope.createMeasurement = function() {
		$http({
			method: 'POST',
			url: '/api/measurement',
			data: $scope.new
		}).then(function successCallback(response) {
			console.log('success: ' + response);
			$scope.measurements.push( response.data );
			$scope.new = {};
			growl.success('Successfully added a new measurement');
		}, function errorCallback(response) {
			console.log('error: ', response);
			growl.error('Unable to create measurement');
		});

		ngDialog.close();

	};


	// Editing an individual type
	$scope.editThis = function(measurement) {

		var url = '/api/measurement/' + measurement._id;
		console.log(url);

		ngDialog.open({
			templateUrl: '../dialogs/measurement/edit.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-measurement-edit'
		});

		$http({
			method: 'GET',
			url: url,
		}).then(function successCallback(response) {
			console.log('success: ' + response.status);
			$scope.measurement = response.data;
		}, function errorCallback(response) {
			console.log('error: ', response.status);
			growl.error('Unable to retrieve measurement');
		});

	};


	// Editing an individual type
	$scope.saveThis = function(measurement) {
		var itemIndex = $scope.findOinA($scope.measurements, measurement._id);
		var url = '/api/measurement/' + measurement._id;
		//console.log(url);

		$http({
			method: 'PUT',
			url: url,
			data: measurement
		}).then(function successCallback(response) {
			$scope.measurements[itemIndex] = response.data;
			growl.success('Successfully saved measurement');
		}, function errorCallback(response) {
			console.log('error: ', response.status);
			growl.error('Unable to edit measurement');
		});
		ngDialog.close();

	};


	// Editing an individual type
	$scope.deleteThis = function(item) {
		var itemIndex = $scope.measurements.indexOf(item);

		$scope.confirmDelete = false;
		var url = '/api/measurement/' + item._id;

		console.log(url);

		ngDialog.open({
			templateUrl: '../dialogs/general/confirm-delete.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-confirm-delete'
		});
		
		$scope.confirmDelete = function(doDelete) {
			if ( doDelete ) {
				var url = '/api/measurement/' + item._id;
				
				$http({
					method: 'DELETE',
					url: url
				}).then(function successCallback(response) {
					console.log('success: ' + response);
					$scope.measurements.splice(itemIndex, 1);
					growl.success('Successfully deleted measurement');
				}, function errorCallback(response) {
					console.log('error: ', response);
					growl.error('Unable to delete measurement');
				});

				ngDialog.close();
			}
			else if ( !doDelete ) {
				ngDialog.close();
			}
		} // End confirmDelete
		
	};



});