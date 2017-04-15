var createFestival = angular.module("lehoiviet");

createFestival.controller("createFestivalController", function($scope, $rootScope, festivalService,
  categoryService, provinceService, imageService, dateHelper, $window, $compile, $sce, eventService, dateHelper, $routeParams, $timeout) {
  var festivalId = {};
  var tabPriority = {
    "eventPost" : 1,
    "detailPost" : 2,
    "last" : 3
  };
  var maxAccessablePriority = 1;
  var selectedTabPriority = 1;
  var backgroundImage = null;
  var isUpdate = false;

  $scope.festival = {};

  $scope.initData = function() {
    $scope.showAlert = false;

    $(window).resize(function(){
      $scope.$apply(function(){
        if (window.innerWidth < 767){
          $scope.showAlert = true;
        } else {
          $scope.showAlert = false;
        }
      });
    });

    if ($rootScope.token == null) {
      window.location = "#/";
      return;
    }

    isUpdate = $routeParams.festivalId >= 0;

    if (isUpdate) {
      $scope.isUpdate = true;
      $scope.nameFinalTask = "Cập Nhật Lễ Hội";

      $('.box-event').addClass('hide');
      $('.btn-create-event').removeClass('hide');
      $('.box-save2').removeClass('hide');
    } else {
      $scope.isUpdate = false;
      $scope.nameFinalTask = "Thêm Lễ Hội";
    }

    $rootScope.currentPage = "creating-festival";
    getCategories();
    getProvincies();
    enableOrDisableTab();

  };

  enableOrDisableTab = function() {
    for (var tabName in tabPriority){
      if (getTabPriorityByEventName(tabName) <= maxAccessablePriority) {
        $('#' + tabName).removeClass('disable');
        $('#' + tabName).addClass('onhover');
      } else {
        $('#' + tabName).addClass('disable');
        $('#' + tabName).removeClass('onhover');
      }
    }
  };

  getCategories = function() {
    categoryService.get(function(response) {
      if(response.status == 200) {
        $scope.categories = response.data.data;
      }
    });
  };

  getProvincies = function() {
    provinceService.get(function(response) {
      if (response.status == 200){
        $scope.provincies = response.data.data;

        if ($scope.isUpdate){
            getFestivalById($routeParams.festivalId);
        }
      }
    });
  };

  getFestivalById = function() {
    var festivalId = $routeParams.festivalId;
    festivalService.getById(festivalId, function(response) {
      if (response.status == 200) {
        $scope.festival = response.data.data;
        $scope.backgroundImage = $scope.festival.thumbnail.full;
        $scope.festival.typeEvent = $scope.festival.typeEvent._id;
        $scope.festival.mainAddress = $scope.festival.address.mainAddress;
        $scope.festival.district = $scope.festival.address.district;
        $scope.festival.phoneNumber = $scope.festival.contactInfo.phoneNumber;
        $scope.festival.emailAddress = $scope.festival.contactInfo.emailAddress;
        $scope.festival.website = $scope.festival.contactInfo.website;

        $scope.festival.city = parseInt($scope.festival.address.cityCode);
        for(var province in $scope.provincies){
          if (parseInt(province) == $scope.festival.city) {
            $scope.districts = $scope.provincies[province].districts;
          }
        }
      } else {

      }
    });
  };

  $scope.onChangeTab = function(info){
    if (info == null || info == undefined) {
      if (selectedTabPriority == maxAccessablePriority) {
        ++maxAccessablePriority;
        ++selectedTabPriority;
      }


      for (var tabName in tabPriority) {
        if (tabPriority[tabName] == maxAccessablePriority) {
          info = tabName;

          if (info == 'detailPost' && !$scope.isUpdate){
            $('.btn-create-event').addClass('hide');
            $('.box-save2').addClass('hide')
          }
        }
      }
      this.onSave(info);
    } else {
      if (info == 'detailPost' && !$scope.isUpdate){
        $('.btn-create-event').addClass('hide');
        $('.box-save2').addClass('hide')
      }
      selectedTabPriority = getTabPriorityByEventName(info);
      if (selectedTabPriority > maxAccessablePriority) {
        return;
      }

      maxAccessablePriority = selectedTabPriority > maxAccessablePriority ? selectedTabPriority : maxAccessablePriority;
      updateContentOfTab(info);
      enableOrDisableTab();
    }
  };

  updateContentOfTab = function(info){
    $('.infoList li').removeClass('action');
    $('.infoList #' + info).addClass('action');
    $('.infoTab section').addClass('hide');
    $('.' + info + 'Tab').removeClass('hide')
    // $window.scrollTo(0, 0); // scroll top
    $("html, body").stop().animate({scrollTop:0}, '1000', 'swing');

    if(info === 'detailPost' && festivalId != null && festivalId != undefined) {
      getEvents();
    }
  };

  getEvents = function(){
    eventService.getAll(festivalId, function(response) {
      if (response.status == 200) {
        $scope.events = response.data.data;
      }
    })
  };

  getTabPriorityByEventName = function(name) {
    var priority = tabPriority[name];

    if (priority < 0 || priority > 3) {
      return 1;
    }

    return priority;
  };

  $scope.onProvinceSelected = function(province) {
    $scope.festival.district = null;
    $scope.districts = province.districts;
  };

  $scope.onCreateFestival = function(){
    var festival = {};
    festival.title = $scope.title;
    festival.description = $scope.description;
    festival.content = $scope.content;
    festival.timeBegin = dateHelper.toDate($scope.timeBegin);
    festival.timeEnd = dateHelper.toDate($scope.timeEnd);
    festival.website = $scope.website;
    festival.emailAddress = $scope.emailAddress;
    festival.phoneNumber = $scope.phoneNumber;
    festival.typeEvent = $scope.typeEvent;
    festival.mainAddress = $scope.mainAddress;
    festival.city = $scope.city;
    festival.district = $scope.district;
    festival.priceTicket = $scope.priceTicket;

    createFestival(festival);
  };

  $scope.onImageSelected = function(element) {
       $scope.$apply(function(scope) {
         $scope.isUploading = true;
          var formData = new FormData();
          formData.append("file", element.files[0]);
          imageService.uploadBackgroundFestival(formData, function(response){
            if(response.status == 200) {
              backgroundImage = response.data.data.imgName;
              $scope.backgroundImage = backgroundImage;
              $scope.onChangeValidateInfoTab();
            }
           });
       });
  };

  // image uploaded when image's rendered on screen
  $scope.onImageUploaded = function() {
    $scope.isUploading = false;
  };

  $scope.onSave = function(tabNeedUpdate) {
    var festival = {};

    if ($scope.festival == null || $scope.festival == undefined) {
      return;
    }

    $scope.festival.thumbnailFull = $scope.backgroundImage;
    $scope.festival.thumbnailResize = $scope.backgroundImage;
    festival = $scope.festival;

    if (!tabNeedUpdate) {
      $scope.isSaving = true;
    } else {
      $scope.isSavingBeforeEnter = true;
    }

    festivalService.save(festival, $scope.festival._id, function(response) {
      if (response.status == 200) {
        showSavingNotification("Lưu Thành Công");
        $scope.festival._id = $scope.festival._id == null ? response.data.data._id : $scope.festival._id;
        $scope.isSaving = false;
        $scope.isSavingBeforeEnter = false;
        festivalId = $scope.festival._id;

        if (tabNeedUpdate != null && tabNeedUpdate != undefined) {
          $scope.isSaving = false;
          updateContentOfTab(tabNeedUpdate);
          enableOrDisableTab();
        }
      }
    });
  };

  $scope.onAddEvent = function() {
    $scope.event = {};
    $('.box-event').removeClass('hide');
    $('.btn-create-event').addClass('hide');
    $('.box-save2').addClass('hide')
    resetBoxEvent();
    // $("html, body").stop().animate({scrollTop:0}, '1000', 'swing');
  }

  $scope.onChangeValidateEventTab = function(){
    console.log("Change");
    if($scope.festival == null || $scope.festival == undefined) {
        $scope.festival = {};
    }

    if ($scope.events == null || $scope.events == undefined){
      $scope.events = {};
    }

    if ($scope.festival.description == null || $scope.festival.description == undefined) {
      $scope.detailPost.invalid = true;

      return;
    } else {
      $scope.detailPost.invalid = false;
    }

    if ($scope.festival.content == "" || $scope.festival.content == null || $scope.festival.content == undefined) {
      $scope.detailPost.invalid = true;

      return;
    } else {
      $scope.detailPost.invalid = false;
    }

    if ($scope.events.length <= 0){
      $scope.detailPost.invalid = true;

      return;
    } else {
      $scope.detailPost.invalid = false;
    }
  }

  $scope.onChangeValidateInfoTab = function(selectedProvince){
    if (selectedProvince == 1){
      angular.forEach($scope.provincies, function(value, key) {
        if (key == $scope.festival.city){
          $scope.festival.district = null;
          $scope.districts = value.districts;
        }
      });
    } else if (selectedProvince == 2) {

    }

    if ($scope.backgroundImage == null || $scope.backgroundImage == undefined) {
      $scope.info.invalid = true;

      return;
    } else {
      $scope.info.invalid = false;
    }

    if ($scope.festival.typeEvent == null || $scope.festival.typeEvent == undefined) {
      $scope.info.invalid = true;

      return;
    } else {
      $scope.info.invalid = false;
    }


    if ($scope.festival.city == "" || $scope.festival.city == null || $scope.festival.city == undefined) {
      $scope.info.invalid = true;

      return;
    } else {
      $scope.info.invalid = false;
    }

    console.log($scope.festival.district == undefined);
    if ($scope.festival.district == "" || $scope.festival.district == null || $scope.festival.district == undefined) {
      $scope.info.invalid = true;

      return;
    } else {
      $scope.info.invalid = false;

      return;
    }
  };

  resetBoxEvent = function(){
    $scope.event.name = " ";
    $('#dateBegin').val("");
    $('#dateEnd').val("");
    $('#timeBegin').val("");
    $('#timeEnd').val("");
  };

  $scope.onUpdateOrCreateEvent = function() {
    var event = {};

    if ($scope.event == null || $scope.event == undefined) {
      return;
    }

    event = $scope.event;

    $scope.event.isSaving = true;
    console.log($rootScope.dateBegin);
    event.dateBegin = $('#dateBegin').val();
    event.timeBegin = $('#timeBegin').val();
    event.dateEnd = $('#dateEnd').val();
    event.timeEnd = $('#timeEnd').val();

    if (event._id == null || event._id == undefined) {
      eventService.create(festivalId, event, function(response) {
        if (response.status == 200) {
          $scope.event.isSaving = false;
          getEvents();

          $('.box-event').addClass('hide');
          $('.btn-create-event').removeClass('hide');
          $('.box-save2').removeClass('hide');
        }
      });
    } else {
      eventService.updateById(event._id, event, function(response) {
        if (response.status == 200) {
          $scope.isSaving = false;
          getEvents();

          $('.box-event').addClass('hide');
          $('.btn-create-event').removeClass('hide');
          $('.box-save2').removeClass('hide');
        }
      });
    }
  };

  $scope.onUpdateEvent = function(eventId){
    if (eventId == null || eventId == undefined) {
      return;
    }

    eventService.getById(eventId, function(response) {
      if (response.status == 200) {
        $scope.event = response.data.data;
        $('#dateBegin').val($scope.event.dateBegin);
        $('#timeBegin').val($scope.event.timeBegin);
        $('#dateEnd').val($scope.event.dateEnd);
        $('#timeEnd').val($scope.event.timeEnd);

        $('.box-event').removeClass('hide');
        $('.btn-create-event').addClass('hide');
      }
    });
  }

  $scope.onDeleteEvent = function(){
    eventService.delete($scope.selectedEventId, function(response){
      $("#delete-event").modal("hide");
    });
  };

  $scope.onConfirmDeleteEvent = function(eventId){
    $("#delete-event").modal("show");

    $scope.selectedEventId = eventId;
  };

  $scope.onSubmit = function() {
    var festival = {};

    if ($scope.festival == null || $scope.festival == undefined) {
      return;
    }

    festival = $scope.festival;
    $scope.isCreatingFestival = true;
    festivalService.save(festival, $scope.festival._id, function(response) {
      if (response.status == 200) {
        $scope.festival._id = $scope.festival._id == null ? response.data.data._id : $scope.festival._id;

        festivalId = $scope.festival._id;

        festivalService.submit(festivalId, function(response) {
          showSubmittingNotification("Lễ Hội " + $scope.festival.title + " Đã Được Gửi Lên Quản Trị Viên");
          $scope.isCreatingFestival = false;
          $timeout(function() {
            window.location = "#/";
          }, 1000);

        })

      }
    });
  };

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
  }

  showSubmittingNotification = function(message) {
    $.notify({
      icon: 'fa fa-check',
      message: message,
    },{
      type: 'submitting',
      allow_dismiss: false,
      offset: {
    		x: 50,
    		y: 55
	     }
    });
  }
});
