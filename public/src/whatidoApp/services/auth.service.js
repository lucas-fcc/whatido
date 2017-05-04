(function(){

    'use strict';

    angular.module('WhatIDoApp')
        .service('AuthService', AuthService);

    AuthService.$inject = ['$http', 'ApiPath', 'UserTokenService'];

    function AuthService($http, ApiPath, UserTokenService) {

        var service = this;

        service.login = function(loginInfo) {

            return $http.post(ApiPath + '/users/login', JSON.stringify(loginInfo))
                .then((res) => {
                    UserTokenService.setUserTokenInfo(res.data);

                    return res;
                });

        };

        service.logout = function() {
            UserTokenService.deleteToken();
        };

        service.isAuthenticated = function() {
            return UserTokenService.getToken() ? true : false;
        };

        service.getUserLogged = function() {
            return UserTokenService.getUser();
        };

    };

})();