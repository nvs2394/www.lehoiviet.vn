var app = angular.module("lehoiviet", ["ngRoute", "component", "ngCookies", "ngSanitize", "ng.ckeditor", "ngImgCrop", "ngMap", "ui.bootstrap"]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/pods/home/view.html',
            controller: "homeController",
            controllerAs: 'home'
        })
        .when('/festivals', {
            templateUrl: 'app/pods/festivals/view.html',
            controller: "festivalsController",
            controllerAs: 'festivals'
        })
        .when('/festival/create', {
            templateUrl: 'app/pods/create-festival/view.html',
            controller: "createFestivalController",
            controllerAs: 'createFestival'
        })
        .when('/festival/:festivalId', {
            templateUrl: 'app/pods/festival/view.html',
            controller: "festivalController",
            controllerAs: 'festival'
        })
        .when('/festival/update/:festivalId', {
            templateUrl: 'app/pods/create-festival/view.html',
            controller: "createFestivalController",
            controllerAs: 'festival'
        })
        .when('/video', {
            templateUrl: 'app/pods/video/view.html',
            controller: "videoController",
            controllerAs: 'video'
        })
        .when('/blog', {
            templateUrl: 'app/pods/blog/view.html',
            controller: "blogController",
            controllerAs: 'blog'
        })
        .when('/blog/create', {
            templateUrl: 'app/pods/create-blog/view.html',
            controller: "createBlogController",
            controllerAs: 'createBlog'
        })
        .when('/user/profile', {
            templateUrl: 'app/pods/user/view.html',
            controller: "userController",
            controllerAs: 'user'
        })
        // .when('/users', {
        //     templateUrl: 'app/pods/user/view.html',
        //     controller: "userController",
        //     controllerAs: 'user'
        // })
        .when('/user/profile/:userId', {
            templateUrl: 'app/pods/user/view.html',
            controller: "userController",
            controllerAs: 'user'
        })
        .when('/account/setting', {
            templateUrl: 'app/pods/account/view.html',
            controller: "accountController",
            controllerAs: 'account'
        })
        .when('/lives', {
            templateUrl: 'app/pods/lives/list.html',
            controller: "livesController",
            controllerAs: 'lives'
        })
        .when('/live/create', {
            templateUrl: 'app/pods/create-live/live.html',
            controller: "createLiveController",
            controllerAs: 'createLive'
        })
        // .when('/live/:streamId', {
        //     templateUrl: 'app/pods/create-live/view.html',
        //     controller: "createLiveController",
        //     controllerAs: 'createLive'
        // })
        .when('/live/:festivalId', {
            templateUrl: 'app/pods/live/view.html',
            controller: "liveController",
            controllerAs: 'live'
        })
        .when('/users', {
            templateUrl: 'app/pods/users/view.html',
            controller: "usersController",
            controllerAs: 'users'
        })
        .when('/404', {
            templateUrl: 'app/pods/404/view.html',
            controller: "errorController",
            controllerAs: 'error'
        })
        .when('/chat/:streamId',{
            templateUrl:'app/pods/chat/chat-box.html',
            controller:"chatController",
            controllerAs:"chatBox"
        })
        .when('/resetpassword/:token',{
            templateUrl:'app/pods/reset-password/view.html',
            controller:"resetPasswordController",
            controllerAs:"resetPassword"
        })
        .otherwise({
            redirectTo: '/404'
        });
}]);

app.constant("ENV", {
    apiUrl: "https://api.lehoiviet.vn",
    gateWay: "https://api.lehoiviet.vn"
    // apiUrl: "http://localhost:3000",
    // gateWay: "http://localhost:3000"
    /*apiUrl: "http://api.lehoiviet.vn",
    gateWay: "http://api.lehoiviet.vn"*/
});

app.constant("FestivalStatus", {
    "1": "Bản Nháp",
    "2": "Chờ Duyệt",
    "3": "Đã Duyệt"
});

app.run(['$rootScope', '$window', 'facebookService', 'userService', 'gatewayService', function($rootScope, $window, facebookService, userService, gatewayService) {

  $rootScope.user = {};

  $window.fbAsyncInit = function() {
    // Executed when the SDK is loaded
    FB.init({

      /*
       The app id of the web app;
       To register a new app visit Facebook App Dashboard
       ( https://developers.facebook.com/apps/ )
      */

      appId: "226048441093415",

      /*
       Adding a Channel File improves the performance
       of the javascript SDK, by addressing issues
       with cross-domain communication in certain browsers.
      */

      channelUrl: 'channel.html',

      /*
       Set if you want to check the authentication status
       at the start up of the app
      */

      status: true,

      /*
       Enable cookies to allow the server to access
       the session
      */

      cookie: true,

      /* Parse XFBML */

      xfbml: true
    });

    facebookService.checkFacebookLoginStage(function(res){
      userService.loginByFacebook(res.authResponse.accessToken, function(response){
          var data = response.data;
          $rootScope.token = data.token;
          $rootScope.email = data.user.email;
          $rootScope.avatar = data.user.avatar;
          $rootScope.firstName = data.user.firstName;
          $rootScope.uid = data.user._id;

          gatewayService.online();
          $('#userLogin').modal('hide');
      });
    });
  };


  (function(d){
    // load the Facebook javascript SDK
    var js,
    id = 'facebook-jssdk',
    ref = d.getElementsByTagName('script')[0];

    if (d.getElementById(id)) {
      return;
    }

    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";

    ref.parentNode.insertBefore(js, ref);

  }(document));

}]);

app.controller("appController", function($scope, $rootScope, userService, gatewayService, festivalService, $route, FestivalStatus, liveService, notificationHelper) {
    $scope.init = function() {

        $rootScope.status = FestivalStatus;
        $rootScope.token = null;
        $rootScope.notification = {};
        $rootScope.notificationsForReplyingRequestStream = [];
        userService.autoLogin(function(response) {
            var data = response.data;
            $rootScope.token = data.token;
            $rootScope.email = data.user.email;
            $rootScope.avatar = data.user.avatar;
            $rootScope.firstName = data.user.firstName;
            $rootScope.uid = data.user._id;

            festivalService.getNotifiedFestival(function(response) {
                $rootScope.notification = response.data.data;
                angular.forEach($rootScope.notification, function(value, key) {
                    if (!value.data.notifyStatus) {
                        if ($rootScope.notification.unseen == null) {
                            $rootScope.notification.unseen = 0;
                        }
                        $rootScope.notification.unseen++;
                    }
                });
            });

            liveService.getNotifications(function(response){
              for (var i = 0; i < response.data.data.notifications.length; ++i){
                $rootScope.notificationsForReplyingRequestStream.unshift(JSON.parse(response.data.data.notifications[i].content));
              }
            });

            gatewayService.online();
            gatewayService.listen();

            gatewayService.listenOnBroadcastHasStream($scope.handelHasLiveStreamNotify);
        });
    };

    $scope.scrollTop = function(){
      $("html, body").stop().animate({scrollTop:0}, '1000', 'swing');
    };

    $scope.handelHasLiveStreamNotify = function(data){
      var audio = new Audio('./assets/enough.mp3');
      audio.play();
      notificationHelper.hasLiveStream(data);
    };
});
