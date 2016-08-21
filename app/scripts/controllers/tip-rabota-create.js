/**
 * Created by Moki on 4/11/2016.
 */
'use strict';
angular.module('adminBankaFrontendApp')
  .controller('TipRabotaCreate', function($scope, gatewayService, $filter, toastr, $route, $rootScope) {

  $scope.productTypes = []; ////////////////////////////da se brishe//////////////////////////////////////



////////////////////////// SETIRANJE PREDEF VREDNOSTI /////////////
$scope.flag = false;
$scope.flag1 = false;
$scope.blokirajIzmeni=false;
$scope.StatusZaDatumZatvoranje="";
$scope.Products = {
      'ProductTypeID':null,
      "Description":null,
      "WorkingTable":null,
      "Status":true,
      "OpeningDate":null,
      "ClosingDate":null

    };
$scope.iminjaTabeliOdBaza=[];
$scope.onSelectUI_validation = true;
var PID=null;
var ProduktTip = 'ProductType';///////////////////////////////////da se vidi////

  $scope.test = function(){
    console.log("lang", $rootScope.tmp);
  }



$scope.init = function () {
      $scope.Products.OpeningDate = new Date();
}

$scope.tblNameChange = function(){ $scope.tblName = 'ProducTypes'}


//////////////////////////// ISPOLNI TABELA ///////////////////////////////////

$scope.ProductTypes = function () {
      gatewayService.request("/api/ProductTypes/1/ProductTypesFetch", "GET").then(function (data, status, heders, config) {
        // console.log("data" ,data);
        $scope.productTypes = data;
        console.log("pocetok ", $scope.productTypes);

      }, function (data, status, headers, config) {
        console.log(status);
      });

    }
$scope.ProductTypes();


////////////////////////////  SUBMIT //////////////////////////////////////
$scope.submit= function (Prod) {

  console.log("Prod ", Prod); ////////////////////////// za brishenje //////////////////////

    var fullDate1 = $filter('date')($scope.Products.ClosingDate, "yyyy-MM-dd");
    var fullDate2 = $filter('date')($scope.Products.OpeningDate,"yyyy-MM-dd");
    Prod.ClosingDate = fullDate1;
    Prod.OpeningDate = fullDate2;
    //console.log("checkstatus pred if", $scope.Products.Status);
    if($scope.Products.Status == true){
        $scope.Products.Status = '1';
    }
    else{
       $scope.Products.Status = '0';
    }

    if ($scope.form.$valid) {
        ProduktTip += $scope.Products.WorkingTable;
        $scope.Products.WorkingTable = ProduktTip;
         //console.log(Prod);
    gatewayService.request("/api/ProductTypes/1/ProductTypesInsert", "POST", Prod).then(function (data, status, heders, config) {
          $route.reload();
          toastr.success($filter('translate')('lblDbSuccess_pt'));
        }, function (data, status, headers, config) {
             console.log(status);
             toastr.warning($filter('translate')('lblDbError_pt'));

        });

    } //if valid

    //setiranje na null vrednosta na productTip input za da ne se ++dodava celo vreme na stringot
    ProduktTip = "";

}

////////////////////////////  SUBMIT OD EDIT //////////////////////////////////////
$scope.zachuvaj = function(Prod){
   // console.log("closing date PRED FILTER: ",Prod.ClosingDate);
    var fullDate1 = $filter('date')(Prod.ClosingDate, "yyyy-MM-dd");
    var fullDate2 = $filter('date')(Prod.OpeningDate,"yyyy-MM-dd");
    Prod.ClosingDate = fullDate1;
    Prod.OpeningDate = fullDate2;
    //console.log("oppening date: ",Prod.OpeningDate);
   // console.log("closing date: ",Prod.ClosingDate);
    if(Prod.Status == true){
        Prod.Status = '1';
    }
    else{
       Prod.Status = '0';
    }

      ProduktTip += $scope.Products.WorkingTable;
      $scope.Products.WorkingTable = ProduktTip;
      Prod.ID
      gatewayService.request("/api/ProductTypes/1/ProductTypesUpdate", "PUT", Prod).then(function (data, status, heders, config) {
          $route.reload();
          toastr.success($filter('translate')('lblDbSuccessEdit_pt'));
        }, function (data, status, headers, config) {
            console.log(status);
            toastr.warning($filter('translate')('lblDbError_pt'));

        });


 ProduktTip = "";

}


/////////////////////////// close function ///////////////////////
$scope.close = function(){
    $scope.blokirajIzmeni = false;
    $route.reload();
}

/////////////////////////// sort function ///////////////////////
    $scope.sort = function(keyname){
      $scope.sortKey = keyname;   //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      $scope.verify = ! $scope.verify;
      // console.log("verify: ", $scope.verify);
    }


/////////////////////////// PROVERKA DALI TOJ TIP RABOTA GO IMA VEKJE VO BAZA ///////////
$scope.checkTipInDb = function(prodWeSearchWith){
  ////api/ProductTypes/1/FetchByProductTypeId?productTypeID=11
      gatewayService.request("/api/ProductTypes/1/FetchProductTypes_ByProductTypeId?productTypeID="+prodWeSearchWith, "GET").then(function (data, status, heders, config) {

         if($scope.isEmpty(data) != true){
            toastr.error($filter('translate')('lblTipExist_pt'));
            $scope.flag = true;
         }
         else{
          $scope.flag = false;
         }
       // console.log("Ova e flag: " ,$scope.flag);
      }, function (data, status, headers, config) {
        //console.log("greshka: ",status);
      });

    }


    /////////////////////////// PROVERKA VO EDIT DALI TOJ TIP RABOTA GO IMA VEKJE VO BAZA ///////////
$scope.checkTipInDbEdit = function(prodWeSearchWith){
  ////api/ProductTypes/1/FetchByProductTypeId?productTypeID=11
      console.log("vleguva vo edit ");
      gatewayService.request("/api/ProductTypes/1/FetchProductTypes_ByProductTypeId?productTypeID="+prodWeSearchWith, "GET").then(function (data, status, heders, config) {

         if($scope.isEmpty(data) != true){
            toastr.error($filter('translate')('lblTipExist_pt'));
            $scope.flag1 = true;
         }
         else{
          $scope.flag1 = false;
         }
        //console.log("Ova e flag: " ,$scope.flag);
      }, function (data, status, headers, config) {
        //console.log("greshka: ",status);
      });

    }


///////////////////////////////////   IZMENI ///////////////////////////////
$scope.izmeni = function(ob){ PID = ob.ProductTypeID; if(ob.Status =="1"){ ob.Status = true;} else{ob.Status = false;} $scope.blokirajIzmeni = true; }



/////////////////////// FUNKCIJA KOJA PROVERUVA DALI OBJEKTOT E PRAZEN ///////////////
$scope.isEmpty = function(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

/////////////////////////// PROVERKA ZA ERROR POP UP ///////////////////////
$scope.checkTip = function (){
  if($scope.Products.ProductTypeID == null){
     toastr.error($filter('translate')('lblTipError_pt'));
  }
}

$scope.checkOpis = function (){
  if($scope.Products.Description == null){
     toastr.error($filter('translate')('lblOpisError_pt'));
  }
}

$scope.checkWTable = function (){
  if($scope.Products.WorkingTable == null){
     toastr.error($filter('translate')('lblWTableError_pt'));
  }
}


/////////////////////////// PROVERKA NA EDIT ZA ERROR POP UP ///////////////////////
$scope.checkTipEdit = function (tip){
  if(tip == null){
     toastr.error($filter('translate')('lblTipError_pt'));
  }
}

$scope.checkOpisEdit = function (opis){
  if(opis == null){
     toastr.error($filter('translate')('lblOpisError_pt'));
  }
}

$scope.checkWTableEdit = function (wtable){
  if(wtable == null){
     toastr.error($filter('translate')('lblWTableError_pt'));
  }
}

$scope.reset = function(){
  $scope.Products.OpenningDate = new Date();
  $scope.Products.ClosingDate = null;
  $scope.Products.Description = null;
  $scope.Products.WorkingTable = null;
  $scope.Products.ProductTypeID = null;
  $scope.Products.chkStatus = false;

}

////////////////////////////// IZMENI KOD PREVZEMEN ////////////////////////////////////////////////////

  $scope.showEditRow = function (r) {
    if ($scope.active != r) {
      $scope.active = r;
    }
    else {
      $scope.active = null;
    }
    console.log("active: ",$scope.active);
  };

///////////////////////////////// KRAJ IZMENI //////////////////////////////////////////////////////////


///////////////////////////////// setiranje na datum zatvaranje ako kliknat status  /////////////////////////////////////////////////////
$scope.setirajDatumZatvaranje = function(item,status){
    if(status == true){
      item['ClosingDate'] = "";
    }
    else if(status == false){

      item['ClosingDate'] = new Date();
    }
};

///////////////////////////  fetch na table names od baza ////////////
$scope.fetchTableNames = function(){
   gatewayService.request("/api/Baranja/1/admin_bank_Fetch_Table_Names", "GET").then(function (data, status, heders, config) {
         $scope.iminjaTabeliOdBaza = data;
         //console.log("iminja tabeli: ",$scope.iminjaTabeliOdBaza);
        }, function (data, status, headers, config) {
            console.log(status);

        });
 };


 $scope.onSelectUIvalidation = function(){
    $scope.onSelectUI_validation = false;

 };


});
