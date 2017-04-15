var blog = angular.module("lehoiviet");

blog.controller("blogController", function($scope, $rootScope, blogService) {
  $scope.initData = function() {
    $rootScope.currentPage = "blog";
    getBlogs();
  };

  getBlogs = function() {
    blogService.get(function(response) {
      if (response.status == 200) {
        $scope.blogs = response.data.data;
      } else {

      }
    });
  };
});
