var app = angular.module("lehoiviet");

app.service("streamService", function() {
    var streamService = {};
    var client = new PeerManager();
    var mediaConfig = {
        audio: true,
        video: {
            mandatory: {},
            optional: []
        }
    };
    
    return streamService;
});
