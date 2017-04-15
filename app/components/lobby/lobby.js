var lobby = angular.module("component");

lobby.directive("lobbyEvent", function(){
  return {
        restrict: "E",
        scope: {
            events: "=data",
            title: "@",
            isLoaded: "="
        },
        templateUrl: "app/components/lobby/template.html",
        controller: "lobbyController"
    };
});

lobby.controller("lobbyController", function($scope) {
  $scope.isLoaded = false;

  $scope.convertToCurrency = function(data){
    if (data != null && data != "undefined"){
      data = data.toString();
      var result = "";
      var counter = 0;
      for (var i = data.length - 1; i >= 0; --i){
        result += data.charAt(i);
        ++counter;
        if (counter % 3 == 0 && counter < data.length){
          result += ".";
        }
      }

      var result = result.split("").reverse().join("");
      return result;
    }
  };
});
