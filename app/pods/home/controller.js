var home = angular.module("lehoiviet");

home.controller("homeController", function($scope, $rootScope, festivalService) {

  $scope.initData = function() {
    $rootScope.currentPage = "home";
    getCommingSoonFestival();
    getFeaturedFestival();
  };

  getCommingSoonFestival = function() {
    festivalService.getCommingSoon(function(response) {
      if (response.status == 200) {
        $scope.commingSoonFestival = response.data.data;
        $scope.isLoaded = true;
      } else {

      }
    });
  };

  getFeaturedFestival = function() {
    festivalService.getFamouse(function(response) {
      if (response.status == 200) {
        $scope.featuredFestival = response.data.data;
      } else {

      }
    });
  };
});
