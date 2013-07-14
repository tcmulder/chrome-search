/*///////////////////////////////////////////////////////////////// Global Variables
Global Variables */
var sTerm = '';

/*///////////////////////////////////////////////////////////////// Search Highlightin
Search Highlighting */
var sHighlight = function(){
    //set local variables
    var pressed = [];
    var i = -1;

    //set up visual printout
    $('body').prepend('<div id="sPrint"></div>');
    $('body').prepend('<div id="sCur"></div>');

    //when you press a key
    $('body').bind('keydown', function(e){
        pressed.push(e.keyCode);
        if(!$(e.target).is('input, textarea')){
            if(e.which === 8 || e.which === 32) {
                e.preventDefault();
            }
        }
    });

    //when you release the key
    $('body').bind('keyup', function(e){
       if(pressed.length == 1){
            pressed = [];
            if(!$(e.target).is('input, textarea')){
                if(!e.shiftKey){
                    $(this).unhighlight();
                    if(e.which === 27){
                        sTerm = '';
                    }
                    else if(e.which === 8) {
                        e.preventDefault();
                        sTerm = sTerm.substring(0, sTerm.length - 1);
                    } else {
                        var theChar = String.fromCharCode(e.keyCode);
                        var re = /[A-Z\d]|\s/;
                        if(theChar.match(re)){
                            e.preventDefault();
                            sTerm += theChar.toLowerCase();
                            i = -1;
                        }
                    }
                    $(this).highlight(sTerm);
                    $('#sPrint').text(sTerm);
                    $(document).trigger('sUpdate');
                }
            }
        } else {
            pressed = [];
        }
    });

    $(document).bind('keypress', function(event) {
        var highlight = $('.highlight');
        if(event.which === 88 && event.shiftKey) {
            i++;
            console.log(i);
            if(i >= highlight.length){
                i = 0;
            }
            $('html, body').animate({
                scrollTop: highlight.eq(i).offset().top - 10
            }, 300);
            $('#sCur').css('display','block').animate({
                opacity: 1,
                top: 0,
                left: highlight.eq(i).offset().left,
                width: highlight.eq(i).width()
            });
            window.clearTimeout(window.sCurTime);
            window.sCurTime = window.setTimeout(hideSCurTime, 2000);
        } else if(event.which === 90 && event.shiftKey) {
            i--;
            if(i == -1){
                i = highlight.length - 1;
            }
            $('html, body').animate({
                scrollTop: highlight.eq(i).offset().top - 10
            }, 300);
            $('#sCur').css('display','block').animate({
                opacity: 1,
                top: 0,
                left: highlight.eq(i).offset().left,
                width: highlight.eq(i).width()
            });
            window.clearTimeout(window.sCurTime);
            window.sCurTime = window.setTimeout(hideSCurTime, 2000);
        }
    });

    window.sCurTime;
    function hideSCurTime() {
        $('#sCur').fadeOut(500);
    }
}();
var clickable = function() {
    var i = 0;
    $(document).on('sUpdate', function(){
        $('a').each(function(){
            var re = new RegExp(sTerm, 'i');
            if(sTerm != '' && $(this).text().search(re) != -1){
                $(this).addClass('focusable');
                $('.focusable').eq(0).focus().hover();
            } else {
                $(this).removeClass('focusable');
            }
        });
        i = 0;
    });
    $(document).bind('keypress', function(event) {
        var focusable = $('.focusable');
        if(event.which === 83 && event.shiftKey) {
            i++;
            if(i >= focusable.length){
                i = 0;
            }
           focusable.eq(i).focus();
        } else if(event.which === 65 && event.shiftKey) {
            i--;
            if(i == -1){
                i = focusable.length - 1;
            }
            focusable.eq(i).focus();
        }
    });
}();
