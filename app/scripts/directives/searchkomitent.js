'use strict';

/**
 * @ngdoc directive
 * @name adminBankaFrontendApp.directive:searchKomitent
 * @description
 * # searchKomitent
 */
angular.module('adminBankaFrontendApp')
  .directive('searchKomitent', function () {
    return {
      templateUrl: "/views/searchKomitent.html",
      restrict: 'E',
      scope: {
        value: '='

      },
      controller: function($scope, gatewayService, $filter, toastr,ngDialog,$route,$translate, utility, $q, $http,$rootScope) {

        $scope.valueForSearch="Единствен број"
        $scope.flagS="0";
        $scope.Komitenti={};
        $scope.SearchValue="";
        $scope.korisnik=[];
        $scope.KorisnikPrikazInfo={};
        $scope.a=true;

        $scope.changeValue=function (val) {
          if(val=='0')
          {
            $scope.valueForSearch="Единствен број"
            $scope.flagS="0";
            $scope.SearchValue="";
            $scope.Komitenti={};
            $scope.a=true;
          }
          else if(val=="1")
          {
            $scope.valueForSearch="Име/Назив/Презиме";
            $scope.flagS="1";
            $scope.SearchValue="";
            $scope.Komitenti={};
            $scope.a=false;
          }
        }

        $scope.searchRecord=function (val) {
          $scope.Korisnik={};
          $scope.Komitenti={};
          $scope.korisnik=[];
          $scope.KorisnikPrikazInfo={};
          if(val=="" || val== null)
          {
            toastr.error("Внесете податоци за пребарување!")
          }
          else {
            console.log("flag", $scope.flagS)
            console.log("val", $scope.valueForSearch)
            gatewayService.request("/api/Baranja/1/FetchKomitentiCoreIeBanking?Type=" + $scope.flagS + "&Value=" + val, "GET").then(function (data, status, heders, config) {
              //    console.log(data)
              if (data.length < 1) {
                toastr.warning("Не постојат податоци.");
              }
              $scope.Komitenti = data;
              console.log(data);

            }, function (data, status, headers, config) {
              console.log(status);

            });
          }

        }



        $scope.fetchKomitent=function (val) {
          $scope.Flag_Prikazhi = false;

          $scope.Korisnik={};
          $scope.Korisnik = angular.fromJson(val);
          $scope.korisnik.embg=$scope.Korisnik.EdinstvenBroj;
          $scope.KorisnikPrikazInfo.ImePrezime=$scope.Korisnik.ImeNaziv+" "+$scope.Korisnik.Prezime;
          $scope.KorisnikPrikazInfo.TelefonskiBroj = $scope.Korisnik.Mobilen;
          $scope.korisnik.BrLicnaKarta = $scope.Korisnik.BrLicnaKarta;
          $scope.KorisnikPrikazInfo.Adresa = $scope.Korisnik.Adresa;
          $rootScope.EdinstvenBrojKomitent=    $scope.korisnik.embg;
        }




      }

    };
  });
