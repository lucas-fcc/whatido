(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService'];

    function RegisterController(UserService) {

        var ctrl = this;

        ctrl.register = {};
        ctrl.isSubmitting = false;

        ctrl.doRegister = function() {

            ctrl.isSubmitting = true;

            UserService.registerNew(ctrl.register)
                .then(res => {
                    ctrl.register = {};
                    ctrl.message = {
                        type: 'success',
                        description: res.data.message
                    };
                })
                .catch(err => {
                    console.error(err);

                    ctrl.message = {
                        type: 'error',
                        description: err.data.message
                    };
                })
                .then(() => {
                    ctrl.registerForm.$setPristine();
                    ctrl.registerForm.$setUntouched();

                    ctrl.isSubmitting = false;
                });

        };

    };

})();