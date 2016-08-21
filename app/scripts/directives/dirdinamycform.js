'use strict';

/**
 * @ngdoc directive
 * @name adminBankaFrontendApp.directive:dirDinamycForm
 * @description
 * # dirDinamycForm
 */
angular.module('adminBankaFrontendApp')
  .directive('dirDinamycForm', function () {
    return {
      templateUrl: "/views/generateFormDir.html",
      restrict: 'E',
      //   replace: false,
      // template: '<div><label class="control-label">Value{{value}}</label>',
      scope: {
        value: '=',
        obj: '=ngModel',
        type: '=',
        desc: '=',
        disableall: '='
      },
      controller: function ($scope, gatewayService, $filter, toastr, ngDialog, $route, $translate, utility, $q, $http, $rootScope) {
        //console.log('value',  $scope.value);
        // console.log('type',  $scope.type);

        var niza = [];
        var i = 0;

        var output;
        $scope.temp = {};
        //  for (var a = 0; a < $scope.productbody.length; ++a) {
        //       if($scope.productbody[a].FieldType == "o0700101000004") {
        //         $scope.productbody[a].DefaultValue = $scope.productbody[a].data;
        //           }}
        $scope.pom = [];

        $scope.pom = [];

        //console.log("ovde vo kontroler: ",$scope.prodID);

        $scope.productBodyFetch = function () {
          gatewayService.request("/api/ProductBody/1/ProductBodyFetchByIdType?ProductTypeID=" + $scope.type + "&ProductID=" + $scope.value, "GET").then(function (data, status, heders, config) {
            $scope.productbody = data;

            console.log("OVDE", data)

            //  console.log("red od forma",$scope.productbody);

            // for(var i=0;i<$scope.productbody.length;i++)
            // {
            //   $scope.productbody[i].Privilegija=true;

            // }
            // console.log("pb",$scope.productbody)

          }, function (data, status, headers, config) {
            console.log(status);
          });
        }

        $scope.checkIsDisabled = function (item, disableall) {
          console.log("NAJNOVO2",disableall);

          console.log("NAJNOVO",disableall);
          if (disableall){


              return true;
            } else {
              var key = 'o'
              key += item.$parent.$parent.value;
              console.log(key);
              if (item.$parent.$parent.obj[key].isDisabled) {

                if (item.$parent.$parent.obj[key].isDisabled == true) {
                  return true
                } else {
                  return false;
                }
              }
            }

        }


        // $scope.getStatus = function (arg) {
        //   console.log('arg', arg.$parent.$parent.getStatus);
        // }


        $scope.productBodyFetch();
        $route.temp = $scope.temp;


        $scope.fillDropdown = function () {


          var arr = [];

          for (var a = 0; a < $scope.productbody.length; ++a) {
            if ($scope.productbody[a].FieldType == "Dropdown") {

              arr.push($http.get("http://localhost:58075" + $scope.productbody[a].FillApi));
            } else {
              arr.push(null);
            }
          }

          $q.all(arr).then(function (ret) {

            for (var a = 0; a < $scope.productbody.length; ++a) {
              if ($scope.productbody[a].FieldType == "Dropdown") {
                $scope.productbody[a].ControlType = ret[a].data;

              }
            }

          });


        }

        //   $scope.fillDropdown();
        $scope.submit = function (api) {

          angular.forEach($scope.pom, function (key) {

            var tmpvalue = $filter('date')($scope.temp[key], "yyyy-MM-dd");

            $scope.temp[key] = tmpvalue;

            //  this[key][value]=(key + ': ' +    $filter('date')(   value, "yyyy-MM-dd"));


          });
          $scope.temp.ProductID = $rootScope.selectedValue.Spoeni_VidTipRabota;

          gatewayService.request(api, "POST", $scope.temp).then(function (data, status, heders, config) {

          }, function (data, status, headers, config) {
            console.log(status);
          });

          $route.reload();
          // console.log("root",$rootScope.selectedValue);
          //  console.log($scope.temp);

        }


        $scope.filter = function (key) {

          $scope.pom.push(key);

        }


      }
      // link: function postLink(scope, element, attrs) {
      //   element.text('this is the generateForm directive');
      //  console.log("obj",$scope.value);
      //  }
    };
  });
