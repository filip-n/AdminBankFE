/**
 * Created by NikolovskiF on 06.04.2016.
 */


'use strict';

/**
 * @ngdoc function
 * @name adminBankaFrontendApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the adminBankaFrontendApp
 */
angular.module('adminBankaFrontendApp')
  .controller('IndexCtrl', function ($scope, $location, authService) {

    $scope.logOut = function () { console.log("logout");
      authService.logout();
      $location.path('/login');
    }

    //$scope.authentication = AuthService.authentication;



  });
