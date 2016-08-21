'use strict';

/**
 * @ngdoc overview
 * @name adminBankaFrontendApp
 * @description
 * # adminBankaFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('adminBankaFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'mgcrea.ngStrap',
    'ngMask',
    'toastr',
    'angularUtils.directives.dirPagination',
    'ui.select',
    'ngDialog',
    'pascalprecht.translate',
    'angularTranslateApp',
    'LocalStorageModule',
    'checklist-model'

  ])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/vid-rabota/create', {
        templateUrl: 'views/vid-rabota-create.html',
        controller: 'VidRabotaCreateCtrl'
      })
      .when('/tip-rabota/create', {
        templateUrl: 'views/tip-rabota-create.html',
        controller: 'TipRabotaCreate'
      })
      .when('/vid-rabota', {
        templateUrl: 'views/vid-rabota.html',
        controller: 'VidRabotaCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
      })

      .when('/form', {
        templateUrl: 'views/generateForm.html',
        controller: 'GenerateFormCtrl',
      })
      .when('/forma', {
        templateUrl: 'views/create-form.html',
        controller:'formaCtrl',
      })
      .when('/adminBaranja', {
        templateUrl: 'views/adminBaranja.html',

      })
      .when('/odobruvanjeBaranja', {
        templateUrl: 'views/odobruvanjeBaranje.html',
        controller: 'odobruvanjeBaranjaCtrl'

      })
      .when('/komitenti', {
        templateUrl: 'views/vnesuvanjeKomitenti.html',
        controller: 'KomitentiCtrl'

      })
      .when('/partii', {
        templateUrl: 'views/partii.html',
        controller: 'partiiCtrl'
      })
      .otherwise({
        redirectTo: '/login'
      });
  })

  .config(function(toastrConfig) {
    angular.extend(toastrConfig, {
      closeButton: true,
      autoDismiss: true,
      timeOut: 2000,
      positionClass: 'toast-bottom-right'
    })

});


