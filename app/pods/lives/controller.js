var live = angular.module("lehoiviet");

live.controller("livesController", function($scope, $rootScope, liveService, dateHelper) {
    $scope.initData = function() {
        $rootScope.currentPage = "live";
        getLives();
    };

    getLives = function() {
        liveService.get(function(response) {
            if (response.status == 200) {
                console.log(response.data.data)
                $scope.lives = response.data.data;
            } else {

            }
        });
    };
});
