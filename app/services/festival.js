var app = angular.module("lehoiviet");

app.service("festivalService", function($http, net, $rootScope) {
    var festivalService = {};

    festivalService.create = function(festival, eventHandler){
        festival.userId = $rootScope.uid;
        net.post('/festival/create/', festival, eventHandler);
    };

    festivalService.save = function(festival, festivalId, eventHandler){
        festival.userId = $rootScope.uid;
        if (festivalId == -1 || festivalId == null || festivalId == undefined) {
          net.post('/festival/save/', festival, eventHandler);
        } else {
          net.post('/festival/save/'.concat(festivalId), festival, eventHandler);
        }
    };

    festivalService.update = function(festival, eventHandler){
        net.post('/festival/update/', festival, eventHandler);
    };

    festivalService.delete = function(festivalId, eventHandler){
        net.upload('/festival/delete/'.concat(festivalId), null, eventHandler);
    };

    festivalService.getCommingSoon = function(eventHandler) {
        net.get('/festival/lists/commingsoon', eventHandler);
    };

    festivalService.getFamouse = function(eventHandler){
      net.get('/festival/lists/famous', eventHandler);
    };


    festivalService.getById = function(id, eventHandler) {
        net.get('/festival/show/'.concat(id), eventHandler);
    };

    festivalService.submit = function(id, eventHandler) {
      net.post('/festival/submit/'.concat(id), null, eventHandler);
    };

    festivalService.like = function(id, eventHandler) {
      net.post('/festival/like/'.concat(id), null, eventHandler);
    };

    festivalService.checkUserLike = function(id, eventHandler) {
      net.post('/festival/islike/'.concat(id), null, eventHandler);
    };

    festivalService.rate = function(id, data, eventHandler) {
      net.post('/rating/festival/'.concat(id), data, eventHandler);
    };

    festivalService.checkUserRate = function(id, eventHandler) {
      net.post('/rating/check/'.concat(id), null, eventHandler);
    };

    festivalService.getNumberOfLikes = function(id, eventHandler) {
      net.get('/festival/like/count/'.concat(id), eventHandler);
    };

    festivalService.subscribe = function(id, eventHandler) {
      net.post('/subscribe/create/'.concat(id), null, eventHandler);
    };

    festivalService.unsubscribe = function(id, eventHandler) {
      net.post('/subscribe/cancel/'.concat(id), null, eventHandler);
    };

    festivalService.isSubscribed = function(id, eventHandler) {
      net.post('/subscribe/check/user/'.concat(id), null, eventHandler);
    };

    festivalService.seen = function(eventHandler){
      net.post('/subscribe/seen', null, eventHandler);
    };

    festivalService.getNotifiedFestival = function(eventHandler) {
      net.post('/subscribe/notified/', null, eventHandler);
    };

    festivalService.filterByLocation = function(location, eventHandler){
      net.get('/festival/filter/address?name='.concat(location), eventHandler);
    };

    festivalService.filterByType = function(types, eventHandler){
        net.get('/festival/filter/typeevent?'.concat(types), eventHandler);
    };

    festivalService.filterByDate = function(date, eventHandler){
      net.get('/festival/filter/date?date='.concat(date), eventHandler);
    };

    festivalService.filterByPrice = function(date, eventHandler){
      net.get('/festival/filter/price?price='.concat(date), eventHandler);
    };

    festivalService.getFestivalsByUser = function(eventHandler){
      net.get('/festival/lists/user', eventHandler);
    };

    festivalService.getFestivalsByGuest = function(id, eventHandler){
      net.get('/festival/guest/profile/'.concat(id), eventHandler);
    };

    festivalService.getComments = function(id, eventHandler){
      net.get('/festival/comment/find/'.concat(id), eventHandler);
    };

    festivalService.getStreams = function(id, eventHandler){
      net.get('/live/festival/'.concat(id), eventHandler);
    };

    festivalService.getThumbnailsForSlider = function(eventHandler){
      net.get('/live/slider', eventHandler);
    };

    festivalService.registerStream = function(id, eventHandler){
      net.post('/live/access/'.concat(id), null, eventHandler);
    };

    festivalService.getUserCanStream = function(festivalId, eventHandler){
      net.get('/live/festival/users/'.concat(festivalId), eventHandler);
    };

    festivalService.getFestivals = function(data, eventHandler){
      net.get('/festival/lists/more/'.concat(data.page).concat('/').concat(data.limit), eventHandler);
    };

    festivalService.searchByTitle = function(title, eventHandler){
      net.get('/festival/search/title/'.concat(title), eventHandler);
    }

    return festivalService;
});
