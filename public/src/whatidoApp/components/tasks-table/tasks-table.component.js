(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .component('widTasksTable', {
            templateUrl: 'src/whatidoApp/components/tasks-table/tasks-table.template.html',
            controller: WIDTasksTable,
            bindings: {
            	tasks: '<',
                onDelete: '&',
                onCheck: '&'
            }
        });

    function WIDTasksTable() {

        var ctrl = this;

        ctrl.filterTasks = {
            done: false
        };

        ctrl.delete = function(task) {

            ctrl.onDelete({task: task});

        };

        ctrl.check = function(task) {

            ctrl.onCheck({task: task});

        };

        ctrl.toggleTasks = function(show) {
            if (show === 'done')
                ctrl.filterTasks.done = true;
            else
                ctrl.filterTasks.done = false;            
        };
        
    };

})();