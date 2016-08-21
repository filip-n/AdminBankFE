'use strict';


angular.module('adminBankaFrontendApp').factory('gatewayService', function ($http, $q,  $cookies/*, session*/) {

    var instance = {};
    //var user = session.token();

    instance.request = function (url, operationType, obj) {

        var deferred = $q.defer();
        setTimeout(function () {
            var serviceUrl;
            //var token = user.token;

            if (typeof url !== "undefined") {
             //   serviceUrl = "http://10.55.55.28" + url;
                  serviceUrl = "http://localhost:58075" + url;
               // serviceUrl = "http://localhost:9090" + url;
            }

            $http({
                method: operationType,
                url: serviceUrl,
                data: obj,
                headers: {
                    "Content-Type": "application/json",
                    // "Content-Type": "application/x-www-form-urlencode"

                    //"Authorization": "Bearer " + token
                    // "key": keyEncode(key)
                }
            }).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(status);
            });
        }, 0);
        return deferred.promise;
    }




/*    function keyEncode(key) {



        var txtUserName = user.userName;
        var keyCombo = txtUserName + "++" + key;
        var key = CryptoJS.enc.Utf8.parse('SRkTcJz5kt6Lft2r');
        var iv = CryptoJS.enc.Utf8.parse('5Zq4JLGR7TMCs4eP');

        var encryptedlogin = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(keyCombo), key,
       {
           keySize: 128 / 8,
           iv: iv,
           mode: CryptoJS.mode.CBC,
           padding: CryptoJS.pad.Pkcs7
       });

        var encodedString = encryptedlogin.ciphertext.toString(CryptoJS.enc.Base64)
        encodedString = "fe" + encodedString;
        encodedString = encodeURIComponent(encodedString)
        return encodedString;
    }
*/

    return instance;
});
