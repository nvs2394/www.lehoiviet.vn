var user = angular.module("lehoiviet");

user.controller("userController", function($rootScope, $scope, userService, festivalService, FestivalStatus, cookiesManager, gatewayService, $routeParams, dateHelper, facebookService) {
  $scope.isChangingAvatar = false;
  $scope.isVisiter = false;
  $scope.dateHelper = dateHelper;
  $scope.festivals = [];
  $scope.initData = function() {
    if ($routeParams.userId != null && $routeParams.userId != undefined && $routeParams.userId >= 0){
      if ($rootScope.uid != $scope.isVisiter){
        $scope.isVisiter = true;
      }

    }
    if (!$scope.isVisiter && ($rootScope.uid == null || $rootScope.uid == undefined)) {
      window.location = "#/";
    };
    $rootScope.currentPage = "user-profile";

    if ($scope.isVisiter){
      initVissterGUI();
      getGuestProfile();
      getGuestFestival();
    }else {
      getProfile();
      getFestivals();
    }

  };

  getProfile = function() {
    userService.getProfile($rootScope.uid, function(response){
      $scope.user = response.data.data;
    });
  };

  getFestivals = function(){
    festivalService.getFestivalsByUser(function(response){
      $scope.festivals = response.data.data;
    });
  };

  initVissterGUI = function(){
    $('#logout').remove();

  };

  getGuestProfile = function(){
    var guestId = $routeParams.userId;
    userService.getGuestProfile(guestId, function(response){
      $scope.user = response.data.data;
    });
  };

  getGuestFestival = function(){
    var guestId = $routeParams.userId;
    festivalService.getFestivalsByGuest(guestId, function(response){
      $scope.festivals = response.data.data;
    });
  }

  $scope.onChangeTab = function(info){
    $(".infoTab section").addClass('hide');
    $("." + info + "Tab").removeClass('hide');
    $(".infoList li").removeClass('action');
    $("#" + info).addClass('action')
  };

  $scope.onUpdateProfile = function(){
    $scope.isUpdatingProfile = true;
    userService.update($rootScope.uid, $scope.user, function(response){
      $scope.isUpdatingProfile = false;
      showSubmittingNotification("Thay đổi thành công");
    });
  };

  $scope.showModalReset = function () {
    $('#reset-password').modal('show')
  }

  $scope.showModalChangeAvatar = function () {
    if (!$scope.isVisiter) {
      $('#upEditableImage').on('hidden.bs.modal', function(){
        resetImageSelector();
      });

      $('#upEditableImage').modal('show');
    }

  }

  showSubmittingNotification = function(message) {
    $.notify({
      icon: 'fa fa-check',
      message: message,
    },{
      type: 'submitting',
      allow_dismiss: false,

    });
  }

  $scope.onEditableImageSelected = function(element) {
    resetImageSelector();
    $scope.myEditableCroppedImage='';
    var selectedFile = element.files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      $scope.$apply(function($scope){
        $scope.editableImage=reader.result;
      });
    }, false);

    reader.readAsDataURL(selectedFile);
  }

  $scope.onChangeAvatar = function(){
    var data = new FormData();
    data.append("file", dataURItoBlob($scope.myEditableCroppedImage));

    $scope.isChangingAvatar = true;
    userService.changeAvatar(data, function(response){
      resetImageSelector();
      $('#upEditableImage').modal('hide');

      $scope.isChangingAvatar = false;
      $scope.user.avatar = response.data.data.avatar;
      $rootScope.avatar = $scope.user.avatar;
    });
  }

  resetImageSelector = function() {
    $scope.editableImage = null;
    $scope.myEditableCroppedImage = null;
  }

  $scope.onEditFestival = function(festivalId){
    window.location = "#/festival/update/".concat(festivalId);
  }

  $scope.onConfirmDelete = function(festivalId){
    $("#delete-festival").modal("show");
    $scope.selectedFestivalId = festivalId;
  };

  $scope.onDelete = function(){
    if ($scope.selectedFestivalId != null){
      festivalService.delete($scope.selectedFestivalId, function(response){
        $("#delete-festival").modal("hide");
        $scope.selectedFestivalId = null;
        getFestivals();
      });
    }
  };

  $scope.logout = function() {
    userService.logout(function(response){
      if(response.status == 200) {
        $rootScope.token = null;
        if ($rootScope.notification != null){
          $rootScope.notification.unseen = 0;
          $rootScope.notification = null;
        }
        $rootScope.uid = -1;
        cookiesManager.removeUser();
        window.location = "#/";
        gatewayService.offline();
      }
      facebookService.logout();
    });
  };
});

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
