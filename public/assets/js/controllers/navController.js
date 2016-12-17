var app = angular.module('fmp-app');

app.controller('navController', function($scope, growl) {
	
	$scope.slideoutNav = false;

	$scope.openSlideoutIs = function(bool) {
		$scope.slideoutNav = bool;		
	};

	$scope.$on('$locationChangeStart', function(event) {
    	$scope.openSlideoutIs(false);
	});
	

});