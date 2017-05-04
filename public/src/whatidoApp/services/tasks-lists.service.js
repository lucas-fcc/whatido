(function(){

    'use strict';

    angular.module('WhatIDoApp')
        .service('TasksListsService', TasksListsService);

    TasksListsService.$inject = ['$http', 'ApiPath', 'AuthService'];

    function TasksListsService($http, ApiPath, AuthService) {

        var service = this;

        service.getLists = function() {

            const user = AuthService.getUserLogged();

            return $http.get(ApiPath + '/tasks-lists')
                .then(res => res.data);

        };

        service.createNew = function(task) {

            const user = AuthService.getUserLogged();

            return $http.post(ApiPath + '/tasks-lists', task);

        };

        service.deleteList = function(listId) {

            const user = AuthService.getUserLogged();

            return $http.delete(ApiPath + '/tasks-lists/' + listId);

        };

        service.getList = function(listId) {

            const user = AuthService.getUserLogged();

            return $http.get(ApiPath + '/tasks-lists/' + listId)
                .then(res => res.data);

        };

        service.newSuggestion = function(listId, suggestionInfo) {

            const user = AuthService.getUserLogged();

            return $http.patch(ApiPath + '/tasks-lists/' + listId, { currentTask: suggestionInfo });

        };

    };

})();