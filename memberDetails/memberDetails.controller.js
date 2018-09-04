(function () {
    'use strict';

    angular
        .module('app')
        .controller('memberDetailsController', memberDetailsController)
        .filter('filterFilter', filterFilter);

    memberDetailsController.$inject = ['$scope', 'UserService', '$location', '$rootScope', 'FlashService', '$cookieStore'];
    filterFilter.$inject = ['filterFilter'];

    function memberDetailsController($scope, UserService, $location, $rootScope, FlashService, $cookieStore) {
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
        $scope.formPage = true;
        $scope.headerText = "Confirm Member Details";
        $scope.backLinkTopText = "Cancel";
        $scope.backLinkBottomText = "Return to search";

        //footer
        $scope.footer = {name: "footer.view.html", url: "footer/footer.view.html"};

        // Search - Form
        $scope.salutation = [
            {value: 'Ms', label: 'Ms'},
            {value: 'Mrs', label: 'Mrs'},
            {value: 'Miss', label: 'Miss'},
            {value: 'Mr', label: 'Mr'}
        ];

        $scope.gender = [
            {value: 'Female', label: 'Female'},
            {value: 'Male', label: 'Male'},
            {value: 'Other', label: 'Other'}
        ];
    
        // Phone, mobile and email format
        $scope.phoneNumber = /^\(?(?:\+?61|0)(?:2\)?[ -]?(?:3[ -]?[38]|[46-9][ -]?[0-9]|5[ -]?[0-35-9])|3\)?(?:4[ -]?[0-57-9]|[57-9][ -]?[0-9]|6[ -]?[1-67])|7\)?[ -]?(?:[2-4][ -]?[0-9]|5[ -]?[2-7]|7[ -]?6)|8\)?[ -]?(?:5[ -]?[1-4]|6[ -]?[0-8]|[7-9][ -]?[0-9]))(?:[ -]?[0-9]){6}$/;
        $scope.mobileNumber = /^(?:\+?61|0)4 ?(?:(?:[01] ?[0-9]|2 ?[0-57-9]|3 ?[1-9]|4 ?[7-9]|5 ?[018]) ?[0-9]|3 ?0 ?[0-5])(?: ?[0-9]){5}$/;
        $scope.emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        vm.data = $rootScope.row;
        if($rootScope.formDataKey) {

            // Retrieve Data from table - home.controller
            vm.data = $rootScope.row;

            // set selected value to a particular value
            // Salutation
            if(vm.data.salutation) {
                for (var i=0; i < $scope.salutation.length; i++) {
                    if($scope.salutation[i].value == vm.data.salutation ) {  
                        $scope.salutationItem = $scope.salutation[i];
                    }
                }
           }
           // Gender
           if(vm.data.gender) {
                for (var i=0; i < $scope.gender.length; i++) {
                    if($scope.gender[i].value == vm.data.gender ) {
                        $scope.genderItem = $scope.gender[i];
                    }
                }
           }

           // First Name
           if(vm.data.id) {
                vm.id = vm.data.id;
           }

           // First Name
           if(vm.data.firstName) {
                vm.firstname = vm.data.firstName;
           }

           // surname
           if(vm.data.lastName) {
                vm.surname = vm.data.lastName;
           }

           // Phone
           if(vm.data.phone) {
                vm.phone = vm.data.phone;
           }

           // Mobile
           if(vm.data.mobile) {
                vm.mobile = vm.data.mobile; 
           }

           // Email
           if(vm.data.email) {
                vm.email = vm.data.email;
           }

            // Store Sign Up
            if(vm.data.storeSignUp) {
                vm.storeSignUp = vm.data.storeSignUp;
            }
        }

        // Groups

        // mega select
        //store - storeOptions
        $rootScope.storeOptions = [
            { name: 'Group1', selected: false, removed: true },
            { name: 'Group2', selected: false, removed: false },
            { name: 'Group3', selected: false, removed: false },
            { name: 'Group4', selected: false, removed: false }
        ];
        
        var storeOptionsLen = $rootScope.storeOptions.length;

        // Selected options
        $scope.storeSelectedOptions = {
            "id": "storeOptions", 
            "type": "select", 
            "name": "Stores",
            "values": [],
            "value": []
        };

        //$scope.storeSelectedOptions.value = $scope.storeSelectedOptions.values[0];

        // removing selecting option from second dropdown
        $scope.removeListItem = function removeListItem(storeSelectedOption) {
            for(var i = 0; i < storeOptionsLen; i++) {
                if($rootScope.storeOptions[i].name === storeSelectedOption) {
                    $rootScope.storeOptions[i].selected = false;
                }
            }
        }

        // Watch storeOptions for changes in first dropdown
        $rootScope.$watch('storeOptions|filter:{selected:true}', function (nv) {
            $scope.storeSelectedOptions.values = nv.map(function (storeOption) {
                return storeOption.name;
            });
        }, true);

        // Deselect selected item with removed: true - Deselect disabled one 
        $scope.$watch('storeSelectedOptions', function (nv) {  
            var storeSelectedOptionsLen = $scope.storeSelectedOptions.values.length;
            
            for (var i = 0; i < storeSelectedOptionsLen; i++) {
                for (var j = 0; j < storeOptionsLen; j++) {
                    if ($scope.storeSelectedOptions.values[i] === $rootScope.storeOptions[j].name) {
                        if ($rootScope.storeOptions[j].removed == true) {
                            $rootScope.storeOptions[j].selected = false;
                        }
                    }
                }
            }

            if(storeSelectedOptionsLen > 0) {
                $scope.validGroup = true;
            } else {
                $scope.validGroup = false;
            }

         }, true);

        // Store - "Add All" button
        $scope.addAll = function addAll() {
            for(var i = 0; i < storeOptionsLen; i++) {
                //if(!$scope.storeOptions[i].removed) {
                    $rootScope.storeOptions[i].selected = true;
                //}
            }
        }

        // Store - "Remove All" button
        $scope.removeAll = function removeAll() {
            for(var i = 0; i < storeOptionsLen; i++) {
                $rootScope.storeOptions[i].selected = false;
            }
        }

        // Watch storeOptions for validation
        $rootScope.$watch("storeOptions", function(n, o) {
            var trues = filterFilter($rootScope.storeOptions, { selected: true });
            $scope.hasError = trues.length;
        }, true); 
  
        // End - groups
    }

    function filterFilter(filterFilter) {
        return function optionSelection(input, prop) {
          return filterFilter(input, { selected: true }).map(function (storeOption) {
            return storeOption[prop];
          });
        };
    }

})();