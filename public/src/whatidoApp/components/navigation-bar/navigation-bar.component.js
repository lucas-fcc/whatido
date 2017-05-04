(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .component('widNavigationBar', {
            templateUrl: 'src/whatidoApp/components/navigation-bar/navigation-bar.template.html',
            controller: WIDNavigationBar
        });

    WIDNavigationBar.$inject = ['AuthService', '$location'];

    function WIDNavigationBar(AuthService, $location) {

    	var ctrl = this;

    	ctrl.isAuthenticated = function() {
    		return AuthService.isAuthenticated();
    	};

        ctrl.logout = function() {
            AuthService.logout();
            $location.path('/');
        };

        ctrl.getUsername = function() {

            if (AuthService.isAuthenticated())
                return AuthService.getUserLogged().name;
            else
                return '';
        };

    };

})();