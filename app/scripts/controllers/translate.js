angular.module('angularTranslateApp', ['pascalprecht.translate'])
  .config(function($translateProvider) {


    ////////////////////////////////  Prevod za forma Vid rabota //////////////////////////////////////
    $translateProvider.translations('mk', {
      'lblTipRabota_p': 'Тип на продукт',
      'lblVidRabota_p': 'Вид на работа',
      'lblOpis_p': 'Опис',
      'lblStatus_p': 'Статус',
      'lblDatumOtvaranje_p': 'Датум отварање',
      'lblDatumZatvaranje_p': 'Датум затворање',
      'btnSnimi_p': 'Сними',
      'btnOtkazi_p': 'Откажи',
      'lblLabela_p': 'Лабела',
      'lblPoleTabela_p': 'Поле во табела',
      'lblTipPole_p': 'Тип на контрола',
      'lblDolzina_p': 'Должина',
      'lblVrednost_p': 'Основна вредност',
      'lblZad_p': 'M/О',
      'lblRedosled_p': 'Редослед',
      'headerVidoviRabota_p': 'Вид на работа',
      'headerSnimiZapis_p': 'Сними запис',
      'searchVidRabota_p': 'Пребарај по Вид на работа/Опис...',
      'searchApi_p': 'Пребарај API...',
      'lblAktiven_p': 'Активен',
      'errorTipRabota_p': 'Тип на работа е задолжително поле!',
      'errorOpis_p': 'Опис е задолжително поле!',
      'errorVidRabota_p': 'Вид работа е задолжително поле!',
      'errorVidRabotaExist_p': 'Видот на работа постои!',
      'meniVidoviRabota_p': 'Вид на работа',
      'zadolzitelno_p': 'З',
      'opcionalno_p': 'О',
      'zacuvanZapis_p' : 'Записот е успешно снимен!',
      'lblHeaderTip_pt': 'Тип на продукт',
      'lblTip_pt': 'Тип на продукт',
      'lblOpis_pt': 'Опис',
      'lblWorkingTbl_pt': 'Работна табела',
      'lblStatus_pt': 'Статус',
      'lblActive_pt': 'Активен',
      'lblDateOpen_pt': 'Датум отворање',
      'lblDateClose_pt': 'Датум затворање',
      'lblFormName_pt1': 'Сними запис',
      'lblFormName_pt2': 'Преглед на записи',
      'btnOtkazhi_pt': 'Откажи',
      'btnSnimi_pt': 'Сними',
      'lblProductTupeTbl_pt': 'Тип на продукт',
      'lblAction_pt':'Акција',
      'lblEdit_pt':'Измени',
      'lblSave_pt':'Зачувај',
      'lblTipExist_pt':'Типот на продукт постои.',
      'lblWTableError_pt':'Работна табела е задолжително поле.',
      'lblOpisError_pt':'Опис е задолжително поле.',
      'lblTipError_pt':'Тип на продукт е задолжително поле.',
      'lblDbError_pt': 'Грешка при запишување во база.',
      'lblDbSuccess_pt':'Записот е успешно снимен.',

      'lblTipPodatok_p':"Тип на податок",
      'lblIzvornaLista_p':'Изворна листа API',

      'lblDbSuccessEdit_pt':'Записот е успешно изменет.',
      'placeholderSearch_pt': 'Пребарувај ...'



    });

    $translateProvider.translations('en', {
      'lblTipRabota_p': 'Product type',
      'lblVidRabota_p': 'Product',
      'lblOpis_p': 'Description',
      'lblStatus_p': 'Status',
      'lblDatumOtvaranje_p': 'Opening date',
      'lblDatumZatvaranje_p': 'Closing date',
      'btnSnimi_p': 'Submit',
      'btnOtkazi_p': 'Cancel',
      'lblLabela_p': 'Label',
      'lblPoleTabela_p': 'Field name',
      'lblTipPole_p': 'Field type',
      'lblDolzina_p': 'Length',
      'lblVrednost_p': 'Default value',
      'lblZad_p': 'Mandatory ',
      'lblRedosled_p': 'FieldID',
      'headerVidoviRabota_p': 'Products',
      'headerSnimiZapis_p': 'Сними запис',
      'searchVidRabota_p': 'Search by Product/Description...',
      'searchApi_p': 'Search API...',
      'lblAktiven_p': 'Active',
      'errorTipRabota_p': 'Product type is mandatory!',
      'errorOpis_p': 'Description is mandatory!',
      'errorVidRabota_p': 'Product is mandatory!',
      'errorVidRabotaExist_p': 'This product exist!',
      'meniVidoviRabota_p': 'Products',
      'zadolzitelno_p': 'M',
      'opcionalno_p': 'O',
      'lblHeaderTip_pt': 'Product types',
      'lblTip_pt': 'Product type',
      'lblOpis_pt': 'Description',
      'lblWorkingTbl_pt': 'Working table',
      'lblStatus_pt': 'Status',
      'lblActive_pt': 'Active',
      'lblDateOpen_pt': 'Opening date',
      'lblDateClose_pt': 'Closing date',
      'lblFormName_pt1': 'Create input',
      'lblFormName_pt2': 'Preview inputs',
      'btnOtkazhi_pt': 'Cancel',
      'btnSnimi_pt': 'Submit',
      'lblProductTupeTbl_pt': 'Product type',
      'lblAction_pt':'Action',
      'lblEdit_pt':'Edit',
      'lblSave_pt':'Save',
      'lblTipExist_pt':'This product type already exist. ',
      'lblWTableError_pt':'Working table is mandatory field.',
      'lblOpisError_pt':'Description is mandatory field.',
      'lblTipError_pt':'Product type is mandatory field.',
      'lblDbError_pt':'Database error while saving.',
      'lblDbSuccess_pt':'The input was saved successfully.',
      'lblDbSuccessEdit_pt':'The input was edited successfully.',
      'placeholderSearch_pt': 'Search ...',



    });


      $translateProvider.preferredLanguage(localStorage.getItem('key'));



  });


angular.module('adminBankaFrontendApp')
  .controller('langCtrl', function ($scope, gatewayService, authService) {



  });




