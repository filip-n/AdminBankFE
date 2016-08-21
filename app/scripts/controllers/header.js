'use strict'

angular.module('adminBankaFrontendApp')

  .controller('HeaderCtrl', function($scope,$translate,$rootScope,localStorageService,$location, gatewayService, $filter, toastr,ngDialog,$route){




    $scope.loggedUser = {};
    $scope.loggedUser = JSON.parse(localStorage.getItem("loginData"));


    // $scope.loggedUser = "filip NIkolovski"
    //$rootScope.loggedUser.KindergardenName = "kinder garden name"
    $rootScope.tmp = true;


    $scope.changeLang = function(tmp){
      $translate.use(tmp);
      localStorage.setItem("key",tmp);
      $rootScope.tmp = !$rootScope.tmp;
    }



    $scope.changeLanguage = function (langKey) {

      $translate.use(langKey);
      localStorage.setItem('lang', langKey);

    };

    $scope.logOut=function () {
      $location.path('/login');
      localStorage.clear();
    }




  });
