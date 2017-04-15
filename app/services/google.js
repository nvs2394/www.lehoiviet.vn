var app = angular.module("lehoiviet");

app.service("googleService", function($http, net, $rootScope) {
    var googleService = {};

    googleService.getLocation = function(address, eventHandler){
      console.log("maps.googleapis.com/maps/api/geocode/json?address=".concat(address)
       + "&key=AIzaSyDQMvm2Tiyhav_DY6drBYFDOxpqsfVDcis");
      net.getGoogle('https://maps.googleapis.com/maps/api/geocode/json?address='.concat(address)
       + "&key=AIzaSyDQMvm2Tiyhav_DY6drBYFDOxpqsfVDcis", eventHandler);
    };

    return googleService;
});
