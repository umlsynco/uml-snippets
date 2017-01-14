define(['marionette', 'module/umlsync/dm/loader'],
function(Marionette, DiagramLoader) {

    var ContentView = Marionette.ItemView.extend({
		template: _.template('\
       <div id="tabs" style="width: 1640px; background: transparent none repeat scroll 0% 0%; height: 439px;" class="ui-tabs ui-widget ui-widget-content ui-corner-all">\
         <canvas id="SingleCanvas" class="us-canvas ui-droppable" style="left: 5px; top: 5px;" width="1609" height="375" init="true">YOUR BROWSER DOES not SUPPORT CANVAS </canvas>\
         <div id="diagram-c100" style="height:100%; width:80%">\
         </div>'),
    className: 'ui-scrollable-tabs ui-widget-content ui-corner-all',
		onRender: function() {
       // temporaty solution
       $.log = $.log || function(msg) { console.log(msg)};
       if (!this.diagramLoader)
         this.diagramLoader = new DiagramLoader('module/umlsync');
     },
     LoadDiagram: function(jsonData) {
       //var jsonData = {baseTyp: "base", type: "class"};
       $("#diagram-c100").empty();
       var that = this;
       jsonData.editable = true;
       this.diagramLoader.Diagram(
                    jsonData.type,
                    jsonData.base_type || "base",
                    jsonData,
                    "#diagram-c100",
                    function (obj) {
                      that.activeDiagram = obj;
                      obj.draw(); // re-draw connectors
                      that.diagramLoader.OnLoadComplete(function() {
                        console.log("ON FOCUS!!!");
                        setTimeout(function() {
                          obj.onFocus(true);
                        }, 500);
                      });

                    });
		},
    Element: function(jsonData) {
      this.activeDiagram.Element(jsonData.type, jsonData);
    }
	});

    return ContentView;

});
