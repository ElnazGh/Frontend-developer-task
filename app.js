(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies', 'smart-table', 'vsGoogleAutocomplete'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'homeController',
                templateUrl: 'home/home.view.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'loginController',
                templateUrl: 'login/login.view.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'registerController',
                templateUrl: 'register/register.view.html',
                controllerAs: 'vm'
            })

            .when('/member-details', {
                controller: 'memberDetailsController',
                templateUrl: 'memberDetails/memberDetails.view.html',
                controllerAs: 'vm'
            })

            .when('/complete-registration', {
                controller: 'formController',
                templateUrl: 'complete-registration/completeRegistration.view.html',
                controllerAs: 'vm'
            })

            .when('/success', {
                controller: 'successController',
                templateUrl: 'success/success.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {

        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });

        //Groups
        $rootScope.storeOptions = [
            { name: 'Group1', selected: false, removed: true },
            { name: 'Group2', selected: false, removed: false },
            { name: 'Group3', selected: false, removed: false },
            { name: 'Group4', selected: false, removed: false }
        ];
    }

    //Allow only digits
    angular
        .module('app')
        .directive('digitsOnly', function() {
            return {
                require: 'ngModel',
                link: function (scope, element, attr, ngModelCtrl) {
                    function fromUser(text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');
                        
                        if(transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    ngModelCtrl.$parsers.push(fromUser);
                }
            }; 
        });

})();