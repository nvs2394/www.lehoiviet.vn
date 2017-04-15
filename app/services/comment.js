var app = angular.module("lehoiviet");

app.service("commentService", function(net) {
    var commentService = {};

    commentService.create = function(id, comment, eventHandler){
        net.upload('/comment/create/festival/'.concat(id), comment, eventHandler);
    };

    commentService.deleteById = function(id, eventHandler) {
        net.post('/comment/delete/'.concat(id), null, eventHandler);
    };

    commentService.update = function(id, comment, eventHandler){
        net.upload('/comment/update/'.concat(id), comment, eventHandler);
    };

    commentService.deleteImage = function(id, eventHandler){
      net.post('/image/delete/comment/'.concat(id), null, eventHandler);
    };

    return commentService;
});
