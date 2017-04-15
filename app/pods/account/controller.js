var account = angular.module("lehoiviet");

account.controller("accountController", function($rootScope, $scope, $rootScope, userService) {
  $scope.initData = function() {
    $rootScope.currentPage = "account-setting";
    getProfile();
  };

  $scope.onUpdateProfile = function(){
    var profile = {};
    profile.firstName = $scope.firstName;
    profile.lastName = $scope.lastName;
    profile.email = $scope.email;
    profile.gender = $scope.gender;
    profile.avatar = $scope.avatar;
    profile.company = $scope.company;
    profile.description = $scope.description;

    updateProfile(profile);
  };

  $scope.onChangePassword = function(){
    var passwords = {};
    passwords.oldPassword = $scope.oldPassword;
    passwords.newPassword = $scope.newPassword;

    changePassword(passwords);
  };

  $scope.changTab = function(info){
    $('.infoList a').removeClass('action');
    $('.infoList #' + info).addClass('action');
    $('.infoTab section').addClass('hide');
    $('.' + info + 'Tab').removeClass('hide')
  },

  getProfile = function() {
    userService.getProfile($rootScope.uid, function(response){
      if (response.status == 200) {
        var data = response.data.data;
        $scope.company = data.company;
        $scope.firstName = data.firstName;
        $scope.lastName = data.lastName;
        $scope.description = data.description;
        $scope.gender = data.gender;
        $scope.email = data.email;
        $scope.avatar = data.avatar;
      }
    });
  };

  updateProfile = function(profile) {
    userService.update($rootScope.uid, profile, function(response) {

    });
  };

  changePassword = function(passwords) {
    userService.changePassword($rootScope.uid, passwords, function(response) {

    });
  }
});
