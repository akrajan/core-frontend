$(function(){

    $('.contractors .contractor a').tooltip();

    $('.toggle-list .plus-icon').click(function(){
        var btn = $(this),
            btnHTML = btn.html(),
            header = btn.closest('.header'),
            list = btn.closest('.toggle-list'),
            allBtns = list.find('.plus-icon'),
            allHeaders = list.find('.header').not(header); 
        
        allBtns.html('+');
        allHeaders.removeClass('open');

        if(btnHTML == '+'){
            btn.html('-');
        } else {
            btn.html('+');
        }
        header.toggleClass('open');
    });

});
