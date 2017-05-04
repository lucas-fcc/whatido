(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$location', '$anchorScroll', 'AuthService'];

    function HomeController($location, $anchorScroll, AuthService) {

        var ctrl = this;

        ctrl.goTo = function(target) {
            $location.hash(target);
            $anchorScroll();
        };

        ctrl.isAuthenticated = function() {
            return AuthService.isAuthenticated();
        };

    };

})();