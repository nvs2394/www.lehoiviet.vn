var live = angular.module("lehoiviet");

live.controller("liveController", function($scope, festivalService, $routeParams, dateHelper, $window, liveService) {
    $scope.formatDate = dateHelper.formatDate;

    $scope.client = new PeerManager();
    $scope.mediaConfig = {
        audio: true,
        video: {
            mandatory: {},
            optional: []
        }
    };


    $scope.isStreaming = false;
    $scope.stream = {};

    $scope.init = function() {
        $scope.festivalId = $routeParams.festivalId;
        $scope.stream.preview = $window.document.getElementById('streamPlayer');

        $scope.getFestivalId();
    };

    $scope.getFestivalId = function() {
        festivalService.getById($scope.festivalId, function(response) {
            $scope.festival = response.data.data;
        });
    };

    $scope.startStreamming = function() {
        requestUserMedia($scope.mediaConfig).then(function(stream) {
            attachMediaStream($scope.stream.preview, stream);
            $scope.client.setLocalStream(stream);
            $scope.stream.stream = stream;
            // $rootScope.$broadcast('cameraIsOn', true);
        }).catch(Error('Failed to get access to local media.')).then(function(result) {
            $scope.$apply(function() {
                $scope.isStreaming = true;

                var data = {};
                data.name = $scope.festival.title;
                data.festivalId = $scope.festivalId;
                data.streamId = $scope.client.getId();
                $scope.streamId = $scope.client.getId();

                liveService.create(data, function(response) {
                    if (response.status == 200) {
                        $scope.client.send('readyToStream', { name: data.name, festivalId: data.festivalId });
                    }
                });
            });
        });
    };

    $scope.stopStreamming = function() {
        new Promise(function(resolve, reject) {
                try {
                    //camera.stream.stop() no longer works
                    $scope.stream.stream.getVideoTracks()[0].stop();
                    $scope.stream.stream.getAudioTracks()[0].stop();
                    $scope.stream.preview.src = '';
                    $scope.isStreaming = false;
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .then(function(result) {
                $scope.client.send('leave');
                $scope.client.setLocalStream(null);
                $scope.isStreaming = false;
            });
    };
});
