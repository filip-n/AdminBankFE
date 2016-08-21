'use strict';

/**
 * @ngdoc directive
 * @name adminBankaFrontendApp.directive:forma
 * @description
 * # forma
 */
angular.module('adminBankaFrontendApp')
  .directive('searchVidTip', function () {
    return {
      templateUrl: "/views/dirSearchTipVidMain.html",
      restrict: 'E',
      controller: function($scope, gatewayService, $rootScope,  $element, $attrs){

      	$scope.Products=[];
      	$scope.productsBody=[];
        $scope.prodID='huhu';
        $rootScope.opis="";

      	$scope.sendConcatenatedIDs = function(seelectedItem){
 			    gatewayService.request("/api/FormCreating/1/getProductBodyByProductTypeIdAndProductIDConcatenatedIDs?ConcatID="+seelectedItem.Spoeni_VidTipRabota, "GET").then(function (data, status, heders, config) {

            $scope.productsBody = data;


       // console.log($scope.productsBody);
          $scope.opis=seelectedItem.Description;
            $rootScope.selectedValue = seelectedItem;
         console.log("ovde vo kontroler: ",$rootScope.selectedValue);
     		}, function (data, status, headers, config) {
        		//console.log(status);
      		});
		}


      	$scope.fetchProducts_searchByType = function(){
          gatewayService.request("/api/FormCreating/1/getProductTypeByProductTypeIdAndProductIDConcatenatedIDs", "GET").then(function (data, status, heders, config) {
            $scope.Products = data;
                //console.log("ova e toa: ",$scope.Products);
            }, function (data, status, headers, config) {
                //console.log(status);
              });
        }



      }//------------------  end of controller
    };
  });
