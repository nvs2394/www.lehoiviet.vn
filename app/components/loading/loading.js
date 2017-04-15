var loading = angular.module("component");

loading.directive("dataLoader", function(){
  return {
        restrict: "E",
        templateUrl: "app/components/loading/template.html",
        controller: "loadingController"
    };
});

loading.controller("loadingController", function($scope) {

});
