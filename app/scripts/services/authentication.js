'use strict'

angular.module('adminBankaFrontendApp').factory('authService', function ($cookieStore, $http, $q, $rootScope,  gatewayService ){


	var instance = {
    isAuth: false,
    username: ""
  };
	// var user


	instance.login = function (user){

		//instance.usr.username = user.username;
		var deferred = $q.defer();
		var smth = "grant_type=password&username="+ user.username +"&password="+user.password;
    console.log(user);

		var config = {
		    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		}

		$http
			.post('http://localhost:1176/token', smth,config ).success(function (data, status, headers, config){
				//instance.usr.token = data.access_token;
				createTokenSession(data, user.username);
				deferred.resolve(data);
			})
			.error(function (data, status, headers, config){
				deferred.reject(status);
        // console.log(data.error_description);
			});
			return deferred.promise;
	}


	function createTokenSession(data, username){

		var user = {};
		user.username = username;
		user.token = data.access_token;

		if(typeof(Storage) !== "undefined") {
			localStorage.user = angular.toJson(user);
		}else{
			//$cookies.user = angular.toJson(user);
			$cookieStore.put('user', angular.toJson(user));
		}

    instance.isAuth = true;
    instance.username = username;

	}


	instance.token = function (){
		if(typeof(Storage) !== "undefined" && localStorage.user) {
			return angular.fromJson(localStorage.user);
		}else if($cookieStore.get('user') != undefined){
			return angular.fromJson($cookieStore.get('user'));
		}
		return null;
	}

	instance.logout = function (){
        //instance.usr = null;
        var key;
        if(typeof(Storage) !== "undefined") {
            localStorage.clear();
        }
        if($cookieStore.get('user') != undefined )
            $cookieStore.remove('user');

      $rootScope.loggedUser = undefined;
      instance.isAuth = false;
      instance.username = "";

	}


	return instance;
});
