'use strict';
angular.module('adminBankaFrontendApp')
  .controller('adminBaranjaCtrl', function($scope, gatewayService, $filter, toastr, $route, $rootScope, ngDialog, $parse) {

    //Za prikaz na info
    $scope.KorisnikPrikazInfo={};
    $scope.Korisnik={};
    $scope.prikazNaFormaDinamichka=false;
    //Flag za enable i dable na kopceto prikazi
    $scope.Flag_Prikazhi = true;

    //Prebaruvanje na komitentot
    $scope.valueForSearch="Единствен број"
    $scope.flagS="0";
    $scope.Komitenti={};
    $scope.SearchValue="";


    //Podatoci za polni tabela
    $scope.loading = false;
    $scope.tmp={};
    $scope.showDir=false;

    //Flag so kazuva dali ima nselektirano tip na produkt
    $scope.flagSelektiranTip=true;


    $scope.a=true;

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
        $scope.a=true;
        $scope.SearchValue="";
        $scope.Komitenti={};
      }
      else if(val=="1")
      {
        $scope.valueForSearch="Име/Назив/Презиме";
        $scope.flagS="1";
        $scope.a=false;
        $scope.SearchValue="";
        $scope.Komitenti={};
      }
    }

    $scope.searchRecord=function (val) {
      if(val=="" || val== null)
      {
        toastr.error("Внесете податоци за пребарување!")
      }
      else
      {
        console.log("flag", $scope.flagS)
        console.log("val", $scope.valueForSearch)
        gatewayService.request("/api/Baranja/1/FetchKomitentiCoreIeBanking?Type="+$scope.flagS+"&Value="+ val, "GET").then(function (data, status, heders, config) {
          //    console.log(data)
          if(data.length<1)
          {
            toastr.warning("Не постојат податоци.");
          }
          $scope.Komitenti=data;
          console.log(data);

        }, function (data, status, headers, config) {
          console.log(status);

        });


      }

    }



    //Polnenje na polinjata so podatoci za komitentot
    $scope.fetchKomitent=function (val) {
      $scope.Flag_Prikazhi = false;

      $scope.Korisnik={};
      $scope.Korisnik = angular.fromJson(val);
      $scope.KorisnikPrikazInfo.embg=$scope.Korisnik.EdinstvenBroj;
      $scope.KorisnikPrikazInfo.ImePrezime=$scope.Korisnik.ImeNaziv+" "+$scope.Korisnik.Prezime;
      $scope.KorisnikPrikazInfo.TelefonskiBroj = $scope.Korisnik.Mobilen;
      $scope.KorisnikPrikazInfo.BrLicnaKarta = $scope.Korisnik.BrLicnaKarta;
      $scope.KorisnikPrikazInfo.Adresa = $scope.Korisnik.Adresa;
    }


    //FETCH NA SELEKTIRANIOT TIP NA RABOTA
    $scope.zemiSelektiranTipNaProdukt = function(item){
      $scope.selektiranTip="";
      $scope.selektiranTip = item;
      console.log("selektiranTip", $scope.selektiranTip);
      $scope.KorisnikPrikazInfo.ProductTypeId = item;
      $scope.KorisnikPrikazInfo.PTID=$scope.KorisnikPrikazInfo.ProductTypeId.substring(3, 5);
      console.log("Sub",$scope.KorisnikPrikazInfo.PTID);
      if($scope.selektiranTip == "" || $scope.selektiranTip == null)
      {
        $scope.flagSelektiranTip=true;
      }
      else
      {
        $scope.flagSelektiranTip=false;
      }


    };

    //FETCH NA PRODUCT TYPES ZA POLNENJE NA COMBOTO
    $scope.ProductTypes = function () {
      gatewayService.request("/api/ProductTypes/1/ProductTypesFetch", "GET").then(function (data, status, heders, config) {
        //  console.log("data" ,data);
        $scope.productTypes = data;

      }, function (data, status, headers, config) {
        console.log(status);
      });
    }
    $scope.ProductTypes();


    // PODATOCI ZA IDENTIFIKACIJA NA KORISNIK PO EMBG
    $scope.zemiPodatociPo_EMBG = function(embg){

      // console.log("vlezeno vo proverka embg printa korisnik ",$scope.korisnik);
      gatewayService.request("/api/Baranja/1/EbankingFetchZaKomitent?EdinstvenBroj="+embg, "GET").then(function (data, status, heders, config) {
        console.log("tuka: ",data);
        $scope.KorisnikPrikazInfo.korisnichkoIme = data.Table[0].KorisnickoIme;
        //$scope.korisnik.BrBaranje = data.Table[0].BrBaranje;

        $scope.KorisnikPrikazInfo.EdinstvenBroj = $scope.Korisnik.EdinstvenBroj;


        //console.log("broj na baranje: ",$scope.korisnik.BrBaranje);
        $scope.Korisnik.datum = $filter('date')(new Date(),"yyyy-MM-dd");
        $scope.KorisnikPrikazInfo.DatumInsert = $scope.Korisnik.datum;

        polniTabela(); /// povik do proceduri od core za polnenje tabela
      }, function (data, status, headers, config) {
        console.log(status);
      });
    };


    //  LICNI PODATOCI OD CORE ZA KORISNIK PO EMBG
    $scope.zemiPodatoci_CORE = function(embg){
      gatewayService.request("/api/Baranja/1/FetchPersonalInfo_CORE?EdinstvenBroj="+embg, "GET").then(function (data, status, heders, config) {
        console.log("LICHNI PODATOCI: ",data);
        $scope.KorisnikPrikazInfo.TelefonskiBroj = data.Table[0]['Mobilen'];
        $scope.Korisnik.BrLicnaKarta = data.Table[0]['BrLicnaKarta'];
        $scope.KorisnikPrikazInfo.Adresa = data.Table[0]['Adresa'];
      }, function (data, status, headers, config) {
        console.log(status);
      });
    };


    //TUKA SE POLNI TABELATA SO SMETKI
    function polniTabela(){

      $scope.loading = true;
      $scope.temp=[];
      $scope.dodadenaSmetka={};
      $scope.tmp={};
      $scope.final=[];
      $scope.tmp=$route.temp;

      console.log("tmp",$scope.tmp);

      gatewayService.request("/api/Baranja/1/FetchPartiieBankCore?EdinstvenBroj="+$scope.Korisnik.EdinstvenBroj, "GET").then(function (data, status, heders, config) {

        console.log("Core: ",data);
        $scope.loading = false;

        var the_string = 'o010005.TelefonskiBroj';

        // Get the model
        var model = $parse(the_string);
        model.assign($scope, "156156");

        $scope.TmpPodatoci = data;
        // $scope.temp=data;
        for(var i=0;i<data.length;i++)
        {
          console.log(data[i]);
          $scope.temp.push(data[i]);
        }

        console.log("Smetki na korisnikot", $scope.temp);


      }, function (data, status, headers, config) {
        console.log(status);
      });

      //Fetch partii od core
      // gatewayService.request("/api/Baranja/1/EbankingKorisniciServisFetch?EdinstvenBroj="+$scope.Korisnik.EdinstvenBroj, "GET").then(function (data, status, heders, config) {
      //
      //   console.log("Core: ",data);
      //
      //   var the_string = 'o010005.TelefonskiBroj';
      //
      //   // Get the model
      //   var model = $parse(the_string);
      //   model.assign($scope, "156156");
      //
      //   $scope.TmpPodatoci = data;
      //   // $scope.temp=data;
      //   for(var i=0;i<data.length;i++)
      //   {
      //     console.log(data[i]);
      //     $scope.temp.push(data[i]);
      //   }
      //
      //   console.log("Smetki na korisnikot", $scope.temp);
      //
      //
      // }, function (data, status, headers, config) {
      //   console.log(status);
      // });
      //
      // gatewayService.request("/api/Baranja/1/FetchPartiieBanking?EdinstvenBroj="+$scope.Korisnik.EdinstvenBroj, "GET").then(function (data, status, heders, config) {
      //   console.log("Ebanking: ",data);
      //   for(var i=0;i<data.length;i++)
      //   {
      //     console.log(data[i]);
      //     $scope.temp.push(data[i]);
      //   }
      //   console.log("temp",$scope.temp);
      //   $scope.loading = false;
      //
      // }, function (data, status, headers, config) {
      //   console.log(status);
      // });

      $scope.polniFinal();

    };


    $scope.polniFinal=function () {
      $scope.final=$scope.temp;
    }





    $scope.products={};


    //Fetch na site vidovi rabota
    $scope.productsFetch=function (selektiranTip) {
      gatewayService.request("/api/Products/1/ProductsFetchByProductType?ProductTypeID="+selektiranTip, "GET").then(function (data, status, heders, config) {
        $scope.products=data;
        console.log("data",data);
        $scope.showDir=true;
      }, function (data, status, headers, config) {
        console.log(status);
      });
     //  console.log("Y",y);
     //  $scope.products={};
     //  var getBaranjeType="";
     // // console.log("Types",$scope.productTypes)
     //  for(var i=0;i< $scope.productTypes.length;i++)
     //  {
     //  //  console.log("Tuka1", $scope.productTypes[i].ProductTypeID.substring(3,5))
     // //   console.log("Tuka2", $scope.selektiranTip)
     //    if($scope.productTypes[i].ProductTypeID.substring(3,5)==$scope.selektiranTip.substring(0,2))
     //    {
     //
     //   //   console.log("Tuka")
     //
     //      getBaranjeType=$scope.productTypes[i].ProductTypeID;
     //    }
     //  }
     //  gatewayService.request("/api/Products/1/ProductsFetchByProductType?ProductTypeID="+getBaranjeType, "GET").then(function (data, status, heders, config) {
     //    $scope.products=data;
     //    console.log("products",data);
     //    $scope.showDir=true;
     //  }, function (data, status, headers, config) {
     //    console.log(status);
     //  });
    }



    //Za dodavanje na nova partija
    $scope.info="";
    $scope.getInfo=function (partija) {

      if(partija.length==15)
      {

        //$scope.info="Naziv";
        gatewayService.request("/api/Baranja/1/ProveriDaliPostoiPartijaBIS?Partija="+partija, "GET").then(function (data, status, heders, config) {
          //console.log("data", data);

          if(data.length>0)
          {
            var jaima=false;
            for(var i=0;i<$scope.temp.length;i++)
            {
              if($scope.temp[i].Partija==partija)
              {
                jaima=true;

              }
              else
              {

              }
            }
            if(jaima)
            {
              $scope.info="Сметката е веќе внесена.";
              $scope.potpisnikFlag=true;
            }
            else {
              console.log("data",data[0])
              $scope.info=data[0].NazivPartija;
              $scope.potpisnikFlag=false;

              $scope.ePartija={};
              $scope.ePartija.Banka="";
              $scope.ePartija.OrgDel="";
              $scope.ePartija.Partija=data[0].Partija;
              $scope.ePartija.EdinstvenBroj=$scope.korisnik.embg;
              $scope.ePartija.ProductTypeID="";
              $scope.ePartija.ProductID="";
              $scope.ePartija.DatumInsert=new Date();
              $scope.ePartija.DatumInsert=$filter('date')( $scope.ePartija.DatumInsert, "yyyy-MM-dd");
              $scope.ePartija.DatumOtvaranje=new Date();
              $scope.ePartija.DatumOtvaranje=$filter('date')( $scope.ePartija.DatumOtvaranje, "yyyy-MM-dd");
              $scope.ePartija.DatumIstekuvanje="2050-12-31";
              $scope.ePartija.SifraServis="";
              $scope.ePartija.SifraStatus="V";
              $scope.ePartija.KorisnickoIme=$scope.korisnik.korisnichkoIme;
              $scope.ePartija.Lozinka="xxx";
              $scope.ePartija.VidRabota=data[0].ProductTypeID.substring(0,2);
              $scope.ePartija.ReferentInsert="";

                gatewayService.request("/api/Baranja/1/FetchUserePartii?EdinstvenBroj="+$scope.korisnik.embg, "GET").then(function (data, status, heders, config) {
                 if(data.length>0)
                 {
                   $scope.ePartija.DaliPrvoNajavuvanje=false;

                 }
                  else
                 {
                   $scope.ePartija.DaliPrvoNajavuvanje=true;
                 }

                }, function (data, status, headers, config) {
                  console.log(status);
                });

              console.log("partija nova",$scope.ePartija);

            }


          }
          else {
            $scope.info="Не постои таква сметка."
            $scope.potpisnikFlag=true;
          }

        }, function (data, status, headers, config) {
          console.log(status);
        });



      }
      else
      {
        $scope.info="";
      }
    }


    // $scope.setFlagToPrikazhi = function(){
    //   if($scope.korisnik.embg != null && $scope.form.$valid){
    //     $scope.Flag_Prikazhi = false;
    //   }
    //   else{
    //     toastr.error("Внесете податоци за пребарување.");
    //   }
    // };





  $scope.dodadiSmetka = function(smetka){

      // gatewayService.request("/api/Baranja/1/ProveriDaliPostoiSmetka?Partija="+smetka, "GET").then(function (data, status, heders, config) {
      //          if(data.Table.length != 0){
      //               toastr.success('Сметката е успешно додадена.');
      //              // console.log("************************");
      //              // console.log("Dali postoi takva smetka: ",data);
      //               $scope.novPotpisnik = data.Table[0];
      //               $scope.potpisnikFlag = false;
      //               $scope.temp.push($scope.novPotpisnik);
      //              // console.log("potpisnikFlag:",$scope.potpisnikFlag);
      //              // console.log("Nov Potpisnik:",$scope.novPotpisnik);
      //              // console.log("************************");
      //          }
      //          else{
      //               toastr.error('Сметката не постои.');
      //               $scope.potpisnikFlag = true;
      //          }
      //     }, function (data, status, headers, config) {
      //       console.log(status);
      //     });
        gatewayService.request("/api/Baranja/1/ePartiiInsert", "POST", $scope.ePartija).then(function (data, status, heders, config) {
              toastr.success("Сметката е успешно внесена");

        }, function (data, status, headers, config) {
          console.log(status);

        });

  }


  $scope.setirajFlagPotpisnik = function(){
      $scope.potpisnikFlag = false;
  }

 $scope.productBodyFetch = function () {
          gatewayService.request("/api/ProductBody/1/ProductBodyFetchByIdType?ProductTypeID="+$scope.type+"&ProductID="+$scope.value, "GET").then(function (data, status, heders, config) {
            $scope.FormaBody=data;
            console.log("Forma body:",$scope.FormaBody);

          }, function (data, status, headers, config) {
            console.log(status);
          });
        }

/////////////////////////// ***************** SNIMANJE NA BARANJA ******************/////////////////////////////////////////////
// {
//     "BrojBaranje":"",
//     "KorisnickoIme":"moki",
//     "DatumInsert":"2016-09-24",
//     "EMBG":"2409991470010",
//     "ProductID":"1111",
//     "OrgDel":"11111",
//     "Partija":"151515151515",
//     "Status_S":"1",
//     "DatumBaranje":"2016-09-24",
//     "ReferentInsert":"",
//     "Email":"momir@hotmail.com",
//     "SeriskiBrojSertifikat":"",
//     "Sertifikat":"",
//     "TelefonskiBroj":"072233296",
//     "Zabeleshka":"",
//     "Limit":"",
//     "StatusBaranje":"",
//     "Email_Adresa":"",
//     "Pregled_izveshtai":"",
//     "Pregled_nalozi":"",
//     "Vnesuvanje_nalozi_pp30":"",
//     "Prakjanje_nalozi":"",
//     "Vnesuvanje_nalozi_pp53":"",
//     "Potpishuvanje_nalozi":"",
//     "Vnesuvanje_nalozi_pp50":"",
//     "Pregled_na_izveshtai_depoziti":"",
//     "Pregled_na_izveshtai_krediti":"",
//     "Pregled_na_izveshtai_kartichki":""
// }
/////////END SNIMANJE BARANJA    /////////////////////


     $scope.old=[];
//////////////////////////// TUKA SE ZEMAAT PODATOCITE ZA PRIKAZ VO TABOVITE  ///////////////////////////////////////////////////////////////////////////////////////

//     $scope.previewForEdit = function(item){
//       if( $scope.selectedRow!=null
//       {      $scope.productbody=item;
//         $scope.prikazNaFormaDinamichka = true;
//         console.log("THIS IS SELECTED ITEM: ",item);
//       //  console.log("THIS IS SELECTED ITEM: ",$scope.KorisnikPrikazInfo.ProductTypeId);
//        // console.log("THIS IS SELECTED ITEM so substring: ",$scope.KorisnikPrikazInfo.ProductTypeId.substring(3,5));
//
//
//         gatewayService.request("/api/Baranja/1/EbankingKorisniciServis_FetchPrivilegii?EdinstvenBroj=" + item.EdinstvenBroj  + "&ProductTypeID=" +  $scope.KorisnikPrikazInfo.ProductTypeId.substring(3,5) + "&Partija=" + item.Partija, "GET").then(function (data, status, heders, config) {
//           console.log("Vrateni po datoci so PRIVILEGII: " ,data);
//           $scope.KorisnikPrikazInfo.Partija = item.Partija;
//
//           if(data.length != 0){
//             $scope.korisnik.BrBaranje = data[0]["BrojBaranje"];
//           }
//           else{
//             $scope.korisnik.BrBaranje = "";
//           }
//
//           $scope.finalno = {};
//           $scope.odobreni=[];
//           $scope.neodobreni=[];
//
//           for(var i = 0 ; i < data.length; i++){
//
//             if(data[i]["EdinstvenBroj"] == item.EdinstvenBroj && data[i]["Partija"] == item.Partija && data[i]["Partija"] == "1"){
//               var pomoshna="";
//               pomoshna = "o"+data[i]["ProductId"];
//
//               $scope.korisnik.Privilegii[i] = pomoshna;
//               console.log("TUKA SE POLNI SUBSTRING:", $scope.korisnik.Privilegii[i]);
//               $scope.finalno[pomoshna] = {
//                 Privilegii : true
//
//
//               }
//
//               $scope.odobreni.push( pomoshna);
//                 // $scope.finalno[pomoshna] = {
//                 //   isdisabled : true
//                 //
//                 // }
//
//               // if(data[i]["Status_S"]=="N")
//               // {
//               //   $scope.neodobreni.push( pomoshna);
//               // }
//               //
//
//
//               //console.log("final", $scope.finalno);
//               //console.log("old",$scope.old);
//               //$scope.finalno[pomoshna].Privilegii.attr('disabled', true);
//
//             }
//             $scope.zemiNovi();
//
//           }
//
//         }, function (data, status, headers, config) {
//           console.log(status);
//         });
//
//       }
//
//       else{
//         $scope.finalno={};
//         $scope.old=[];
//       }
//
//
// };
    //////////////////////////// TUKA SE ZEMAAT PODATOCITE ZA PRIKAZ VO TABOVITE  ///////////////////////////////////////////////////////////////////////////////////////

    $scope.previewForEdit = function(item){
      $scope.finalno = {};
      $scope.odobreni=[];
      $scope.neodobreni=[];
      $scope.sitevneseni=[];

      $scope.prikazNaFormaDinamichka = true;
      if( $scope.selectedRow!=null)
      {

        $scope.productbody=item;
        $scope.prikazNaFormaDinamichka = true;
        console.log("THIS IS SELECTED ITEM: ",item);
        console.log("TIP: ",$scope.KorisnikPrikazInfo.ProductTypeId.substring(3,5) );
      //  console.log("THIS IS SELECTED ITEM: ",$scope.KorisnikPrikazInfo.ProductTypeId);
       // console.log("THIS IS SELECTED ITEM so substring: ",$scope.KorisnikPrikazInfo.ProductTypeId.substring(3,5));


        gatewayService.request("/api/Baranja/1/EbankingKorisniciServis_FetchPrivilegii?EdinstvenBroj=" +$scope.KorisnikPrikazInfo.EdinstvenBroj  + "&ProductTypeID=" +  $scope.KorisnikPrikazInfo.ProductTypeId.substring(3,5) + "&Partija=" + item.Partija, "GET").then(function (data, status, heders, config) {
          console.log("Vrateni po datoci so PRIVILEGII: " ,data);
          $scope.KorisnikPrikazInfo.Partija = item.Partija;

          if(data.length != 0){
            $scope.KorisnikPrikazInfo.BrBaranje = data[0]["BrojBaranje"];
          }
          else{
            $scope.KorisnikPrikazInfo.BrBaranje = "";
          }



          for(var i = 0 ; i < data.length; i++){

            if(data[i]["EdinstvenBroj"] == +$scope.KorisnikPrikazInfo.EdinstvenBroj  && data[i]["Partija"] == item.Partija && data[i]["Privilegii"] == "1"){
              var pomoshna="";
              pomoshna = "o"+data[i]["ProductId"];

              // $scope.KorisnikPrikazInfo.Privilegii[i] = pomoshna;
              // console.log("TUKA SE POLNI SUBSTRING:", $scope.KorisnikPrikazInfo.Privilegii[i]);



              $scope.odobreni.push( pomoshna);
              var Sertifikat=data[i]["Sertifikat"];
              console.log("Sertifikat",Sertifikat)

              if(data[i]["Status_S"]=='O')
              {

                if(Sertifikat!= null || Sertifikat!="")
                {
                  console.log("1")
                  $scope.finalno[pomoshna]={
                    Sertifikat : Sertifikat,
                    Privilegii : true,
                    isDisabled: true
                  }

                }
                else {
                  console.log("2")
                  $scope.finalno[pomoshna]={

                    Privilegii : true,
                    isDisabled: true
                  }
                }
                $scope.odobreni.push(data[i]);
                $scope.sitevneseni.push(data[i]);

              }
              else if(data[i]["Status_S"]=='N')
              {

                console.log("1")
                  $scope.finalno[pomoshna]={
                    Sertifikat : Sertifikat,
                    Privilegii : true,
                    isDisabled: false
                  }

                }
              else {
                console.log("1")
                $scope.finalno[pomoshna]={

                  Privilegii : true,
                  isDisabled: false
                }
                $scope.neodobreni.push(data[i]);
                $scope.sitevneseni.push(data[i]);



              }




              console.log("final", $scope.finalno);
              console.log("old",$scope.old);
              //$scope.finalno[pomoshna].Privilegii.attr('disabled', true);

            }
           // $scope.zemiNovi();

          }

        }, function (data, status, headers, config) {
          console.log(status);
        });

      }

      else{
        $scope.finalno={};
        $scope.old=[];
        $scope.products={};
        $scope.showDir=false;
      }
    };
    // $scope.previewForEdit = function(item) {
    //
    //   if ($scope.selectedRow != null) {
    //     $scope.showDir=true;
    //     $scope.productbody = item;
    //     if($scope.selektiranTip=="" || $scope.selektiranTip==null)
    //     {
    //       $scope.selektiranTip=item.ProductTypeID;
    //       $scope.KorisnikPrikazInfo.ProductTypeId=item.ProductTypeID;
    //       $scope.KorisnikPrikazInfo.PTID=$scope.KorisnikPrikazInfo.ProductTypeId.substring(0, 2);
    //       console.log("Sub",$scope.KorisnikPrikazInfo.PTID);
    //     }
    //
    //
    //     console.log("Izbranata smetka", item);
    //
    //     $scope.prikazNaFormaDinamichka = true;
    //     // // console.log("THIS IS SELECTED ITEM: ", item);
    //     // console.log("THIS IS SELECTED ITEM: ", $scope.KorisnikPrikazInfo.ProductTypeId);
    //     // // console.log("THIS IS SELECTED ITEM so substring: ", $scope.KorisnikPrikazInfo.ProductTypeId.substring(3, 5));
    //     // gatewayService.request("/api/Baranja/1/EbankingKorisniciServis_FetchPrivilegii?EdinstvenBroj=" + item.EdinstvenBroj + "&ProductTypeID=" +$scope.KorisnikPrikazInfo.PTID  + "&Partija=" + item.Partija, "GET").then(function (data, status, heders, config) {
    //     //   console.log("Vrateni podatoci so PRIVILEGII: ", data);
    //     //   $scope.KorisnikPrikazInfo.Partija = item.Partija;
    //     //
    //     //   if (data.length != 0) {
    //     //     $scope.KorisnikPrikazInfo.BrBaranje = data[0]["BrojBaranje"];
    //     //   }
    //     //   else {
    //     //     $scope.KorisnikPrikazInfo.BrBaranje = "";
    //     //   }
    //     //
    //     //   $scope.finalno = {};
    //     //   $scope.odobreni=[];
    //     //   $scope.neodobreni=[];
    //     //   $scope.sitevneseni=[];
    //     //
    //     //
    //     //   for (var i = 0; i < data.length; i++) {
    //     //
    //     //
    //     //     if (data[i]["EdinstvenBroj"] == item.EdinstvenBroj && data[i]["Partija"] == item.Partija && data[i]["Privilegii"] == "1" ) {
    //     //       var pomoshna = "";
    //     //       pomoshna = "o" + data[i]["ProductId"];
    //     //      // console.log("pom",pomoshna);
    //     //       $scope.korisnik.Privilegii[i] = pomoshna;
    //     //      // console.log("TUKA SE POLNI SUBSTRING:", $scope.korisnik.Privilegii[i]);
    //     //       $scope.finalno[pomoshna] = {
    //     //         Privilegii: true
    //     //       }
    //     //      if("status",data[i]["Status_S"]=='O')
    //     //      {
    //     //        $scope.odobreni.push(data[i]);
    //     //        $scope.sitevneseni.push(data[i]);
    //     //      }
    //     //       else if("status",data[i]["Status_S"]=='N')
    //     //      {
    //     //        $scope.neodobreni.push(data[i]);
    //     //        $scope.sitevneseni.push(data[i]);
    //     //      }
    //     //
    //     //
    //     //     }
    //     //
    //     //   }
    //
    //     // }, function (data, status, headers, config) {
    //     //   console.log(status);
    //     // });
    //   }
    // else{
    //     $scope.finalno={};
    //     $scope.old=[];
    //   }
    // };
//

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $scope.zemiNovi=function () {
      console.log("old",$scope.old);
    }






    $scope.getDigit = function(prod){
      if($scope.KorisnikPrikazInfo.ProductTypeId!=null && $scope.KorisnikPrikazInfo.ProductTypeId!="") {
        if ($scope.KorisnikPrikazInfo.ProductTypeId.substring(3, 5) == prod.ProductTypeID.substring(0, 2)) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return true;
      }

    }


// //////////////////////////////// Fetch na Products //////////////////////////////////
//
//     $scope.GetProducts = function () {
//       gatewayService.request("/api/Products/1/ProductsFetch", "GET").then(function (data, status, heders, config) {
//
//         $scope.products = data;
//         console.log("Products",$scope.products);
//
//       }, function (data, status, headers, config) {
//         console.log(status);
//       });
//
//     }

//    $scope.GetProducts();
    $scope.setVisibility = function(){
      $scope.flagVisibilityTabs = true;
      console.log("povikano flag visibility.");
    };



  $scope.user = {
    items: []
  };
  //$scope.prodID - DEFINIRANA VO DIREKTIVATA dirSearchTipVid.js zaradi zemanje na selectirana vrednost i upotreba vo procedura za vlechenje podatoci od baza
  $scope.flag = true;

  $scope.fetchFromBody = function(){
 	  $scope.flag = false;
  }


  $scope.funkcija = function(){
  	 //$scope.ListtoSave.push(item.ProductBodyID);
  	 //console.log("$scope.user.items[i]: ",$scope.user.items[i]);
	for(var i = 0 ; i < $scope.user.items.length; i++){
		gatewayService.request("/api/ProductBody/1/admin_baranja_insert?productBodyID="+$scope.user.items[i]+"&productID=1111", "GET").then(function (data, status, heders, config) {
          //console.log("uspeshen zapis. ");
        }, function (data, status, headers, config) {
             console.log(status);
     });
	}
  		$route.reload();
        toastr.success('Записот е успешно снимен.');
        $scope.flag = true;
  }

  $scope.proverka = function(){
  		//console.log("PRED DA ZEME OD BAZA: ",$scope.user.items);
  		//console.log("product ID: ",$scope.user.items);
  		gatewayService.request("/api/ProductBody/1/admin_Baranja_Fetch_Inserted", "GET", $scope.prodID).then(function (data, status, heders, config) {

		  $scope.user.items = [];

        for (var i = data.length - 1; i >= 0; i--) {
    			$scope.user.items.push(data[i].ProductBodyID);
    		}

		  console.log("ZEMENO OD BAZA. ",$scope.user.items);
        }, function (data, status, headers, config) {
             console.log(status);
     	});

  }

////////////////////////  TUKA ZA SELECT OD TABELATA   ///////////////////
$scope.idSelectedVote = null;
$scope.setSelected = function (idSelectedVote) {
   $scope.idSelectedVote = idSelectedVote;
};


    $scope.selectedRow = null;  // initialize our variable to null
    $scope.setClickedRow = function(index){  //function that sets the value of selectedRow to current index
      $scope.selectedRow = ($scope.selectedRow == index) ? null : index;
     // console.log("this is selected item: ",index);
    };








  ///////////////  SNIMANJE NA BARANJE ////////////////////////////////////
  $scope.snimiBaranje = function(){

        //  console.log("Odobreni", $scope.odobreni);
         // console.log("Neodobreni", $scope.neodobreni);
          console.log("finalno", $scope.finalno);
          console.log("Site vneseni",$scope.sitevneseni);
          var authData = JSON.parse(localStorage.getItem("loginData"));
          console.log(authData);


          var noviBaranja=[];


            for(var keyName in $scope.finalno){
              var key=keyName ;
              var value=angular.fromJson( $scope.finalno[keyName ]);


              console.log("val",value);
              for(var i=0;i<$scope.neodobreni.length;i++)
              {
                if(key.substring(1,7)== $scope.neodobreni[i].ProductId)
                {
                 // console.log("idneod" , $scope.neodobreni[i].Privilegii);
                 // console.log("idval" , value.Privilegii);
                  if((value.Privilegii == true && $scope.neodobreni[i].Privilegii == '0')|| (value.Privilegii == false && $scope.neodobreni[i].Privilegii == '1'))
                  {
                    var obj={};
                    obj=$scope.neodobreni[i];
                    if(value.Privilegii==true)
                    {
                      obj.Privilegii='1';
                    }
                    else if(value.Privilegii==false)
                    {
                      obj.Privilegii='0';
                    }
                    console.log("obj",obj);
                    gatewayService.request("/api/Baranja/1/ProductTypeBaranjaUpdate", "POST", obj).then(function (data, status, heders, config) {


                    }, function (data, status, headers, config) {
                      console.log(status);

                    });
                  }



                }
              }
              var old=false;

              for(var i=0;i<$scope.sitevneseni.length;i++)
              {
                if(key.substring(1,7) == $scope.sitevneseni[i].ProductId) {
                  var old=true;

                  break;

                }


              }

              if(old==false) {

                    var obj={};
                    obj.BrojBaranje="";
                    obj.KorisnickoIme=$scope.KorisnikPrikazInfo.korisnichkoIme;
                    obj.DatumInsert=$filter('date')( $scope.KorisnikPrikazInfo.DatumInsert, "yyyy-MM-dd");
                    obj.EdinstvenBroj= $scope.KorisnikPrikazInfo.EdinstvenBroj;
                    obj.ProductId=key.substring(1,7);
                    obj.ProductTypeId=$scope.selectiranTip;
                    obj.OrgDel=authData.OrgDel;
                    obj.Partija=  $scope.KorisnikPrikazInfo.Partija;
                    obj.Status_S="N";
                    obj.DatumBaranje=$filter('date')( $scope.KorisnikPrikazInfo.DatumInsert, "yyyy-MM-dd");
                    obj.ReferentInsert=authData.Ime+" "+authData.Prezime ;
                    obj.Email=$scope.finalno['o'+obj.ProductId].Email;
                    if(obj.ProductId=='000003')
                    {
                      obj.Sertifikat=$scope.finalno['o'+obj.ProductId].Sertifikat.replace(/[\s]/g, '');
                    }
                    else {
                      obj.SeriskiBrojSertifikat="";
                    }

                    obj.SeriskiBrojSertifikat ="";
                    obj.SertifikatOTP="";
                    obj.TelefonskiBroj=$scope.finalno['o'+obj.ProductId].TelefonskiBroj;
                    obj.Zabeleska="";
                    obj.Limit="";
                    obj.StatusBaranje="Чекање за одобрување";
                    obj.Privilegii="1";
                    obj.SeriskiBrojSertifikat="";
                    obj.ReferentOdobril="";
                    obj.DatumOdobruvanje="";
                    obj.BrojDogovor="";
                    obj.OrgDelUkinuvanje="";
                    obj.ReferentUkinal="";
                    obj.DatumUkinuvanje="";
                    obj.BrojBaranjeZaUkinuvanje=""

                //     console.log("Novi",noviBaranja);
               //   console.log(key.substring(1,7));
                //  console.log(JSON.stringify(value));


                noviBaranja.push(obj);
              }



             }
            console.log("Novi",noviBaranja);

            $scope.zaVnesuvanje = {
              Baranja: noviBaranja,
              OrgDel: authData.OrgDel
            }

            console.log('obj',$scope.zaVnesuvanje);
            gatewayService.request("/api/Baranja/1/vnesiBaranja", "POST",$scope.zaVnesuvanje).then(function (data, status, heders, config) {
              toastr.success("Барањата се успешно внесени!")
              $route.reload();

            }, function (data, status, headers, config) {
              console.log(status);

            });
  }

  $scope.test = function () {
  	   console.log($scope.user.items);
  };



  $scope.prikazhi = function(){
    ngDialog.open({ template: 'templateId', className: 'ngdialog-theme-default' });
  };

    $scope.cancel=function () {
      $route.reload();
    }












  });
