var app = angular.module("lehoiviet");

app.service("videoService", function(net) {
    var videoService = {};

    videoService.create = function(data, eventHandler){
        net.post('/video/create/', data, eventHandler);
    };

    videoService.update = function(data, eventHandler){
        net.post('/video/update/', data, eventHandler);
    };

    videoService.get = function(eventHandler) {
        net.get('/video/lists/', eventHandler);
    }; 

    videoService.getByAuthor = function(id, eventHandler) {
        net.get('/video/user/'.concat(id), eventHandler);
    };

    videoService.getByPost = function(id, eventHandler) {
        net.get('/video/post/'.concat(id), eventHandler);
    };

    videoService.delete = function(id, eventHandler) {
        net.get('/video/delete/'.concat(id), eventHandler);
    };
    return videoService;
});
