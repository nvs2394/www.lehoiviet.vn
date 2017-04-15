$(function() {
    var pull 		= $('#pull');
    menu 		= $('.dropMenu');
    menuHeight	= menu.height();

    $(pull).on('click', function(e) {
        menu.slideToggle(700);
    });

    $(window).resize(function(){
        var w = $(window).width();
        if(w > 600 && menu.is(':hidden')) {
            menu.removeAttr('style');
        }

    });
    $(".dropdown").on('click', function() {
        $(this).children(".submenu").slideToggle();
    })
    //detail
    var value = parseInt($('#input-count').val());
    $('.counter-plus').click(function(){
        $('#input-count').val(value++);
    });
    $('.counter-minus').click(function(){
        $('#input-count').val(value--);
    });

    $('.myCart .dropdown-toggle').click(function(){
        $('.dropdown-menu').slideToggle('500');
    });
});

function changTab(info) {
    $('.tablist a').removeClass('active');
    $('.tablist .' + info).addClass('active');
    $('.product-layout section').addClass('hide')
    $('.product-layout .' + info + 'Tab').removeClass('hide')
}

$(document).on('ready', function() {

});
