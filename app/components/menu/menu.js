var menu = angular.module("component");

menu.directive("topMenu", function(){
  return {
        restrict: "E",
        scope: {
            events: "=data"
        },
        templateUrl: "app/components/menu/template.html",
        controller: "menuController"
    };
});

menu.controller("menuController", function($scope, $rootScope, cookiesManager, userService, gatewayService, festivalService, liveService) {
  $scope.init = function() {
    gatewayService.listenOnReplyRequestStream($scope.handleReplyRequestStream);
  };

  $scope.loginView = function(){
      $('#userLogin').modal('show');
  };
  $scope.actionUserPanel = function(){
      window.location = "#/user/profile"
  };
  $scope.createFestivalView = function() {
    if ($rootScope.token != null) {
      window.location = "#/festival/create";
    } else {
      $('#userLogin').modal('show');
    }
  };
  $scope.logout = function() {
    userService.logout(function(response){
      if(response.status == 200) {
        $rootScope.token = null;
        $rootScope.notification.unseen = 0;
        $rootScope.notification = null;
        cookiesManager.removeUser();
        window.location = "#/";
        gatewayService.offline();
      }
    });
  };
  $scope.onClickNotification = function() {
    if ($rootScope.notification.unseen == null) {
      $rootScope.notification.unseen = 0;
    }
    festivalService.seen(function(response){

    });
    $rootScope.notification.unseen = 0;
  };
  $scope.onMaintenance = function(){
    $('#maintenance').modal('show');
  };

  $scope.handleReplyRequestStream = function(data){
    $rootScope.notificationsForReplyingRequestStream.unshift(data.data);
    var audio = new Audio('./assets/enough.mp3');
    audio.play();

    $scope.unread = true;
  };

  $scope.handleBroadcastHasStream = function(){

  };

  $scope.onReadStreamNotification = function(){
    $scope.unread = false;
  }
});
