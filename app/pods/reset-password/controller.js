var resetPassword = angular.module("lehoiviet");

resetPassword.controller("resetPasswordController", function($scope, userService, $routeParams, $timeout) {
  $scope.init = function(){
    $scope.isLoading = false;
  };

  $scope.rsPassword = function(){
    if ($scope.password == null || $scope.password == 'undefined'){
        $scope.alert = "Xin Vui Lòng Nhập Mật Khẩu";
        return;
    }

    if ($scope.password != $scope.repassword) {
      $scope.alert = "Mật Khẩu Phải Giống Nhau";
      $scope.password = null;
      $scope.repassword = null;

      return;
    }
    var data = {};
    data.token = $routeParams.token;
    data.newPassword = $scope.password;
    data.host = 'www';

    console.log(data);
    $scope.isLoading = true;
    userService.resetPassword(data, function(response){
      $scope.isLoading = false;
      $scope.alert = "Đổi Mật Khẩu Thành Công";

      $timeout(function() {
        window.location = "#/";
      }, 1000);
    });
  }
});
