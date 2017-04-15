var app = angular.module("lehoiviet");

app.service("provinceService", function(net) {
    var provinceService = {};

    provinceService.get = function(eventHandler){
        net.get('/province/lists/', eventHandler);
    };

    return provinceService;
});
