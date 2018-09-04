(function () {
    'use strict';

    angular
        .module('app')
        .controller('loginController', loginController);

    loginController.$inject = ['$location', 'AuthenticationService', 'FlashService'];
    function loginController($location, AuthenticationService, FlashService) {
        var vm = this;

        vm.login = login;

        // Password 
        // Set the default value of inputType
          vm.inputType = 'password';
          
          // Hide & show password function
          vm.hideShowPassword = function(){
            if (vm.inputType == 'password')
              vm.inputType = 'text';
            else
              vm.inputType = 'password';
          };

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        function login() {
            vm.dataLoading = true;
            AuthenticationService.Login(vm.username, vm.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials(vm.username, vm.password);
                    $location.path('/');
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        };
    }

})();