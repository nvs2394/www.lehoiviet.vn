var app = angular.module("lehoiviet");

app.service("blogService", function($http, net, $rootScope) {
    var bloglService = {};

    bloglService.getById = function(id, eventHandler) {
        net.get('/blog/lists/user/'.concat(id), eventHandler);
    };

    bloglService.get = function(eventHandler) {
        net.get('/blog/lists', eventHandler);
    };

    bloglService.getBlog = function(id) {
        net.get('/blog/show/'.concat(id), eventHandler);
    };

    bloglService.getLimit = function(blog) {
        net.get('/blog/lists/limit', eventHandler);
    };

    bloglService.create = function(blog, eventHandler){
        net.post('/blog/create', blog, eventHandler);
    };

    bloglService.update = function(blog, eventHandler){
        net.post('/blog/update/', blog, eventHandler);
    };

    bloglService.delete = function(blog, eventHandler){
        net.post('/blog/delete/', blog, eventHandler);
    };

    return bloglService;
});
