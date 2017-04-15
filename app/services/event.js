var app = angular.module("lehoiviet");

app.service("eventService", function(net) {
    var eventService = {};

    eventService.create = function(festivalId, data, eventHandler){
      net.post('/event/create/'.concat(festivalId), data, eventHandler);
    };

    eventService.updateById = function(eventId, data, eventHandler) {
      net.post('/event/update/'.concat(eventId), data, eventHandler);
    }

    eventService.delete = function(eventId, eventHandler) {
      net.post('/event/delete/'.concat(eventId), data, eventHandler);
    }

    eventService.getById = function(eventId, eventHandler) {
      net.get('/event/show/'.concat(eventId), eventHandler);
    }

    eventService.getAll = function(festivalId, eventHandler) {
      net.get('/event/list/'.concat(festivalId), eventHandler);
    }

    return eventService;
});
