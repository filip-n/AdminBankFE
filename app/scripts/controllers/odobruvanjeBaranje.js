
/**
 * Created by TalevskaM on 07.07.2016.
 */

angular.module('adminBankaFrontendApp')
  .controller('odobruvanjeBaranjaCtrl', function($scope, gatewayService, $filter, toastr, $route, $rootScope, ngDialog, $parse) {
    $scope.flagVisibility=false;
    $scope.obj={};
    $scope.showDir=false;
    $scope.vnesipodatoci=false;
    $scope.nemapodatoci=false;
    $scope.flagDisableButtons=true;
    $scope.showButtons=false;


   $scope.loading = true;
    $scope.flagVisibilityTabs = false;

    $scope.checkEMBG = function (){
      if($scope.obj.EdinstvenBroj == null || $scope.obj.EdinstvenBroj == ""){
        toastr.error('Единствен број е задолжително поле!');

      }
    };



       $scope.prikaziBaranja = function () {
         if($rootScope.EdinstvenBrojKomitent==null || $rootScope.EdinstvenBrojKomitent=="")
         {
           $scope.vnesipodatoci=true;
           $scope.flagVisibility=true;
           $scope.loading = false;
         }
         else
         {
           $scope.vnesipodatoci=false;
           $scope.flagVisibility=true;
           $scope.baranja={};
           $scope.loading = true;
           console.log($scope.loading);
           $scope.obj.EdinstvenBroj= $rootScope.EdinstvenBrojKomitent;

           gatewayService.request("/api/OdobruvanjeBaranja/1/FetchNeodobreniBaranja?EdinstvenBroj="+$scope.obj.EdinstvenBroj, "GET").then(function (data, status, heders, config) {

             $scope.loading = false;
             if(data.length>0)
             {
               console.log("baranja",data);
               $scope.baranja = data;
             }
             else {
               $scope.nemapodatoci=true;
             }



           }, function (data, status, headers, config) {
             console.log(status);
           });

           gatewayService.request("/api/OdobruvanjeBaranja/1/FetchAllNeodobreniBaranja?EdinstvenBroj="+$scope.obj.EdinstvenBroj, "GET").then(function (data, status, heders, config) {
             // $scope.loading = false;

             // console.log("baranja",data);

             $scope.neodobreniBaranja = data;
             console.log("neodobreni",data);



           }, function (data, status, headers, config) {
             console.log(status);
           });
         }


    }

    $scope.baranje={};
    $scope.baranjaZaOdobruvanje=[];


    $scope.previewForEdit = function(item) {
      if ($scope.selectedRow != null) {

        $scope.showDir=true;
        console.log("Show",$scope.showDir);
        $scope.baranje = item;
        console.log("Baranje", $scope.baranje)

        $scope.finalno={};
        $scope.baranjaZaOdobruvanje=[];

        for(var i=0;i<$scope.neodobreniBaranja.length;i++)
        {
          if ($scope.neodobreniBaranja[i].BrojBaranje==$scope.baranje.BrojBaranje && $scope.neodobreniBaranja[i].Privilegii == "1" ) {
            console.log("tuka sme")
            var pomoshna = "";
            pomoshna = "o" + $scope.neodobreniBaranja[i].ProductId;
            console.log("pom",pomoshna);
            //$scope.korisnik.Privilegii[i] = pomoshna;
            // console.log("TUKA SE POLNI SUBSTRING:", $scope.korisnik.Privilegii[i]);
            $scope.finalno[pomoshna] = {
              Privilegii: true,
              isDisabled: false
            }

            $scope.baranjaZaOdobruvanje.push($scope.neodobreniBaranja[i]);
          }
        }



      }
      else{
        $scope.baranje = {};
        $scope.products={};
        $scope.finalno={};
        $scope.showDir=false;
        console.log("Show",$scope.showDir);
        $scope.flagVisibilityTabs = false;

      }
    };


    $scope.selectedRow = null;  // initialize our variable to null
    $scope.setClickedRow = function(index){  //function that sets the value of selectedRow to current index
      $scope.selectedRow = ($scope.selectedRow == index) ? null : index;
      console.log("this is selected item: ",index);
    };


    //Fetch na site vidovi rabota
    $scope.productsFetch=function (y) {
      gatewayService.request("/api/Products/1/ProductsFetchByProductType?ProductTypeID="+ y.ProductTypeId, "GET").then(function (data, status, heders, config) {
        $scope.products=data;
        console.log("products",data);
        $scope.showDir=true;
      }, function (data, status, headers, config) {
        console.log(status);
      });
    }

    $scope.setVisibility = function(){
      $scope.flagVisibilityTabs = true;
      console.log("povikano flag visibility.");
    };


    obj = {
      Baranja: $scope.baranjaZaOdobruvanje,
      OrgDel: "1000"
    }


    $scope.odobriBaranje=function () {
      $scope.flagDisableButtons=false;
      // $scope.obj = {
      //   Baranja: $scope.baranjaZaOdobruvanje,
      //   OrgDel: "1000"
      // }
      //
      // // $scope.obj.push($scope.baranjaZaOdobruvanje);
      // // $scope.obj.push("1000");
      //
      // console.log("Obj",$scope.obj)
      // gatewayService.request("/api/OdobruvanjeBaranja/1/odobriBaranja", "POST",$scope.obj).then(function (data, status, heders, config) {
      //     scope.flagDisableButtons=false;
      //
      // }, function (data, status, headers, config) {
      //   console.log(status);
      //
      // });
    };

  $scope.password="";
   $scope.randomPassword=function(length) {

      var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
      var pass = "";
      for (var x = 0; x < length; x++) {
        var i = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(i);
      }
      console.log("Password",pass);
      $scope.password=pass;
     // console.log("Pass",password);
    }



////////////////////////  NG DIALOG   ///////////////////
    $scope.popUp = function() {
      ngDialog.open({
        template: 'templateid',
        scope: $scope
      });
    }

    $scope.printDiv = function(divname) {
      console.log("Div",divname);
      var printContents = document.getElementById(divname).innerHTML;
      var popupWin = window.open('', '_blank', 'width=300,height=300');
      popupWin.document.open();
      popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
      popupWin.document.close();
    }



  });
