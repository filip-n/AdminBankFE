'use strict';

/**
 * @ngdoc directive
 * @name adminBankaFrontendApp.directive:dirPaginate
 * @description
 * # dirPaginate
 */
angular.module('adminBankaFrontendApp')
  .directive('dirPaginate', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the dirPaginate directive');
      }
    };
  });
