var alert = angular.module("component");

alert.directive("alertModal", function(){
  return {
      restrict: 'E',
      scope: {
        content: "@"
      },
      templateUrl: "app/components/alert/template.html",
      link: function(scope, element, attrs) {

      }
  };
});
