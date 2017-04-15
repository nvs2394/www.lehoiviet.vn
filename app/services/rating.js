var app = angular.module("lehoiviet");

app.service("ratingService", function(net) {
    var categoryService = {};

    ratingService.create = function(data, eventHandler){
        net.post('/rating/rating/', data, eventHandler);
    };
   
    return ratingService;
});
