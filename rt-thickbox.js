(function($){

$.fn.rtThickbox = function (opt){    
    
    /* Overwrite default options with user provided ones and merge them into "options". */
    var options = $.extend(true,$.fn.rtThickbox.defaults, opt);
    
    options.w = options.width;
    options.h = options.height;
    options.windowh = Math.abs($(window).height() - options.h);
    options.windoww = Math.abs($(window).width() - options.w);
    options.top = ( options.windowh / 2 );
    options.left = ( options.windoww / 2 );    
    options.html = '';
    options.url = "";
    options.originalh = $(window).height();
    options.originalw = $(window).width();

    /* first time click append the markup at the bottom */
    if( document.getElementById('rt-overlay') === null ){
        $('body').append('<div id="'+ options.rtOverlay +'"></div><div id="'+options.rtBody+'"></div>');
    }    

    var rtOverlay = $('#'+options.rtOverlay);
    var rtBody = $('#'+options.rtBody);
    
    $('a.rt-thickbox').each(function(i){
        $(this).on('click', function(e){            
            e.preventDefault();
           /* overlay HTML */    
            url = $(this).attr('href');
            var youtubeurl = '';                                      
            if(url.match(/www.youtube.com\/watch/gi) !== null){
                var youtubeid = url.split('/www.youtube.com\/watch\?v\=/i');            
                youtubeurl = 'http://www.youtube.com/embed/' + youtubeid[1];
                $(this).attr('data-rel','video');
            } else if(url.match(/http:\/\/www.youtube.com\/embed/gi) !== null ){                    
                youtubeurl = url;
                $(this).attr('data-rel','video');
            } else {
                youtubeurl = '';
            }

            if(youtubeurl === ''){
                html = '<img src="'+url+'" width="'+options.w+'" height="'+options.h+'" alt="" />';
            } else {
                html = '<iframe class="rt-thickbox-yt" title="YouTube video player" style="margin:0; padding:0;" width="' + options.w + '" ';
                html += 'height="' + options.h + '" src="' + youtubeurl + '" frameborder="0" allowfullscreen></iframe>';   
            }
            
            rtBody.append(html);            

            /* handle the click event */
            rtOverlay.fadeIn('fast');
            rtBody.css('width', options.w + 'px').css('height', options.h + 'px').css('top', options.top).css('left', options.left).fadeIn('fast');
            rtOverlay.on('click',function(){
                $(this).fadeOut('fast');
                rtBody.fadeOut('fast');
                rtBody.html('');
            });
            rtBody.on('click',function(){
                $(this).fadeOut('fast');
                rtOverlay.fadeOut('fast');
                rtBody.html('');
            }); 
        });        
    });

    /* on window resize rearrage the position and resize the height width of the overlay */
    $(window).resize(function() {
        $.fn.rtThickbox.resize(options);
    });
};

$.fn.rtThickbox.resize = function(options){
    
    var rtBody = $('#'+options.rtBody);    
    options.w = options.width;
    options.h = options.height;
    options.hratio = $(window).height()/options.originalh ;
    options.wratio = $(window).width()/options.originalw ;
    
    if(options.wratio === 1){
        options.wratio = options.hratio;
    } else if (options.hratio ===  options.wratio) {
        options.hratio = options.wratio; 
    }
    options.w = options.w * options.wratio;
    options.h = options.h * options.hratio;
    rtBody.css('width', options.w + 'px').css('height', options.h + 'px');
    options.top = ( Math.abs($(window).height() - options.h) / 2 );
    options.left = ( Math.abs($(window).width() - options.w) / 2 );
    
    rtBody.find('iframe.rt-thickbox-yt').css('width', options.w).css('height', options.h);
    rtBody.css('top', options.top).css('left', options.left);
};
$.fn.rtThickbox.defaults = {
			width : '600',
			height : '500',
                        rtOverlay : 'rt-overlay',
                        rtBody : 'rt-thickbox-wrapper'
//			commonClass : 'all',
//                        dissabledClass : 'dissabled',
//			categoryClass : [],
//			activeImage : [],
//			inActive : [],
//			start: 'all'
	};
})(jQuery);