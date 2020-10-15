angular.module('app')
    .controller('PlayLAddThemeCtrl', function ($scope, $state, $ionicPopover, $ionicPopup, $ionicModal, PlayListManager, ThemeManager, $rootScope, $stateParams, $filter, PlayListManager) {
        $scope.$on('$ionicView.loaded', function () {
            var id = $stateParams.id;

            $scope.playlist = PlayListManager.getPlayList(id);

            $scope.themeList = _.map($scope.playlist.themeIds, function (id) {
                return ThemeManager.getTheme(id);
            });

            $ionicModal.fromTemplateUrl('views/main/playl-theme-list.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.themeModal = {};

            $scope.themeModal.themeList = ThemeManager.getThemeListForPlayList($scope.playlist.themeIds);
        });

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        })

        $scope.toggleAddTheme = function () {
            $scope.modal.show();
        }

        $scope.doCancel = function () {
            $state.go("main.playl-list");
        }

        $scope.deleteTheme = function (theme) {
            $scope.themeList = _.filter($scope.themeList, function (t) { return t.id != theme.id });

            $scope.themeModal.themeList.push(theme);
            $scope.themeModal.themeList = _.sortBy($scope.themeModal.themeList, function (theme) { return theme.id });
        }

        $scope.addThemeToPlayList = function (theme) {
            $scope.themeModal.themeList = _.filter($scope.themeModal.themeList, function (t) { return t.id != theme.id });

            $scope.themeList.push(theme);
            $scope.themeList = _.sortBy($scope.themeList, function (theme) { return theme.id });
        }

        $scope.doPlayListSave = function () {
            $scope.playlist.themeIds = _.map($scope.themeList, function (theme) { return theme.id });

            PlayListManager.updatePlayList($scope.playlist);

            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')('playlist_save_success')
            });

            alertPopup.then(function () {
                $state.go('main.playl-list');
            });

        }

        $scope.doThemeModalClose = function () {
            $scope.modal.hide();
        }
    })