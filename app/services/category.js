var app = angular.module("lehoiviet");

app.service("categoryService", function(net) {
    var categoryService = {};

    categoryService.create = function(data, eventHandler){
        net.post('/category/create/', data, eventHandler);
    };

    categoryService.get = function(eventHandler) {
        net.get("/category/lists", eventHandler);
    };

    categoryService.getById = function(id, eventHandler) {
        net.get('/category/'.concat(id), eventHandler);
    };

    categoryService.update = function(data, eventHandler){
        net.post('/category/update/', data, eventHandler);
    };

    return categoryService;
});
