angular.module('app')
    .controller('ThemeAddPlayListCtrl', function ($scope, $ionicPlatform, $cordovaCamera, $state, $ionicLoading, $ionicPopover, $ionicPopup, $ionicModal, $rootScope, $stateParams, $filter, ThemeManager, PlayListManager, ImageManager) {
        $scope.$on('$ionicView.loaded', function () {
            var themeId = $stateParams.id;

            $scope.theme = ThemeManager.getTheme(themeId);

            $scope.playlList = PlayListManager.getPlaylList();

            $scope.playlList = _.filter($scope.playlList, function (playlist) {
                var themeIds = playlist.themeIds;

                var result = true;

                for (var i in themeIds) {
                    if (themeIds[i] == themeId) {
                        result = false;
                        break;
                    }
                }

                return result;
            })
        });

        $scope.addThemeToPlayList = function (theme, playlist) {

            var themeIds = playlist.themeIds;

            themeIds.push(theme.id);

            PlayListManager.updatePlayList(playlist);

            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')('add_to_playlist_success')
            });

            alertPopup.then(function (res) {
                $state.go('main.theme-list');
            });

        }
    })