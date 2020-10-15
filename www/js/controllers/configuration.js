angular.module('app')
    .controller('ConfigurationCtrl', function ($scope, $state, $ionicPopup, $ionicPopover, $ionicLoading, $rootScope, $stateParams, $filter, UserManager) {
        $scope.$on('$ionicView.loaded', function () {
            var user = UserManager.getUser();
            if (!user) {
                $scope.user = UserManager.makeNewUser();
            }
            else {
                $scope.user = UserManager.getUser();
            }
        })

        $scope.doSave = function () {
            UserManager.saveUser($scope.user);
            
            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')('configuration_save_success')
            });

        }
    })