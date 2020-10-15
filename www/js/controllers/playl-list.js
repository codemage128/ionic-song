angular.module('app')
    .controller('PlayLListCtrl', function ($scope, $state, $ionicPopup, $ionicPopover, $ionicLoading, $rootScope, $stateParams, $filter, PlayListManager, ThemeManager) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.playlList = [];
            $scope.isSearch = false;
            $scope.searchKey = "";
            $scope.id = -1;
            $scope.themeId = -1;

            $scope.playlpopover = $ionicPopover.fromTemplate(
                '<ion-popover-view class="playl-list-popover">' +
                '<div class="content">' +
                '<div class="list">' +
                '<button href="#" class="item button" on-touch="addThemeToPlayList()">' +
                $filter('translate')('add_theme') +
                '</button>' +
                '<button href="#" class="item button" on-touch="editPlayList()">' +
                $filter('translate')('edit') +
                '</button>' +
                '<button href="#" class="item button" on-touch="deletePlayList()">' +
                $filter('translate')('delete') +
                '</button>' +
                '<button href="#" class="item button" on-touch="duplicatePlayList()">' +
                $filter('translate')('duplicate') +
                '</button>' +
                '</div>' +
                '</ion-popover-view>', {
                    scope: $scope
                })

            $scope.themepopover = $ionicPopover.fromTemplate(
                '<ion-popover-view class="playl-list-popover">' +
                '<div class="content">' +
                '<div class="list">' +
                '<button href="#" class="item button" on-touch="testTheme()">' +
                $filter('translate')('test') +
                '</button>' +
                '<button href="#" class="item button" on-touch="deleteTheme()">' +
                $filter('translate')('delete') +
                '</button>' +
                '</div>' +
                '</ion-popover-view>', {
                    scope: $scope
                })
            refreshView();
        });


        $scope.$on('$destroy', function () {
            $scope.playlpopover.remove();
            $scope.themepopover.remove();
        });

        $scope.toggleSearch = function () {
            $scope.isSearch = true;
        }

        $scope.toggleMenu = function ($event, id) {
            $scope.playlpopover.show($event);
            $scope.id = id;
        }

        $scope.toggleThemeMenu = function ($event, id, themeId) {
            $scope.themepopover.show($event);
            $scope.id = id;
            $scope.themeId = themeId;
        }

        $scope.addThemeToPlayList = function () {
            $state.go('main.playl-add-theme', { id: $scope.id });
        }

        $scope.editPlayList = function () {
            $scope.playlpopover.hide();
            $state.go('main.playl-new', { id: $scope.id });
        }

        $scope.duplicatePlayList = function () {
            $scope.playlpopover.hide();
            PlayListManager.duplicatePlayList($scope.id);
            refreshView();
        }

        $scope.toggleThemeView = function (playlist) {
            playlist.isThemeToggle = !playlist.isThemeToggle;
        }

        $scope.deletePlayList = function () {
            $scope.playlpopover.hide();

            var alertPopup = $ionicPopup.confirm({
                title: $filter('translate')('playlist_delete')
            });

            alertPopup.then(function (res) {
                if (res) {
                    PlayListManager.deletePlayList($scope.id);
                    refreshView();
                }
            });
        }

        $scope.doSearch = function () {
            refreshView();
        }

        $scope.deleteTheme = function () {
            $scope.themepopover.hide();
            PlayListManager.deleteThemeInPlayList($scope.id, $scope.themeId);
            refreshView();
        }

        $scope.testTheme = function () {
            $state.go('main.theme-test', { id: $scope.themeId });
        }

        $scope.getThemeListForPlayList = function (themeIds) {
            var themeList = _.map(themeIds, function (id) {
                return ThemeManager.getTheme(id);
            });

            return themeList;
        }

        function refreshView() {

            var searchKey = $("#playl-list-search-val").val();

            $scope.playlList = PlayListManager.getPlaylListBySearchKey(searchKey);

            for (var i in $scope.playlList) {
                $scope.playlList[i].themeList = $scope.getThemeListForPlayList($scope.playlList[i].themeIds);
            }
        }
    })