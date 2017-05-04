(function(){

    'use strict';

    angular.module('WhatIDoApp')
        .service('UserTokenService', UserTokenService);

    UserTokenService.$inject = ['$window'];

    function UserTokenService($window) {

        var service = this;

        var tokenKey = 'widToken';

        var token;
        var user;

        getUserToken();

        service.deleteToken = function() {
            $window.localStorage.removeItem(tokenKey);

            token = undefined;
            user = undefined;
        };

        service.getToken = function() {
            return token;
        };

        service.getUser = function() {
            return user;
        };

        service.setUserTokenInfo = function(userToken) {
            token = userToken.token;
            user = userToken.user;

            $window.localStorage[tokenKey] = JSON.stringify(userToken);
        };

        function getUserToken() {
            var userToken = JSON.parse($window.localStorage[tokenKey] || false);

            if (userToken) {
                token = userToken.token;
                user = userToken.user;
            }

        };

    };

})();