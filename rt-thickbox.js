(function($){

$.fn.rtThickbox = function (opt){
    /* Overwrite default options with user provided ones and merge them into "options". */
    var options = $.extend(true,$.fn.rtThickbox.defaults, opt);  
    
    rtt_var = {
        w : parseInt(options.width),
        h : parseInt(options.height),
        windoww : Math.abs($(window).width() - options.width),
        windowh : Math.abs($(window).height() - options.height),
        top : ( (Math.abs($(window).height() - options.height)) / 2 ),
        left : ( (Math.abs($(window).width() - options.width)) / 2 ),
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
        start : options.start
    };    
    
    /* first time click append the markup at the bottom */
    $.fn.rtThickbox.init(rtt_var);    
    
    var rtOverlay = $('#'+rtt_var.rtOverlay);
    var rtBody = $('#'+rtt_var.rtBody);
    
    $('a.rt-thickbox').on('click', function(e){            
        e.preventDefault();
        
       /* overlay HTML */    
        var url = '';
        var html = '';
        if(rtt_var.hasthumb){
            if($(this).find('img').length){
                url = $(this).find('img').attr('src');
            } else {
                url = $(this).attr('href');
            }
        } else {
            url = $(this).attr('href');
        }
        var str = url.toString();
        var youtubeurl = '';                            
        if(str.match(/www.youtube.com\/watch/gi) !== null){
            var youtubeid = str.split(/www.youtube.com\/watch\?v\=/i);
            youtubeurl = 'http://www.youtube.com/embed/' + youtubeid[1];
        } else if(str.match(/http:\/\/www.youtube.com\/embed/gi) !== null ){
            youtubeurl = str;
        } else {
            youtubeurl = '';
        }

        if(youtubeurl === ''){
            if(!rtt_var.resize){                          
                rtt_var.w = $(this).children().width();
                rtt_var.h = $(this).children().height();
                rtt_var.windoww = Math.abs($(window).width() - rtt_var.w);
                rtt_var.windowh = Math.abs($(window).height() - rtt_var.h);
                rtt_var.top = parseInt( rtt_var.windowh / 2 );
                rtt_var.left = parseInt( rtt_var.windoww / 2 );
                rtt_var.rtBodyw = rtt_var.w;
                rtt_var.rtBodyh = rtt_var.h;
            }
            html = '<img src="'+url+'" alt=""  />';
        } else {
            html = '<iframe class="rt-thickbox-yt" title="YouTube video player" style="margin:5px; padding:0;" width="' + rtt_var.w + '" ';
            html += 'height="' + rtt_var.h + '" src="' + youtubeurl + '" frameborder="0" allowfullscreen></iframe>';
        }

        rtBody.append(html);

        /* handle the click event */
        rtOverlay.fadeIn('fast');
        if(rtBody.find('img').length ){
            rtBody.find('img').css('width',rtt_var.w+'px');
            rtBody.find('img').css('height',rtt_var.h+'px');
        }
        
        rtBody.css('width', (parseInt(rtt_var.rtBodyw) + 10) + 'px').css('height', (parseInt(rtt_var.rtBodyh) + 10) + 'px').css('top', rtt_var.top).css('left', rtt_var.left).fadeIn('fast');
        
    /* clears overlay and content */
        rtOverlay.on('click',function(){
            $.fn.rtThickbox.clear(rtt_var);
        });
        rtBody.on('click',function(){
            $.fn.rtThickbox.clear(rtt_var);
        }); 
    });

    $('.rt-thickbox-slide a').on('click', function(e){
        e.preventDefault();
        var url = $(this).attr('href');            
        var html = '';
        var rtSlider = $('#'+rtt_var.sliderContainer);
        if(!rtt_var.resize){                          
            rtt_var.w = $(this).children().width();
            rtt_var.h = $(this).children().height();
            rtt_var.windoww = Math.abs($(window).width() - rtt_var.w);
            rtt_var.windowh = Math.abs($(window).height() - rtt_var.h);
            rtt_var.top = parseInt( rtt_var.windowh / 2 );
            rtt_var.left = parseInt( rtt_var.windoww / 2 );
            rtt_var.rtBodyw = rtt_var.w;
            rtt_var.rtBodyh = rtt_var.h;
        }
        html = '<img src="'+url+'" alt=""  />';
        rtBody.append(html);

        /* handle the click event */
        rtOverlay.fadeIn('fast');
        if(rtBody.find('img').length ){
            rtBody.find('img').css('width',rtt_var.w+'px');
            rtBody.find('img').css('height',rtt_var.h+'px');
        }
        
        rtBody.css('width', (parseInt(rtt_var.rtBodyw) + 10) + 'px').css('height', (parseInt(rtt_var.rtBodyh) + 10) + 'px').css('top', rtt_var.top).css('left', rtt_var.left).fadeIn('fast');
        rtSlider.show();
        
        /* clears overlay and content */
        rtOverlay.on('click',function(){
            $.fn.rtThickbox.clear(rtt_var);
        });
        rtBody.on('click',function(){
            $.fn.rtThickbox.clear(rtt_var);
        });         
    });

    /* on window resize rearrage the position and resize the height width of the overlay */
    $(window).on('resize', rtt_var, function() {
        if(rtBody.html().length){
            if(!rtt_var.resize){
                rtt_var.w = rtBody.find('img').width();
                rtt_var.h = rtBody.find('img').height();
            }

            rtt_var.hratio = $(window).height()/rtt_var.originalh ;
            rtt_var.wratio = $(window).width()/rtt_var.originalw ;

            if(rtt_var.wratio === 1){
                rtt_var.wratio = rtt_var.hratio;
            } else if (rtt_var.hratio ===  rtt_var.wratio) {
                rtt_var.hratio = rtt_var.wratio; 
            }

            rtt_var.w = rtt_var.w * rtt_var.wratio;
            rtt_var.h = rtt_var.h * rtt_var.hratio;
            rtt_var.rtBodyw = parseInt(rtt_var.w);
            rtt_var.rtBodyh = parseInt(rtt_var.h);        
            rtt_var.top = parseInt( Math.abs($(window).height() - rtt_var.h) / 2 );
            rtt_var.left = parseInt( Math.abs($(window).width() - rtt_var.w) / 2 );

            rtBody.removeAttr('style');
            if(!rtt_var.resize){
                rtBody.css('position','absolute');   
                    console.log($(window).scrollTop());

            }        
            rtBody.css('width', (parseInt(rtt_var.rtBodyw) + 10) + 'px').css('height', (parseInt(rtt_var.rtBodyh) + 10) + 'px');
            rtBody.find('img').css('width', rtt_var.w).css('height', rtt_var.h);
            rtBody.find('iframe.rt-thickbox-yt').css('width', rtt_var.w).css('height', rtt_var.h);
            rtBody.css('top', rtt_var.top + 'px').css('left', rtt_var.left + 'px');
            rtBody.show();

            rtt_var.originalh =  $(window).height();
            rtt_var.originalw =  $(window).width();
        }        
    });    
};

/* Function to append the ovelay markup at the botttom of the body */
$.fn.rtThickbox.init = function(rtt_var){        
    if( document.getElementById('rt-overlay') === null ){
        $('body').append('<div id="'+ rtt_var.rtOverlay +'"></div><div id="'+rtt_var.rtBody+'"></div>');        
    }
    if(rtt_var.isslider){
        $('#'+rtt_var.rtBody).remove();
        $('body').append('<div id="'+rtt_var.sliderContainer+'"><div id="'+rtt_var.rtBody+'"></div><div id="'+ rtt_var.navigationContainer +'"><div id="'+ rtt_var.leftArrow +'"><a href="#" title="'+rtt_var.prev+'" >'+rtt_var.prev+'</a></div><div id="'+ rtt_var.rightArrow +'"><a href="#" title="'+rtt_var.next+'" >'+rtt_var.next+'</a></div></div>')
        var slider_count = 0;
        $('.rt-thickbox dl').each(function(i){
            jQuery(this).addClass('rt-thickbox-slide');
            slider_count++;
        });
//        if(rtt_var.start === 0){
//            rtt_var.rtBody.append('<div class="prev"></div><div class="active"></div><div class=""></div>');
//        } else {
//        
//        }

        
//        $('.rt-thickbox .rt-thickbox-slide').eq().each(function(i){
//            if( i === 0 ){
//                
//            } else {
//            
//            }
//
//        });
    }
};

/* Function to clear the content and hide the overlay */
$.fn.rtThickbox.clear = function(rtt_var){
    var rtOverlay = $('#'+rtt_var.rtOverlay);
    var rtBody = $('#'+rtt_var.rtBody);
    if(rtt_var.isslider){
        var rtSlider = $('#'+rtt_var.sliderContainer);
        rtSlider.fadeOut('fast');
    }
    rtBody.fadeOut('fast');
    rtOverlay.fadeOut('fast');
    rtBody.removeAttr('style');
    rtBody.css('display','none');
    rtBody.html('');
};

/* Default rtt_var */
$.fn.rtThickbox.defaults = {
        width : '600',
        height : '500',
        rtOverlay : 'rt-overlay',
        rtBody : 'rt-thickbox-wrapper',
        resize : false,
        hasthumb : false,
        isslider : false,
        sliderContainer : 'rtt-slider',
        leftArrow : 'rtt-leftarrow',
        rightArrow : 'rtt-rightarrow',
        navigationContainer : 'rtt-navigation',
        next : 'Next',
        prev : 'Prev',
        start : 0
};

//$.fn.rtThickbox.slider = $.extend({},$.fn.rtThickbox,function(opt){
//        console.log(opt);
//});

})(jQuery);