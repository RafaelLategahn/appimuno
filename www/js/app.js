// Ionic Starter App

angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('your_app_name', [
  'ionic',
  'your_app_name.directives',
  'your_app_name.controllers',
  // 'your_app_name.views',
  'your_app_name.services',
  'your_app_name.config',
  'your_app_name.factories',
  'your_app_name.filters',
  'ngMap',
  'angularMoment',
  'underscore',
  'ngCordova',
  'youtube-embed',
])

.run(function($ionicPlatform, AuthService, $rootScope, $state, $cordovaPushV5, WpPushServer, GCM_SENDER_ID) {

  $ionicPlatform.on("deviceready", function(){

    AuthService.userIsLoggedIn().then(function(response)
    {
      if(response === true)
      {
        //update user avatar and go on
        AuthService.updateUserAvatar();

        $state.go('app.home');
      }
      else
      {
        $state.go('walkthrough');
      }
    });

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    var options = {
    	android: {
    	  senderID: GCM_SENDER_ID
    	},
      ios: {
        alert: "true",
        badge: "true",
        sound: "true"
      },
      windows: {

      }
    };
    var current_platform = "",
        token = "";


    // initialize
    $cordovaPushV5.initialize(options).then(function() {
      // start listening for new notifications
      $cordovaPushV5.onNotification();
      // start listening for errors
      $cordovaPushV5.onError();


      // register to get registrationId
      $cordovaPushV5.register().then(function(data) {
        console.log("data contains the user token: ", data);

        if(ionic.Platform.isIOS()){
          current_platform = "ios";
          token = data;
          // token = data.registrationId;
        }
        else if(ionic.Platform.isAndroid()){
          current_platform = "android";
          token = data;
        }

        WpPushServer.storeDeviceToken(current_platform, token);
      });
    });

    // triggered every time notification received
    $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data){
      //data param will have the following params which you can use.

      // data.message,
      // data.title,
      // data.count,
      // data.sound,
      // data.image,
      // data.additionalData


      //use this to navigate to a specific post:
      // if(data.additionalData)
      //    {
      //      $ionicHistory.nextViewOptions({
      //        disableAnimate: true
      //      });
      //      $state.go("app.post", { postId: notification.relatedvalue });
      //    }
    });

    // triggered every time error occurs
    $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e){
      // e.message
    });

  });

  $ionicPlatform.on("resume", function(){
    AuthService.userIsLoggedIn().then(function(response)
    {
      if(response === false)
      {
        $state.go('walkthrough');
      }else{
        //update user avatar and go on
        AuthService.updateUserAvatar();
      }
    });

  });

  // UI Router Authentication Check
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.data.authenticate)
    {
      AuthService.userIsLoggedIn().then(function(response)
      {
        if(response === false)
        {
          event.preventDefault();
          $state.go('walkthrough');
        }
      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('walkthrough', {
    url: "/",
    templateUrl: "views/auth/walkthrough.html",
    controller: 'WalkthroughCtrl',
    data: {
      authenticate: false
    }
  })

  .state('register', {
    url: "/register",
    templateUrl: "views/auth/register.html",
    controller: 'RegisterCtrl',
    data: {
      authenticate: false
    }
  })

  .state('login', {
    url: "/login",
    templateUrl: "views/auth/login.html",
    controller: 'LoginCtrl',
    data: {
      authenticate: false
    }
  })

  .state('forgot_password', {
    url: "/forgot_password",
    templateUrl: "views/auth/forgot-password.html",
    controller: 'ForgotPasswordCtrl',
    data: {
      authenticate: false
    }
  })

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "views/app/home.html",
        controller: 'HomeCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.bookmarks', {
    url: "/bookmarks",
    views: {
      'menuContent': {
        templateUrl: "views/app/bookmarks.html",
        controller: 'BookMarksCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.contact', {
    url: "/contact",
    views: {
      'menuContent': {
        templateUrl: "views/app/contact.html",
        controller: 'ContactCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })
  
  .state('app.cotacao', {
    url: "/cotacao",
    views: {
      'menuContent': {
        templateUrl: "views/app/cotacao.html",
        controller: 'CotacaoCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.post', {
    url: "/post/:postId",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/post.html",
        controller: 'PostCtrl'
      }
    },
    data: {
      authenticate: true
    },
    resolve: {
      post_data: function(PostService, $ionicLoading, $stateParams) {
        $ionicLoading.show({
      		template: 'Carregando ...'
      	});

        var postId = $stateParams.postId;
        return PostService.getPost(postId);
      }
    }
  })

  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "views/app/settings.html",
        controller: 'SettingCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.category', {
    url: "/category/:categoryTitle/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/category.html",
        controller: 'PostCategoryCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.produtos', {
    url: "/category/:categoryTitle/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/produtos.html",
        controller: 'PostCategoryCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })
  .state('app.artigos', {
    url: "/category/:categoryTitle/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/category.html",
        controller: 'PostArtigosCtrl'
      }
    },
    data: {
      authenticate: true
    }
  })

  .state('app.page', {
   url: "/wordpress_page",
  //  url: "/wordpress_page",
  views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/wordpress-page.html",
        controller: 'PageCtrl'
      }
    },
    data: {
      authenticate: true
    },
    resolve: {
      page_data: function(PostService) {
        //You should replace this with your page slug
        var page_slug = 'about';
        return PostService.getWordpressPage(page_slug);
      }
    }
  })
  .state('app.sobre', {
    url: "/wordpress_page",
   //  url: "/wordpress_page",
   views: {
       'menuContent': {
         templateUrl: "views/app/wordpress/wordpress-page.html",
         controller: 'PageCtrl'
       }
     },
     data: {
       authenticate: true
     },
     resolve: {
       page_data: function(PostService) {
         //You should replace this with your page slug
         var page_slug = 'about';
         return PostService.getWordpressPage(page_slug);
       }
     }
   })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
})

;
