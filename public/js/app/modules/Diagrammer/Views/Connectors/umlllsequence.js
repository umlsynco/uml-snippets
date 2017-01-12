
require("underscore");

define(['marionette', './../umldiagram', '../llconnector'],
    function(Marionette) {
        var Connector = Backbone.Marionette.SequenceConnectorItemView.extend({
            'draw': function(c, points, color, isSvg) {
                if ((points == null) || (points.length < 2)) {
                    return;
                }

                var ep = points.length-1;
                var x2 = points[ep].x,
                    x1 = points[ep-1].x,
                    y2 = points[ep].y,
                    y1 = points[ep-1].y;

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

                c.beginPath();
                c.fillStyle = color;
                c.strokeStyle = color;
                c.moveTo(points[0].x, points[0].y);
                for (i=1; i<ep; ++i) {
                    c.lineTo(points[i].x, points[i].y);
                }
                c.moveTo(x1, y1);
                c.lineTo(x3, y3);
                c.lineTo(x4, y4);
                c.lineTo(x2, y2);
                c.lineTo(x5, y5);
                c.lineTo(x3, y3);
                /*if ((this.epoints != undefined) && (this.epoints.length >0)) {
                 for (i=0; i<this.epoints.length;++i)
                 c.arc(this.epoints[i].x, this.epoints[i].y, 3, 0, Math.PI * 2, true);
                 }*/
                c.stroke();
                c.closePath();
            } // draw
        });
        return Connector;
    });
