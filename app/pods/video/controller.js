var video = angular.module("lehoiviet");

video.controller("videoController", function($rootScope, $scope, videoService, dateHelper) {
  $scope.initData = function() {
    $rootScope.currentPage = "video";
    getVideo();
  };

  getVideo= function() {
    videoService.get(function(response) {
      if (response.status == 200) {
        $scope.videos = response.data.data;
      } else {

      }
    });
  };
});
