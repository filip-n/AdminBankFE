
angular.module('adminBankaFrontendApp')
  .controller('formaCtrl', function($scope, gatewayService, $filter, toastr, $route, $rootScope) {

$scope.Products=[];

///////////////////////// Prebaruvaj po Tip i Vid rabota i vrati konkateniran string od id na dvete /////////////////////////////////////////////////
$scope.fetchProducts_searchByType = function(){
 
     gatewayService.request("/api/FormCreating/1/getProductTypeByProductTypeIdAndProductIDConcatenatedIDs", "GET").then(function (data, status, heders, config) {

       $scope.Products = data;
        console.log($scope.Products);
      }, function (data, status, headers, config) {
        console.log(status);
      });

    }
});