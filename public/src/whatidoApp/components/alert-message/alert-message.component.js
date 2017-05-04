(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .component('widAlertMessage', {
            templateUrl: 'src/whatidoApp/components/alert-message/alert-message.template.html',
            controller: WIDAlertMessageController,
            bindings: {
            	message: '<'
            }
        });

    WIDAlertMessageController.$inject = ['$timeout'];

    function WIDAlertMessageController($timeout) {

        var ctrl = this;

        ctrl.closeAlert = function() {
            ctrl.message = undefined;
        };

        // Closes the alert automatically
        ctrl.$onChanges = function(changesObj) {
            
            if (changesObj.message) {
                if (changesObj.message.currentValue) {

                    $timeout(() => {
                        ctrl.message = undefined;
                    }, 3000);

                }
            }

        };
        
    };

})();