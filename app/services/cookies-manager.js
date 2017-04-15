var app = angular.module("lehoiviet");

app.service("cookiesManager", function($cookieStore){
  var cookiesManager = {};

  cookiesManager.set = function(key, value) {
    if (key == null || key == undefined) {
      return;
    }

    $cookieStore.put(key, value);
  };

  cookiesManager.get = function(key) {
    return $cookieStore.get(key);
  };

  cookiesManager.remove = function(key) {
    $cookieStore.remove(key);
  };

  cookiesManager.removeUser = function(key) {
      console.log("Remove Cookie");
      $cookieStore.remove("email");
      $cookieStore.remove("password");
  };

  return cookiesManager;
});
