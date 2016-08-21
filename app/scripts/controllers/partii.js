angular.module('adminBankaFrontendApp')
  .controller('partiiCtrl', function($scope, gatewayService, $filter, toastr, $route, $rootScope, ngDialog, $parse) {

    //Za prikaz na info
    $scope.KorisnikPrikazInfo={};
    $scope.Korisnik={};



    //Flag za enable i dable na kopceto prikazi
    $scope.Flag_Prikazhi = true;

    //Prebaruvanje na komitentot
    $scope.valueForSearch="Единствен број"
    $scope.flagS="0";
    $scope.Partii={};
    $scope.SearchValue="";
    $scope.a=true;


    //Podatoci za polni tabela
    $scope.loading = false;
    $scope.tmp={};
    $scope.showDir=false;


    $scope.flagVisibilityInput=false;

    $scope.selectedPartija={};
    $scope.IzbranaPartija={};

    $scope.epartii={
      MinBrojPotpisnici:1
    };



    $scope.tooltip = {

      "title": "Пребарај",
      "checked": false
    };

    //Prebaruvanje na komitentot
    $scope.changeValue=function (val) {
      if(val=='0')
      {
        $scope.valueForSearch="Единствен број"
        $scope.flagS="0";
        $scope.SearchValue="";
        $scope.Partii={};
        $scope.a=true;
        $scope.flagVisibilityInput=false;
      }
      else if(val=="1")
      {
        $scope.valueForSearch="Партија";
        $scope.flagS="1";
        $scope.SearchValue="";
        $scope.Partii={};
        $scope.a=false;
        $scope.flagVisibilityInput=false;
      }
    }

    $scope.searchRecord=function (val) {
      console.log("flag", $scope.flagS)
      console.log("val", $scope.valueForSearch)
      gatewayService.request("/api/Partii/1/FetchPartiieBankCore?Type="+$scope.flagS+"&Value="+ val, "GET").then(function (data, status, heders, config) {
        //    console.log(data)
        if(data.length<1)
        {
          toastr.warning("Не постојат податоци.");
        }
        $scope.Partii=data;
        console.log(data);

      }, function (data, status, headers, config) {
        console.log(status);

      });


      $scope.fetchPartija=function () {
        $scope.Flag_Prikazhi = false;
      }

      $scope.setVisibility=function () {
        $scope.flagVisibilityInput=true;
      }


      $scope.snimi=function () {
        console.log("Partija", angular.fromJson($scope.selectedPartija).Partija);

        gatewayService.request("/api/Partii/1/ePartiiFetchPartija?Type=1&Value=" +angular.fromJson($scope.selectedPartija).Partija, "GET").then(function (data, status, heders, config) {
          //    console.log(data)
          if (data.length < 1) {

            toastr.warning("Немате електронско банкарство за оваа сметка!");
            $route.reload();

          }
          else {
            $scope.IzbranaPartija = angular.fromJson($scope.selectedPartija);
            $scope.IzbranaPartija.MinimalenBrojPotpisi=$scope.epartii.MinBrojPotpisnici;
            console.log("IzbranaPartija",$scope.IzbranaPartija);

            gatewayService.request("/api/Partii/1/ePartiiUpdate", "POST",$scope.IzbranaPartija).then(function (data, status, heders, config) {

              toastr.success("Записот е успешно снимен!");
              $route.reload();

            }, function (data, status, headers, config) {
              console.log(status);

            });


          }


        }, function (data, status, headers, config) {
          console.log(status);

        });
      }

    }











  });
