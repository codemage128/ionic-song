angular.module('app')
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {
  // $compileProvider.imgSrcSanitizationWhitelist(/^\s(https|file|blob|cdvfile):|data:image\//);
  $stateProvider
  //auth
  .state('auth', {
    cache: false,
    url: "/auth",
    templateUrl: "views/auth/auth.html",
    abstract: true,
    controller: 'AuthCtrl'
  })
  .state('auth.signin', {
    cache: false,
    url: '/signin',
    templateUrl: "views/auth/signin.html",
    controller: 'SignInCtrl'
  })
  .state('main', {
    cache: false,
    url: "/main",
    abstract: true,
    templateUrl: "views/main/layout.html",
    controller: 'MainCtrl'
  })
  .state('main.menu', {
    cache: false,
    url: "/menu",
    views: {
      'menuContent': {
        templateUrl: "views/main/menu.html",
        controller: 'MainMenuController' 
      }
    }
  })
  .state('main.configuration', {
    cache: false,
    url: '/configuration', 
    views: {
      'menuContent': {
        templateUrl: "views/main/configuration.html",
        controller: 'ConfigurationCtrl'
      }
    }
  })
  .state('main.next-concert', {
    cache: false,
    url: '/next-concert', 
    views: {
      'menuContent': {
        templateUrl: "views/main/next-concert.html",
        controller: 'NextConcertCtrl'
      }
    }
  })
  .state('main.theme-list', {
    cache: false,
    url: "/theme-list",
    views: {
      'menuContent': {
        templateUrl: "views/main/theme-list.html",
        controller: 'ThemeListCtrl'
      }
    }
  })
  .state('main.theme-test', {
    cache: false,
    url: "/theme-test/:id",
    views: {
      'menuContent': {
        templateUrl: "views/main/theme-test.html",
        controller: 'ThemeTestCtrl'
      }
    }
  })
  .state('main.theme-info', {
    cache: false,
    url: "/theme-info/:id",
    views: {
      'menuContent': {
        templateUrl: "views/main/theme-info.html",
        controller: 'ThemeInfoCtrl'
      }
    }
  })
  .state('main.theme-param', {
    cache: false,
    url: "/theme-param/:id",
    views: {
      'menuContent': {
        templateUrl: "views/main/theme-param.html",
        controller: 'ThemeParamCtrl'
      }
    }
  })
  .state('main.playl-list', {
    cache: false,
    url: "/playl-list",
    views: {
      'menuContent': {
        templateUrl: "views/main/playl-list.html",
        controller: 'PlayLListCtrl'
      }
    }
  })
  .state('main.playl-new', {
    cache: false,
    url: "/playl-new/:id",
    views: {
      'menuContent': {
        templateUrl: "views/main/playl-new.html",
        controller: 'PlayLNewCtrl'
      }
    }
  })
  .state('main.playl-new-with-theme', {
    cache: false,
    url: "/playl-new-with-theme/:themeId",
    views: {
      'menuContent': {
        templateUrl: "views/main/playl-new-with-theme.html",
        controller: 'PlayLNewWithThemeCtrl'
      }
    }
  })
  .state('main.theme-add-playlist', {
    cache: false,
    url: "/theme-add-playlist/:id",
    views: {
      'menuContent': {
        templateUrl: "views/main/theme-add-playlist.html",
        controller: 'ThemeAddPlayListCtrl'
      }
    }
  })
  .state('main.playl-add-theme', {
    cache: false,
    url: "/playl-add-theme/:id",
    views: {
      'menuContent': {
        templateUrl: "views/main/playl-add-theme.html",
        controller: 'PlayLAddThemeCtrl'
      }
    }
  })
  .state('main.change-playlist', {
    cache: false,
    url: "/change-playlist",
    views: {
      'menuContent': {
        templateUrl: "views/main/change-playlist.html",
        controller: 'ChangePlaylistCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/auth/signin');
})
.constant('MAX_PAGE_NUM', 10)