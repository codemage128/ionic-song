angular.module('app')
    .controller('PlayLNewCtrl', function ($scope, $ionicPlatform, $cordovaCamera, $state, $ionicLoading, $ionicPopover, $ionicPopup, $ionicModal, $rootScope, $stateParams, $filter, ThemeManager, PlayListManager, ImageManager) {
        $scope.$on('$ionicView.loaded', function () {
            var id = $stateParams.id;
            if(id) {
                $scope.playList = PlayListManager.getPlayList(id);
                $scope.playList.date = new Date($scope.playList.date);
            }else{
                $scope.playList = PlayListManager.makeNewPlayList();
            }
        });

        $scope.doSaveImage = function () {

            $ionicPlatform.ready(function () {
                var options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.FILE_URL,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.PNG,
                };
                $cordovaCamera.getPicture(options)
                    .then(function (imageURI) {
                        ImageManager.saveSource(imageURI, function (url) {
                            if(url) {
                                $scope.playList.image = url;
                            }
                        });
                    }, function (error) {
                        console.log(error);
                    });
            });
        }

        $scope.doSave = function () {
            console.log(JSON.stringify($scope.playList));
            PlayListManager.savePlayList($scope.playList);


            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')('playlist_save_success')
            });

            alertPopup.then(function () {
                $state.go('main.playl-list');
            });
        }
    })