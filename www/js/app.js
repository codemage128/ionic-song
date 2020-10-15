// Ionic Starter App
angular.module('underscore', [])
  .factory('_', function () {
    return window._; // assumes underscore has already been loaded on the page
  });

angular.module('app', [
  'app.controllers',
  'app.directives',
  'app.factories',
  'app.services',
  'ionic',
  'ngCordova',
  'underscore',
  'pascalprecht.translate',
  'LocalStorageModule',
])
  .run(function ($ionicPlatform, $state, $stateParams, $ionicPopup, $filter, $ionicHistory) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.cordova) {
        cordova.plugins.diagnostic.requestExternalStorageAuthorization(function(status){
            console.log("Authorization request for external storage use was " + (status == cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
        }, function(error){
            console.error(error);
        });
      }

      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

    });

    $ionicPlatform.registerBackButtonAction(function (event) {
      event.preventDefault();
      if ($state.current.name == "main.menu") {
        var confirmPopup = $ionicPopup.confirm({
          title: $filter('translate')('exit'),
          template: $filter('translate')('exit_words')
        });

        confirmPopup.then(function (res) {
          if (res) {
            navigator.app.exitApp();
          }

        });
      } else {
        $ionicHistory.nextViewOptions({ disableBack: true });
        switch ($state.current.name) {
          case 'main.theme-list':
            $state.go('main.menu');
            break;
          case 'main.playl-list':
            $state.go('main.menu');
            break;
          case 'main.next-concert':
            $state.go('main.menu');
            break;
          case 'main.configuration':
            $state.go('main.menu');
            break;
          case 'main.configuration':
            $state.go('main.menu');
            break;
          case 'main.theme-test':
            $state.go('main.theme-list');
            break;
          case 'main.theme-add-playlist':
            $state.go('main.theme-list');
            break;
          case 'main.playl-new':
            $state.go('main.playl-list');
            break;
          case 'main.playl-add-theme':
            $state.go('main.playl-list');
            break;
          case 'main.theme-param':
            $state.go('main.theme-test', {id: $stateParams.id});
            break;
          case 'main.theme-info':
            $state.go('main.theme-test', {id: $stateParams.id});
            break;
          case 'main.change-playlist':
            $state.go('main.next-concert');
            break;
        }
      }
    }, 100);//registerBackButton

  })

