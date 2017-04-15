var users = angular.module("lehoiviet");

users.controller("usersController", function($scope, userService, $rootScope) {
  $scope.init = function(){
    $("html, body").stop().animate({scrollTop:0}, '1000', 'swing');
    
    $rootScope.currentPage = "users";
    userService.getAll(function(response){
      $scope.users = response.data.data;
    });
  };
});
