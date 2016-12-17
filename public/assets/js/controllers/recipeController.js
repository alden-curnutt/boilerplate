var app = angular.module('fmp-app');

app

/*
 * Recipe Controller
 *
 * Main controller for recipe interactivity
 *   - Creating recipes
 *   - Editing recipes
 *   - Saving recipes
 *   - Deleting recipes
 **/
.controller('recipeController', function($scope, $rootScope, $http, $routeParams, $filter, ngDialog, growl) {

	$scope.new = {}; // Reset the new recipe object
	$scope.recipeFilters = [];
	$scope.categoryFilter = 'Select';
	$scope.orderByFilter = 'friendly_name';

	$scope.getRecipeTypes = function() { // Assign recipe categories to scope variable
		$http.get('/api/recipe-type')
			.success(function(response) {
				// $scope.recipeCategories = response;
				// $scope.recipeCatFilters = response;
				$scope.recipeCategoriesEdit = response;
				$scope.recipeCategories = new Array;
				$scope.activeCategories = new Array;
				var tmp = response;		
				for ( var i = 0; i < tmp.length; i++ ) {
					$scope.recipeCategories.push(tmp[i].recipe_type);
				}
			}
		);
	}();
	$scope.getMeasurements = function() { // Assign recipe categories to scope variable
		$http.get('/api/measurement')
			.success(function(response) {
				$scope.measurements = response;
			}
		);
	}();
	$scope.getMeasurementSizes = function() { // Assign recipe categories to scope variable
		$http.get('/api/measurement-size')
			.success(function(response) {
				$scope.measurementSizes = response;
			}
		);
	}();
	$scope.getPantryCategories = function() { // Assign recipe categories to scope variable
		$http.get('/api/pantry-category')
			.success(function(response) {
				$scope.pantryCategories = response;
			}
		);
	}();

	// Setting inital recipe get request eq to recipes obj
	$http.get('/api/recipe')
		.success(function(response) {
			$scope.recipes = response;
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
	$scope.findIinA = function(array, key) {
		for ( var a = 0; a < array.length; a++ ) {
			if ( array[a] == key ) { return a; }
		}
	};

	// Default recipe open dialog
	$scope.newRecipeDialog = function() {
		ngDialog.open({
			templateUrl: '../dialogs/recipe/new.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-recipe-create'
		});
	};


	// Creating an idividual recipe
	$scope.createRecipe = function() {
		$http({
			method: 'POST',
			url: '/api/recipe',
			data: $scope.new
		}).then(function successCallback(response) {
			console.log('success: ' + response);
			$scope.recipes.push( response.data );
			growl.success('Successfully created recipe');
			$scope.new = {};
		}, function errorCallback(response) {
			console.log('error: ', response);
			growl.error('Unable to create recipe');
		});

		ngDialog.close();
	};


	// Editing an individual recipe
	$scope.editThis = function(recipe) {
		// Set recipe lookups to standard vars
		//$scope.recipeCat = ['Chicken', 'Beef', 'Sausage', 'Vegetarian', 'Side', 'Dessert', 'Support'];
		
		$scope.major = ['1', '2', '3'];
		$scope.minor = ['4', '5', '6'];
		$scope.meas = ['clove', 'can', 'cup'];

		console.log('now editing: ' + recipe.friendly_name);

		var url = '/api/recipe/' + recipe._id;
		
		ngDialog.open({
			templateUrl: '../dialogs/recipe/edit.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-recipe-edit',
			appendTo: '#ng-view'
		});

		$http({
			method: 'GET',
			url: url,
		}).then(function successCallback(response) {
			console.log('success: ' + response.status);
			$scope.recipe = response.data;
		}, function errorCallback(response) {
			console.log('error: ', response.status);
		});


		$scope.addPrepGroup = function() {
			$scope.recipe.preparation_groups.push('');
		};
		$scope.removePrepGroup = function(item) {
			$scope.recipe.preparation_groups.splice(item, 1);
		};
		
		$scope.addIngredient = function() {
			$scope.recipe.ingredients.push('');
		};
		$scope.removeIngredient = function(item) {
			$scope.recipe.ingredients.splice(item, 1);
		};

		$scope.addInstruction = function() {
			$scope.recipe.cooking_instructions.push('');
		};
		$scope.removeInstruction = function(item) {
			$scope.recipe.cooking_instructions.splice(item, 1);
		};

		$scope.addReference = function() {
			$scope.recipe.reference_url.push('');
		};
		$scope.removeReference = function(item) {
			$scope.recipe.reference_url.splice(item, 1);
		};
	}; // END editThis


	// Saving an idividual recipe
	$scope.saveThis = function(recipe) {
		var url = '/api/recipe/' + recipe._id;
		var itemIndex = $scope.findOinA($scope.recipes, recipe._id);
		
		$http({
			method: 'PUT',
			url: url,
			data: recipe
		}).then(function successCallback(response) {
			$scope.recipes[itemIndex] = response.data;
			growl.success('Successfully saved recipe');
		}, function errorCallback(response) {
			console.log('error: ', response.status);
			growl.error('Unable to save recipe');
		});
		ngDialog.close();
	};


	// Deleting an idividual recipe
	$scope.deleteThis = function(item) {
		$scope.confirmDelete = false;
		var itemIndex = $scope.recipes.indexOf(item);

		ngDialog.open({
			templateUrl: '../dialogs/general/confirm-delete.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-confirm-delete'
		});

		$scope.confirmDelete = function(doDelete) {
			if ( doDelete ) {
				var url = '/api/recipe/' + item._id;
				
				$http({
					method: 'DELETE',
					url: url
				}).then(function successCallback(response) {
					console.log('success: ' + response);
					$scope.recipes.splice(itemIndex, 1);
					growl.success('Successfully deleted recipe');
				}, function errorCallback(response) {
					console.log('error: ', response);
					growl.error('Unable to delete recipe');
				});

				ngDialog.close();
			}
			else if ( !doDelete ) {
				ngDialog.close();
			}
		} // End confirmDelete
	}; // End deleteThis


	// Filtering
	$scope.filterRecipeBy = function() {
		// $scope.recipeCategories

		if ( $scope.categoryFilter != 'Select' ) {
			var index = $scope.recipeCategories.indexOf($scope.categoryFilter);
			$scope.activeCategories.push($scope.recipeCategories[index]);
			$scope.recipeCategories.splice(index, 1);
			$scope.categoryFilter = 'Select';
		}
	};

	$scope.replaceFilter = function(index) {
		var returnCat = $scope.activeCategories[index];
		$scope.recipeCategories.push(returnCat);
		$scope.activeCategories.splice(index, 1);

	};
	

})
/*
 * Recipe Details Controller
 *
 * Called as a request to an individual recipe page
 **/
.controller('recipeDetailsController', function($scope, $http, $routeParams, ngDialog) {

	// Default dialog close func
	$scope.closeThis = function() {
		$scope.processCookTime($scope.recipe.recipe_time);
		ngDialog.close();
	};

	// Initial recipe request upon page load
	$scope.initialUrl = '/api/recipe/' + $routeParams.recipeId;
	$http({
		method: 'GET',
		url: $scope.initialUrl,
	}).then(function successCallback(response) {
		$scope.recipe = response.data;
		$scope.processCookTime($scope.recipe.recipe_time);
	}, function errorCallback(response) {
		console.log('error: ' + response.status);
	});

	$scope.getRecipeTypes = function() { // Assign recipe categories to scope variable
		$http.get('/api/recipe-type')
			.success(function(response) {
				// $scope.recipeCategories = response;
				// $scope.recipeCatFilters = response;
				$scope.recipeCategoriesEdit = response;
				$scope.recipeCategories = new Array;
				$scope.activeCategories = new Array;
				var tmp = response;		
				for ( var i = 0; i < tmp.length; i++ ) {
					$scope.recipeCategories.push(tmp[i].recipe_type);
				}
			}
		);
	}();
	$scope.getMeasurements = function() { // Assign recipe categories to scope variable
		$http.get('/api/measurement')
			.success(function(response) {
				$scope.measurements = response;
			}
		);
	}();
	$scope.getMeasurementSizes = function() { // Assign recipe categories to scope variable
		$http.get('/api/measurement-size')
			.success(function(response) {
				$scope.measurementSizes = response;
			}
		);
	}();
	$scope.getPantryCategories = function() { // Assign recipe categories to scope variable
		$http.get('/api/pantry-category')
			.success(function(response) {
				$scope.pantryCategories = response;
			}
		);
	}();


	// Edit an individual recipe
	$scope.editThis = function(recipe) {
		
		//console.log('now editing: ' + recipe.friendly_name);
		var url = '/api/recipe/' + recipe._id;
		
		ngDialog.open({
			templateUrl: '../dialogs/recipe/edit.html',
			plain: false,
			scope: $scope,
			appendClassName: 'ngdialog-recipe-edit',
			title: 'Recipe Editor'
		});

		$http({
			method: 'GET',
			url: url,
		}).then(function successCallback(response) {
			//console.log('success: ' + response.status);
			$scope.recipe = response.data;
			$scope.processCookTime($scope.recipe.recipe_time);
		}, function errorCallback(response) {
			console.log('error: ', response.status);
		});

		$scope.addPrepGroup = function() {
			$scope.recipe.preparation_groups.push('');
		};
		$scope.removePrepGroup = function(item) {
			$scope.recipe.preparation_groups.splice(item, 1);
		};
		
		$scope.addIngredient = function() {
			$scope.recipe.ingredients.push('');
		};
		$scope.removeIngredient = function(item) {
			$scope.recipe.ingredients.splice(item, 1);
		};

		$scope.addInstruction = function() {
			$scope.recipe.cooking_instructions.push('');
		};
		$scope.removeInstruction = function(item) {
			$scope.recipe.cooking_instructions.splice(item, 1);
		};

		$scope.addReference = function() {
			$scope.recipe.reference_url.push('');
		};
		$scope.removeReference = function(item) {
			$scope.recipe.reference_url.splice(item, 1);
		};
	};


	// Saving edits to an individual recipe
	$scope.saveThis = function(recipe) {

		var url = '/api/recipe/' + recipe._id;
		
		$http({
			method: 'PUT',
			url: url,
			data: recipe
		}).then(function successCallback(response) {
			console.log('success: ' + response.status);
			$scope.processCookTime($scope.recipe.recipe_time);
		}, function errorCallback(response) {
			console.log('error: ', response.status);
		});
		ngDialog.close();
	};


	$scope.processCookTime = function(timeObj) {
		var time = {
			total: 0,
			hours: 0,
			minutes: 0
		};

		
//		console.log(timeObj)
		
		//console.log('processing prep hrs');
		if ( timeObj.preparation.hours ) {
			//console.log( timeObj.preparation.hours );
			time.total += (timeObj.preparation.hours * 60)
		}		

		//console.log('processing prep min');
		if ( timeObj.preparation.minutes ) {
			//console.log( timeObj.preparation.minutes );
			time.total += timeObj.preparation.minutes
		}

		//console.log('processing cook hrs');
		if ( timeObj.cook.hours ) {
			//console.log( timeObj.cook.hours );
			time.total += (timeObj.cook.hours * 60);
		}

		//console.log('processing cook min');
		if ( timeObj.cook.minutes ) {
			//console.log( timeObj.cook.minutes );
			time.total += timeObj.cook.minutes
		}


		if ( time.total ) {
			//console.log(time);
			var done = false;
			count = 0;
			
			minsLeft = time.total; // 75

			while ( !done ) {
				if ( minsLeft > 60 ) { // if time left is more than 60
					time.hours += 1;
					minsLeft = minsLeft - 60;
				}
				else { // if minsLeft is not greater than 60, no more hours or work to do
					time.minutes += minsLeft;
					done = true;
				}

			}
		}

		//console.log(time);
		
		$scope.recipe.recipe_time.total = time;
		//console.log($scope.recipe.recipe_time);
	};


});