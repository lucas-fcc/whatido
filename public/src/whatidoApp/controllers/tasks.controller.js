(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .controller('TasksController', TasksController);

    TasksController.$inject = ['taskList', 'TasksService', 'TasksListsService'];

    function TasksController(taskList, TasksService, TasksListsService) {

        var ctrl = this;

        ctrl.taskList = taskList;
        ctrl.task = {};
        ctrl.isSubmitting = false;
        ctrl.isGettingSuggestion = false;

        ctrl.createTask = function() {

            ctrl.isSubmitting = true;

            TasksService.createNew(ctrl.taskList._id, ctrl.task)
                .then(res => {
                    ctrl.taskList = res.data.taskList;

                    ctrl.task = {};
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

        ctrl.deleteTask = function(task) {

            TasksService.deleteTask(ctrl.taskList._id, task._id)
                .then(res => {
                    ctrl.taskList.tasks.splice(ctrl.taskList.tasks.indexOf(task), 1);

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

        ctrl.checkTask = function(task) {

            const checkInfo = {
                old: !task.done,
                new: task.done
            };

            TasksService.checkTask(ctrl.taskList._id, task._id, checkInfo)
                .then(res => {
                    ctrl.message = {
                        type: 'success',
                        description: res.data.message
                    };
                })
                .catch(err => {
                    console.error(err);

                    task.done = !task.done;

                    ctrl.message = {
                        type: 'error',
                        description: err.data.message
                    };
                });

        };

        ctrl.newSuggestion = function() {

            ctrl.isGettingSuggestion = true;

            if (ctrl.taskList.currentTask) {
                
                var currentTaskId = ctrl.taskList.currentTask._id;
                var toDoTasks = ctrl.taskList.tasks.filter(task => !task.done && task._id != currentTaskId);

                if (!toDoTasks.length) {
                    ctrl.isGettingSuggestion = false;
                    return;
                }

                var random = getRandomNumber(0, toDoTasks.length);
                console.log(random);

                var newSuggestion = {
                    old: ctrl.taskList.currentTask,
                    new: toDoTasks[random]
                };
            
            } else {

                var random = getRandomNumber(0, ctrl.taskList.tasks.length);

                var newSuggestion = {
                    old: null,
                    new: ctrl.taskList.tasks[random]
                };

            }

            TasksListsService.newSuggestion(ctrl.taskList._id, newSuggestion)
                .then(res => {
                    ctrl.taskList = res.data.taskList;

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
                    ctrl.isGettingSuggestion = false;
                });

        };

        ctrl.isAllTasksDone = function() {

            for (let i = 0; i < ctrl.taskList.tasks.length; i++) {
                if (!ctrl.taskList.tasks[i].done)
                    return false;
            }

            return true;

        };

        function getRandomNumber(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        };

    };

})();