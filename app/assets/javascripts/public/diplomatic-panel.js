TextLab.DiplomaticPanel = Backbone.View.extend({
      
  id: 'diplomatic-panel',
  
  syncScroll : true,
  lastScrollPosition : 0,
  maxScrollPosition : 0,
  imagePanel : null,
  marginBuffer : 2,

  render: function() {
    this.fixMetamark();
    this.fixSuper();
    this.fixSublinear();
    this.fixAddInMargin();
    this.addAppTips();
    this.addSubstTips();
    this.fixAdds();
    this.fixErasures();
    this.fixStrikethroughs();
    this.fixLinebreaks();
  },
  
  // Positioning of metamark elements
  fixMetamark : function() {
     function fixInDiv(mydiv) {
        var bottomleft = mydiv.find('#v-margin-bottom>.left-margin');
        var bottomcenter = mydiv.find('#v-margin-bottom>.center-margin');
        var bottomright = mydiv.find('#v-margin-bottom>.right-margin');
        var topleft = mydiv.find('#v-margin-top>.left-margin');
        var topcenter = mydiv.find('#v-margin-top>.center-margin');
        var topright = mydiv.find('#v-margin-top>.right-margin');
        var left = mydiv.find('#h-margin-left');
        var right = mydiv.find('#h-margin-right');

        mydiv.find('.metamark[place~="margin(top)"][place~="margin(left)"]').appendTo(topleft);
        mydiv.find('.metamark[place~="margin(top)"][place~="margin(right)"]').appendTo(topright);
        mydiv.find('.metamark[place="margin(top)"]').appendTo(topcenter);

        mydiv.find('.metamark[place~="margin(bottom)"][place~="margin(left)"]').appendTo(bottomleft);
        mydiv.find('.metamark[place~="margin(bottom)"][place~="margin(right)"]').appendTo(bottomright);
        mydiv.find('.metamark[place="margin(bottom)"]').appendTo(bottomcenter);

        mydiv.find('.metamark[place="margin(left)"]').appendTo(left);
        mydiv.find('.metamark[place="margin(right)"]').appendTo(right);
     };

     fixInDiv(this.$el);

     this.fixMarginHeight();
  },

  /**
   * Add tooltip type stuff for app/rdg tags
   */
  addAppTips : function() {
     this.$('.app').each(function(i) {
        $('body').append('<div class="apparatustip" id="apparatustip' + i + '"><div class="tipheader">Other Readings</div></div>');
        var tip = $('#apparatustip' + i);

        $(this).find('.alternate').each(function(j) {
           tip.append($(this).clone());
           if ($(this).next().length) {
              tip.append($('<br>'));
           }
        });

        $(tip).mouseenter(function() {
           if (tip.fadeTimeout) {
              clearTimeout(tip.fadeTimeout);
           }
        }).mouseleave(function() {
           tip.fadeTimeout = setTimeout(function() {
              tip.fadeOut();
           }, 400);
        });

        $(this).removeAttr('title').mouseenter(function() {
           if (tip.fadeTimeout) {
              clearTimeout(tip.fadeTimeout);
           }
           tip.css({
              opacity : 1
           }).fadeIn();
        }).mousemove(function(mouse) {
           tip.css({
              left : mouse.pageX,
              top : mouse.pageY - tip.height() - 15
           });
        }).mouseleave(function() {
           tip.fadeTimeout = setTimeout(function() {
              tip.fadeOut();
           }, 1000);
        });
     });
  },

  /**
   * Add tooltip type stuff for overwritten text (subst tags) tags
   */
  addSubstTips : function() {
     this.$('.del').parents('.subst').find('.add').each(function(i) {
        $('body').append('<div class="substtip diplomaticstyle" id="substtip' + i + '"><div class="tipheader">Altered Text</div></div>');
        var tip = $('#substtip' + i);
        $(this).addClass('highlight-subst');
        $(this).parents('.subst').find('.del').each(function(j) {
           tip.append($(this).clone());
           if ($(this).next().length) {
              tip.append($('<br>'));
           }
        });

        $(tip).mouseenter(function() {
           if (tip.fadeTimeout) {
              clearTimeout(tip.fadeTimeout);
           }
        }).mouseleave(function() {
           tip.fadeTimeout = setTimeout(function() {
              tip.fadeOut();
           }, 400);
        });

        $(this).removeAttr('title').mouseenter(function() {
           if (tip.fadeTimeout) {
              clearTimeout(tip.fadeTimeout);
           }
           tip.css({
              opacity : 1
           }).fadeIn();
        }).mousemove(function(mouse) {
           tip.css({
              left : mouse.pageX - tip.width() - 5,
              top : mouse.pageY - tip.height() - 15
           });
        }).mouseleave(function() {
           tip.fadeTimeout = setTimeout(function() {
              tip.fadeOut();
           }, 1000);
        });
     });
  },

  /**
   * fix above/below that are too large to display properly
   */
  fixAdds : function() {
     var maxHeight;
     var maxRight;
     var convertToRollover;

     convertToRollover = function(el, isBelow) {
        var html =  $(el).html();
        var startPos = html.indexOf("<span class=\"rollover bubble\">");
        if ( startPos > -1 ) {
           var endPos  =  html.indexOf("<span style=\"display:none\">", startPos+1);  
           html = html.substring(0,startPos)+html.substring(endPos+"<span style=\"display:none\">".length);
        }

        var rollover = $('<div class="add-rollover"></div>').html(html);
        $('body').append(rollover);

        $(rollover).mouseenter(function() {
           if (rollover.fadeTimeout) {
              clearTimeout(rollover.fadeTimeout);
           }
        }).mouseleave(function() {
           rollover.fadeTimeout = setTimeout(function() {
              rollover.fadeOut();
           }, 400);
        });

        var icon = $('<span class="rollover">...<span style="display:none">' + html + '</span></span>');
        if ($(el).find('.bubble') || $(el).hasClass('bubble')) {
           icon.addClass('bubble');
        }

        var heightDifference = rollover.height() + 15;

        var innerAboves = $(rollover).find('.above');
        var innerBelows = $(rollover).find('.below');
        if (innerAboves.length > 0) {
           $(rollover).css({
              'padding-top' : (innerAboves.length * 20) + 'px'
           });
           heightDifference += innerAboves.length * 20;
        }
        if (innerBelows.length > 0) {
           $(rollover).css({
              'padding-bottom' : (innerBelows.length * 20) + 'px'
           });
           heightDifference += innerBelows.length * 20;
        }

        if (isBelow) {

           heightDifference = -rollover.height();
           if (innerAboves.length > 0) {
              $(rollover).css({
                 'padding-top' : (innerAboves.length * 20) + 'px'
              });
              heightDifference -= innerAboves.length * 20;
           }
           if (innerBelows.length > 0) {
              $(rollover).css({
                 'padding-bottom' : (innerBelows.length * 20) + 'px'
              });
              heightDifference -= innerBelows.length * 20;
           }
        }

        $(el).html('').append(icon).css({
           left : '-10px',
           'margin-right' : '-15px'
        }).removeAttr('title').mouseenter(function() {
           if (rollover.fadeTimeout) {
              clearTimeout(rollover.fadeTimeout);
           }
           rollover.css({
              opacity : 1
           }).fadeIn();
        }).mousemove(function(mouse) {
           rollover.css({
              left : mouse.pageX - rollover.width() / 2,
              top : mouse.pageY - heightDifference
           });
        }).mouseleave(function() {
           rollover.fadeTimeout = setTimeout(function() {
              rollover.fadeOut();
           }, 1000);
        });
     };

     maxRight = this.$el.offset().left + this.$el.width();
     var tmpEl = $('<span>^MQ</span>');
     // using the 'tall' letters
     this.$el.append(tmpEl);
     maxHeight = tmpEl.height() + (tmpEl.height() / 3);
     tmpEl.remove();

     this.$('.above').each(function(i) {

        if ($(this).height() > maxHeight) {
           // If there is a line-break in the middle of the insertion
           // turn into rollover;
           convertToRollover($(this));
        } else if ($(this).offset().left + $(this).width() > maxRight) {
           // if the insertion is just too long
           // turn into rollover;
           convertToRollover($(this));
        } else if ($(this).parents('.above,.below').length > 0) {
           convertToRollover($(this));
        }
        //console.log($(this).height())
     });
     this.$('.below').each(function(i) {

        if ($(this).height() > maxHeight) {
           // If there is a line-break in the middle of the insertion
           // turn into rollover;
           convertToRollover($(this), true);
        } else if ($(this).offset().left + $(this).width() > maxRight) {
           // if the insertion is just too long
           // turn into rollover;
           convertToRollover($(this), true);
        } else if ($(this).parents('.above,.below').length > 0) {
           convertToRollover($(this), true);
        }
        //console.log($(this).height())
     });
     // TODO: Need a way to deal with a popup having an extra long insertion in it.
     this.$('.above').each(function(i) {

        if ($(this).height() > maxHeight) {
           // If there is a line-break in the middle of the insertion
           // turn into rollover;
           convertToRollover($(this));
        } else if ($(this).offset().left + $(this).width() > maxRight) {
           // if the insertion is just too long
           // turn into rollover;
           convertToRollover($(this));
        } else if ($(this).parents('.above,.below').length > 0) {
           convertToRollover($(this));
        }
        //console.log($(this).height())
     });

     convertToRolloverMargin = function(el) {
        var html = $(el).html();

        var rollover = $('<div class="add-rollover"></div>').html(html);
        $('body').append(rollover);

        $(rollover).mouseenter(function() {
           if (rollover.fadeTimeout) {
              clearTimeout(rollover.fadeTimeout);
           }
        }).mouseleave(function() {
           rollover.fadeTimeout = setTimeout(function() {
              rollover.fadeOut();
           }, 400);
        });

        var icon = $('<span class="rollover">...<span style="display:none">' + html + '</span></span>');
        if ($(el).find('.bubble') || $(el).hasClass('bubble')) {
           icon.addClass('bubble');
        }

        var heightDifference = rollover.height();

        var innerAboves = $(rollover).find('.above');
        var innerBelows = $(rollover).find('.below');
        if (innerAboves.length > 0) {
           $(rollover).css({
              'padding-top' : (innerAboves.length * 20) + 'px'
           });
           heightDifference += innerAboves.length * 20;
        }
        if (innerBelows.length > 0) {
           $(rollover).css({
              'padding-bottom' : (innerBelows.length * 20) + 'px'
           });
           heightDifference += innerBelows.length * 20;
        }

        var elLeft;
        var elTop;
        var elContent = $('#leafrightContent');

        if ($(el).hasClass('add-margin-bottom')) {
           elLeft = elContent.offset().left + (elContent.width() / 2);
           elTop = elContent.offset().top + elContent.height();
        } else if ($(el).hasClass('add-margin-left')) {
           elLeft = elContent.offset().left;
           elTop = elContent.offset().top + (elContent.height() / 2);
        } else if ($(el).hasClass('add-margin-right')) {
           elLeft = elContent.offset().left + elContent.width();
           elTop = elContent.offset().top + (elContent.height() / 2);
        } else// treat it as 'add-margin-top'
        {
           elLeft = elContent.offset().left + (elContent.width() / 2);
           elTop = elContent.offset().top;
        }

        var cssLeft = "-10px";

        if ($(el).css('left').match(/\d+\.*\d*/)) {
           // cssLeft = $(el).css('left').match(/\d+\.*\d*/)[0] - 10 + 'px';
           if ($(el).css('left').replace(/px/, '')[0] > 0) {
              cssLeft = $(el).css('left');
           }
        }

        $(el).html('').append(icon).css({
           left : cssLeft,
           'margin-right' : '-15px'
        }).removeAttr('title').mouseenter(function() {
           if (rollover.fadeTimeout) {
              clearTimeout(rollover.fadeTimeout);
           }
           rollover.css({
              opacity : 1
           }).slideDown();
        }).mousemove(function(mouse) {
           rollover.css({
              left : elLeft - rollover.width() / 2,
              top : elTop
           });
        }).mouseleave(function() {
           rollover.fadeTimeout = setTimeout(function() {
              rollover.fadeOut();
           }, 1000);
        });
     };

     this.$('.add[class*="add-margin"]').each(function(i) {
        convertToRolloverMargin($(this));
        //fixNestedBubble();
     });

  },

  /**
   * Positioning of "above" and "below" classes
   */
  getSpanDimensions : function(el) {
     var tmp = document.createElement('span');
     tmp.style.display = 'inline-block';
     tmp.style.cssText = "line-height:1em;";
     tmp.innerHTML = el.innerHTML;
     var dip = this.el;
     tmp = dip.appendChild(tmp);
     tmp.hidden = true;
     tmp.hidden = false;
     var size = {
        x : tmp.offsetWidth,
        y : tmp.offsetHeight
     };
     dip.removeChild(tmp);
     return size;
  },

  fixAddInMargin : function() {
     this.$('.add[class~="margin(top)"]').addClass('add-margin-top');
     this.$('.add[class~="margin(bottom)"]').addClass('add-margin-bottom');
     this.$('.add[class~="margin(left)"]').addClass('add-margin-left');
     this.$('.add[class~="margin(right)"]').addClass('add-margin-right');

     var dip = this.$el;
     var s = $('#diplomatictext .add[class~="add-margin-top"], #diplomatictext .add[class~="add-margin-left"], #diplomatictext .add[class~="add-margin-right"]');
     for (var i = 0; i < s.length; i++) {
        //if (!$(s[i]).parents('.above').length && !$(s[i]).parents('.below').length) {
        var theEl = s[i];
        var size = this.getSpanDimensions(theEl);
        var newStyle = "left:-" + ((size.x / 2) + 5) + "px;" + "top:-" + 17 + "px;" + "margin-right:" + ((size.x - this.marginBuffer) * -1) + "px;";
        theEl.style.cssText = newStyle;
        if ($(theEl).offset().left < $(dip).offset().left) {
           var delta = $(dip).offset().left - $(theEl).offset().left;
           theEl.style.cssText = s[i].style.cssText.replace(/left:\s*.*?px;/i, "left:" + (((size.x / 2) - delta) * -1) + "px;");
        }
        $(theEl).addClass('moved');
        //this.checkOverlap(theEl);
        //}
     }

     s = this.$('.add[class~="add-margin-bottom"]');
     for (var i = 0; i < s.length; i++) {
        //if (!$(s[i]).parents('.above').length && !$(s[i]).parents('.below').length) {
        var theEl = s[i];
        var size = this.getSpanDimensions(s[i]);
        if (s[i].innerHTML.search("—") > -1 /*&& $.browser.mozilla*/) {
           size.x = size.x - 17;
        }
        var newStyle = "left:-" + (size.x / 2) + "px;" + "top:" + 17 + "px;" + "margin-right:" + ((size.x - this.marginBuffer) * -1) + "px;";
        s[i].style.cssText = newStyle;
        if ($(theEl).offset().left < $(dip).offset().left) {
           var delta = $(dip).offset().left - $(theEl).offset().left;
           s[i].style.cssText = s[i].style.cssText.replace(/left:\s*.*?px;/i, "left:" + (((size.x / 2) - delta) * -1) + "px;");
        }
        $(theEl).addClass('moved');
        //this.checkOverlap(s[i]);
        //}
     }
  },

  fixSuper : function() {
     var dip = this.$el;
     var s = this.$('.above');
     for (var i = 0; i < s.length; i++) {
        //if (!$(s[i]).parents('.above').length && !$(s[i]).parents('.below').length) {
        var theEl = s[i];
        var size = this.getSpanDimensions(theEl);
        var newStyle = "left:-" + ((size.x / 2) + 5) + "px;" + "top:-" + 17 + "px;" + "margin-right:" + ((size.x - this.marginBuffer) * -1) + "px;";
        theEl.style.cssText = newStyle;
        if ($(theEl).offset().left < $(dip).offset().left) {
           var delta = $(dip).offset().left - $(theEl).offset().left;
           theEl.style.cssText = s[i].style.cssText.replace(/left:\s*.*?px;/i, "left:" + (((size.x / 2) - delta) * -1) + "px;");
        }
        theEl.className += " moved";
        this.checkOverlap(theEl);
        //}
     }
     s = this.$('.metamark[place="above"]');
     for (var i = 0; i < s.length; i++) {
        var theEl = s[i];
        var size = this.getSpanDimensions(theEl);
        var newStyle = "left:-" + ((size.x / 2) ) + "px;" + "top:-" + 17 + "px;" + "margin-right:" + ((size.x - this.marginBuffer) * -1) + "px;";
        theEl.style.cssText = newStyle;
        if ($(theEl).offset().left < $(dip).offset().left) {
           var delta = $(dip).offset().left - $(theEl).offset().left;
           theEl.style.cssText = s[i].style.cssText.replace(/left:\s*.*?px;/i, "left:" + (((size.x / 2) - delta) * -1) + "px;");
        }
        theEl.className += " moved";
        this.checkOverlap(theEl);
     }
  },

  fixSublinear : function() {
     var dip = this.$el;
     var s = this.$('.below');
     for (var i = 0; i < s.length; i++) {
        //if (!$(s[i]).parents('.above').length && !$(s[i]).parents('.below').length) {
        var theEl = s[i];
        var size = this.getSpanDimensions(s[i]);
        if (s[i].innerHTML.search("—") > -1 /* && $.browser.mozilla */) {
           size.x = size.x - 17;
        }
        var newStyle = "left:-" + (size.x / 2) + "px;" + "top:" + 17 + "px;" + "margin-right:" + ((size.x - this.marginBuffer) * -1) + "px;";
        s[i].style.cssText = newStyle;
        if ($(theEl).offset().left < $(dip).offset().left) {
           var delta = $(dip).offset().left - $(theEl).offset().left;
           s[i].style.cssText = s[i].style.cssText.replace(/left:\s*.*?px;/i, "left:" + (((size.x / 2) - delta) * -1) + "px;");
        }
        s[i].className += " moved";
        this.checkOverlap(s[i]);
        //}
     }
     s = this.$('.metamark[place="below"]');
     for (var i = 0; i < s.length; i++) {
        var theEl = s[i];
        var size = this.getSpanDimensions(s[i]);
        if (s[i].innerHTML.search("—") > -1 /*&& $.browser.mozilla*/) {
           size.x = size.x - 17;
        }
        var newStyle = "left:-" + (size.x / 2) + "px;" + "top:" + 17 + "px;" + "margin-right:" + ((size.x - this.marginBuffer) * -1) + "px;";
        s[i].style.cssText = newStyle;
        if ($(theEl).offset().left < $(dip).offset().left) {
           var delta = $(dip).offset().left - $(theEl).offset().left;
           s[i].style.cssText = s[i].style.cssText.replace(/left:\s*.*?px;/i, "left:" + (((size.x / 2) - delta) * -1) + "px;");
        }
        s[i].className += " moved";
        this.checkOverlap(s[i]);
     }
  },

  checkOverlap : function(el) {
     var moved = this.$('.moved');
     for (var i = 0; i < moved.length; i++) {
        var jEl = $(el), jMoved = $(moved[i]);
        // check if both elements are on the same line
        if (el != moved[i] && Math.abs(jEl.offset().top - jMoved.offset().top) < jEl.height() - 3) {
           if (// check if the elements are overlapping
           (jEl.offset().left >= jMoved.offset().left && jEl.offset().left <= jMoved.offset().left + jMoved.width()) || (jMoved.offset().left >= jEl.offset().left && jMoved.offset().left <= jEl.offset().left + jEl.width())) {
              var d = jMoved.offset().left + jMoved.width() - jEl.offset().left + 5;
              var left = el.style.cssText.match(/left:[^;]+/gi)[0];
              left = parseFloat(left.substr(5, left.indexOf('px') - 5)) + d;
              //var right = el.style.cssText.match(/margin-right:[^;]+/gi)[0];
              //right = parseFloat(right.substr(13, right.indexOf('px') - 13)) - d;
              el.style.cssText = el.style.cssText.replace(/left:\s*.*?px;/gi, "left:" + left + "px;");
              el.hidden = true;
              el.hidden = false;
              // force browser to paint???
              // TODO fix
              // return this.checkOverlap(el);
           }
        }
     }
     return;
  },

  /**
   * adds the erasure-child class to any class that doesn't have children
   * this is to deal with funky stuff that happens in if you applied the
   * same css to the element that is the erasure class.
   */
  fixErasures : function() {
     this.$('.erasure').each(function(i) {
        if ($(this).find(':last-child').length > 0) {
           $(this).find(':last-child').each(function(j) {
              if ($(this).children().length < 1) {
                 $(this).addClass('erasure-child');
              }
           });
        } else {
           $(this).addClass('erasure-child');
        }
     });

     this.$('.substtip .erasure').each(function(i) {
        $(this).addClass('erasure-child');
     });
  },

  fixLinebreaks : function() {
     this.$('.lb').next('br').hide();
  },

  /**
   * The linethrough style can cause what looks like random "-" marks
   *  if the span that contains the linethrough is moved.
   */
  fixStrikethroughs : function() {
     this.$('.strikethrough').each(function(i) {
        if ($(this).find('span').length > 0) {
           $(this).find('span').each(function(j) {
              if ($(this).children().length < 1) {
                 $(this).addClass('strikethrough');
              }
           });
           //$(this).removeClass('strikethrough');
        }
     });
     this.$('.single-stroke').each(function(i) {
        if ($(this).find('span').length > 0) {
           var superimposed = false;
           $(this).find('span').each(function(j) {
              if ( $(this).hasClass("subst") ) {
                 superimposed = true;
              } else {
                 if ($(this).children().length < 1) {
                    $(this).addClass('single-stroke');
                 }
              }
           });
         
           if ( superimposed === false ) {
             //$(this).removeClass('single-stroke');
           }
        }
     });
     this.$('.multi-stroke').each(function(i) {
        if ($(this).find('span').length > 0) {
           $(this).find('span').each(function(j) {
              if ($(this).children().length < 1) {
                 $(this).addClass('multi-stroke');
              }
           });
           //$(this).removeClass('multi-stroke');
        }
     });
  },

  fixMarginHeight : function() {
     var dipheight = this.$el.height();
     this.$('#h-margin-left').height(dipheight - 170);
     this.$('#h-margin-right').height(dipheight - 170);
  }

});




