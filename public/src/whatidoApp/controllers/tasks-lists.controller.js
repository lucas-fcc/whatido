(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .controller('TasksListsController', TasksListsController);

    TasksListsController.$inject = ['TasksListsService', 'tasksLists'];

    function TasksListsController(TasksListsService, tasksLists) {

        var ctrl = this;

        ctrl.tasksLists = tasksLists;
        ctrl.list = {};
        ctrl.isSubmitting = false;

        ctrl.createTask = function() {

            ctrl.isSubmitting = true;

            TasksListsService.createNew(ctrl.list)
                .then(res => {
                    console.log(res.data);
                    tasksLists.push(res.data.taskList);

                    ctrl.list = {};
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
                    ctrl.taskForm.$setPristine();
                    ctrl.taskForm.$setUntouched();

                    ctrl.isSubmitting = false;
                });

        };

        ctrl.deleteList = function(list) {

            TasksListsService.deleteList(list._id)
                .then(res => {
                    ctrl.tasksLists.splice(ctrl.tasksLists.indexOf(list), 1);

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
                });

        };

    };

})();