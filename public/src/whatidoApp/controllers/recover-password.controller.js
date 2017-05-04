(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .controller('RecoverPasswordController', RecoverPasswordController);

    RecoverPasswordController.$inject = ['UserService'];

    function RecoverPasswordController(UserService) {

        var ctrl = this;

        ctrl.recover = {};
        ctrl.isSubmitting = false;

        ctrl.doRecoverPassword = function() {

            ctrl.isSubmitting = true;

            UserService.recoverPassword(ctrl.recover.email)
                .then(res => {
                    ctrl.recover = {};
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
                    ctrl.recoverForm.$setPristine();
                    ctrl.recoverForm.$setUntouched();

                    ctrl.isSubmitting = false;
                });

        };

    };

})();