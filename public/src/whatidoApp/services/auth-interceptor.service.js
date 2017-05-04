(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .factory('AuthInterceptor', AuthInterceptor);

    AuthInterceptor.$inject = ['$q', '$location', 'UserTokenService'];

    function AuthInterceptor($q, $location, UserTokenService) {

        var authInterceptor = {
            request: function(config) {

                config.headers = config.headers || {};

                if (UserTokenService.getToken()) {
                    config.headers.Authorization = 'JWT ' + UserTokenService.getToken();
                }

                return config;
            },
            responseError: function(res) {

                if (res.status === 401) {

                    if (UserTokenService.getToken()) {
                        UserTokenService.deleteToken();
                    }

                    $location.path('/login');

                }

                return $q.reject(res);

            }
        };

        return authInterceptor;

    };

})();