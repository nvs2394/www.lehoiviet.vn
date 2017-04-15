var app = angular.module("lehoiviet");

app.service("userService", function(net, $http, $rootScope, cookiesManager) {
    var userService = {};

    userService.signup = function(user, eventHandler){
        net.post('/user/signup', user, eventHandler);
    };

     userService.login = function(user, eventHandler){
        net.post('/user/login', user, eventHandler);
    };

    userService.autoLogin = function(eventHandler) {
      var user = {};
      user.email = cookiesManager.get("email");

      if (user.email == null) {
        return;
      }

      user.password = cookiesManager.get("password");
      if (user.password == null) {
        return;
      }

      userService.login(user, eventHandler);
    };

    userService.logout = function(eventHandler) {
        net.post("/user/logout", null, eventHandler);
    };

    userService.changeAvatar = function(post, eventHandler){
        net.upload('/user/avatar/update', post, eventHandler);
    };

    userService.inactive = function(eventHandler) {
        net.get("/user/inactive", eventHandler);
    };

    userService.getById = function(data, eventHandler) {
        net.get('/user/avatar/update/'.concat(data), eventHandler);
    };

    userService.update = function(uid, user, eventHandler){
      net.post('/user/update/'.concat(uid), user, eventHandler);
    };

    userService.getUserbyId = function(id, eventHandler){
        net.get('/user/show/'.concat(id), eventHandler);
    };

    userService.getAll = function(eventHandler){
        net.get('/user/top', eventHandler);
    };

    userService.getProfile = function(id, eventHandler){
        net.get('/user/profile/'.concat(id), eventHandler);
    };

    userService.getGuestProfile = function(id, eventHandler){
      net.get('/user/guest/profile/'.concat(id), eventHandler);
    };

    userService.changePassword = function(uid, passwords, eventHandler){
        $http.defaults.headers.common['Authorization'] = $rootScope.token;
        net.post('/user/password/change/'.concat(uid), passwords, eventHandler);
    };

    userService.forgotPassword = function(data, eventHandler){
      net.post('/user/password/forgot', data, eventHandler);
    };

    userService.resetPassword = function(data, eventHandler){
      net.post('/user/password/reset', data, eventHandler);
    };

    userService.loginByFacebook = function(access_token, eventHandler){
        net.get('/user/facebook?access_token='.concat(access_token), eventHandler);
    };

    return userService;
});
