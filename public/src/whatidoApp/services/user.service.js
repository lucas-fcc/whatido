(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .service('UserService', UserService);

    UserService.$inject = ['$http', 'ApiPath'];

    function UserService($http, ApiPath) {

        var service = this;

        service.registerNew = function(userInfo) {

            return $http.post(ApiPath + '/users', JSON.stringify(userInfo));

        };

        service.recoverPassword = function(email) {

            return $http.get(ApiPath + '/users/recover-password', { params: { email } });

        };

        service.changePassword = function(passwordData) {

            return $http.patch(ApiPath + '/users/', { password: passwordData });

        };

    };

})();