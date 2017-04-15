var app = angular.module("lehoiviet");

app.service("reviewService", function(net) {
    var reviewService = {};
    reviewService.getAll = function(eventHandler) {
        net.get("/review/lists", eventHandler);
    };

    reviewService.getByAuthor = function(id, eventHandler) {
        net.get("/review/lists/user/".concat(id), eventHandler);
    };

    reviewService.getById = function(id, eventHandler) {
        net.get("/review/show/".concat(id), eventHandler);
    };

    reviewService.getSix = function(eventHandler) {
        net.get("/review/lists/limit", eventHandler);
    };

    postService.create = function(review, eventHandler){
        net.post('/review/create', review, eventHandler);
    };

    postService.update = function(review, eventHandler){
        net.post('/review/update/', review, eventHandler);
    };

    postService.delete = function(id, eventHandler){
        net.get('/review/delete/'.concat(id), eventHandler);
    };

  return reviewService;
});
