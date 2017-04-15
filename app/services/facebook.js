var app = angular.module("lehoiviet");

app.service("facebookService", function($http, net, $rootScope) {
    var facebookService = {};

    facebookService.checkFacebookLoginStage = function(callback){
        FB.Event.subscribe('auth.authResponseChange', function(res) {
            if (res.status === 'connected') {
                callback(res);
            }
            else {

            }

        });

    };

    facebookService.login = function(callback){
      FB.login(function(response){
        callback(response);
      }, {scope: 'public_profile,email'});
    };

    facebookService.logout = function(){
      FB.logout(function(response){

      });
    };

    facebookService.onShareFacebook = function(data){
      FB.ui({
        method: 'share',
        display: 'popup',
        href: data.href,
        picture: data.picture,
        title: data.title,
        description: data.description
      }, function(response){});
    };

    return facebookService;
});
