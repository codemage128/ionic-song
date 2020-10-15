angular.module('app')
    .controller('ChangePlaylistCtrl', function ($scope, $state, $ionicPopup, $ionicPopover, $ionicLoading, $rootScope, $stateParams, $filter, MediaManager, PlayListManager, ThemeManager) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.allPlayList = PlayListManager.getPlaylList();

            if (window.sessionStorage.changedPlaylistId) {
                $scope.allPlayList = _.filter(PlayListManager.getPlaylList(), function (playlist) { return playlist.id != window.sessionStorage.changedPlaylistId });
            }
        });

        $scope.selectPlayList = function (playlistId) {
            window.sessionStorage.changedPlaylistId = playlistId;

            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')('select_playlist_success')
            });

            alertPopup.then(function (res) {
                $state.go('main.next-concert');
            });
        }
    })