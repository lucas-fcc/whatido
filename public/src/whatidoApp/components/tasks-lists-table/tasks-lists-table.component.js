(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .component('widTasksListsTable', {
            templateUrl: 'src/whatidoApp/components/tasks-lists-table/tasks-lists-table.template.html',
            controller: WIDTasksListsTable,
            bindings: {
            	lists: '<',
                onDelete: '&'
            }
        });

    function WIDTasksListsTable() {

        var ctrl = this;

        ctrl.delete = function(list) {

            ctrl.onDelete({list: list});

        };
        
    };

})();