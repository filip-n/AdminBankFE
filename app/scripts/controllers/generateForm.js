'use strict';

/**
 * @ngdoc function
 * @name adminBankaFrontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the adminBankaFrontendApp
 */
angular.module('adminBankaFrontendApp')
  .controller('GenerateFormCtrl', function($scope, gatewayService, $filter, toastr,ngDialog,$route,$translate, utility, $q, $http,$rootScope){


    $scope.productbody=[

      {
          "ProductBodyID" : "1" ,
           "ProductTypeID" : "01",
           "ProductID" : "0001",
           "FieldID" : "1",
           "FieldName" : "Button",
           "Mandatory" : "O",
           "FieldType" : "Button",
           "FieldLength" : "15",
           "ControlType" : "nnnnnn" ,
           "FillApi" : "",
           "DefaultValue" : "Submit",
           "FieldDescription" : ""
      },
      {
          "ProductBodyID" : "2" ,
          "ProductTypeID" : "01",
          "ProductID" : "0001",
          "FieldID" : "2",
          "FieldName" : "Textbox",
          "Mandatory" : "З",
          "FieldType" : "Textbox",
          "FieldLength" : "20",
          "ControlType" : "" ,
          "FillApi" : "",
          "DefaultValue" : "",
          "FieldDescription" : "Textbox"
      },
      {
        "ProductBodyID" : "3" ,
        "ProductTypeID" : "01",
        "ProductID" : "0001",
        "FieldID" : "2",
        "FieldName" : "Datepicker",
        "Mandatory" : "З",
        "FieldType" : "Datepicker",
        "FieldLength" : "20",
        "ControlType" : "" ,
        "FillApi" : "",
        "DefaultValue" : "",
        "FieldDescription" : "Datepicker"
      },
      {
        "ProductBodyID" : "4" ,
        "ProductTypeID" : "01",
        "ProductID" : "0001",
        "FieldID" : "4",
        "FieldName" : "Datepicker2",
        "Mandatory" : "З",
        "FieldType" : "Datepicker",
        "FieldLength" : "20",
        "ControlType" : "" ,
        "FillApi" : "",
        "DefaultValue" : "19-05-2016",
        "FieldDescription" : "Datepicker2"
      },
      {
        "ProductBodyID" : "5" ,
        "ProductTypeID" : "01",
        "ProductID" : "0001",
        "FieldID" : "5",
        "FieldName" : "Number",
        "Mandatory" : "З",
        "FieldType" : "Number",
        "FieldLength" : "20",
        "ControlType" : "" ,
        "FillApi" : "",
        "DefaultValue" : "",
        "FieldDescription" : "Number"
      },
      {
        "ProductBodyID" : "6" ,
        "ProductTypeID" : "01",
        "ProductID" : "0001",
        "FieldID" : "6",
        "FieldName" : "Dropdown",
        "Mandatory" : "З",
        "FieldType" : "Dropdown",
        "FieldLength" : "15",
        "ControlType" : "" ,
        "FillApi" : "/api/ProductBody/1/FieldApiFetch",
        "DefaultValue" : "Search",
        "FieldDescription" : "Dropdown"
      }
      ,
      {
        "ProductBodyID" : "7" ,
        "ProductTypeID" : "01",
        "ProductID" : "0001",
        "FieldID" : "7",
        "FieldName" : "Dropdown1",
        "Mandatory" : "З",
        "FieldType" : "Dropdown",
        "FieldLength" : "15",
        "ControlType" : "" ,
        "FillApi" : "/api/ProductTypes/1/ProductTypesFetch",
        "DefaultValue" : "Search",
        "FieldDescription" : "Dropdown1"
      },
      {
        "ProductBodyID" : "8" ,
        "ProductTypeID" : "01",
        "ProductID" : "0001",
        "FieldID" : "8",
        "FieldName" : "Textarea",
        "Mandatory" : "З",
        "FieldType" : "Textarea",
        "FieldLength" : "15",
        "ControlType" : "" ,
        "FillApi" : "api/ProductTypes/1/ProductTypesFetch",
        "DefaultValue" : "Search",
        "FieldDescription" : "Textarea"
      },
      {
        "ProductBodyID" : "9" ,
        "ProductTypeID" : "01",
        "ProductID" : "0001",
        "FieldID" : "9",
        "FieldName" : "Dropdown3",
        "Mandatory" : "З",
        "FieldType" : "Dropdown",
        "FieldLength" : "15",
        "ControlType" : "" ,
        "FillApi" : "/api/ProductTypes/1/ProductTypesFetch",
        "DefaultValue" : "Search",
        "FieldDescription" : "Dropdown3"
      }
      ,
      {
        "ProductBodyID" : "10" ,
        "ProductTypeID" : "01",
        "ProductID" : "0001",
        "FieldID" : "10",
        "FieldName" : "Checkbox",
        "Mandatory" : "З",
        "FieldType" : "Checkbox",
        "FieldLength" : "15",
        "ControlType" : "" ,
        "FillApi" : "",
        "DefaultValue" : "",
        "FieldDescription" : "Checkbox"
      },
      {
        "ProductBodyID" : "11" ,
        "ProductTypeID" : "01",
        "ProductID" : "0001",
        "FieldID" : "11",
        "FieldName" : "fhj",
        "Mandatory" : "З",
        "FieldType" : "ButtonCancel",
        "FieldLength" : "15",
        "ControlType" : "" ,
        "FillApi" : "",
        "DefaultValue" : "Cancel",
        "FieldDescription" : "check"
      },
      {
        "ProductBodyID" : "12" ,
        "ProductTypeID" : "01",
        "ProductID" : "0001",
        "FieldID" : "12",
        "FieldName" : "Inputnumber",
        "Mandatory" : "З",
        "FieldType" : "Input-Number",
        "FieldLength" : "20",
        "ControlType" : "" ,
        "FillApi" : "",
        "DefaultValue" : "",
        "FieldDescription" : "Input Number",
        "Mask":"4"
      }
    ];
    var niza=[];
    var i = 0;
    var output;

    $scope.temp={};
    $scope.pom=[];

    console.log("ovde vo kontroler: ",$scope.prodID);
    $scope.fillDropdown = function (){


      var arr = [];

      for (var a = 0; a < $scope.productbody.length; ++a) {
        if($scope.productbody[a].FieldType == "Dropdown"){

          arr.push($http.get("http://localhost:58075"+$scope.productbody[a].FillApi));
        } else {
          arr.push(null);
        }
      }

      $q.all(arr).then(function (ret) {

        for (var a = 0; a < $scope.productbody.length; ++a) {
          if($scope.productbody[a].FieldType == "Dropdown") {
            $scope.productbody[a].ControlType = ret[a].data;

          }
        }

      });


    }

    $scope.fillDropdown();




    $scope.submit=function (api) {

       angular.forEach($scope.pom, function( key) {

        var tmpvalue = $filter('date')(  $scope.temp[key], "yyyy-MM-dd");

        $scope.temp[key] = tmpvalue;

      //  this[key][value]=(key + ': ' +    $filter('date')(   value, "yyyy-MM-dd"));


      });
      $scope.temp.ProductID=$rootScope.selectedValue.Spoeni_VidTipRabota;

      gatewayService.request(api, "POST",$scope.temp).then(function (data, status, heders, config)
      {

      }, function (data, status, headers, config) {
        console.log(status);
      });

      $route.reload();
     // console.log("root",$rootScope.selectedValue);
      //  console.log($scope.temp);

    }



    $scope.filter=function ( key ) {

      $scope.pom.push(key);

    }




  });
