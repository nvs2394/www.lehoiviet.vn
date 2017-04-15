var app = angular.module("lehoiviet");

app.service("likeService", function(net) {
    var likeService = {};

    likeService.create = function(data, eventHandler){
        net.post('/like/createLike/', data, eventHandler);
    };

    return likeService;
});
