angular.module('app')
    .controller('ThemeParamCtrl', function ($scope, $state, $ionicPlatform, $ionicPopup, $ionicLoading, $rootScope, $stateParams, $filter, ThemeManager, MediaManager) {
        $scope.$on('$ionicView.loaded', function () {
            MediaManager.MediaPlayer.stopAudio();
            var id = $stateParams.id;
            $scope.audio_name = "";

            $scope.platform = "android";

            if ($ionicPlatform.is('ios'))
                $scope.platform = "ios";

            if (id) {
                $scope.theme = ThemeManager.getTheme(id);
                if ($scope.theme.audio_file != "") {
                    $scope.audio_name = $scope.theme.audio_name;
                }
                $scope.mode = $scope.theme.mode;
            }

            angular.element(document).find('input[name=audio]')[0].addEventListener('change', function (e) {
                $scope.doAudioFileChange(e);
            })
        });

        $scope.doAudioClick = function (e) {
            window.plugins.iOSAudioPicker.getAudio(success, error, 'false', 'false');
            function success(data) {
                console.log(data);
                var obj = data[0];
                if (obj.filename.toLowerCase().indexOf('.mp3') > 0 || obj.filename.toLowerCase().indexOf('.wmv') > 0 || obj.filename.toLowerCase().indexOf('.m4a') > 0) {
                    $scope.theme.audio_file = {
                        filename: obj.filename,
                        url: obj.exportedurl
                    };
                    $scope.audio_name = obj.filename;
                    $scope.theme.audio_name = obj.filename;
                    var alertPopup = $ionicPopup.alert({
                        title: $scope.audio_name + " " + $filter('translate')('audio_select')
                    }).then(function () {
                    });
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: $filter('translate')('select_audio_file')
                    }).then(function () {
                    });
                }
            }

            function error(e) {
                console.log(e);
            }
        }

        $scope.doAudioFileChange = function (e) {
            var file = e.target.files[0];
            if (file.name.toLowerCase().indexOf('.mp3') > 0 || file.name.toLowerCase().indexOf('.wmv') > 0) {
                console.log("Audio_Change Prev " + $scope.theme.audio_name);
                $scope.theme.audio_file = e.target.files[0];
                $scope.audio_name = e.target.files[0].name;
                console.log("Audio_Change Next " + $scope.theme.audio_name);
                $scope.theme.audio_name = e.target.files[0].name;
                var alertPopup = $ionicPopup.alert({
                    title: $scope.audio_name + " " + $filter('translate')('audio_select')
                }).then(function () {
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: $filter('translate')('select_audio_file')
                }).then(function () {
                });
            }
        }

        $scope.changeMode = function () {
            if ($scope.mode != $scope.theme.mode) {
                $scope.theme.tested = false;
                $scope.theme.letterItemList = [];
            }
        }

        $scope.toggleJustification = function (val) {
            $scope.theme.justification = val;
        }

        $scope.toggleBold = function () {
            $scope.theme.bold = !$scope.theme.bold;
        }

        $scope.toggleColor = function (val) {
            $scope.theme.color = val;
        }

        $scope.doSave = function () {
            $ionicLoading.show({
                template: 'Saving...'
            });
            ThemeManager.saveTheme($scope.theme, function () {
                var alertPopup = $ionicPopup.alert({
                    title: $filter('translate')('theme_save_success')
                });

                alertPopup.then(function () {
                    $state.go('main.theme-test', { id: $scope.theme.id });
                });

                $ionicLoading.hide();
            });
        }
    })