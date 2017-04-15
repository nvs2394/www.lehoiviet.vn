(function() {
    var chat = angular.module("lehoiviet");


    chat.directive('chatBox', function() {
        return {
            restrict: 'E',
            scope:{
                streamId:'=streamId'
            },
            templateUrl: 'app/pods/chat/chat-box.html',
            controller: function($scope,$attrs) {
                console.log($attrs.streamId);
                //var socket = io.connect('http://localhost:9000');
                var socket = io.connect('https://chat-lehoiviet.herokuapp.com');
                // on connection to server, ask for user's name and add Room - this room is streamId.
                socket.on('connect', function() {
                    // call the server-side function 'adduser' and room
                    socket.emit('adduser-room', prompt("What's your name?"), 1);
                });

                // listener, whenever the server emits 'updatechat', this updates the chat body
                socket.on('updatechat', function(username, data) {
                    $('#conversation').append('<b>' + username + ':</b> ' + data + '<br>');
                });

                socket.on('countUser',function(number){
                    console.log(number);
                    $scope.countUser = number;
                })

                $scope.enterSendMessage = function() {
                    var message = $scope.localMessage;
                    socket.emit('sendchat', message);
                    $scope.localMessage = '';
                }
            },
            controllerAs: 'chat-box'
        };
    });

    chat.controller("chatController", function($scope, $rootScope, $routeParams) {
        // var room = $routeParams.streamId;
        // console.log(room);

        // //var socket = io.connect('http://chat-lehoiviet.herokuapp.com');
        // var socket = io.connect('http://localhost:9000');

        // // on connection to server, ask for user's name and add Room - this room is streamId.
        // socket.on('connect', function() {
        //     // call the server-side function 'adduser' and room
        //     socket.emit('adduser-room', "Son", 1);
        // });

        // // listener, whenever the server emits 'updatechat', this updates the chat body
        // socket.on('updatechat', function(username, data) {
        //     console.log(data)
        //     $('#conversation').append('<b>' + username + ':</b> ' + data + '<br>');
        // });

        // $scope.enterSendMessage = function() {
        //     var message = $scope.localMessage;
        //     socket.emit('sendchat', message);
        //     $scope.localMessage = '';
        // };
    });

    chat.directive('dlKeyCode', dlKeyCode);

    function dlKeyCode() {
        return {
            restrict: 'A',
            link: function($scope, $element, $attrs) {
                $element.bind("keypress", function(event) {
                    var keyCode = event.which || event.keyCode;

                    if (keyCode == $attrs.code) {
                        $scope.$apply(function() {
                            $scope.$eval($attrs.dlKeyCode, { $event: event });
                        });

                    }
                });
            }
        };
    }
})();
