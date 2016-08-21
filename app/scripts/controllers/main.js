'use strict';

/**
 * @ngdoc function
 * @name eBankingAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eBankingAdminApp
 */
angular.module('adminBankaFrontendApp')
  .controller('MainCtrl', function ($scope,  gatewayService,localStorageService, $location, authService, $filter, toastr,ngDialog,$route,$translate) {



    if(localStorage.getItem("loginData")){

      var authData = JSON.parse(localStorage.getItem("loginData"));
      console.log(authData);
    }

    if(authData)
    {

    }
    else
    {
      $location.path('/login');
      localStorage.clear();
    }








  });
