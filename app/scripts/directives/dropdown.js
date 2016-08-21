'use strict';

/**
 * @ngdoc directive
 * @name adminBankaFrontendApp.directive:DropDown
 * @description
 * # DropDown
 */
angular.module('adminBankaFrontendApp')
  .directive('dynamicModel', ['$compile', '$parse', function ($compile, $parse) {
    return {
      restrict: 'A',
      terminal: true,
      priority: 100000,
      link: function (scope, elem) {
        var name = $parse(elem.attr('dynamic-model'))(scope);
        elem.removeAttr('dynamic-model');
        elem.attr('ng-model', name);
        $compile(elem)(scope);
      }
      
    };
  }]);
