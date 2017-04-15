var footer = angular.module("component");

footer.directive("infoFooter", function(){
  return {
        restrict: "E",
        scope: {
            events: "=data"
        },
        templateUrl: "app/components/info-footer/template.html",
        controller: "footerController"
    };
});

footer.controller("footerController", function($scope) {

});
