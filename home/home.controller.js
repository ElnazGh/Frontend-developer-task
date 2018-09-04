(function () {
    'use strict';

    angular
        .module('app')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope', '$location', 'UserService', '$rootScope']; 
    function homeController($scope, $location, UserService, $rootScope) { 
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;

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

        //
        var ctrl = this;

        this.displayed = [];

        this.callServer = function callServer(tableState) {
            ctrl.isLoading = true;

            var pagination = tableState.pagination;

            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
            var number = pagination.number || 2;  // Number of entries showed per page.
     
            ctrl.displayed = vm.allUsers;
            tableState.pagination.numberOfPages = vm.allUsers.numberOfPages; //result.numberOfPages; //set the number of pages so the pagination can update
            ctrl.isLoading = false;

            //remove to the real data holder - users
            $scope.removeItem = function removeItem(id) {
                UserService.Delete(id)
                    .then(function () {
                        loadAllUsers();
                });
            }
        };

        function addItem() {
            return {
                name: $scope.groupName,
                selected: false,
                removed: false
            }
        }

        //add a group
        $scope.addNamedItem = function addNamedItem() {
            $rootScope.storeOptions.push(addItem());
        };

        $scope.removeItem = function removeItem(item) {
            console.log(item);
            var index = $rootScope.storeOptions.indexOf(item);
            if (index !== -1) {
                $rootScope.storeOptions.splice(index, 1);
            }
        }

        // link table row to form 
        $rootScope.formDataKey = false;
        $rootScope.rowClick = function rowClick (path, row, id) {
            $location.path( path );
            $rootScope.formDataKey = true;
            $rootScope.path = path;
            $rootScope.row = row;
            $rootScope.users = $rootScope.randomsItems; 
        }

        //header
        $scope.header = {name: "header.view.html", url: "header/header.view.html"};
        $scope.formPage = false;
        $scope.headerText = "Scan legacy card or search for member";
        $scope.mobileHeaderText = "to import";

        //footer
        $scope.footer = {name: "footer.view.html", url: "footer/footer.view.html"};

        // Clear Search Fields
        vm.clearSearch = function clearSearch () {
            vm.firstName = null;
            vm.lastName = null;
        }
    }

})();