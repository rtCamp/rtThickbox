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
        resize : options.resize
    };
    
    /* first time click append the markup at the bottom */
    $.fn.rtThickbox.init(rtt_var);
    
    var rtOverlay = $('#'+rtt_var.rtOverlay);
    var rtBody = $('#'+rtt_var.rtBody);
    
    $('a.rt-thickbox').on('click', function(e){            
        e.preventDefault();
       /* overlay HTML */    
        url = jQuery(this).attr('href');            
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
            if(rtt_var.resize){                          
                rtt_var.w = $(this).children().width();
                rtt_var.h = $(this).children().height();
                rtt_var.windoww = Math.abs($(window).width() - rtt_var.w);
                rtt_var.windowh = Math.abs($(window).height() - rtt_var.h);
                rtt_var.top = parseInt( rtt_var.windowh / 2 );
                rtt_var.left = parseInt( rtt_var.windoww / 2 );
                rtt_var.rtBodyw = rtt_var.w;
                rtt_var.rtBodyh = rtt_var.h;
            } 
            html = '<img src="'+url+'" alt="" />';
        } else {
            html = '<iframe class="rt-thickbox-yt" title="YouTube video player" style="margin:0; padding:0;" width="' + rtt_var.w + '" ';
            html += 'height="' + rtt_var.h + '" src="' + youtubeurl + '" frameborder="0" allowfullscreen></iframe>';
        }

        rtBody.append(html);

        /* handle the click event */
        rtOverlay.fadeIn('fast');     
            console.log(rtt_var.rtBodyw);
            console.log(rtt_var.rtBodyh);
        rtBody.css('max-width', (parseInt(rtt_var.rtBodyw) + 10) + 'px').css('max-height', (parseInt(rtt_var.rtBodyh) + 10) + 'px').css('top', rtt_var.top).css('left', rtt_var.left).fadeIn('fast');
        
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
        if(rtt_var.resize){
            rtt_var.w = $(this).children().width();
            rtt_var.h = $(this).children().height();
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
        
        rtBody.css('max-width', (parseInt(rtt_var.rtBodyw) + 10) + 'px').css('max-height', (parseInt(rtt_var.rtBodyh) + 10) + 'px');
//        rtBody.css('max-width', rtt_var.rtBodyw).css('max-height', rtt_var.rtBodyh);        
        rtBody.find('iframe.rt-thickbox-yt').css('max-width', rtt_var.w).css('max-height', rtt_var.h);
        rtBody.css('top', rtt_var.top).css('left', rtt_var.left);
        
        rtt_var.originalh =  $(window).height();
        rtt_var.originalw =  $(window).width();
    });
};

/* Function to append the ovelay markup at the botttom of the body */
$.fn.rtThickbox.init = function(rtt_var){
    if( document.getElementById('rt-overlay') === null ){
        $('body').append('<div id="'+ rtt_var.rtOverlay +'"></div><div id="'+rtt_var.rtBody+'"></div>');
    }
};

/* Function to clear the content and hide the overlay */
$.fn.rtThickbox.clear = function(rtt_var){
    var rtOverlay = $('#'+rtt_var.rtOverlay);
    var rtBody = $('#'+rtt_var.rtBody);
    rtBody.fadeOut('fast');
    rtOverlay.fadeOut('fast');
    rtBody.removeAttr('style');
    rtBody.html('');
};

/* Function to handle overlay resizing */
$.fn.rtThickbox.resize = function(rtt_var){
    var rtBody = $('#'+rtt_var.rtBody);   
//    if(rtt_var.resize){
//        rtt_var.w = $(this).children().width();
//        rtt_var.h = $(this).children().height();
//    } else {
//        rtt_var.w = rtt_var.width;
//        rtt_var.h = rtt_var.height;
//    }
//
//        console.log(rtt_var.originalh);
//        console.log(rtt_var.originalw);
//    rtt_var.hratio = $(window).height()/rtt_var.originalh ;
//    rtt_var.wratio = $(window).width()/rtt_var.originalw ;
    
//    if(rtt_var.wratio === 1){
//        rtt_var.wratio = rtt_var.hratio;
//    } else if (rtt_var.hratio ===  rtt_var.wratio) {
//        rtt_var.hratio = rtt_var.wratio; 
//    }
//    rtt_var.w = rtt_var.w * rtt_var.wratio;
//    rtt_var.h = rtt_var.h * rtt_var.hratio;
//    rtt_var.rtBodyw = parseInt(rtt_var.w) + 10;
//    rtt_var.rtBodyh = parseInt(rtt_var.h) + 10;
//    rtBody.css('max-width', rtt_var.rtBodyw + 'px').css('max-height', rtt_var.rtBodyh + 'px');
//    rtt_var.top = ( Math.abs($(window).height() - rtt_var.h) / 2 );
//    rtt_var.left = ( Math.abs($(window).width() - rtt_var.w) / 2 );
//    
//    rtBody.find('iframe.rt-thickbox-yt').css('max-width', rtt_var.w).css('max-height', rtt_var.h);
//    rtBody.css('top', rtt_var.top).css('left', rtt_var.left);
};

/* Default rtt_var */
$.fn.rtThickbox.defaults = {
			width : '600',
			height : '500',
                        rtOverlay : 'rt-overlay',
                        rtBody : 'rt-thickbox-wrapper',
                        resize : false
//			commonClass : 'all',
//                        dissabledClass : 'dissabled',
//			categoryClass : [],
//			activeImage : [],
//			inActive : [],
//			start: 'all'
	};
})(jQuery);