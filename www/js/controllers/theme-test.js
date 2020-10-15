angular.module('app')
    .controller('ThemeTestCtrl', function ($scope, $state, $ionicLoading, $ionicPopup, $rootScope, $stateParams, $filter, $ionicPopover, ThemeManager, MediaManager, PlayListManager, $ionicScrollDelegate) {
        $scope.$on('$ionicView.loaded', function () {
            var id = $stateParams.id;
            if (id) {
                $scope.theme = ThemeManager.getTheme(id);
                $scope.isNew = false;
            } else {
                $scope.theme = ThemeManager.makeNewTheme();
                $scope.isNew = true;
            }

            $scope.isPlaying = false;

            if ($scope.theme.letterItemList.length > 0 && $scope.theme.tested)
                $scope.playMode = true;
            else
                $scope.playMode = false;

            $scope.letterItemList = $scope.theme.letterItemList;

            $scope.curLetterItemIndex = 0;
            $scope.curParagraphIndex = 0;
            $scope.curParagraphAry = [];
            $scope.a = 0.0;

            $scope.letter = $scope.theme.letter;

            $scope.timer = null;

            $scope.popover = $ionicPopover.fromTemplate(
                '<ion-popover-view class="theme-test-popover">' +
                '<div class="content">' +
                '<img src="img/theme-test/testmode_popup_bg.png"/>' +
                '<span>' + $filter('translate')('tap_on_screen') + '</span>' +
                '</div>' +
                '</ion-popover-view>', {
                    scope: $scope
                })

            console.log("Theme Test " + $scope.theme.audio_file);
        });

        $scope.$on('$destroy', function () {
            $scope.popover.remove();
        });

        $scope.getFontColor = function (color) {
            var fontColor = 'black';

            switch (color) {
                case '#26afb2':
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
                case '#26afb2':
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

        $scope.tickLetter = function () {
            if ($scope.isPlaying && !$scope.playMode) {
                $scope.theme.tested = true;
                if ($scope.theme.mode == 'paragraph') {
                    if ($scope.curLetterItemIndex < $scope.letterItemList.length) {
                        if ($scope.curLetterItemIndex > 0 && $scope.curParagraphIndex > 0) {
                            for (var i = $scope.curParagraphAry[$scope.curParagraphIndex - 1]; i < $scope.curParagraphAry[$scope.curParagraphIndex]; i++) {
                                $scope.letterItemList[i].isShow = false;
                            }
                        }

                        while ($scope.curLetterItemIndex < $scope.curParagraphAry[$scope.curParagraphIndex + 1]) {
                            $scope.letterItemList[$scope.curLetterItemIndex].id = ($scope.curLetterItemIndex + 1);
                            $scope.letterItemList[$scope.curLetterItemIndex].time = $scope.a;
                            if ($scope.curLetterItemIndex == $scope.curParagraphAry[$scope.curParagraphIndex + 1] - 2)
                                $scope.letterItemList[$scope.curLetterItemIndex].isTick = true;

                            $scope.curLetterItemIndex++;
                        }

                        $scope.curParagraphIndex++;

                    }

                }
                else if ($scope.theme.mode == 'line' || $scope.theme.mode == 'full') {
                    if ($scope.curLetterItemIndex < $scope.letterItemList.length) {
                        $scope.letterItemList[$scope.curLetterItemIndex].id = ($scope.curLetterItemIndex + 1);
                        $scope.letterItemList[$scope.curLetterItemIndex].time = $scope.a;
                        $scope.letterItemList[$scope.curLetterItemIndex].isTick = true;
                        if ($scope.curLetterItemIndex > 0)
                            $scope.letterItemList[$scope.curLetterItemIndex - 1].isShow = false;

                    }
                    $scope.curLetterItemIndex++;
                }
            }
        }

        $scope.toggleTestMode = function ($event) {
            if ($scope.playMode) {
                if ($scope.theme.letterItemList.length > 0) {

                    var alertPopup = $ionicPopup.confirm({
                        title: $filter('translate')('theme_test_exist')
                    });

                    alertPopup.then(function (res) {
                        if (res) {
                            $scope.playMode = !$scope.playMode;
                            for (var i = 0; i < $scope.letterItemList.length; i++) {
                                $scope.letterItemList[i].isShow = true;
                            }
                            if ($scope.letterItemList.length == 0) {
                                $scope.theme.letter = $("#theme-test-letter").val();
                                $scope.theme.letterItemList = [];
                            } else {
                                $scope.theme.letter = $scope.letter;
                                $scope.theme.letterItemList = $scope.letterItemList;
                            }

                            $scope.theme.tested = false;

                            ThemeManager.saveTheme($scope.theme, function () {
                                $scope.stopAudio();
                            });
                        }
                    });
                } else {
                    $scope.playMode = !$scope.playMode;
                    for (var i = 0; i < $scope.letterItemList.length; i++) {
                        $scope.letterItemList[i].isShow = true;
                    }
                    if ($scope.letterItemList.length == 0) {
                        $scope.theme.letter = $("#theme-test-letter").val();
                        $scope.theme.letterItemList = [];
                    } else {
                        $scope.theme.letter = $scope.letter;
                        $scope.theme.letterItemList = $scope.letterItemList;
                    }

                    ThemeManager.saveTheme($scope.theme, function () {
                        $scope.stopAudio();
                    });
                }
            } else {
                $scope.playMode = !$scope.playMode;
                for (var i = 0; i < $scope.letterItemList.length; i++) {
                    $scope.letterItemList[i].isShow = true;
                }
                if ($scope.letterItemList.length == 0) {
                    $scope.theme.letter = $("#theme-test-letter").val();
                    $scope.theme.letterItemList = [];
                } else {
                    $scope.theme.letter = $scope.letter;
                    $scope.theme.letterItemList = $scope.letterItemList;
                }

                ThemeManager.saveTheme($scope.theme, function () {
                    $scope.stopAudio();
                });
            }

        }

        $scope.playAudio = function () {
            if (!$scope.playMode) {
                $scope.letter = $("#theme-test-letter").val();
                if ($scope.letter != "") {
                    $scope.letterItemList = $scope.breakLetterIntoItems($scope.letter);
                    if ($scope.theme.mode == 'paragraph')
                        $scope.curParagraphAry = $scope.getParagraphAry($scope.letter);
                }
                if ($scope.letterItemList.length == 0) {
                    var alertPopup = $ionicPopup.alert({
                        title: $filter('translate')('input_letter')
                    }).then(function () {
                    });
                }

                $scope.curLetterItemIndex = 0;
                $scope.curParagraphIndex = 0;

                if ($scope.theme.audio_file != "" && $scope.theme.audio_file != undefined) {
                    $scope.isPlaying = true;
                    MediaManager.MediaPlayer.stopAudio();
                    MediaManager.MediaPlayer.playAudio($scope.theme.audio_file);
                } else {
                    $scope.isPlaying = true;
                }

                $scope.a = 0.0;

            } else {
                if ($scope.letterItemList.length == 0) {
                    var alertPopup = $ionicPopup.alert({
                        title: $filter('translate')('no_time_mark')
                    }).then(function () {
                    });

                }
                if ($scope.theme.mode == 'paragraph') {
                    $scope.curParagraphAry = $scope.getParagraphAry($scope.theme.letter);
                }

                $scope.curLetterItemIndex = 0;
                $scope.curParagraphIndex = 0;

                if ($scope.theme.audio_file != "" && $scope.theme.audio_file != undefined) {
                    $scope.isPlaying = true;
                    MediaManager.MediaPlayer.playAudio($scope.theme.audio_file);
                } else {
                    $scope.isPlaying = true;
                }
            }

            $scope.timer = setInterval(function () {
                $scope.a += 0.05;
                if (!$scope.playMode) {
                } else {
                    if ($scope.theme.mode == 'line' || $scope.theme.mode == 'full') {
                        for (var i = 0; i < $scope.letterItemList.length; i++) {
                            if ((($scope.a + 0.1) - $scope.letterItemList[i].time) < 0.15 && (($scope.a + 0.1) - $scope.letterItemList[i].time) >= 0) {
                                $("#letterItem-" + $scope.letterItemList[i].id).css('color', $scope.getActiveFontColor($scope.theme.color));
                                if (i > 0)
                                    $("#letterItem-" + $scope.letterItemList[i - 1].id).hide();
                                break;
                            }
                        }
                    }
                    else if ($scope.theme.mode == 'paragraph') {
                        for (var i = 0; i < $scope.curParagraphAry.length - 1; i++) {
                            if ((($scope.a + 0.1) - $scope.letterItemList[$scope.curParagraphAry[i]].time) < 0.15 && (($scope.a + 0.1) - $scope.letterItemList[$scope.curParagraphAry[i]].time) >= 0) {

                                for (var j = $scope.curParagraphAry[i]; j < $scope.curParagraphAry[i + 1] - 1; j++) {
                                    $("#letterItem-" + $scope.letterItemList[j].id).css('color', $scope.getActiveFontColor($scope.theme.color));
                                }
                                if (i > 0) {
                                    for (var j = $scope.curParagraphAry[i - 1]; j < $scope.curParagraphAry[i]; j++) {
                                        $("#letterItem-" + $scope.letterItemList[j].id).hide();
                                    }
                                }

                                break;
                            }
                        }
                    }

                }
            }, 50);
        }

        $scope.$on('$destroy', function () {
            $scope.popover.remove();
            if ($scope.timer)
                clearInterval($scope.timer);
        });

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

        $scope.doSave = function () {
            if ($scope.isNew) {
                var promptPopup = $ionicPopup.prompt({
                    title: $filter('translate')('message'),
                    template: $filter('translate')('input_theme_title'),
                    inputType: 'text',
                });
                promptPopup.then(function (res) {
                    if (res != undefined) {
                        for (var i in $scope.letterItemList) {
                            $scope.letterItemList[i].isShow = true;
                        }
                        if (!$scope.playMode) {
                            if (!$scope.isPlaying) {
                                $scope.theme.letter = $("#theme-test-letter").val();
                                $scope.theme.letterItemList = $scope.breakLetterIntoItems($("#theme-test-letter").val());
                            }
                            else {
                                $scope.theme.letter = $scope.letter;
                                $scope.theme.letterItemList = $scope.letterItemList;
                            }
                        }

                        $scope.theme.title = res;


                        ThemeManager.saveTheme($scope.theme, function () {
                            var alertPopup = $ionicPopup.alert({
                                title: $filter('translate')('theme_test_save_success')
                            });

                            $scope.isNew = false;
                        });
                    }
                });
            } else {
                for (var i in $scope.letterItemList) {
                    $scope.letterItemList[i].isShow = true;
                }

                if (!$scope.playMode) {
                    if (!$scope.isPlaying) {
                        $scope.theme.letter = $("#theme-test-letter").val();
                        $scope.theme.letterItemList = $scope.breakLetterIntoItems($("#theme-test-letter").val());
                    }
                    else {
                        $scope.theme.letter = $scope.letter;
                        $scope.theme.letterItemList = $scope.letterItemList;
                    }
                }

                ThemeManager.saveTheme($scope.theme, function () {
                    var alertPopup = $ionicPopup.alert({
                        title: $filter('translate')('theme_test_save_success')
                    });

                    alertPopup.then(function () {
                        MediaManager.MediaPlayer.stopAudio();
                        $state.go('main.theme-list');
                    });
                });
            }
        }

        $scope.breakLetterIntoItems = function (letter) {
            var ary = [];
            if (letter == '' || letter == ' ') {
                return ary;
            }
            switch ($scope.theme.mode) {
                case "paragraph":
                    tempAry = letter.split("\n");

                    for (var i in tempAry) {

                        ary.push({ text: tempAry[i], isTick: false, time: -1, isShow: true });

                    }
                    break;
                case "line":
                    var tempAry = letter.split("\n");
                    for (var i in tempAry) {
                        ary.push({ text: tempAry[i], isTick: false, time: -1, isShow: true });
                    }
                    break;
                case "full":
                    ary = [{ text: letter, isTick: false, time: -1, isShow: true }];
                    break;
                case "text":
                    ary = [{ text: letter, isTick: false, time: -1, isShow: true }];
                    break;
            }

            return ary;
        }

        $scope.getParagraphAry = function (letter) {
            var lines = letter.split('\n');
            var paragraphIndex = [];
            paragraphIndex.push(0);
            var index = 0;

            for (var i = 0; i < lines.length; i++) {
                if (i > 0 && (lines[i - 1] == '' || lines[i - 1] == ' ')) {
                    paragraphIndex.push(i);
                }
            }

            if (lines[lines.length - 1] == '' || lines[lines.length - 1] == ' ')
                paragraphIndex.push(lines.length);
            else
                paragraphIndex.push(lines.length + 1);
            return paragraphIndex;
        }

    })