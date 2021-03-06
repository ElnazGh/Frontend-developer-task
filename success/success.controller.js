(function () {
    'use strict';

    angular
        .module('app')
        .controller('successController', successController);

    successController.$inject = ['$scope', 'UserService', '$location', '$rootScope', 'FlashService'];
    function successController($scope, UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;

        vm.formData = {};

        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }

        //header
        $scope.header = {name: "header.view.html", url: "header/header.view.html"};
        $scope.formPage = false;
        $scope.headerText = "Success";   

        //footer
        $scope.footer = {name: "footer.view.html", url: "footer/footer.view.html"};
    }

})();