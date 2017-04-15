var helper = angular.module('lehoiviet');

helper.service("notificationHelper", function(){
  var notificationHelper = {};

  notificationHelper.hasLiveStream = function(data){
    $.notify({
    	// options
    	icon: 'glyphicon glyphicon-file',
    	url: '#/festival/'.concat(data.festival.id),
    	target: '_blank'
    },{
    	// settings
    	element: 'body',
    	position: null,
    	type: "info",
    	allow_dismiss: true,
    	newest_on_top: false,
    	showProgressbar: false,
    	placement: {
    		from: "bottom",
    		align: "left"
    	},
    	offset: 15,
    	spacing: 10,
    	z_index: 1031,
    	delay: 5000,
    	timer: 1000,
    	url_target: '_blank',
    	mouse_over: null,
    	animate: {
    		enter: 'animated fadeInDown',
    		exit: 'animated fadeOutUp'
    	},
    	icon_type: 'class',
    	template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} notify-data" role="alert">' +
    		'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
        '<div class="clearfix">'+
          '<div class="col-15"><span data-notify="icon"></span></div>'+
          '<div class="col-85">'+
        		'<p data-notify="title">' + data.festival.title + '</p> ' +
        		'<p data-notify="message"> ĐANG LIVE STREAM'  + '</p>' +
          '</div></div>'+
    		'<div class="progress" data-notify="progressbar">' +
    			'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
    		'</div>' +
    		'<a href="{3}" target="{4}" data-notify="url"></a>' +
    	'</div>'
    });
  };

  return notificationHelper;
});
