/**
 * @ngdoc service
 * @name adminBankaFrontendApp.utility
 * @description
 * # utility
 * Service in the adminBankaFrontendApp.
 */
angular.module('adminBankaFrontendApp')
  .factory("utility", function($http) {
    return {


      getCombo: function(url) {

        return $http.get(url).then(function(result) {
          return result.data;
        });

      }
    }
  })
