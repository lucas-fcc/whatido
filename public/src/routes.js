(function() {

    'use strict';

    angular.module('WhatIDoApp')
        .config(RoutesConfig)
        .config(Interceptor);

    Interceptor.$inject = ['$httpProvider'];

    function Interceptor($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    };

    RoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function RoutesConfig($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'src/whatidoApp/templates/home.template.html',
                controller: 'HomeController as homeCtrl'
            })

            .state('login', {
                url: '/login',
                templateUrl: 'src/whatidoApp/templates/login.template.html',
                controller: 'LoginController as loginCtrl'
            })

            .state('register', {
                url: '/register',
                templateUrl: 'src/whatidoApp/templates/register.template.html',
                controller: 'RegisterController as registerCtrl'
            })

            .state('recover-password', {
                url: '/recover-password',
                templateUrl: 'src/whatidoApp/templates/recover-password.template.html',
                controller: 'RecoverPasswordController as recoverPasswordCtrl'
            })

            .state('tasks-lists', {
                url: '/tasks-lists',
                templateUrl: 'src/whatidoApp/templates/tasks-lists.template.html',
                controller: 'TasksListsController as tasksListsCtrl',
                resolve: {
                    security: ['$q', '$state', '$timeout', 'AuthService', function($q, $state, $timeout, AuthService) {
                        if (AuthService.isAuthenticated()) {
                            return $q.when();
                        } else {
                            $timeout(function() {
                                $state.go('login');
                            });

                            return $q.reject();
                        }
                    }],
                    tasksLists: ['TasksListsService', function(TasksListsService) {
                        return TasksListsService.getLists();
                    }]
                }
            })

            .state('tasks', {
                url: '/tasks-lists/{id}',
                templateUrl: 'src/whatidoApp/templates/tasks.template.html',
                controller: 'TasksController as tasksCtrl',
                resolve: {
                    security: ['$q', '$state', '$timeout', 'AuthService', function($q, $state, $timeout, AuthService) {
                        if (AuthService.isAuthenticated()) {
                            return $q.when();
                        } else {
                            $timeout(function() {
                                $state.go('login');
                            });

                            return $q.reject();
                        }
                    }],
                    taskList: ['TasksListsService', '$stateParams', function(TasksListsService, $stateParams) {
                        return TasksListsService.getList($stateParams.id);
                    }]
                }
            })

            .state('user-info', {
                url: '/user-info',
                templateUrl: 'src/whatidoApp/templates/user-info.template.html',
                controller: 'UserInfoController as userInfoCtrl',
                resolve: {
                    security: ['$q', '$state', '$timeout', 'AuthService', function($q, $state, $timeout, AuthService) {
                        if (AuthService.isAuthenticated()) {
                            return $q.when();
                        } else {
                            $timeout(function() {
                                $state.go('login');
                            });

                            return $q.reject();
                        }
                    }],
                    userInfo: ['AuthService', function(AuthService) {
                        return AuthService.getUserLogged();
                    }]
                }
            });

    };

})();