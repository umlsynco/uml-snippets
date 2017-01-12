define(['marionette', 'jquery-ui/jquery-ui'],
function(Marionette, ui) {


    var ContentView = Marionette.ItemView.extend({
		template: _.template('\
       <div id="tabs" style="width: 1640px; background: transparent none repeat scroll 0% 0%; height: 439px;" class="ui-tabs ui-widget ui-widget-content ui-corner-all">\
         <canvas id="SingleCanvas" class="us-canvas ui-droppable" style="left: 17.6px; top: 45.2px;" width="1609" height="375" init="true">YOUR BROWSER DOES not SUPPORT CANVAS </canvas>\
         <div id="class0" class="us-diagram" width="100%" height="100%" style="height: 386px; width: 1621px;">\
              <div class="us-canvas-bg" style="width:100%;height:100%;"></div>\
         </div>'),
    className: 'ui-scrollable-tabs ui-widget-content ui-corner-all',
		onRender: function() {
      // handle re-write options
		}
	});

    return ContentView;

});
