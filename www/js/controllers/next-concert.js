angular.module('app')
    .controller('NextConcertCtrl', function ($scope, $state, $ionicPopup, $ionicPopover, $ionicLoading, $rootScope, $stateParams, $filter, MediaManager, PlayListManager, ThemeManager) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.playlList = [];
            $scope.playlist;
            $scope.curPlayListIndex = -1;
            $scope.id = -1;
            $scope.themeId = -1;
            $scope.curThemeIndex = -1;
            $scope.isPlaying = false;
            $scope.isShowDetail = false;
            $scope.isShowPlay = false;
            $scope.isMute = false;
            $scope.a = 0.0;
            $scope.curParagraphAry = [];
            $rootScope.isMute = $scope.isMute;
            $scope.playlpopover = $ionicPopover.fromTemplate(
                '<ion-popover-view class="next-concert-popover">' +
                '<div class="content">' +
                '<div class="list">' +
                '<button href="#" class="item button" on-touch="addThemeToPlayList()">' +
                $filter('translate')('add_theme') +
                '</button>' +
                '<button href="#" class="item button" on-touch="changePlayList()">' +
                $filter('translate')('change_playlist') +
                '</button>' +
                '</div>' +
                '</ion-popover-view>', {
                    scope: $scope
                })

            $scope.themepopover = $ionicPopover.fromTemplate(
                '<ion-popover-view class="next-concert-popover">' +
                '<div class="content">' +
                '<div class="list">' +
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
            $scope.pauseAudio();
            $rootScope.isMute = false;
        });

        $scope.getFontColor = function (color) {
            var fontColor = 'black';

            switch (color) {
                case 'lightblue':
                    fontColor = 'black';
                    break;
                case 'black':
                    fontColor = 'white';
                    break;
                case 'white':
                    fontColor = 'black';
                    break;
                default:
                    break;
            }
            return fontColor;
        }

        $scope.getActiveFontColor = function (color) {
            var activeFontColor = 'yellow';

            switch (color) {
                case 'lightblue':
                    activeFontColor = 'yellow';
                    break;
                case 'black':
                    activeFontColor = 'blue';
                    break;
                case 'white':
                    activeFontColor = 'blue';
                    break;
                default:
                    break;
            }
            return activeFontColor;
        }

        $scope.setMute = function () {
            if ($scope.isMute)
                MediaManager.MediaPlayer.undoMute();
            else
                MediaManager.MediaPlayer.doMute();
            $scope.isMute = !$scope.isMute;
        }

        $scope.toggleNoPlaylistMenu = function ($event) {
            $scope.playlpopover.show($event);
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

        $scope.toggleThemeView = function (playlist) {
            playlist.isThemeToggle = !playlist.isThemeToggle;
        }

        $scope.deleteTheme = function () {
            $scope.themepopover.hide();
            PlayListManager.deleteThemeInPlayList($scope.id, $scope.themeId);
            refreshView();
        }


        $scope.getThemeListForPlayList = function (themeIds) {
            var themeList = _.map(themeIds, function (id) {
                return ThemeManager.getTheme(id);
            });

            return themeList;
        }

        $scope.showListViewFromDetailView = function () {
            $scope.isShowDetail = false;
            $scope.pauseAudio();
        }

        $scope.showListViewFromPlayView = function () {
            $scope.isShowPlay = false;
            $scope.pauseAudio();
        }

        $scope.changePlayList = function () {

            $scope.playlpopover.hide();
            $state.go('main.change-playlist');
        }

        $scope.playAudio = function () {
            if ($scope.playlist.themeList.length > 0 && $scope.curThemeIndex >= 0) {
                if (!$scope.isShowDetail && !$scope.isShowPlay) {
                    $scope.isShowDetail = true;
                } else if ($scope.isShowDetail && !$scope.isShowPlay) {
                    $scope.isShowDetail = false;
                    $scope.isShowPlay = true;
                } else if (!$scope.isShowDetail && $scope.isShowPlay) {
                    var theme = $scope.playlist.themeList[$scope.curThemeIndex];
                    if (theme.mode == 'paragraph')
                        $scope.curParagraphAry = $scope.getParagraphAry(theme.letter);
                    if (theme.audio_file != "" && theme.audio_file != undefined) {
                        $scope.isPlaying = true;
                        MediaManager.MediaPlayer.resumeAudio(theme.audio_file);
                    } else {
                        $scope.isPlaying = true;
                    }

                    $scope.timer = setInterval(function () {
                        $scope.a += 0.05;

                        if (theme.mode == 'line' || theme.mode == 'full') {
                            for (var i = 0; i < theme.letterItemList.length; i++) {
                                if ((($scope.a + 0.1) - theme.letterItemList[i].time) < 0.15 && (($scope.a + 0.1) - theme.letterItemList[i].time) >= 0) {
                                    $("#letterItem-" + theme.letterItemList[i].id).css('color', $scope.getActiveFontColor(theme.color));
                                    if (i > 0)
                                        $("#letterItem-" + theme.letterItemList[i - 1].id).hide();
                                    break;
                                }
                            }
                        }
                        else if (theme.mode == 'paragraph') {
                            for (var i = 0; i < $scope.curParagraphAry.length - 1; i++) {
                                if ((($scope.a + 0.1) - theme.letterItemList[$scope.curParagraphAry[i]].time) < 0.15 && (($scope.a + 0.1) - theme.letterItemList[$scope.curParagraphAry[i]].time) >= 0) {

                                    for (var j = $scope.curParagraphAry[i]; j < $scope.curParagraphAry[i + 1] - 1; j++) {
                                        $("#letterItem-" + theme.letterItemList[j].id).css('color', $scope.getActiveFontColor(theme.color));
                                    }
                                    if (i > 0) {
                                        for (var j = $scope.curParagraphAry[i - 1]; j < $scope.curParagraphAry[i]; j++) {
                                            $("#letterItem-" + theme.letterItemList[j].id).hide();
                                        }
                                    }

                                    break;
                                }
                            }
                        }
                    }, 50);
                }

            }
        }

        $scope.pauseAudio = function () {
            MediaManager.MediaPlayer.pauseAudio();
            if ($scope.timer)
                clearInterval($scope.timer);
            $scope.isPlaying = false;
        }

        $scope.stopAudio = function () {
            MediaManager.MediaPlayer.stopAudio();
            if ($scope.timer)
                clearInterval($scope.timer);
            $scope.a = 0.0;
            $scope.isPlaying = false;
        }

        $scope.nextTheme = function () {
            $scope.stopAudio();
            if ($scope.curThemeIndex >= 0 && $scope.playlist.themeList.length > 0) {
                $scope.curThemeIndex++;

                if ($scope.curThemeIndex == $scope.playlist.themeList.length) {
                    $scope.curThemeIndex = $scope.playlist.themeList.length - 1;
                }

                $scope.isShowDetail = true;
                $scope.isShowPlay = false;
            }

        }

        $scope.prevTheme = function () {
            $scope.stopAudio();
            if ($scope.playlist.themeList.length > 0) {
                $scope.curThemeIndex--;


                if ($scope.curThemeIndex < 0) {
                    $scope.curThemeIndex = 0;
                }


                $scope.isShowDetail = true;
                $scope.isShowPlay = false;
            }
        }

        $scope.getParagraphAry = function (letter) {
            var lines = letter.split('\n');
            var paragraphIndex = [];
            paragraphIndex.push(0);
            var index = 0;

            for (var i = 0; i < lines.length; i++) {
                if (i > 0 && (lines[i - 1] == '' || lines[i - 1] == ' ')) {
                    paragraphIndex.push(i);
                    console.log(i);
                }
            }
            paragraphIndex.push(lines.length);
            return paragraphIndex;
        }

        function refreshView() {

            if (window.sessionStorage.changedPlaylistId) {
                $scope.playlist = PlayListManager.getPlayList(window.sessionStorage.changedPlaylistId);
                $scope.playlist.themeList = $scope.getThemeListForPlayList($scope.playlist.themeIds);

                $scope.curThemeIndex = -1;
                if ($scope.playlist.themeList.length > 0) {
                    $scope.curThemeIndex = 0;
                }
            }
            else {
                $scope.playlList = PlayListManager.getPlaylListByTodayDate();

                if ($scope.playlList.length == 0) {
                    $scope.playlpopover = $ionicPopover.fromTemplate(
                        '<ion-popover-view class="next-concert-popover">' +
                        '<div class="content">' +
                        '<div class="list">' +
                        '<button href="#" class="item button" on-touch="changePlayList()">' +
                        $filter('translate')('change_playlist') +
                        '</button>' +
                        '</div>' +
                        '</ion-popover-view>', {
                            scope: $scope
                        })
                }

                for (var i in $scope.playlList) {
                    $scope.playlList[i].themeList = $scope.getThemeListForPlayList($scope.playlList[i].themeIds);
                }

                if ($scope.playlList.length > 0) {
                    $scope.curPlayListIndex = 0;
                    $scope.playlist = $scope.playlList[$scope.curPlayListIndex];

                    window.sessionStorage.changedPlaylistId = $scope.playlist.id;

                    $scope.curThemeIndex = -1;
                    if ($scope.playlist.themeList.length > 0) {
                        $scope.curThemeIndex = 0;
                    }

                }
            }
        }
        $scope.getParagraphAry = function (letter) {
            var lines = letter.split('\n');
            var paragraphIndex = [];
            paragraphIndex.push(0);
            var index = 0;

            for (var i = 0; i < lines.length; i++) {
                if (i > 0 && (lines[i - 1] == '' || lines[i - 1] == ' ')) {
                    paragraphIndex.push(i);
                    console.log(i);
                }
            }

            if (lines[lines.length - 1] == '' || lines[lines.length - 1] == ' ')
                paragraphIndex.push(lines.length);
            else
                paragraphIndex.push(lines.length+1);
            return paragraphIndex;
        }
    })