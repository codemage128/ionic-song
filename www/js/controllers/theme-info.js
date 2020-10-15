angular.module('app')
    .controller('ThemeInfoCtrl', function ($scope, $state, $ionicPopup, $ionicLoading, $rootScope, $stateParams, $filter, ThemeManager, MediaManager) {
        $scope.$on('$ionicView.loaded', function () {
            MediaManager.MediaPlayer.stopAudio();
            var id = $stateParams.id;
            if (id) {
                $scope.theme = ThemeManager.getTheme(id);
                $scope.isNew = false;
            }
        });

        $scope.doSave = function () {
            ThemeManager.saveTheme($scope.theme, function () {
                var alertPopup = $ionicPopup.alert({
                    title: $filter('translate')('theme_save_success')
                });

                alertPopup.then(function () {
                    $state.go('main.theme-test', { id: $scope.theme.id });
                });
            });
        }
    })
