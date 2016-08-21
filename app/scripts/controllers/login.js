/**
 * Created by NikolovskiF on 06.04.2016.
 */

'use strict';


angular.module('adminBankaFrontendApp')
  .controller('LoginCtrl', function ($scope, authService, $location, gatewayService, $filter, toastr,ngDialog,$route,$translate) {

    if(localStorage.getItem("loginData")){

        var authData = JSON.parse(localStorage.getItem("loginData"));
        console.log(authData);
    }


    if (authData) {
      $location.path('/main');
    }



    $scope.loginData = {};
    var InfoBanka={};
    var InfoReferent={};

    $scope.init = function () {
      $scope.loginData.Datum = new Date();

    }
    $scope.init();



    $scope.login = function(){

      var InfoBanka={};
      var InfoReferent={};

      gatewayService.request("/api/Login/1/FetchBanka?Banka="+$scope.loginData.Banka, "GET").then(function (data, status, heders, config) {

        if(data.length<1)
        {
          toastr.warning("Внесената шифра на банка не постои!");
        }
        else
        {
          InfoBanka=data;
         // console.log(InfoBanka);
          gatewayService.request("/api/Login/1/FetchReferent?Banka="+$scope.loginData.Banka+"&Referent="+$scope.loginData.Operator+"&Lozinka="+$scope.loginData.Lozinka, "GET").then(function (data, status, heders, config) {

            if(data.length<1)
            {
              toastr.warning("Погрешно внесени оператор или лозинка!");
            }
            else
            {
              InfoReferent=data;
             // console.log(InfoReferent[0].Ime);
              $scope.loginData.Naziv= InfoBanka[0].Naziv;
              $scope.loginData.Ime= InfoReferent[0].Ime;
              $scope.loginData.Prezime= InfoReferent[0].Prezime;
              $scope.loginData.Pozicija= InfoReferent[0].Pozicija;
              $scope.loginData.OrgDel=InfoReferent[0].OrgDel;
              console.log("logindata",  $scope.loginData);
              toastr.success("Успешна најава!");


              localStorage.setItem("loginData", JSON.stringify($scope.loginData));



              $location.path("/main")

            }


          }, function (data, status, headers, config) {
            console.log(status);

          });


        }


      }, function (data, status, headers, config) {
        console.log(status);

      });




      // authService.login(loginData).then(function (data, status, headers, config) {
      //   console.log(data);
      //   $location.path("/main")
      // }, function (data, status, headers, config) {
      //   alert(data);
      //   console.log(data);
      // });


    }




  });

