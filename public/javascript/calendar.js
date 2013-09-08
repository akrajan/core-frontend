
    $.fn.createCalendar = function(config){

        var date = '8-26-2013',
            time = '9-11',
            callback = config.callback,
//            filter = config.filter,
            slotsTemplate = $('.date-time-selector .slot.template', this),
            days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
            daysAbbr = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
            months = ["January","February","March","April","May","June","July","August","September","October","November","December"],
            allSlots = [],
            slotGroups = [],
            unavailableSlotGroups = [],
            unavailableSlots = [
                {"value":"9-11","name":"9AM","available":false},
                {"value":"11-13","name":"11AM","available":false},
                {"value":"13-15","name":"1PM","available":false},
                {"value":"15-17","name":"3PM","available":false}
            ], 
            slotGroupContainer = $('.slotgroups', this),
            slotGroupHeight,
            groupBy = 4,
            maxDays = 180,
            visibleSlotGroupIndex = 0,
            nextButton = $('.next', this),
            previousButton = $('.previous', this),
            mask = $('<div class="mask-overlay"><div class="progress-wrapper">' +
                       '<div class="progress progress-striped active">' +
                       '<div class="bar" style="width: 30%;"></div></div>' +
                     '</div></div>'),
            devnull = this.append(mask);

        var prepareDateRange = function(startdate, numdays){
            var start = formatSimpleDate(startdate),
                devnull = startdate.setDate(startdate.getDate()+numdays),
                end = formatSimpleDate(startdate);

            return {start:start, end:end};      
        };


        var formatLongDate = function(dateStr){
            var dateObj = getDateFromString(dateStr),
                dayOfWeek = days[dateObj.getDay()],
                monthName = months[dateObj.getMonth()],
                date = dateObj.getDate().toString().replace(/^0/,""),
                lastDigitOfDate = date.replace(/[0-9]*([0-9])$/, "$1");
                dateSuffix = lastDigitOfDate == 1 ? 'st' : lastDigitOfDate == 2 ? 'nd' : lastDigitOfDate == 3 ? 'rd' :  'th';
                formattedDate = dayOfWeek + ", " + monthName + " " + date + dateSuffix + ", " + dateObj.getFullYear();
            return formattedDate;
        };

        var formatSimpleDate = function(dateObj){
            var day = dateObj.getDate(),
                formattedDay = day.length == 1 ? '0'+day : day,
                month = dateObj.getMonth()+1,
                formattedMonth = month.length == 1 ? '0'+month : month,
                year = dateObj.getFullYear(),
                simpleDate = formattedMonth + '-' + formattedDay + '-' + year;
            
            return simpleDate;
        };

        var getDateFromString = function(dateStr){
            var dateParts = dateStr.split(/\D/),
                dateObj = new Date(dateParts[2], --dateParts[0], dateParts[1]);
            return dateObj;
        };

        var formatDate = function(dateStr){
            var dateObj = getDateFromString(dateStr),
                dayOfWeek = daysAbbr[dateObj.getDay()],
                monthNum = dateObj.getMonth()+1,
                date = dateObj.getDate().toString().replace(/^0/,""),
                formattedDate = dayOfWeek + " " + monthNum + "/" + date;
            return formattedDate;
        };
        
        var onReady = function(slots){
            prepareSlotGroups(slots); 
            var visible  = slotGroups.slice(0,1),
                hidden = slotGroups.slice(1);
            
            addVisibleSlots(visible);
            addHiddenSlots(hidden);
            initEvents();
        };
        
       var init = function(){
            var startdate = new Date(),
                devnull = startdate.setDate(new Date().getDate()+1),
                range = prepareDateRange(startdate, (maxDays/2));

            slotGroupContainer.empty();
            getAllSlots(range);
        };

        var initEvents = function(){
            $('body').on('click','.slot .time', function(e){
                e.preventDefault();
                
                var btn = $(this),
                    dateStr = this.getAttribute("data-value"),
                    longDate = formatLongDate(dateStr.split('|')[0]);

                if(btn.hasClass('available')){
                    $('.slot .btn.selected, .slot .btn.clicked')
                        .removeClass('selected')
                        .removeClass('clicked')
                        .addClass('available');
                    
                    btn.addClass('clicked').removeClass('available');
                }

                callback({
                    e: e,
                    btn: btn,
                    name: this.innerHTML,
                    value: dateStr,
                    longDate: longDate 
                });
            });
            nextButton.on('click', navigateToNext);
            previousButton.on('click', navigateToPrevious);
        };

        var toggleNavigation = function(isNextBtn){
            var availableGroups = $('.slotgroup').not('.unavailable');
                unavailableGroups = $('.slotgroup.unavailable');

            if(isNextBtn && visibleSlotGroupIndex >= availableGroups.size()-2){
                nextButton.hide();  
                previousButton.show();
            } else if(!isNextBtn && visibleSlotGroupIndex <= (availableGroups.size()-2)*-1){
                previousButton.hide();  
                nextButton.show();
            } else {
                previousButton.show();  
                nextButton.show();
            }
        };    

        var navigateToNext = function(e){
            e.preventDefault();

            toggleNavigation(true);

            var groups = $('.slotgroup');
           
            groups.hide();
           
            if(visibleSlotGroupIndex < -1){
                $('#unavailableSlotGroup_' + (++visibleSlotGroupIndex * -1)).show();
            } else {
                $('#slotGroup_' + ++visibleSlotGroupIndex).show();
            }
        };

        var navigateToPrevious = function(e){
            e.preventDefault();

            toggleNavigation(false);

            var groups = $('.slotgroup');
            groups.hide();

            console.log(visibleSlotGroupIndex);
            if(visibleSlotGroupIndex <= 0){
                $('#unavailableSlotGroup_' + (--visibleSlotGroupIndex * -1)).show();
            } else {
                $('#slotGroup_' + --visibleSlotGroupIndex).show();
            }
        };

        var prepareUnavailableSlots = function(dateStr){
            var j=0,
                startdate = getDateFromString(dateStr.date);

            for(var i=0; i<(maxDays/2); i++){
                if(i%groupBy == 0){
                    j = i > 0 ? j+1 : 0;
                    unavailableSlotGroups[j]={};
                    unavailableSlotGroups[j].slots = [];
                    unavailableSlotGroups[j].id = "unavailableSlotGroup_"+(j+1);
                    unavailableSlotGroups[j].unavailable = true;
                    if(j > 0){
                        var tmp = unavailableSlotGroups[j-1].slots,
                            reversed = tmp.reverse();
                        unavailableSlotGroups[j-1].slots = reversed;
                    }
                }
                startdate.setDate(startdate.getDate()-1);
                unavailableSlotGroups[j].slots.push({
                    date: formatSimpleDate(startdate),
                    slots: unavailableSlots
                });
            }
            addHiddenSlots(unavailableSlotGroups);
        };
        
        var prepareSlotGroups = function(data){
            var j=k=0;
            for(var i=0; i<data.length; i++){
                if(i%groupBy == 0){
                    k = j;
                    slotGroups[j++]={};
                    slotGroups[k].slots = [];
                    slotGroups[k].id = "slotGroup_"+k;                  
                }
                slotGroups[k].slots.push(data[i]);

                if((i == data.length-1) && (i%groupBy != 0)){
                    var str = data[i].date,
                        dateObj = getDateFromString(str);

                    for(var l=(i%groupBy); l<unavailableSlots.length-1; l++){
                        var devnull = dateObj.setDate(dateObj.getDate()+1),
                            dateStr = formatSimpleDate(dateObj);
                       
                        slotGroups[k].slots.push({
                            date: dateStr,
                            slots: unavailableSlots
                        });
                    } 
                }
            }
            prepareUnavailableSlots(data[0]); 
        };
        
        var addSlots = function(slotgroup, hidden){
            var data = slotgroup.slots;

            var groupingDiv = $('#'+slotgroup.id).empty();
            if(groupingDiv.size() == 0){
                groupingDiv = createGroupingDiv(slotgroup);
                slotGroupContainer.append(groupingDiv);
            }

            for(var i=0; i<data.length; i++){
                var slotEl = slotsTemplate.clone(),
                    slots = data[i].slots,
                    dateStr = data[i].date,
                    formattedDate = formatDate(dateStr),            
                    times = $(".time", slotEl);

                slotEl.removeClass('template');
                $(".date", slotEl).html(formattedDate);
            
                for(var j=0; j<slots.length; j++){
                    var slotName = slots[j].name.split(/\s*\-\s*/)[0],
                        slotValue = slots[j].value,
                        slotAvailable = slots[j].available,
                        slotSelected = slots[j].value == time && dateStr == date,
                        button = times.get(j);

                    if(slotSelected === true){
                        button.setAttribute("data-value",dateStr+"|"+slotValue);
                        button.className += ' selected';
                    } else if(slotAvailable === false){
                        button.className += ' unavailable';
                    } else {
                        button.setAttribute("data-value",dateStr+"|"+slotValue);
                        button.className += ' available';
                    }
                    button.innerHTML = slotName.replace(/([0-9]+)(AM|PM)/i, "$1:00 $2").toLowerCase();
                }
                if(hidden === true){
                    groupingDiv.hide();
                }
                groupingDiv.append(slotEl);
            }
            finishMask();
        };

        var finishMask = function(){
            mask.find('.bar').css('width', '100%');
            setTimeout(function(){mask.hide();}, 700) 
        };

        var addVisibleSlots = function(slotgroups){
            for(var i=0; i<slotgroups.length; i++){
                var slotgroup = slotgroups[i];
                addSlots(slotgroup, false);
            }
        };

        var addHiddenSlots = function(slotgroups){
            for(var i=0; i<slotgroups.length; i++){
                var slotgroup = slotgroups[i];
                addSlots(slotgroup, true);
            }
        };
            
        var createGroupingDiv = function(slotgroup){
            var extraClass = slotgroup.unavailable === true ? ' unavailable' : '';
            groupingDiv = $('<div id="'+slotgroup.id+'" class="slotgroup' + extraClass + '"></div>');
            return groupingDiv;
        };  
        
        var getAllSlots = function(range){
          var url = 'javascript/availability.json';//services/'+ engagement.service_id +'/availability/'+zip+'.json?start_date='+range.start+'&end_date='+range.end;
 /*         
          if(date) {
            url +='&min_start='+ date;
          }
          if(filter){
            url += '&'+$.param({filter:filter});
          } 
*/
            $.ajax({
                url: url,
                type: 'get',
                success: onReady 
            });    
        };

        init();

        return this;
    };
    

