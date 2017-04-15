var app = angular.module("lehoiviet");

app.service("imageService", function(net) {
    var imageService = {};

    imageService.uploadBackgroundFestival = function(data, eventHandler) {
        net.upload('/image/upload/thumbnail/festival/', data, eventHandler);
    };

    imageService.uploadImagePost = function(festivalId, data, eventHandler){
        net.upload('/image/upload/image/festival/'.concat(festivalId), data, eventHandler);
    };
    imageService.uploadThumbnailPost = function(data, eventHandler){
        net.post('/upload/thumbnail/post/', data, eventHandler);
    };
    imageService.uploadReview = function(data, eventHandler){
        net.post('/upload/image/review/', data, eventHandler);
    };
    imageService.uploadThumbnailReview = function(data, eventHandler){
        net.post('/upload/thumbnail/review/', data, eventHandler);
    };

    return imageService;
});
