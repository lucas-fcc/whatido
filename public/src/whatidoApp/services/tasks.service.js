(function(){

    'use strict';

    angular.module('WhatIDoApp')
        .service('TasksService', TasksService);

    TasksService.$inject = ['$http', 'ApiPath', 'AuthService'];

    function TasksService($http, ApiPath, AuthService) {

        var service = this;

        service.createNew = function(listId, task) {

            const user = AuthService.getUserLogged();

            return $http.post(ApiPath + '/tasks-lists/' + listId + '/tasks', task);

        };

        service.deleteTask = function(listId, taskId) {

            const user = AuthService.getUserLogged();

            return $http.delete(ApiPath + '/tasks-lists/' + listId + '/tasks/' + taskId);

        };

        service.checkTask = function(listId, taskId, checkInfo) {

            const user = AuthService.getUserLogged();

            return $http.patch(ApiPath + '/tasks-lists/' + listId + '/tasks/' + taskId, { done: checkInfo });

        };

    };

})();