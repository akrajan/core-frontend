$(function(){

    var calendar = $(".calendar").first().createCalendar({
        callback: function(btnObj){          
//            $('.btn').popover('hide');
//            btnObj.btn.popover('destroy');

            if(btnObj.btn.hasClass('unavailable') !== false){
                return;
            }

            console.log('scheduling: ' + $(this).attr('data-value'));
            $('.reserved-info').html("You've reserved <strong>" + btnObj.longDate  + " at " + btnObj.name + "</strong> for your visit." ).removeClass('hidden');
            
            
//            btnObj.btn.popover({
//                title: 'Confirm Date &amp; Time',
//                html: true,
//                content: 'Would you like to schedule your appointment for this time?' +
//                         '<div class="buttons"><a href="#" data-value="'+btnObj.value+'" class="btn btn-primary btn-mini schedule-now">Yes, schedule now.</a>' + 
//                         '<a href="#" data-value="'+btnObj.value+'" class="btn btn-mini cancel">No, choose another.</a></div>',
//                placement: 'bottom',
//                container: 'body'
//            });
//            btnObj.btn.popover('show');
        }
    });

//    $('body').on('click', '.popover .schedule-now', function(){
//        console.log('scheduling: ' + $(this).attr('data-value'));
//        $('.calendar .btn.clicked').removeClass('clicked').removeClass('selected');
//        $('.btn.clicked').addClass('selected');
//        $('.btn').popover('hide');
//        var mask = $('.calendar .mask-overlay');
//        mask.find('.bar').css('width','30%');
//        mask.show();
//    });

//    $('body').on('click', '.popover .cancel', function(){
//        $('.calendar .btn.clicked').removeClass('clicked').removeClass('selected');
//        $('.calendar .btn').popover('hide');
//    });


//    $(window).on('resize orientationchange', function(){
//        $('.btn').popover('hide');
//        $('.btn.clicked').removeClass('clicked');
//    });

});
