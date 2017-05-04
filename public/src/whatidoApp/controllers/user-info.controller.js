(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .controller('UserInfoController', UserInfoController);

    UserInfoController.$inject = ['UserService', 'userInfo'];

    function UserInfoController(UserService, userInfo) {

        var ctrl = this;

        ctrl.userInfo = userInfo;
        ctrl.password = {};
        ctrl.isSubmitting = false;

        ctrl.doChangePassword = function() {

            ctrl.isSubmitting = true;

            UserService.changePassword(ctrl.password)
                .then(res => {
                    ctrl.password = {};
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
                    ctrl.passwordForm.$setPristine();
                    ctrl.passwordForm.$setUntouched();

                    ctrl.isSubmitting = false;
                });

        };

    };

})();