var festival = angular.module("lehoiviet");


// for youtube
festival.filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}]);

festival.controller("festivalController", function($scope, $rootScope, festivalService, dateHelper, $routeParams, imageService, commentService, $timeout, eventService, googleService, facebookService) {
  $scope.point = 0;
  $scope.editable = -1;
  $scope.editableContent = [];
  $scope.comments = [];
  $scope.album = [];
  $scope.usersCanStream = {};
  $scope.dateHelper;
  $scope.initData = function() {
    // add listener
    $('#watchVideo').on('hidden.bs.modal', function () {
      $('iframe').attr('src', $('iframe').attr('src'));
      $("#remoteVideosContainer").children().remove();
    })

    $scope.dateHelper = dateHelper;
    $rootScope.currentPage = "festival";
    $scope.isUploading = false;
    $scope.srcVideo = "https://www.youtube.com/embed/nfwm4uesyFY";
    getFestivalById();
    getComments();
    getUsersCanStream($routeParams.festivalId);
  };

  getFestivalById = function() {
    var festivalId = $routeParams.festivalId;
    $scope.festivalId = festivalId;
    festivalService.getById(festivalId, function(response) {
      if (response.status == 200) {
        $scope.festival = response.data.data;
        $scope.festival.timeBegin = dateHelper.parse($scope.festival.timeBegin);
        $scope.festival.timeEnd = dateHelper.parse($scope.festival.timeEnd);
        $scope.fullAddress =  $scope.festival.address.mainAddress + "," +  $scope.festival.address.district + "," + $scope.festival.address.city;
        $scope.fullAddress = $scope.fullAddress.replace(/\s+/g, '+');
        $scope.phoneNumber = $scope.festival.contactInfo.phoneNumber;
        $scope.emailAddress = $scope.festival.contactInfo.emailAddress;
        $scope.website = $scope.festival.contactInfo.website;

        $rootScope.title = $scope.festival.title;
        googleService.getLocation($scope.fullAddress, function(response){
          var data = response;
          if (data.results.length <= 0){
            $scope.latitude = 10.8230989;
            $scope.longitude = 106.6296638;

            $scope.location = [];
            $scope.location.push($scope.latitude);
            $scope.location.push($scope.longitude);
            return 0;
          }
          $scope.latitude = data.results[0].geometry.location.lat;
          $scope.longitude = data.results[0].geometry.location.lng;
          $scope.location = [];
          $scope.location.push($scope.latitude);
          $scope.location.push($scope.longitude);
        });
        updateLikeElementState();
        updateSubscribeElementState();
        festivalService.checkUserRate(festivalId, function(response){
          if (response.status == 200){
            var rate = response.data.data.point;
            if (rate == null || rate == undefined) {
              $scope.point = 0;
            } else {
              $scope.point = rate;
            }

            if ($scope.point > 0){
              $('#rating-bar-rated').barrating({
                  initialRating: $scope.point,
                  theme: 'bootstrap-stars',
                  showSelectedRating: false,
                  readonly: $scope.point > 0,
              });
            }
          }
        });

        getEvents($scope.festival._id);

        $scope.getStreams(festivalId);
      }
    });
  };

  getEvents = function(festivalId){
    eventService.getAll(festivalId, function(response) {
      if (response.status == 200) {
        $scope.events = response.data.data;

        dateHelper.sortBydate($scope.events);

      }
    })
  };

  updateLikeElementState = function() {
    if ($scope.festival != null || $scope.festival != undefined) {
      festivalService.checkUserLike($scope.festival._id, function(response) {
        if (response.data.data.code == 0) {
          var classOfLikeButton = $('.fa-thumbs-o-down');

          classOfLikeButton.addClass('fa-thumbs-o-up');
          classOfLikeButton.removeClass('fa-thumbs-o-down');
        } else {
          var classOfLikeButton = $('.fa-thumbs-o-up');

          classOfLikeButton.addClass('fa-thumbs-o-down');
          classOfLikeButton.removeClass('fa-thumbs-o-up');
        }
      });

      festivalService.getNumberOfLikes($scope.festival._id, function(response) {
        $scope.festival.statistic.likes = (typeof response.data.data == "number") ? response.data.data : 0;
      });
    }
  };

  updateRatingElementState = function() {
    if ($scope.festival != null || $scope.festival != undefined) {

    }
  };

  updateSubscribeElementState = function() {
    if ($scope.festival != null || $scope.festival != undefined) {
      festivalService.isSubscribed($scope.festival._id, function(response) {

      });
    }
  }

  getComments = function(){
    $scope.album = [];
    var festivalId = $routeParams.festivalId;
    if (festivalId < 0 || festivalId == null || festivalId == undefined) {
      return;
    }

    festivalService.getComments(festivalId, function(response){
      $scope.comments = response.data.data;
      for (var i = 0; i < $scope.comments.length; ++i){
        $scope.album.push.apply($scope.album, $scope.comments[i].imageId);
      }
    });
  }

  getUsersCanStream = function(festivalId){
      festivalService.getUserCanStream(festivalId, function(response){
        $scope.usersCanStream = response.data.data;
      });
  }

  $scope.watchSlide = function (shownImage) {
    $('#slideImage').modal('show')
    $scope.shownImage = shownImage;
  }

  $scope.watchVideo = function (streamId) {
    $('#watchVideo').modal('show');
    var clientPlayer = new PeerManager();
    clientPlayer.peerInit(streamId);
  }

  $scope.postVideo = function () {
    $('#maintenance').modal('show');
  }

  $scope.onLike = function() {
    if ($rootScope.token == null) {
      $('#userLogin').modal('show');
      return;
    }

    festivalService.like($scope.festival._id, function(response) {
      updateLikeElementState();
    });
  }

  $scope.onRate = function() {
    if ($scope.point <= 0) {
      return;
    }
    if ($rootScope.token == null) {
      $('#userLogin').modal('show');

      $scope.point = 0;
      return;
    }

    var data = {};
    data.point = $scope.point;
    $('#rating-bar-rated').barrating({
        initialRating: $scope.point,
        theme: 'bootstrap-stars',
        showSelectedRating: false,
        readonly: $scope.point > 0,
    });
    festivalService.rate($scope.festival._id, data, function(response) {

    });
  }

  $scope.onUploadImage = function() {
    $('#upImage').on('hidden.bs.modal', function(){
      resetImageSelector();
    });

    if ($rootScope.token == null) {
      $('#userLogin').modal('show');
      return;
    }

    $('#upImage').modal('show');
  }

  $scope.onUploadEditableImage = function() {
    $('#upEditableImage').on('hidden.bs.modal', function(){
      resetEditableImageSelector();
    });

    if ($rootScope.token == null) {
      $('#userLogin').modal('show');
      return;
    }

    $('#upEditableImage').modal('show');
  }

  $scope.onUploadVideo = function() {
    if ($rootScope.token == null) {
      $('#not-signed').modal('show');
      return;
    }
  }

  $scope.onImageSelected = function(element) {
    $scope.myCroppedImage='';
    var selectedFile = element.files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      $scope.$apply(function($scope){
        $scope.image=reader.result;
      });
    }, false);

    reader.readAsDataURL(selectedFile);
  }

  $scope.onEditableImageSelected = function(element) {
    $scope.myEditableCroppedImage='';
    var selectedFile = element.files[0];
    var reader = new FileReader();
    reader.addEventListener("load", function () {
      $scope.$apply(function($scope){
        $scope.editableImage=reader.result;
      });
    }, false);

    reader.readAsDataURL(selectedFile);
  }

  resetImageSelector = function() {
    $scope.image = null;
    $scope.myCroppedImage = null;
  }

  resetEditableImageSelector  = function(){
    $scope.editableImage = null;
    $scope.myEditableImage = null;
  }

  $scope.onSubmitComment = function() {
    if ($rootScope.token == null) {
      $('#userLogin').modal('show');
      return;
    }


    if ($scope.formData == null || $scope.formData == undefined) {
      $scope.formData = new FormData();
    }

    if ($scope.displayImages == null ||  $scope.displayImages == undefined){
       $scope.displayImages = [];
    }
    for (var i = 0; i < $scope.displayImages.length; ++i){
      $scope.formData.append("files", dataURItoBlob($scope.displayImages[i]));
    }

    $scope.formData.append("content", $scope.comment);
    $scope.isPostingComment = true;
    commentService.create($scope.festival._id, $scope.formData, function(response){
      $scope.displayImages = null;
      $scope.comment = null;
      $scope.formData = null;
      if(response.status == 200) {
        $scope.isPostingComment = false;
        getComments();
        var height = $( document ).height() - 500;
        $("html, body").stop().animate({scrollTop:heigth}, '1000', 'swing');
      }
    });
  }

  $scope.onAddImage = function(){
    if ($scope.formData == null || $scope.formData == undefined){
      $scope.formData = new FormData();
    }

    if ($scope.displayImages == null || $scope.displayImages == undefined) {
      $scope.displayImages = [];
    }

    if ($scope.displayImages.indexOf($scope.myCroppedImage) >= 0) {
      $('#duplicated-image').modal('show');
    } else {
      $scope.displayImages.push($scope.myCroppedImage);
    }


    $('#upImage').modal('hide');
  };


  $scope.onAddEditableImage = function(){
    if ($scope.editableData == null || $scope.editableData == undefined){
      $scope.editableData = new FormData();
    }

    if ($scope.editableDisplayImages == null || $scope.editableDisplayImages == undefined) {
      $scope.editableDisplayImages = [];
    }

    if ($scope.editableDisplayImages.indexOf($scope.myEditableCroppedImage) >= 0) {
      $('#duplicated-image').modal('show');
    } else {
      $scope.editableDisplayImages.push($scope.myEditableCroppedImage);
    }


    $('#upEditableImage').modal('hide');
  };

  $scope.onSubscribe = function() {
    if ($rootScope.token == null) {
      $('#userLogin').modal('show');
      return;
    }

    if ($scope.festival == null || $scope.festival == undefined) {
      return;
    }

    festivalService.subscribe($scope.festival._id, function(response){

      updateSubscribeElementState();
      showSavingNotification("Bạn đã đăng kí theo dõi lễ hội này!");
    });
  }

  $scope.onUnsubscribe = function() {
    if ($scope.festival == null || $scope.festival == undefined) {
      return;
    }

    festivalService.unsubscribe($scope.festival._id, function(response){
      updateSubscribeElementState();
    });
  }

  $scope.onDeleteImage = function (img) {
    $('#delete-image').modal('show');
    $scope.selectedImage = img;
  }

  $scope.onAcceptRemove = function(){
    if ($scope.displayImages != null) {
      var index = $scope.displayImages.indexOf($scope.selectedImage);
      if (index >= 0){
        $scope.displayImages.splice(index, 1);
        $('#delete-image').modal('hide');
        $scope.selectedImage = null;
        return;
      }
    }

    commentService.deleteById($scope.selectedDeleteCommentId, function(response){
      getComments();
      $scope.selectedDeleteCommentId = null;
      $scope.editable = -1;
      $('#delete-image').modal('hide');
    });

    return;
  }

  $scope.onRejectRemove = function(){
    $('#delete-image').modal('hide');
  }

  $scope.onEditableMode = function(commentId, content){
    $scope.editable = commentId;
    $scope.editable.content = content;
  }

  $scope.onDeleteImageEditableMode = function(cmt, image){
    $('#delete-image-editable').modal('show');
    $scope.selectedEditableImage = image;
    $scope.selectedEidtableComment = cmt;
  }

  $scope.onRejectRemoveEditable = function(){
    $('#delete-image-editable').modal('hide');
  }

  $scope.onAcceptRemoveEditable = function(){
    if ($scope.editableDisplayImages != null && $scope.editableDisplayImages.length > 0) {
      var index = $scope.editableDisplayImages.indexOf($scope.selectedEditableImage);

      if (index >= 0){
        $scope.editableDisplayImages.splice(index, 1);
        $scope.selectedEditableImage = null;
        $('#delete-image-editable').modal('hide');
        return;
      }
    }

    var images = $scope.selectedEidtableComment.imageId;
    var indexImage = images.indexOf($scope.selectedEditableImage);
    $('#delete-image-editable').modal('hide');
    if (indexImage >= 0){
        commentService.deleteImage(images[indexImage]._id, function(response){
        $scope.selectedEidtableComment.imageId.splice(indexImage, 1);
        $scope.selectedEidtableComment = null;
        $scope.selectedEditableImage = null;
      });
    }
  }

  $scope.onDeleteComment = function(commentId){
    $('#delete-image').modal("show");
    $scope.selectedDeleteCommentId = commentId;
  }

  $scope.onUpdateComment = function(commentId){
    if ($scope.editableData == null || $scope.editableData == undefined) {
      $scope.editableData = new FormData();
    }

    if ($scope.editableDisplayImages == null || $scope.editableDisplayImages == undefined) {
      $scope.editableDisplayImages = {};
    }
    for (var i = 0; i < $scope.editableDisplayImages.length; ++i){
      $scope.editableData.append("files", dataURItoBlob($scope.editableDisplayImages[i]));
    }

    $scope.editableData.append("content", $scope.editableContent[commentId]);
    $scope.isPostingComment = true;
    commentService.update(commentId, $scope.editableData, function(response){
      if(response.status == 200) {
        $scope.isPostingComment = false;

        $scope.editableDisplayImages = null;
        $scope.editableData = null;

        $scope.editable = -1;
        getComments();
      }
    });
  }

  $scope.closeImmediately = function(){
    $('#duplicated-image').modal('hide');
  }

  showSavingNotification = function(message){
    $.notify({
      icon: 'fa fa-check',
      message: message,
    },{
      type: 'saving',
      allow_dismiss: false,
      offset: {
        x: 50,
        y: 55
      },
      delay: 500
    });
  };

  $scope.getStreams = function(festivalId){
    festivalService.getStreams(festivalId, function(response){
      $scope.streams = response.data.data;
    });
  };

  $scope.convertToCurrency = function(data){
    if (data != null && data != "undefined"){
      data = data.toString();
      var result = "";
      var counter = 0;
      for (var i = data.length - 1; i >= 0; --i){
        result += data.charAt(i);
        ++counter;
        if (counter % 3 == 0 && counter < data.length){
          result += ".";
        }
      }

      var result = result.split("").reverse().join("");
      return result;
    }
  };

  $scope.convertToNumberPhone = function(data){
    if (data != null && data != "undefined"){
      data = data.toString();
      var result = "";
      var counter = 0;
      for (var i = data.length - 1; i >= 0; --i){
        result += data.charAt(i);
        ++counter;
        if (counter % 4 == 0 && counter < data.length){
          result += ".";
        }
      }

      var result = result.split("").reverse().join("");
      return result;
    }
  };

  $scope.onStream = function(festivalId){
    if ($rootScope.token == null) {
      $('#userLogin').modal('show');
      return;
    }

    window.location = "#live/" + $routeParams.festivalId;
  };

  $scope.onShareFacebook = function(){
    var data = {};
    data.href = "https://lehoiviet.vn#/festival/".concat($scope.festival._id);
    data.title = $scope.festival.title;
    data.picture = "https://api.lehoiviet.vn/".concat($scope.festival.thumbnail.resize);
    data.description= $scope.festival.description;
    facebookService.onShareFacebook(data);
  };

  $scope.onRegisterStream = function(){
    if ($rootScope.token == null) {
      $('#userLogin').modal('show');
      return;
    }

    festivalService.registerStream($scope.festival._id, function(response){
      showSavingNotification("Lời yêu cầu đã được gửi đến ban quản trị");
    });
  };

  $scope.isCanStream = function(){
    if ($rootScope.uid == null || $rootScope.uid == undefined){
      return false;
    }

    for (var i = 0; i < $scope.usersCanStream.length; ++i){
      if ($scope.usersCanStream[i].userId._id === $rootScope.uid){
        return true;
      }
    }

    return false;
  };
});


function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}
