/*! jQuery UI - v1.11.4 - 2015-03-13
* http://jqueryui.com
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function(t){"function"==typeof define&&define.amd?define(["jquery","./effect"],t):t(jQuery)})(function(t){return t.effects.effect.pulsate=function(e,i){var s,n=t(this),o=t.effects.setMode(n,e.mode||"show"),a="show"===o,r="hide"===o,h=a||"hide"===o,l=2*(e.times||5)+(h?1:0),c=e.duration/l,u=0,d=n.queue(),p=d.length;for((a||!n.is(":visible"))&&(n.css("opacity",0).show(),u=1),s=1;l>s;s++)n.animate({opacity:u},c,e.easing),u=1-u;n.animate({opacity:u},c,e.easing),n.queue(function(){r&&n.hide(),i()}),p>1&&d.splice.apply(d,[1,0].concat(d.splice(p,l+1))),n.dequeue()}});
