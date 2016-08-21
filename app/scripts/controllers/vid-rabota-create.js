/**
 * Created by NikolovskiF on 21.03.2016.
 */
'use strict';

/**
 * @ngdoc function
 * @name eBankingAdminApp.controller:VidRabotaCtrl
 * @description
 * # VidRabotaCtrl
 * Controller of the eBankingAdminApp
 */

angular.module('adminBankaFrontendApp')
  .controller('VidRabotaCreateCtrl', function($scope, gatewayService, $filter, toastr,ngDialog,$route,$translate){




    $scope.hasNew=false;
    $scope.productExist = false;
    $scope.canAdd=false;
    $scope.flag=false;
    $scope.deleted=[];
    $scope.LastId = 0;

    // Modeli

    $scope.Products={
      "Status": true,
      "ProductTypeID" :"",
      "ClosingDate":null
    }

    $scope.productBody =  [

    ];

    $scope.productBodyNew = {};
    $scope.item = {};

    // Change closing date
    $scope.changeClosingDate=function () {
      if($scope.Products.Status==false)
      {
        $scope.Products.ClosingDate = new Date();
      }
      else {
        $scope.Products.ClosingDate="";
      }
    }

    // Polni gi polinjata tip na pole i dolzina so podatoci od baza soodvetno

    $scope.polniTipDolzina=function (item) {
      console.log(item);
      gatewayService.request("/api/ProductBody/1/TipPodatokDolzinaFetch?FieldName="+item, "GET").then(function (data, status, heders, config) {
        console.log("data" ,data[0]);
        $scope.productBodyNew.DataType=data[0].Data_Type;
        $scope.productBodyNew.FieldLength=data[0].CHARACTER_MAXIMUM_LENGTH;

        $scope.productTypes = data;

      }, function (data, status, headers, config) {
        console.log(status);
      });

    }

    // Dodadi nov ProductBody vo tabelata

    $scope.addRow = function(test){
      //if ($scope.productBodyNew != undefined && $scope.productBodyNew.FieldName != undefined) {
        // console.log("zz", $scope.productBodyNew.FieldName != undefined);
      //   var result = $scope.productBody.filter(function (obj) {
      //     if (obj.FieldName == $scope.productBodyNew.FieldName) {
      //       return 1;
      //     } else {
      //       return 0;
      //     }
      //   });
      //
      // }
        // if(result != undefined && result.length <= 0){
      if ($scope.productBodyNew != undefined){


        if($scope.productBodyNew.FillApi!=null)
        {
          $scope.productBodyNew.FillApi=$scope.productBodyNew.FillApi.ApiUrl;
        }

        if($scope.productBodyNew.Mandatory==true)
        {
          $scope.productBodyNew.Mandatory="М";
        }
        else
        {
          $scope.productBodyNew.Mandatory="О";
        }
        if($scope.productBodyNew.FieldType==null || $scope.productBodyNew.FieldName==null)
        {
          $scope.canAdd=false;
          toastr.error('Поле во табела и тип поле се задолжителни!');
        }
        else {
          $scope.canAdd = true;
         // console.log("false");

          $scope.hasNew = true;
          var pb={};
          pb.Type="I";
          pb.ProductTypeID=$scope.Products.ProductTypeID;
          pb.ProductID=$scope.Products.ProductID;
          pb.FieldID=$scope.lastId;
          pb.FieldName=$scope.productBodyNew.FieldName;
          pb.Mandatory=$scope.productBodyNew.Mandatory;
          pb.FieldType=$scope.productBodyNew.FieldType;
          pb.FieldLength=$scope.productBodyNew.FieldLength;
          pb.ControlType="";
          pb.Mask="";
          pb.FillApi=$scope.productBodyNew.FillApi;
          pb.DefaultValue=$scope.productBodyNew.DefaultValue;
          pb.DataType=$scope.productBodyNew.DataType;
          pb.FieldDescription=$scope.productBodyNew.FieldDescription;
          pb.ProductBodyID=$scope.productBodyNew.ProductBodyID;
          gatewayService.request("/api/ProductBody/1/ProductBody_FetchByProductBodyID?ProductBodyID="+$scope.productBodyNew.ProductBodyID, "GET").then(function (data, status, heders, config)
          {
            console.log("pbid",$scope.productBodyNew.ProductBodyID);
            if(data.length>0)
            {
              console.log("pb",pb);
              pb.Type="U";
              gatewayService.request("/api/ProductBody/1/ProductBodyUpdate", "POST", pb).then(function (data, status, heders, config)
              {

                console.log("Uspesno izmenet");
              }, function (data, status, headers, config) {
                console.log(status);
              });
            }
            else{



              gatewayService.request("/api/ProductBody/1/ProductBodyInsertUpdate1", "POST", pb).then(function (data, status, heders, config)
              {
                console.log("Uspeh");
                $scope.lastId++;
                console.log("lastID",  $scope.lastId)
              }, function (data, status, headers, config) {
                console.log(status);
              });
              $scope.productBody.push(pb);
            }
          }, function (data, status, headers, config) {
            console.log(status);
          });



            $scope.productBodyNew = {};

          }


      }

      $scope.productBodyNew = {};

    }


    $scope.removeRow = function(index){
      ngDialog.open({
        template: 'templateId',
        scope: $scope
      });
       //$scope.temp=index+1;
      //console.log("i",index);

      //$scope.productBody.splice(index, 1);

    }

    $scope.tmpdel={};


    $scope.deleteRow = function(){
      //console.log("temp",$scope.temp)
      $scope.tmpdel= $scope.productBody[$scope.temp];
     // console.log("tmpdel", $scope.tmpdel);
     // console.log("tmpdel", $scope.tmpdel.ProductBodyID);

      gatewayService.request("/api/ProductBody/1/ProductBodyDelete?ProductBodyID="+ $scope.tmpdel.ProductBodyID, "GET").then(function (data, status, heders, config)
      {
        console.log("pred",$scope.lastId);
       // $scope.lastId--;
        console.log("pred",$scope.lastId);
      }, function (data, status, headers, config) {
        console.log(status);
      });

      // Smeni go redosledot na site naredni
      for(var i=$scope.temp;i<$scope.productBody.length-1;i++)
      {
        $scope.pbtemp={};
        $scope.pbtemp=$scope.productBody[i+1];
        $scope.pbtemp.FieldID=i;
        console.log("item111",$scope.pbtemp);
        gatewayService.request("/api/ProductBody/1/ProductBodyUpdate", "POST",$scope.pbtemp).then(function (data, status, heders, config)
        {
          console.log("success");
          $scope.pbtemp={};

        }, function (data, status, headers, config) {
          console.log(status);
        });

      }
      $scope.productBody.splice($scope.temp, 1);
      $scope.selectedRow=null;
      $scope.productBodyNew={};

    }


    //////////////////////////////// Fetch na ProductTypes //////////////////////////////////

    $scope.ProductTypes = function () {
      gatewayService.request("/api/ProductTypes/1/ProductTypesFetch", "GET").then(function (data, status, heders, config) {
       //  console.log("data" ,data);

        $scope.productTypes = data;

      }, function (data, status, headers, config) {
        console.log(status);
      });

    }

    $scope.ProductTypes();

    //////////////////////////////// Fetch na Products //////////////////////////////////

    $scope.GetProducts = function () {
      gatewayService.request("/api/Products/1/ProductsFetch", "GET").then(function (data, status, heders, config) {
        // console.log("data" ,data);

        $scope.products = data;

      }, function (data, status, headers, config) {
        console.log(status);
      });

    }

    $scope.GetProducts();


    ////////////////////////////// PROVERKA ZA ERROR POP UP ////////////////////////////////

    $scope.checkVid = function (){

      if($scope.Products.ProductID == null|| $scope.Products.ProductID == ""){

        toastr.error($filter('translate')('errorVidRabota_p'));
      }
      else{
        gatewayService.request("/api/Products/1/ProductsFetchByProductIDProductTypeID?ProductTypeID="+$scope.Products.ProductTypeID+"&ProductID="+$scope.Products.ProductID, "GET").then(function (data, status, heders, config)
        {
          if(data.length>0)
          {
            $scope.productExist = true;
            toastr.error($filter('translate')('errorVidRabotaExist_p'));


          }else{
            $scope.productExist = false;
          }
        }, function (data, status, headers, config) {
          console.log(status);
        });


      }
    }



    $scope.checkOpis = function (){
      if($scope.Products.Decsription == null || $scope.Products.Decsription == ""){
        toastr.error($filter('translate')('errorOpis_p'));

      }
    }

    $scope.checkTip = function (){
      if($scope.Products.ProductTypeID == null || $scope.Products.ProductTypeID == ""){
        toastr.error($filter('translate')('errorTipRabota_p'));
        toastr.error($filter('translate')('errorTipRabota_p'));

      }
    }


  ///////////////////////////////// Snimi Vid Rabota ////////////////////////////////


    console.log("zz" ,$scope.Products.ProductTypeID)

    $scope.vidRabotaSave = function () {

      var item={}
      item.Type="U";
      item.ProductTypeID =$scope.Products.ProductTypeID ;
      item.ProductID = $scope.Products.ProductID;
      item.Description= $scope.Products.Decsription ;
      if($scope.Products.Status==true)
      {
        item.Status="1";
      }
      else
      {
        item.Status="0";
      }
      item.OpeningDate=$filter('date')( $scope.Products.OpeningDate, "yyyy-MM-dd");
      if(item.ClosingDate!=null)
      {
        item.ClosingDate=$filter('date')(   $scope.Products.ClosingDate, "yyyy-MM-dd");
      }
     // console.log("Item",item);
      gatewayService.request("/api/Products/1/ProductsFetchByProductIDProductTypeID?ProductTypeID="+$scope.Products.ProductTypeID+"&ProductID="+$scope.Products.ProductID, "GET").then(function (data, status, heders, config)
      {


        if(data.length>0)
        { //console.log("dat",data);
          $scope.productExist = false;

          gatewayService.request("/api/Products/1/ProductsUpdate", "POST",item).then(function (data, status, heders, config)
          {
           // $route.reload();
            console.log("sel111",$scope.item.selected);
            $scope.item.selected={ProductTypeID:item.ProductTypeID,ProductID: item.ProductID,Description:item.Description};
            console.log("sel",$scope.item.selected);
            toastr.success('Записот е успешно уреден!', '');
          }, function (data, status, headers, config) {
            console.log(status);
          });


          // console.log(item);
         // $scope.products.push(item);
        }
        else
        {
         // console.log("pro", $scope.Products);  console.log("ii", item)//return false;
          //item.ProductTypeID =$scope.Products.ProductTypeID.ProductTypeID ;

          item.Type="I";
          gatewayService.request("/api/Products/1/ProductsInsert", "POST",item).then(function (data, status, heders, config)
          {
           // console.log("Item",item);
           // console.log("data",data);
            $route.reload();

            $scope.item.selected={ProductTypeID:item.ProductTypeID,ProductID: item.ProductID,Description:item.Description};
            toastr.success('Записот е успешно снимен!', '');
          }, function (data, status, headers, config) {
            console.log(status);
          });


        //  $scope.products.push(item);
        }
      }, function (data, status, headers, config) {
        console.log(status);
      });
    }
    /////////////////////////////////////// Inicijalizacija na OpeningDate na denes /////////////////////////////////
    $scope.init = function () {
      $scope.Products.OpeningDate = new Date();

    }

    $scope.reloadPage = function(){window.location.reload();}

    /////////////////////////////////////// Button Otkazi /////////////////////////////////

    $scope.cancel=function () {
      $scope.Products.ProductID=null;
      $scope.Products.ProductTypeID=null;
      $scope.Products.Decsription=null;
      $scope.Products.Status=true;
      $scope.Products.OpeningDate=new Date();
      $scope.Products.ClosingDate="";
      $route.reload();
    }


    //////////////////////////////////// Prebaruvaj Vid rabota ////////////////////////////////

      $scope.fetchProducts = function(products){
        $scope.hasNew=false;
        $scope.hasSelected=true;
        $scope.flag=true;
        console.log("Product", products);

      $scope.Products=products;
        console.log("zz11", $scope.Products.ProductTypeID   )



      $scope.Products.ProductID=products.ProductID;
      $scope.Products.Decsription=products.Description;
      if(products.Status==0)
      {
        $scope.Products.Status=false;

      }
      else
      {
        $scope.Products.Status=true;
      }
      $scope.Products.OpeningDate=products.OpeningDate;
      $scope.Products.ClosingDate=products.ClosingDate;


     gatewayService.request("/api/ProductBody/1/ProductBodyFetchByIdType?ProductTypeID="+products.ProductTypeID+"&ProductID="+products.ProductID, "GET").then(function (data, status, heders, config) {

       $scope.productBody = data;
       $scope.productBodyNew={};
       $scope.selectedRow=null;
       $scope.lastId = 0;
       for (var i = 0; i<$scope.productBody.length; i++){
         // $scope.productBody[i].isOld = true;

          if($scope.productBody[i].FieldID > $scope.LastId){
            $scope.lastId = $scope.productBody[i].FieldID;
          }

       }

     //  console.log( $scope.productBody);
       //$scope.products = data;
      //  $scope.getBody();
      }, function (data, status, headers, config) {
        console.log(status);
      });

    }





    $scope.getBody = function(){

      /*    gatewayService.request("/api/Products/1/ProductsFetchByProductType?ProductTypeID="+products, "GET").then(function (data, status, heders, config) {
       console.log("data" ,data);

       //$scope.products = data;

       }, functiogetBody();n (data, status, headers, config) {
       console.log(status);
       });*/
    }


    $scope.AddProductBody=function () {
      $scope.pom=[];
      for (var i = 0; i<$scope.productBody.length; i++){

        if(!($scope.productBody[i].isOld == true))
        {
          $scope.pom.push($scope.productBody[i]);

        }

      }
     // console.log($scope.pom);
     //  console.log("pid",$scope.Products.ProductID);
      //console.log("pid",$scope.Products.ProductTypeID);
      for(var i=0; i<$scope.pom.length;i++)
      {
        $scope.pb={};
        $scope.pb.Type="I";
        $scope.pb.ProductTypeID=$scope.Products.ProductTypeID;
        $scope.pb.ProductID=$scope.Products.ProductID;
        $scope.pb.FieldID=$scope.pom[i].FieldID;
        $scope.pb.FieldName=$scope.pom[i].FieldName;
        $scope.pb.Mandatory=$scope.pom[i].Mandatory;
        $scope.pb.FieldType=$scope.pom[i].FieldType;
        $scope.pb.FieldLength=$scope.pom[i].FieldLength;
        $scope.pb.ControlType="";
        $scope.pb.FillApi=$scope.pom[i].FillApi;
        $scope.pb.DefaultValue=$scope.pom[i].DefaultValue;
        $scope. pb.FieldDescription=$scope.pom[i].FieldDescription;


        gatewayService.request("/api/ProductBody/1/ProductBodyInsertUpdate1", "POST", $scope.pb).then(function (data, status, heders, config)
        {

        }, function (data, status, headers, config) {
          console.log(status);
        });


      }

      if($scope.deleted.length>0)
      {
        for(var i=0; i<$scope.deleted.length;i++)
        {
          $scope.pb={};
          $scope.pb.ProductTypeID=$scope.deleted[i].ProductTypeID;
          //console.log($scope.deleted[i].ProductTypeID);
          $scope.pb.ProductID=$scope.deleted[i].ProductID;
          $scope.pb.FieldID=$scope.deleted[i].FieldID;



          gatewayService.request("/api/ProductBody/1/ProductBodyDelete?ProductTypeID="+$scope.pb.ProductTypeID+"&ProductID="+$scope.pb.ProductID+"&FieldID="+  $scope.pb.FieldID, "GET").then(function (data, status, heders, config)
          {

          }, function (data, status, headers, config) {
            console.log(status);
          });


        }

      }
      $scope.deleted=[];
      toastr.success('Записот е успешно снимен!', '');
      $route.reload();


    }



    //////////////////////////////////// Field Functions //////////////////////////

    $scope.FieldTypes = function () {
      gatewayService.request("/api/ProductBody/1/FieldTypeFetch", "GET").then(function (data, status, heders, config) {
        //  console.log("data" ,data);

        $scope.fieldTypes = data;

      }, function (data, status, headers, config) {
        console.log(status);
      });

    }

    $scope.FieldTypes();


    $scope.FieldApis = function () {
      gatewayService.request("/api/ProductBody/1/FieldApiFetch", "GET").then(function (data, status, heders, config) {
        //  console.log("data" ,data);

        $scope.fieldApis = data;

      }, function (data, status, headers, config) {
        console.log(status);
      });

    }

    $scope.FieldApis();


    $scope.cancelProductBody=function () {
      $route.reload();
    }


/////////////////////////////////////////////// Fetch Table Columns //////////////////////////////////////////

    $scope.TableColumns = function (pt) {
      gatewayService.request("/api/ProductTypes/1/ProductTypes_FetchWorkingTable?ProductTypeID="+pt.ProductTypeID, "GET").then(function (data, status, heders, config) {
        //  console.log("data" ,data);

        $scope.WorkingTable = data;

        //console.log(data);

        gatewayService.request("/api/ProductTypes/1/ProductTypes_FetchTableColumns?TableName="+ $scope.WorkingTable, "GET").then(function (data, status, heders, config) {
          //  console.log("data" ,data);


          if(data.length<=0)
          {
            toastr.error("Не постои работната табела "+$scope.WorkingTable+"!");

            $scope.tableColumns=[];
          }
          else {
            $scope.tableColumns=data;
            $scope.tableColumns.splice($scope.tableColumns, 1);
          }

        }, function (data, status, headers, config) {
          console.log(status);
        });



      }, function (data, status, headers, config) {
        console.log(status);
      });

    }

/////////////////////////// sort function ///////////////////////
    $scope.sort = function(keyname){
      $scope.sortKey = keyname;   //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      $scope.verify = ! $scope.verify;
      // console.log("verify: ", $scope.verify);
    }


    // All tooltips

    $scope.tooltip = {

      "title": "Вид на работа содржи 6 цифри!",
      "checked": false
    };

    // var tooltipSave = $tooltip(element, {title: 'Сними'});



    $scope.tooltipDelete = {

      "title": "Избриши",
      "checked": false
    };



    $scope.change=function (item) {
      console.log("it",item)
      $scope.Products.ProductTypeID=item.ProductTypeID;
    }




    $scope.selectedRow = null;  // initialize our variable to null

    $scope.setClickedRow = function(index){  //function that sets the value of selectedRow to current index
      $scope.selectedRow = ($scope.selectedRow == index) ? null : index;
      console.log("this is selected item: ",index);
      $scope.temp=index;
    };

    $scope.previewForEdit = function(item) {
      console.log("selectedRow",$scope.selectedRow);
      if($scope.selectedRow!=null) {
        console.log("this is the item: ", item);
        $scope.productBodyNew = item;
        $scope.productBodyNew.ProductBodyID = item.ProductBodyID;
        console.log(item.Mandatory);
        if (item.Mandatory == "М") {
          $scope.productBodyNew.Mandatory = true;
          //  $scope.productBody[$scope.selectedRow]="M";
          console.log("Mandatory");
        }
        else {
          $scope.productBodyNew.Mandatory = false;
          // $scope.productBody[$scope.selectedRow]="O";
        }
        if ($scope.productBodyNew.Mandatory == true) {
          $scope.productBody[$scope.selectedRow].Mandatory = "M";
        }
        else {
          $scope.productBody[$scope.selectedRow].Mandatory = "O";
        }
      }
      else {
        $scope.productBodyNew={};
      }

    }
    $scope.enableAPI=false;
    $scope.API="Изворна листа API";
    $scope.disableFields=function (item) {
      //console.log("selektiraniot",$scope.API);
      if(!(item=="oButtonSuccess" || item=="oDropDown" ))
      {
        $scope.enableAPI=true;
      }
      else
      {
        $scope.enableAPI=false;
      }

      if(item=="oButtonSuccess")
      {
        $scope.API="Action API";
      }
      else {
        $scope.API="Изворна листа API";
      }
    }



    $scope.up=function () {

      if($scope.selectedRow!=null)
      {
        console.log($scope.selectedRow);
        if($scope.productBody[$scope.selectedRow-1]!=null)
        {
          console.log("Ima nad nego");
          gatewayService.request("/api/ProductBody/1/ProductBody_FieldIDChangePosition?Type=U&FieldID="+$scope.selectedRow+"&ProductTypeID="+$scope.productBody[$scope.selectedRow].ProductTypeID+"&ProductID="+$scope.productBody[$scope.selectedRow].ProductID+"&ProductBodyID="+$scope.productBody[$scope.selectedRow].ProductBodyID, "GET").then(function (data, status, heders, config) {
            //  console.log("data" ,data);

            console.log("success");
        //    $scope.pom={};
         //   $scope.pom= $scope.productBody[$scope.selectedRow-1];
         //   $scope.productBody[$scope.selectedRow-1]= $scope.productBody[$scope.selectedRow];
        //    $scope.productBody[$scope.selectedRow]= $scope.pom;
        //    $scope.pom={};
            $scope.selectedRow=$scope.selectedRow-1;


          }, function (data, status, headers, config) {
            console.log(status);
          });

        }
      }
    }

    $scope.down=function () {

      if($scope.selectedRow!=null)
      {
        console.log($scope.selectedRow);
        if($scope.productBody[$scope.selectedRow+1]!=null)
        {
          console.log("Ima pod nego");
          gatewayService.request("/api/ProductBody/1/ProductBody_FieldIDChangePosition?Type=D&FieldID="+$scope.selectedRow+"&ProductTypeID="+$scope.productBody[$scope.selectedRow].ProductTypeID+"&ProductID="+$scope.productBody[$scope.selectedRow].ProductID+"&ProductBodyID="+$scope.productBody[$scope.selectedRow].ProductBodyID, "GET").then(function (data, status, heders, config) {
            //  console.log("data" ,data);

            console.log("success");
            $scope.pom={};
            $scope.pom= $scope.productBody[$scope.selectedRow+1];
            $scope.productBody[$scope.selectedRow+1]= $scope.productBody[$scope.selectedRow];
            $scope.productBody[$scope.selectedRow]= $scope.pom;
            $scope.pom={};
            $scope.selectedRow=$scope.selectedRow+1;


          }, function (data, status, headers, config) {
            console.log(status);
          });

        }
      }
    }


  });

