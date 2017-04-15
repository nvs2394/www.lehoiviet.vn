var app = angular.module("lehoiviet");

app.service("postService", function(net) {
    var postService = {};

    postService.getAll = function(eventHandler) {
        net.get("/post/lists", eventHandler);
    };

    postService.getById = function(id, eventHandler) {
        net.get('/post/show/'.concat(id), eventHandler);
    };

    postService.create = function(post, eventHandler){
        net.post('/post/create', post, eventHandler);
    };

    postService.update = function(post, eventHandler){
        net.post('/post/update/', post, eventHandler);
    };

    postService.delete = function(id, eventHandler){
        net.get('/post/delete/'.concat(id), eventHandler);
    };

    postService.getSix = function(eventHandler){
        net.get("/post/lists/limit", eventHandler);
    };

    postService.getPostByAuthor = function(id, eventHandler){
        net.get('/post/getPost/'.concat(id), eventHandler);
    };

    postService.search = function(key, eventHandler){
        net.get('/post/search/title/'.concat(key), eventHandler);
    };

    return postService;
});
