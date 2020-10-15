angular.module('app.controllers', [])
    .controller('AuthCtrl', function ($scope) {

    })
    .controller('SignInCtrl', function ($scope, $ionicPopup, $state, $ionicLoading, $rootScope, $filter, RootManager) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.user_email = '';
            $scope.user_password = '';

            if(RootManager.getLoginState()) {
                $state.go('main.menu');
            }
        });

        $scope.doLogin = function () {
            $ionicLoading.show({
                spinner: 'hide',
                content: '<div class=""><div class=""></div></div>'
            });

            $ionicLoading.hide();
            
            RootManager.saveLoginState(true);
            $state.go('main.menu');
        }
    })
    .controller('SignUpCtrl', function ($scope, $state, $ionicLoading, $rootScope, $filter) {
        $scope.$on('$ionicView.loaded', function () {
            $scope.user_email = '';
            $scope.user_name = '';
            $scope.user_music_group = '';
            $scope.user_surname = '';
            $scope.user_direction = '';
            $scope.user_city = '';
            $scope.user_cp = '';
            $scope.user_province = '';
            $scope.user_telephone = '';
            $scope.user_license = '';
            $scope.user_artist_name = '';
            $scope.user_pt_purpose = '';
            $scope.user_term_policy = true;
        });

        $scope.doRegister = function () {
            $ionicLoading.show({
                spinner: 'hide',
                content: '<div class=""><div class=""></div></div>'
            });

            $ionicLoading.hide();

            var alertPopup = $ionicPopup.alert({
                title: $filter('translate')('user_signup_success')
            });

            alertPopup.then(function () {
                $state.go('main.theme-list');
            });

        }
    })
    .controller('MainCtrl', function ($scope, $rootScope, ThemeManager, RootManager, $translate) {
        $scope.lang = $translate.use();

        console.log($scope.lang);
        $scope.changeLocale = function() {
            $scope.lang = $scope.lang == 'en' ? 'es' : 'en';
            $translate.use($scope.lang);
        }
        // console.log($translate.use('es'));
        // console.log($translate.use());
    })
    .controller('MainMenuController', function ($scope, $ionicPopup, $rootScope, $ionicHistory,$ionicPlatform) {
    
    });