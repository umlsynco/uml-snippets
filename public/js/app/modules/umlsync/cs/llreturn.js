/*
Class: return connector for life line diagram

Return connector creates a connection beween two ports of object instance on life line diagram

Author:
  Evgeny Alexeyev (evgeny.alexeyev@googlemail.com)

Copyright:
  Copyright (c) 2012 Evgeny Alexeyev (evgeny.alexeyev@googlemail.com). All rights reserved.

URL:
  umlsync.org/about

Version:
  2.0.0 (2012-Oct-19)
*/
define(['module/umlsync/ds/diagram'], function(diagram) {
(function($, dm, undefined) {

dm.base.diagram("cs.llreturn", dm.cs.connector, {
   dashedLine: function(p1,p2, c) {
        var x2 = p2[0],
        x1 = p1[0],
        y2 = p2[1],
        y1 = p1[1];

        var x = 10, // dash length
        dashf = 5,
        dashe = 3,
        dx = x2 -x1,
        dy = y2 -y1,
        gip = Math.sqrt(dx*dx + dy*dy);

        if (gip<x) // Nothing to draw
            return;

        var sina = dy/gip,
        cosa = dx/gip,
        fx = dashf * cosa,
        fy = dashf * sina,
        ex = dashe * cosa,
        ey = dashe * sina;

        for (var i=0; i<(gip/(dashf + dashe)); ++i) {
            c.moveTo(x1, y1);

            c.lineTo(x1+fx, y1+fy);
            x1+= (ex + fx);
            y1+= (ey + fy);
        }
    },
    'draw': function(c, points, color, isSvg) {
            if ((points == null) || (points.length < 2)) {
               return;
            }
            var ep = points.length-1;
            var x2 = points[ep][0],
            x1 = points[ep-1][0],
            y2 = points[ep][1],
            y1 = points[ep-1][1];

            var x = 10,
                dx = x2 -x1,
                dy = y2 -y1,
                gip = Math.sqrt(dx*dx + dy*dy);

            if (gip<x) {
               return;
            }

            var sina = dy/gip,
            cosa = dx/gip,
            x3 = x2 - Math.sqrt(x*x*3/4)*cosa,
            y3 = y2 - Math.sqrt(x*x*3/4)*sina,
            x6 = x1 - Math.sqrt(x*x*3)*cosa,
            y6 = y1 - Math.sqrt(x*x*3)*sina,
            x4 = x3 + x * sina/2,
            y4 = y3 - x * cosa/2,
            x5 = x3 - x * sina/2,
            y5 = y3 + x * cosa/2;

			// Return SVG connector's group
			if (isSvg) {
				var desc = '<polyline stroke-dasharray="7 3" points="';
				var comma = '';
				for (var t=0; t < ep; ++t) {
				  desc += comma + points[t][0] + ' ' + points[t][1];
				  comma = ', ';
				}
				desc += '"/>';
				desc += '<polyline stroke-dasharray="7 3" points="' + points[0][0] + ' ' + points[0][1] + ','
				        + points[ep][0] + ' ' + points[ep][1] + '"/>';
                desc += '<polyline points="' + x4 + ' ' +y4 + ',' + x2 + ' ' +y2 + ',' + x5 + ' ' +y5+'"/>';
				return desc;
			}

            c.beginPath();
            c.fillStyle = color;
            c.strokeStyle = color;
            this.dashedLine(points[0], points[1],c);
//            c.lineTo(x3, y3);
            c.lineTo(x4, y4);
            c.moveTo(x2, y2);
            c.lineTo(x5, y5);
//            c.lineTo(x3, y3);
            /*if ((this.epoints != undefined) && (this.epoints.length >0)) {
              for (i=0; i<this.epoints.length;++i)
              c.arc(this.epoints[i][0], this.epoints[i][1], 3, 0, Math.PI * 2, true);
            }*/
            c.stroke();
            c.closePath();
    },
    '_getConnectionPoints': function(fromId, toId, epoints) {
       var p1 = $('#'+ fromId).position();

       var p2 = $('#' + toId).position();

       var p11 = $('#'+ fromId + "_Border").position();
       if (!p11) {
        return;
       }
       var p21 = $('#' + toId + "_Border").position(),
       w11 = $('#' + fromId + "_Border").width() + 26,
       w21 = $('#' + toId + "_Border").width() + 26,
       scrollTop = $("#" + this.parrent.euid).scrollTop(),
       scrollLeft = $("#" + this.parrent.euid).scrollLeft();

     if (toId == "ConnectionHelper") {
       var y1 = (p11.top + 40 > p21.top) ? p11.top + 40 : p21.top;
       y1+=5;
       var y2 = y1;
       var x1 = (p11.left + w11/2 + 13);
       var x2 = (p21.left + 10);
       var newpoints = [[x1,y1], [x2,y2]];
       return newpoints;
     } else {
       if ((epoints == undefined) || (epoints.length ==0)) {
         var y1 = (p11.top > p21.top) ? p11.top : p21.top;
             h1 = (p11.top > p21.top) ? p1.top : p2.top;
           y1 += h1;
           var y2 = y1,
               x1 = 0,
               x2 = 0;
           if (p21.left > p11.left) {
             x1 = (p11.left + w11 - 20);
             x2 = (p21.left);
           } else {
             x1 = (p11.left + 10 );
             x2 = (p21.left + w21 - 20);
           }
		   // Different canvas types
		   if (this.parrent.options.multicanvas) {
		     // x,y are relative coordinates and we need to add
			 // scrolling to them in case individual canvas for diagram
             var newpoints = [[x1+scrollLeft,y1+5+scrollTop], [x2+scrollLeft,y2+5+scrollTop]];
             return newpoints;
		   }
		   else {
             var newpoints = [[x1,y1+5], [x2,y2+5]];
             return newpoints;
		   }
       } else {
	   	   if (this.parrent.options.multicanvas) {
		     scrollTop = 0;
		   }
		   else {
		    scrollLeft = 0;
		   }
           var y2 = epoints[epoints.length-1][1],
             y1 = y2,
              x1 = 0,
             x2 = 0;
           if (p21.left > p11.left) {
             x1 = (p11.left + w11 - 20);
             x2 = (p21.left);
           } else {
             x1 = (p11.left + 10 );
             x2 = (p21.left + w21 - 20);
           }
           var newpoints = //[[x1,y1], [x2,y2]];
             [[x1 + scrollLeft,y1 - scrollTop], [x2+ scrollLeft,y2 - scrollTop]];
           return newpoints;
       }
     }
    },
    '_updateEPoints': function(ui) {
      this.epoints = [[ui.position.left, ui.position.top]];
      this.cleanOnNextTransform = true;
      this.eppos = 0;
      this.parrent.draw();
    },
    'getAutocomplete': function() {
        if (this.parrent == undefined)
          return null;

        if (this.parrent.elements[this.toId]
         && this.parrent.elements[this.toId].getAutocomplete)
         return this.parrent.elements[this.toId].getAutocomplete();
        return null;
    },
    'addLable': function(text, x, y) {
      var self = this;
      this.lables.push($("<div style=\"position:absolute;z-index:99999;\">" + text + "</div>").appendTo("#" + this.parrent.euid)
      .css("left", x).css("top", y)
      .draggable().editable({onAutocomplete:function() { return self.getAutocomplete() }}));
    },
    'canRemovePoint': function() {
        return true;
    },
    'onStartTransform': function(x,y) {
        $.log("onStartTransform: " + y);
        this.drag_info  = y;
        this.parrent.onElementDragStart(this, {left:0, top:0}, true);
    },
    'onTransform': function(x,y) {
        $.log("onTransform: " + (y - this.drag_info));
        this.parrent.onElementDragMove(this, {left:0, top:y - this.drag_info}, true);
    },
    'onStopTransform': function(x,y) {
        $.log("onStopTransform: " + (y - this.drag_info));
        this.parrent.onElementDragStop(this, {left:0, top:y - this.drag_info}, true);
    }
    });
//@aspect
})(jQuery, dm);

return dm.cs.llreturn;
});
