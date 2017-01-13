define(['marionette', 'module/umlsync/dm/loader'],
function(Marionette, DiagramLoader) {


    var ContentView = Marionette.ItemView.extend({
		template: _.template('\
       <div id="tabs" style="width: 1640px; background: transparent none repeat scroll 0% 0%; height: 439px;" class="ui-tabs ui-widget ui-widget-content ui-corner-all">\
         <canvas id="SingleCanvas" class="us-canvas ui-droppable" style="left: 17.6px; top: 45.2px;" width="1609" height="375" init="true">YOUR BROWSER DOES not SUPPORT CANVAS </canvas>\
         <div id="class0" class="us-diagram" width="100%" height="100%" style="height: 386px; width: 1621px;">\
              <div class="us-canvas-bg" style="width:100%;height:100%;"></div>\
         </div>'),
    className: 'ui-scrollable-tabs ui-widget-content ui-corner-all',
		onRender: function() {
       // temporaty solution
       $.log = $.log || function(msg) { console.log(msg)};
       this.diagramLoader = new DiagramLoader('module/umlsync/');
       var jsonData = {baseTyp: "base", type: "class"};
       var that = this;
       this.activeDiagram = this.diagramLoader.Diagram(
                    jsonData.type,
                    jsonData.base_type || "base",
                    jsonData,
                    "#class0",
                    function (obj) {
                      console.dir(obj);
                    });
		}
	});

    return ContentView;

});
