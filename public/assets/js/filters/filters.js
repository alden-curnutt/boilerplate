// var app = angular.module('fmp-app');

// app.filter('recipeFilter', function() {
//     return function( input, filtersArr ) {
//         var exists = false;
//         if ( input ) {
//             if ( filtersArr.length != 0 ) {
//                 console.log('filter length: ' + filtersArr.length );
//                 for ( var i = 0; i < input.length; i++ ) {
//                     console.log( 'testing recipe: ' + input[i].friendly_name );
//                     for ( var j = 0; j < filtersArr.length; j++ ) {
//                         if ( input[i].recipe_category == filtersArr[j] ) {
//                             console.log('found a match: ' + input[i].recipe_category + '==' + filtersArr[j]);
//                             exists = true;
//                         }
//                     }
//                 }
//             }
//             else {
//                 console.log('no filters, filter length: ' + filtersArr.length );
//                 exists = input;
//             }
//             //console.log(input.length)
//         }
//         console.log(exists)
//         return exists;
//     }
// });