(function($) {

    $.fn.rtThickbox = function(opt) {
        /* Overwrite default options with user provided ones and merge them into "options". */
        var options = $.extend(true, $.fn.rtThickbox.defaults, opt);

        rtt_var = {
            w : parseInt(options.width),
            h : parseInt(options.height),
            windoww : Math.abs($(window).width() - options.width),
            windowh : Math.abs($(window).height() - options.height),
            top : ((Math.abs($(window).height() - options.height)) / 2),
            left : ((Math.abs($(window).width() - options.width)) / 2),
            html : '',
            url : "",
            originalh : $(window).height(),
            originalw : $(window).width(),
            rtBodyw : parseInt(options.width),
            rtBodyh : parseInt(options.height),
            rtOverlay : options.rtOverlay,
            rtBody : options.rtBody,
            resize : options.resize,
            hasthumb : options.hasthumb,
            isslider : options.isslider,
            leftArrow : options.leftArrow,
            rightArrow : options.rightArrow,
            navigationContainer : options.navigationContainer,
            sliderContainer : options.sliderContainer,
            next : options.next,
            prev : options.prev,
            start : options.start,
            duration : options.duration,
            easing : options.easing,
            hastitle : options.hastitle
        };

        /* first time click append the markup at the bottom */        
        $.fn.rtThickbox.init(rtt_var);
        
        var rtOverlay = $('.' + rtt_var.rtOverlay);
        var rtBody = $('.' + rtt_var.rtBody);

        $('a.rt-thickbox').on('click', function(e) {
            e.preventDefault();

            /* overlay HTML */
            var url = '';
            var html = '';
            var title = '';
            if (rtt_var.hasthumb) {
                if ($(this).find('img').length) {
                    url = $(this).find('img').attr('src');
                } else {
                    url = $(this).attr('href');
                }
            } else {
                url = $(this).attr('href');
            }
            var str = url.toString();
            var youtubeurl = '';
            if (str.match(/www.youtube.com\/watch/gi) !== null) {
                var youtubeid = str.split(/www.youtube.com\/watch\?v\=/i);
                youtubeurl = 'http://www.youtube.com/embed/' + youtubeid[1];
            } else if (str.match(/http:\/\/www.youtube.com\/embed/gi) !== null) {
                youtubeurl = str;
            } else {
                youtubeurl = '';
            }

            if (youtubeurl === '') {
                if (!rtt_var.resize) {
                    rtt_var.w = $(this).children().width();
                    rtt_var.h = $(this).children().height();
                    rtt_var.windoww = Math.abs($(window).width() - rtt_var.w);
                    rtt_var.windowh = Math.abs($(window).height() - rtt_var.h);
                    rtt_var.top = parseInt(rtt_var.windowh / 2);
                    rtt_var.left = parseInt(rtt_var.windoww / 2);
                    rtt_var.rtBodyw = rtt_var.w;
                    rtt_var.rtBodyh = rtt_var.h;
                }
                html = '<img src="' + url + '" alt=""  />';
            } else {
                html = '<iframe class="rt-thickbox-yt" title="YouTube video player" style="margin:5px; padding:0;" width="' + rtt_var.w + '" ';
                html += 'height="' + rtt_var.h + '" src="' + youtubeurl + '" frameborder="0" allowfullscreen></iframe>';
            }

            rtBody.append(html);

            /* handle the click event */
            rtOverlay.fadeIn('fast');
            if (rtBody.find('img').length) {
                rtBody.find('img').css({width : rtt_var.w + 'px', height : rtt_var.h + 'px'});
            }

            $.fn.rtThickbox.gettitle(rtt_var, $(this));
            rtBody.css({width : (parseInt(rtt_var.rtBodyw) + 10) + 'px', height : (parseInt(rtt_var.rtBodyh) + 10) + 'px', top : rtt_var.top, left : rtt_var.left}).fadeIn('fast');

            /* clears overlay and content */
            rtOverlay.on('click', function() {
                $.fn.rtThickbox.clear(rtt_var);
            });
            rtBody.on('click', function() {
                $.fn.rtThickbox.clear(rtt_var);
            });
        });

        $('.rt-thickbox-slide a').on('click', function(e) {
            e.preventDefault();
            var url = '';
            var title = '';
            if (rtt_var.hasthumb) {
                if ($(this).find('img').length) {
                    url = $(this).find('img').attr('src');
                } else {
                    url = $(this).attr('href');
                }
            } else {
                url = $(this).attr('href');                
            }            
            var html = '';
            var rtSlider = $('.' + rtt_var.sliderContainer);
            var rtSliderNavi = $('.' + rtt_var.navigationContainer);
            var rtLeftArrow = $('.' + rtt_var.leftArrow);
            var rtRightArrow = $('.' + rtt_var.rightArrow);            
            if (!rtt_var.resize && rtt_var.hasthumb) {
                rtt_var.w = $(this).children().width();
                rtt_var.h = $(this).children().height();                
                rtt_var.windoww = Math.abs($(window).width() - rtt_var.w);
                rtt_var.windowh = Math.abs($(window).height() - rtt_var.h);
                rtt_var.top = parseInt(rtt_var.windowh / 2);
                rtt_var.left = parseInt(rtt_var.windoww / 2);
                rtt_var.rtBodyw = rtt_var.w;
                rtt_var.rtBodyh = rtt_var.h;
            }
            html = '<img src="' + url + '" class="' + $(this).attr('class') + '" alt=""  />';
            if(rtt_var.hastitle){
                html += title;
            }
            rtBody.append(html);

            /* handle the click event */
            rtOverlay.fadeIn('fast');
            if (rtBody.find('img').length) {
                rtBody.find('img').css({width : rtt_var.w + 'px', height : rtt_var.h + 'px'});
            }
            
            rtLeftArrow.css({left : (rtt_var.left - (rtLeftArrow.width()/2)), top : (rtt_var.top + ((parseInt(rtt_var.rtBodyh) + 10) / 2))});
            rtRightArrow.css({left : (rtt_var.left + rtt_var.rtBodyw), top : (rtt_var.top + ((parseInt(rtt_var.rtBodyh) + 10) / 2))});
            rtSliderNavi.css({width : (parseInt(rtt_var.rtBodyw) + 10) + 'px', height : 'auto', top : (rtt_var.top + (parseInt(rtt_var.rtBodyh) + 10) ), left : rtt_var.left}).fadeIn('fast');            
            $.fn.rtThickbox.gettitle(rtt_var, $(this));
            rtBody.css({width : (parseInt(rtt_var.rtBodyw) + 10) + 'px', height : (parseInt(rtt_var.rtBodyh) + 10) + 'px', top : rtt_var.top, left: rtt_var.left}).fadeIn('fast');
            rtSlider.show();

            /* clears overlay and content */
            rtOverlay.on('click', function() {
                $.fn.rtThickbox.clear(rtt_var);
            });
            rtBody.on('click', function() {
                $.fn.rtThickbox.clear(rtt_var);
            });            
        });
        
        /* Slider Navigation */
        
        $('.'+rtt_var.leftArrow).on('click', rtt_var, function(e){
            e.preventDefault();
            var currentObj = $(this);
            var rtBody = $('.' + rtt_var.rtBody);
            var current_slide = rtBody.find('img').attr('class').split(/slide\-/gi);
            var prevslide = 'slide-';
            console.log(current_slide[1]);
            if( parseInt(current_slide[1]) === 0 ){
                prevslide += rtt_var.total_slide_count - 1;
            } else {
                prevslide += parseInt(current_slide[1]) - 1;
            }
            
            var img = rtBody.find('img');
            var previmg = $('.'+prevslide).find('img');
            var duration = (rtt_var.duration !== 0)? parseInt(rtt_var.duration / 2) : 0;
            
            switch(rtt_var.easing){
                
                case 'fade' :
                            if(!currentObj.hasClass('disable-left')){
                                img.stop(true,true).animate({opacity: 0}, { queue: false, duration: duration, complete : function(){
                                    currentObj.addClass('disable-left');
                                    if (rtt_var.hasthumb) {
                                        img.attr('src', (previmg.attr('src'))).attr('class', prevslide);
                                        $.fn.rtThickbox.gettitle(rtt_var, previmg);
                                    } else {                                        
                                        img.attr('src', (previmg.parent().attr('href'))).attr('class', prevslide);
                                        $.fn.rtThickbox.gettitle(rtt_var, previmg.parent());
                                    }                                    
                                    img.stop(true,true).animate({opacity: 1}, { queue: false, duration: duration, complete : function(){
                                        currentObj.removeClass('disable-left'); 
                                    }});
                                }});
                            }
                        break;
                        
                case 'horizontal' :
                        if(!currentObj.hasClass('disable-left')){
                            var prevslide_1 = 0;
                            if( parseInt(current_slide[1]) === 0 ){
                                prevslide_1 += ( rtt_var.total_slide_count - 1 );
                            } else {
                                prevslide_1 += ( parseInt(current_slide[1]) - 1 );
                            }

                            var img2 = $('.slide-'+prevslide_1).find('img');
                            img.css({position : 'absolute', top :'0', left : '0'}).addClass('img1');
                            rtBody.prepend(img.clone()); 
                            
                            if (rtt_var.hasthumb) {
                                img2 = rtBody.find('img.img1').eq(0).removeAttr('class').attr('src',img2.attr('src')).addClass('img2').addClass('slide-'+prevslide_1).css('left', (0 - img.parent().width()));
                            } else {                                
                                img2 = rtBody.find('img.img1').eq(0).removeAttr('class').attr('src',img2.parent().attr('href')).addClass('img2').addClass('slide-'+prevslide_1).css('left', (0 - img.parent().width()));                             
                            }
                            
                            $.fn.rtThickbox.gettitle(rtt_var, img2 ,true);
                            currentObj.addClass('disable-left');
                            img2.stop(true,true).animate({left: 0}, {queue: false, duration: duration});
                            img.stop(true,true).animate({left: (img.parent().width())}, {queue: false, duration: duration, complete : function(){
                                img.remove();
                                currentObj.removeClass('disable-left');
                            }});
                        }
                    break;
                    
                case 'vertical' :
                        if(!currentObj.hasClass('disable-left')){
                            var prevslide_1 = 0;
                            if( parseInt(current_slide[1]) === 0 ){
                                prevslide_1 += ( rtt_var.total_slide_count - 1 );
                            } else {
                                prevslide_1 += ( parseInt(current_slide[1]) - 1 );
                            }

                            var img2 = $('.slide-'+prevslide_1).find('img');
                            img.css({position : 'absolute', top : '0', left : '0'}).addClass('img1');
                            rtBody.prepend(img.clone());
                            
                            if (rtt_var.hasthumb) {
                                img2 = rtBody.find('img.img1').eq(0).removeAttr('class').attr('src',img2.attr('src')).addClass('img2').addClass('slide-'+prevslide_1).css('top', (0 - img.parent().height()));
                            } else {
                                img2 = rtBody.find('img.img1').eq(0).removeAttr('class').attr('src',img2.parent().attr('href')).addClass('img2').addClass('slide-'+prevslide_1).css('top', (0 - img.parent().height()));
                            }
                        
                            $.fn.rtThickbox.gettitle(rtt_var, img2, true);
                            currentObj.addClass('disable-left');
                            img2.stop(true,true).animate({top: 0}, {queue: false, duration: duration});
                            img.stop(true,true).animate({top: (img.parent().height())}, {queue: false, duration: duration, complete : function(){
                                img.remove();
                                currentObj.removeClass('disable-left');
                            }});
                        }
                    break;
            }            
        });
    
        $('.'+rtt_var.rightArrow).on('click', rtt_var, function(e){
            e.preventDefault();
            var rtBody = $('.' + rtt_var.rtBody);
            var currentObj = $(this);
            var current_slide = rtBody.find('img').attr('class').split(/slide\-/gi);
            var nxtslide = 'slide-';
            console.log(current_slide[1]);
            if( parseInt(current_slide[1]) === ( rtt_var.total_slide_count -1 ) ){
                nxtslide = 0;
            } else {
                nxtslide += parseInt(current_slide[1]) + 1;
            }
            
            var img = rtBody.find('img');
            var nxtimg = $('.'+nxtslide).find('img');
            var duration = (rtt_var.duration !== 0)? parseInt(rtt_var.duration / 2) : 0;
            
            switch(rtt_var.easing){
                case 'fade' :   
                        if(!currentObj.hasClass('disable-right')){
                            img.stop(true,true).animate({opacity: 0}, {queue: false, duration: duration, complete : function(){
                                currentObj.addClass('disable-right');
                                if (rtt_var.hasthumb) {
                                    img.attr('src', (nxtimg.attr('src'))).attr('class', nxtslide);
                                    $.fn.rtThickbox.gettitle(rtt_var, nxtimg);
                                } else {
                                    img.attr('src', (nxtimg.parent().attr('href'))).attr('class', nxtslide);
                                    $.fn.rtThickbox.gettitle(rtt_var, nxtimg);
                                }
                                img.stop(true,true).animate({opacity: 1}, {queue: false, duration: 'slow', complete : function(){                                    
                                    currentObj.removeClass('disable-right');
                                }});
                            }});
                        }
                    break;
                    
                case 'horizontal' :
                        if(!currentObj.hasClass('disable-right')){
                            var nxtslide_1 = 0;
                            if( parseInt(current_slide[1]) === ( rtt_var.total_slide_count -1 ) ){
                                nxtslide_1 = 0;
                            } else {
                                nxtslide_1 += parseInt(current_slide[1]) + 1;
                            }

                            var img2 = $('.slide-'+nxtslide_1).find('img');
                            img.css({position : 'absolute', top : '0'}).addClass('img1');
                            rtBody.append(img.clone());
                            
                            if (rtt_var.hasthumb) {
                                img2 = rtBody.find('img.img1').eq(1).removeAttr('class').attr('src',img2.attr('src')).addClass('img2').addClass('slide-'+nxtslide_1).css('left', img.parent().width());                                
                            } else {
                                img2 = rtBody.find('img.img1').eq(1).removeAttr('class').attr('src',img2.parent().attr('href')).addClass('img2').addClass('slide-'+nxtslide_1).css('left', img.parent().width());                             
                            }
                            
                            $.fn.rtThickbox.gettitle(rtt_var, img2, true);
                            currentObj.addClass('disable-right');
                            img.stop(true,true).animate({left: -(img.parent().width())}, {queue: false, duration: duration});
                            img2.stop(true,true).animate({left: 0}, {queue: false, duration: duration, complete : function(){
                                img.remove();
                                currentObj.removeClass('disable-right');
                            }});
                        }
                    break;
                    
                case 'vertical' :
                        if(!currentObj.hasClass('disable-right')){
                            var nxtslide_1 = 0;
                            if( parseInt(current_slide[1]) === ( rtt_var.total_slide_count -1 ) ){
                                nxtslide_1 = 0;
                            } else {
                                nxtslide_1 += parseInt(current_slide[1]) + 1;
                            }

                            var img2 = $('.slide-'+nxtslide_1).find('img');
                            img.css({position : 'absolute', top : '0'}).addClass('img1');
                            rtBody.append(img.clone());
                            
                            if (rtt_var.hasthumb) {
                                img2 = rtBody.find('img.img1').eq(1).removeAttr('class').attr('src',img2.attr('src')).addClass('img2').addClass('slide-'+nxtslide_1).css('top', img.parent().height());                                
                            } else {
                                img2 = rtBody.find('img.img1').eq(1).removeAttr('class').attr('src',img2.parent().attr('href')).addClass('img2').addClass('slide-'+nxtslide_1).css('top', img.parent().height());                                
                            }
                            
                            $.fn.rtThickbox.gettitle(rtt_var, img2, true);
                            currentObj.addClass('disable-right');
                            img.stop(true,true).animate({top: -(img.parent().height())}, {queue: false, duration: duration});
                            img2.stop(true,true).animate({top: 0}, {queue: false, duration: duration, complete : function(){
                                img.remove();
                                currentObj.removeClass('disable-right');
                            }});
                        }
                    break;
                
            }            
        });
        
        /* on window resize rearrage the position and resize the height width of the overlay */
        $(window).on('resize', rtt_var, function() {
            if (rtBody.find('img').length || rtBody.find('iframe').length) {
                if (!rtt_var.resize) {
                    rtt_var.w = rtBody.find('img').width();
                    rtt_var.h = rtBody.find('img').height();
                }

                rtt_var.hratio = $(window).height() / rtt_var.originalh;
                rtt_var.wratio = $(window).width() / rtt_var.originalw;

                if (rtt_var.wratio === 1) {
                    rtt_var.wratio = rtt_var.hratio;
                } else if (rtt_var.hratio === rtt_var.wratio) {
                    rtt_var.hratio = rtt_var.wratio;
                }

                rtt_var.w = rtt_var.w * rtt_var.wratio;
                rtt_var.h = rtt_var.h * rtt_var.hratio;
                rtt_var.rtBodyw = parseInt(rtt_var.w);
                rtt_var.rtBodyh = parseInt(rtt_var.h);
                rtt_var.top = parseInt(Math.abs($(window).height() - rtt_var.h) / 2);
                rtt_var.left = parseInt(Math.abs($(window).width() - rtt_var.w) / 2);

                rtBody.removeAttr('style');
                if (!rtt_var.resize) {
                    rtBody.css('position', 'absolute');                    

                }
                if (rtt_var.isslider) {
                    var rtSliderNavi = $('.' + rtt_var.navigationContainer);
                    var rtLeftArrow = $('.' + rtt_var.leftArrow);
                    var rtRightArrow = $('.' + rtt_var.rightArrow);
                    rtSliderNavi.css({ width : (parseInt(rtt_var.rtBodyw) + 10) + 'px', height : 'auto', top : (rtt_var.top + (parseInt(rtt_var.rtBodyh) + 10) ), left : rtt_var.left}).fadeIn('fast');
                    rtLeftArrow.css({left : (rtt_var.left - (rtLeftArrow.width()/2)), top : (rtt_var.top + ((parseInt(rtt_var.rtBodyh) + 10) / 2))});
                    rtRightArrow.css({ left : (rtt_var.left + rtt_var.rtBodyw) , top : (rtt_var.top + ((parseInt(rtt_var.rtBodyh) + 10) / 2))});
                }
                rtBody.css({ width : (parseInt(rtt_var.rtBodyw) + 10) + 'px', height : (parseInt(rtt_var.rtBodyh) + 10) + 'px'});
                rtBody.find('img').css({width : rtt_var.w, height : rtt_var.h});
                rtBody.find('iframe.rt-thickbox-yt').css({ width : rtt_var.w, height : rtt_var.h});
                rtBody.css({top : rtt_var.top + 'px', left : rtt_var.left + 'px'});
                if(rtt_var.hastitle && rtt_var.hastitle.selector !== ''){
                    rtBody.find('div.title').css('width', (rtt_var.rtBodyw - 10));
                }
                rtBody.show();

                rtt_var.originalh = $(window).height();
                rtt_var.originalw = $(window).width();
            }
        });
    };

    /* Function to get title */
    $.fn.rtThickbox.gettitle = function(rtt_var, curr_obj, isnav){        
        console.log(curr_obj);
        var rtBody = $('.' + rtt_var.rtBody);
        var title = '';
        if(rtt_var.hastitle && rtt_var.hastitle.selector !== ''){
            if (rtt_var.hasthumb) {
                if(isnav === true){
                    title = curr_obj.attr(rtt_var.hastitle.selector);
                    var tmp = curr_obj.attr('class').split(/\s/gi);                    
                    title = $('.rt-thickbox-slide a.'+tmp[1]).find('img').attr(rtt_var.hastitle.selector);
                } else {
                    title = curr_obj.find('img').attr(rtt_var.hastitle.selector);
                }                
            } else {
                if(isnav === true){                    
                    var tmp = curr_obj.attr('class').split(/\s/gi);                    
                    title = $('.rt-thickbox-slide a.'+tmp[1]).attr(rtt_var.hastitle.selector);
                } else {
                    title = curr_obj.attr(rtt_var.hastitle.selector);
                }                
            }            
            rtBody.find('div.title').text(title);            
            
            if(rtBody.find('div.title').length){
                
                var title_obj = rtBody.find('div.title');
                title_obj.css({
                    position : 'absolute',
                    width : (rtt_var.rtBodyw - 10),
                    left : 0,
                    padding : '5px',
                    margin : '5px',
                    background : rtt_var.hastitle.bgcolor,
                    opacity : rtt_var.hastitle.opacity,
                    color : rtt_var.hastitle.color
                }).css('z-index', 102);
            
                switch(rtt_var.hastitle.opsition){
                    case 'bottom' : 
                         title_obj.css('bottom', '0');
                        break;

                    case 'top' : 
                        title_obj.css('top', '0');
                        break;
                }                
            }            
        }        
    }

    /* Function to append the ovelay markup at the botttom of the body */
    $.fn.rtThickbox.init = function(rtt_var) {        
        if ( $('.'+rtt_var.rtOverlay).length === 0 ) {
            var html = '<div class="' + rtt_var.rtOverlay + '"></div><div class="' + rtt_var.rtBody + '">';
            if(rtt_var.hastitle && rtt_var.hastitle.selector !== ''){
                html += '<div class="title"></div>';
            }
            html += '</div>';
            $('body').append(html);
        }
        if (rtt_var.isslider) {
            $('.' + rtt_var.rtBody).remove();
            var html = '<div class="' + rtt_var.sliderContainer + '"><div class="' + rtt_var.rtBody + '">';
            if(rtt_var.hastitle && rtt_var.hastitle.selector !== ''){
                html += '<div class="title"></div>';
            }
            html += '</div><div class="' + rtt_var.navigationContainer + '"><a href="#" class="' + rtt_var.leftArrow + '" title="' + rtt_var.prev + '" >' + rtt_var.prev + '</a><a href="#" class="' + rtt_var.rightArrow + '" title="' + rtt_var.next + '" >' + rtt_var.next + '</a></div>';
            $('body').append(html);
            rtt_var.total_slide_count = 0;
            $('.rt-thickbox dl').each(function(i) {
                jQuery(this).addClass('rt-thickbox-slide');
                jQuery(this).find('a').addClass('slide-' + i);
                rtt_var.total_slide_count++;
            });
        }
    };

    /* Function to clear the content and hide the overlay */
    $.fn.rtThickbox.clear = function(rtt_var) {
        var rtOverlay = $('.' + rtt_var.rtOverlay);
        var rtBody = $('.' + rtt_var.rtBody);
        if (rtt_var.isslider) {
            var rtSlider = $('.' + rtt_var.sliderContainer);
            rtSlider.fadeOut('fast');
        }
        rtBody.fadeOut('fast');
        rtOverlay.fadeOut('fast');
        rtBody.removeAttr('style');
        rtBody.css('display', 'none');
        $('.'+rtt_var.leftArrow).removeClass('disable-left')
        $('.'+rtt_var.rightArrow).removeClass('disable-left')
        rtBody.find('img').remove();
        rtBody.find('iframe').remove();
    };

    /* Default rtt_var */
    $.fn.rtThickbox.defaults = {
        width: '600',
        height: '500',
        rtOverlay: 'rt-overlay',
        rtBody: 'rt-thickbox-wrapper',
        resize: false,
        hasthumb: false,
        isslider: false,
        sliderContainer: 'rtt-slider',
        leftArrow: 'rtt-leftarrow',
        rightArrow: 'rtt-rightarrow',
        navigationContainer: 'rtt-navigation',
        next: 'Next',
        prev: 'Prev',
        start: 0,
        duration: 500,
        easing : 'fade',
        hastitle : { selector : '', opsition : '' }
    };

})(jQuery);