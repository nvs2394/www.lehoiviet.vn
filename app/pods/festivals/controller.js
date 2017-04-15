var festivals = angular.module("lehoiviet");

festivals.controller("festivalsController", function($scope, $rootScope, festivalService, dateHelper, categoryService) {
  $scope.festivals = [];
  $scope.currentPage = 1;
  $scope.totalPages = 1;

  $scope.isDefault = true;
  $scope.initData = function() {
    $rootScope.currentPage = "festivals";

    categoryService.get(function(response){
      $scope.categories = response.data.data;
    });

    $("html, body").stop().animate({scrollTop:0}, '1000', 'swing');

    var data = {};
    data.page = $scope.currentPage;
    data.limit = 1;

    festivalService.getFestivals(data, function(response){
      $scope.festivals = response.data.rows;
      $scope.totalPages = response.data.totalPage;
    });
  };

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

  $scope.showMore = function(){
    if ($scope.currentPage >= $scope.totalPages){
      return;
    }

    $scope.currentPage = $scope.currentPage + 1;
    var data = {};
    data.page = $scope.currentPage;
    data.limit = 1;

    festivalService.getFestivals(data, function(response){
      for (var i = 0; i < response.data.rows.length; ++i){
        $scope.festivals.push(response.data.rows[i]);
      }

      $scope.totalPages = response.data.totalPage;
    });
  };

  $scope.onFilterByLocation = function(){
    $scope.isDefault = false;
    if ($scope.location == null || $scope.location == undefined) {
      return;
    }

    festivalService.filterByLocation($scope.location, function(response){
      $scope.festivals = response.data.rows;
    });
  };

  $scope.onFilterByType = function(){
    $scope.isDefault = false;
    if ($scope.types == null || $scope.types.length <= 0) {
      return;
    }

    var queryString = "";
    for (var i = 0; i < $scope.types.length; ++i) {
      queryString = queryString + "typeId=" + $scope.types[i];
      if (i < $scope.types.length -1 ) {
        queryString = queryString + "&";
      }
    }

    festivalService.filterByType(queryString, function(response){
      $scope.festivals = response.data.rows;
    });
  };

  $scope.onFilterByDate = function(){
    $scope.isDefault = false;
    if($scope.date == null || $scope.date == undefined) {
      return;
    }

    festivalService.filterByDate($scope.date, function(response){
      $scope.festivals = response.data.rows;
    });
  };

  $scope.onFilterByPrice = function(){
    $scope.isDefault = false;
    if($scope.price == null || $scope.price == undefined){
      return;
    }

    festivalService.filterByPrice($scope.price, function(response){
      $scope.festivals = response.data.rows;
    });
  };

  $scope.searchByTitle = function(){
    
    if ($scope.title == null || $scope.title == 'undefined'){
      return;
    }

    festivalService.searchByTitle($scope.title, function(response){
      $scope.festivals = response.data.data;
    })
  };
});
