//chrome search function
var chromeSearch = {
    //store the search term
    sTerm: '',
    //store concurrently pressed keys
    pressed: [],
    //store highlight nav increment
    highlightInc: -1,
    //store anchor nav increment
    aInc: 0,
    //add some stuff to the DOM
    modDom: function(){
        //add the search term printout
        $('body').prepend('<div id="sPrint"></div>');
        //add the search term current item highlighter
        $('body').prepend('<div id="sCur"></div>');
    },
    //handle what happens when keys are pressed
    handleKeydown: function(){
        $(document).bind('keydown', function(e){
            //add keys pressed to the array
            chromeSearch.pressed.push(e.keyCode);
            //make sure you're not typing in a form field
            if(!$(e.target).is('input, textarea')){
                //prevent backspace and space default behavior
                if(e.which === 8 || e.which === 32) {
                    e.preventDefault();
                }
            }
        });
    },
    //highlight text
    highlight: function(){
        //apply highlights on keyup (only works for body)
        $('body').bind('keyup', function(e){
            //if only one key was pressed
            if(chromeSearch.pressed.length == 1){
                //reset the keypress array
                chromeSearch.pressed = [];
                //make sure you're not typing in a form field
                if(!$(e.target).is('input, textarea')){
                    //make sure the shift key isn't pressed
                    if(!e.shiftKey){
                        //stop highlighting everything
                        $(this).unhighlight();
                        //remove the search term on esc keypress
                        if(e.which === 27){
                            chromeSearch.sTerm = '';
                        }
                        //if you click backspace
                        else if(e.which === 8) {
                            //remove the last character in the search term variable
                            chromeSearch.sTerm = chromeSearch.sTerm.substring(0, chromeSearch.sTerm.length - 1);
                        } else {
                            //get the character from the code
                            var theChar = String.fromCharCode(e.keyCode);
                            //if this is a character A-Z, a number, or a space
                            var re = /[A-Z\d]|\s/;
                            if(theChar.match(re)){
                                //ensure no default behavior triggers
                                e.preventDefault();
                                //add this character to the search term
                                chromeSearch.sTerm += theChar.toLowerCase();
                                //reset the highlight increment
                                chromeSearch.highlightInc = -1;
                            }
                        }
                        //highlight the search term
                        $(this).highlight(chromeSearch.sTerm);
                        //print the search term so you can see it
                        $('#sPrint').text(chromeSearch.sTerm);
                        //trigger the search update
                        $(document).trigger('sUpdate');
                    }
                }
            //don't do anything if you pressed more than one key
            } else {
                pressed = [];
                return false;
            }
        });
    },
    //navigate through highlighted terms
    navHighlights: function(){
        //when you click a key
        $(document).bind('keypress', function(e) {
            //cache the items with the highlight class
            var highlight = $('.highlight');
            //if you click shift+x
            if(e.which === 88 && e.shiftKey) {
                //increment the search term index
                chromeSearch.highlightInc++;
                //if you're at the last highlighted term
                if(chromeSearch.highlightInc >= highlight.length){
                    //reset increment to the start
                    chromeSearch.highlightInc = 0;
                }
                //animate to the top of the search term at the current increment index
                $('html, body').animate({
                    scrollTop: highlight.eq(chromeSearch.highlightInc).offset().top - 10
                }, 300);
                //animate the current highlighted term indicator
                $('#sCur').css('display','block').animate({
                    opacity: 1,
                    top: 0,
                    left: highlight.eq(chromeSearch.highlightInc).offset().left,
                    width: highlight.eq(chromeSearch.highlightInc).width()
                });
                //clear any existing timers and then start it again
                window.clearTimeout(window.sCurTime);
                window.sCurTime = window.setTimeout(chromeSearch.aCurHideTimer, 2000);
            //if you click shift-z
            } else if(e.which === 90 && e.shiftKey) {
                //decrement the search term index
                chromeSearch.highlightInc--;
                //if you're past the first highlighted term
                if(chromeSearch.highlightInc == -1){
                    //reset the increment to the last item
                    chromeSearch.highlightInc = highlight.length - 1;
                }
                //animate to the top of this search term
                $('html, body').animate({
                    scrollTop: highlight.eq(chromeSearch.highlightInc).offset().top - 10
                }, 300);
                //animate the current highlighted term indicator
                $('#sCur').css('display','block').animate({
                    opacity: 1,
                    top: 0,
                    left: highlight.eq(chromeSearch.highlightInc).offset().left,
                    width: highlight.eq(chromeSearch.highlightInc).width()
                });
                //clear any existing timers and then start it again
                window.clearTimeout(window.sCurTime);
                window.sCurTime = window.setTimeout(chromeSearch.aCurHideTimer, 2000);
            }
        });
    },
    //fadeout the current term highlighter after some time
    aCurHideTimer: function(){
        window.sCurTime;
        $('#sCur').fadeOut(500);
    },
    //navigate through anchor tags
    navA: function(){
        //when the search term is updated
        $(document).on('sUpdate', function(){
            //loop through all anchors
            $('a').each(function(){
                //set up regex to search for the search term (case insensitive)
                var re = new RegExp(chromeSearch.sTerm, 'i');
                //if this anchor contains the search term and isn't empty
                if($(this).text().search(re) != -1 && chromeSearch.sTerm != ''){
                    //add class signifying focus
                    $(this).addClass('focusable');
                    //focus on the first anchor with this term
                    $('.focusable').eq(0).focus()
                //if this search term isn't in any anchor
                } else {
                    //remove the class signifying focus
                    $(this).removeClass('focusable');
                }
            });
            //reset the anchor search term increment index
            chromeSearch.aInc = 0;
        });
        //when you click a key
        $(document).bind('keypress', function(e) {
            //cache the anchor tags that could be focused on
            var focusable = $('.focusable');
            //if you click shift+s
            if(e.which === 83 && e.shiftKey) {
                //increment the anchor tag index
                chromeSearch.aInc++;
                //if this is the last anchor item
                if(chromeSearch.aInc >= focusable.length){
                    //reset increment to the top item
                    chromeSearch.aInc = 0;
                }
                //focus on the item at the current increment index
                focusable.eq(chromeSearch.aInc).focus();
            //if you click shift+a
            } else if(e.which === 65 && e.shiftKey) {
                //decrement the anchor tag index
                chromeSearch.aInc--;
                //if this is the first item
                if(chromeSearch.aInc == -1){
                    //go to the last item
                    chromeSearch.aInc = focusable.length - 1;
                }
                //focus on the item at the current increment index
                focusable.eq(chromeSearch.aInc).focus();
            }
        });
    },
    //run everything initially
    init: function(){
        this.modDom();
        this.handleKeydown();
        this.highlight();
        this.navHighlights();
        this.aCurHideTimer();
        this.navA();
    }
}
//kick 'er off
chromeSearch.init();