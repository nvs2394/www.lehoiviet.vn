var app = angular.module("lehoiviet");

app.service("net", function($http, ENV, $rootScope, gatewayService) {
  var netService = {};


  netService.get = function(url, eventHandler) {
    gatewayService.online();
    $http.defaults.headers.common['Authorization'] = $rootScope.token;
    $http.get(ENV.apiUrl + url).then(eventHandler);
  };

  netService.getGoogle = function(path, eventHandler) {
    $.ajax({
    url: path,

    // The name of the callback parameter, as specified by the YQL service
    jsonp: "callback",

    // Tell jQuery we're expecting JSONP
    dataType: "json",

    // Work with the response
    success: eventHandler
});
  };

  netService.post = function(url, param, eventHandler) {
    gatewayService.online();
    $http.defaults.headers.common['Authorization'] = $rootScope.token;
    $http.post(ENV.apiUrl + url, param).then(eventHandler);
  };

  netService.put = function(url, param, eventHandler) {
    gatewayService.online();
    $http.put(ENV.apiUrl + url, param).then(eventHandler);
  };

  netService.upload = function(url, param, eventHandler) {
    gatewayService.online();
    $http.defaults.headers.common['Authorization'] = $rootScope.token;
    $http.post(ENV.apiUrl + url, param, {headers: {
                    'Content-Type': undefined
                }}).then(eventHandler);
  };


  return netService;
});
