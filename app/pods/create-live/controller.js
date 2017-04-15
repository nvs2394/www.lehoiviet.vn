(function() {
    var live = angular.module("lehoiviet");

    var client = new PeerManager();
    var mediaConfig = {
        audio: true,
        video: {
            mandatory: {},
            optional: []
        }
    };

    live.controller("createLiveController", function($scope, $rootScope, videoService, dateHelper) {
        console.log('live')
    });

    live.factory('camera', ['$rootScope', '$window', function($rootScope, $window) {
        var camera = {};
        camera.preview = $window.document.getElementById('streamPlayer');

        camera.start = function() {
            return requestUserMedia(mediaConfig)
                .then(function(stream) {
                    attachMediaStream(camera.preview, stream);
                    client.setLocalStream(stream);
                    camera.stream = stream;
                    $rootScope.$broadcast('cameraIsOn', true);
                })
                .catch(Error('Failed to get access to local media.'));
        };
        camera.stop = function() {
            return new Promise(function(resolve, reject) {
                    try {
                        //camera.stream.stop() no longer works
                        camera.stream.getVideoTracks()[0].stop();
                        camera.stream.getAudioTracks()[0].stop();
                        camera.preview.src = '';
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                })
                .then(function(result) {
                    $rootScope.$broadcast('cameraIsOn', false);
                });
        };
        return camera;
    }]);

    live.controller('LocalStreamController', ['camera', '$scope', '$window', '$http', 'festivalService', 'liveService',
        function(camera, $scope, $window, $http, festivalService, liveService) {
            var localStream = this;
            localStream.link = '';
            localStream.cameraIsOn = false;

            $scope.$on('cameraIsOn', function(event, data) {
                $scope.$apply(function() {
                    localStream.cameraIsOn = data;
                });
            });

            localStream.toggleCam = function() {
                localStream.disableShow = 'true';
                if (localStream.cameraIsOn) {
                    camera.stop()
                        .then(function(result) {
                            client.send('leave');
                            client.setLocalStream(null);
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                } else {
                    camera.start()
                        .then(function(result) {
                            if ($scope.festivalId != null && $scope.nameStream != null) {
                                localStream.festivalId = $scope.festivalId;
                                localStream.name = $scope.nameStream;
                                localStream.link = $window.location.host + '/channel/' + client.getId();
                                var liveData = {};
                                liveData.name = localStream.name;
                                liveData.festivalId = localStream.festivalId;
                                liveData.streamId = client.getId();

                                liveService.create(liveData, function(response) {
                                    if (response.status == 200) {
                                        client.send('readyToStream', { name: localStream.name, festivalId: localStream.festivalId });
                                    }
                                })
                            } else {
                                console.log('dont')
                            }
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                }
            };

            festivalService.getCommingSoon(function(response) {
                if (response.status == 200) {
                    localStream.commingSoonFestival = response.data.data;
                } else {

                }
            });
        }
    ]);

    live.controller('RemoteStreamsController', ['camera', '$location', '$http', '$routeParams', 'liveService',
        function(camera, $location, $http, $routeParams, liveService) {
            var streamId = $routeParams.streamId;
            var rtc = this;
            rtc.id = streamId;
            client.peerInit(streamId);


            liveService.getByStreamId(streamId, function(response) {
                if (response.status == 200) {
                    rtc.stream = response.data.data;
                } else {

                }
            })
        }
    ]);

})();
