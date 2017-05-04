(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .component('widFooter', {
            templateUrl: 'src/whatidoApp/components/footer/footer.template.html',
            controller: WIDFooterController
        });

    WIDFooterController.$inject = ['$location'];

    function WIDFooterController($location) {
        this.year = new Date().getFullYear();

        this.isNotHome = function() {
        	return $location.path() !== '/';
        };
    };

})();