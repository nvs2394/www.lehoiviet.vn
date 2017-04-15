var videoHeader = angular.module("component");

videoHeader.directive("videoHeader", function(){
  return {
        restrict: "E",
        templateUrl: "app/components/video-header/template.html",
        controller: "videoHeaderController"
    };
});

videoHeader.controller("videoHeaderController", function($scope, festivalService) {
  $scope.myInterval = 3000;
  $scope.init = function(){
    $scope.getThumbnails();
  };

  $scope.getThumbnails = function(){
    festivalService.getThumbnailsForSlider(function(response){
      $scope.thumbnails = response.data.data;
    });
  };
});
