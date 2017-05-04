(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['AuthService', '$location'];

    function LoginController(AuthService, $location) {

        var ctrl = this;

        ctrl.login = {};
        ctrl.isSubmitting = false;

        ctrl.doLogin = function() {

            ctrl.isSubmitting = true;

            AuthService.login(ctrl.login)
                .then(() => {
                    $location.path('/');
                })
                .catch(err => {
                    console.error(err.data.message);

                    ctrl.loginForm.$setPristine();
                    ctrl.loginForm.$setUntouched();

                    ctrl.message = {
                        type: 'error',
                        description: err.data.message
                    };
                })
                .then(() => {
                    ctrl.isSubmitting = false;
                });

        };

    };

})();