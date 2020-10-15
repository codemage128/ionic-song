angular.module('app')
    .controller('ThemeListCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, $ionicPopover, $rootScope, $filter, MAX_PAGE_NUM, ThemeManager, MediaManager) {
        $scope.$on('$ionicView.loaded', function () {
            MediaManager.MediaPlayer.stopAudio();
            $scope.themeList = [];
            $scope.isSearch = false;
            $scope.id = 0;

            $scope.popover = $ionicPopover.fromTemplate(
                '<ion-popover-view class="theme-list-popover">' +
                '<div class="content">' +
                '<div class="list">' +
                '<button href="#" class="item button" on-touch="addToPlayList()">' +
                $filter('translate')('add_to_playlist') +
                '<button href="#" class="item button" on-touch="testTheme()">' +
                $filter('translate')('test') +
                '<button href="#" class="item button" on-touch="deleteTheme()">' +
                $filter('translate')('delete') +
                '</button>' +
                '</div>' +
                '</div>' +
                '</ion-popover-view>', {
                    scope: $scope
                })

            refreshView();
        });

        $scope.addToPlayList = function () {
            $scope.popover.hide();
            $state.go('main.theme-add-playlist', { id: $scope.id });
        }
        
        $scope.goTest = function(theme) {
            $scope.popover.hide();
            $state.go('main.theme-test', { id: theme.id });
        }

        $scope.testTheme = function () {
            $scope.popover.hide();
            $state.go('main.theme-test', { id: $scope.id });
        }

        $scope.deleteTheme = function () {
            $scope.popover.hide();

            var alertPopup = $ionicPopup.confirm({
                title: $filter('translate')('themelist_delete')
            });

            alertPopup.then(function (res) {
                if (res) {
                    ThemeManager.deleteTheme($scope.id);
                    refreshView();
                }
            });

        }

        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });

        $scope.toggleSearch = function () {
            $scope.isSearch = true;
        }

        $scope.doSearch = function () {
            refreshView();
        }

        $scope.toggleMenu = function ($event, id) {
            $scope.popover.show($event);
            $scope.id = id;
        }

        function refreshView() {
            var searchKey = $("#theme-list-search-val").val();
            $scope.themeList = ThemeManager.getThemeListBySearchKey(searchKey);
        }
    })