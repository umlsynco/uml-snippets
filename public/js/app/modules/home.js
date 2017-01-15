
define(['app', 'marionette', 'js/app/routing-module', "module/diagram/views/menu", "module/diagram/views/diagram_wrapper"],
function(app, Marionette, RoutingModule, LeftSideMenu, DiagramView) {

var jsonData =
  {
  	"type": "class",
  	"base_type": "base",
  	"multicanvas": false,
  	"fullname": "/diagrams/classDiagramCommitRefTest.umlsync",
  	"name": "diagram32",
  	"viewid": "github",
  	"connectors": [{
  		"type": "aggregation",
  		"fromId": "0",
  		"toId": "1",
  		"epoints": [{
  			"0": "368",
  			"1": "121"
  		}],
  		"labels": []
  	}],
  	"elements": [{
  		"width": "150",
  		"height": "67",
  		"left": "266.1166826611328",
  		"top": "220.1166521435547",
  		"ctx_menu": "class",
  		"type": "class",
  		"title": "Class",
  		"menu": "us-class-menu",
  		"icon": "/dm/icons/us/es/class/Class.png",
  		"z-index": "101",
  		"name": "Class34",
  		"operations": [],
  		"attributes": [],
  		"references": ["ElkaClass.umlsunc", "ElkaClass.umlsync", "packageDiagram.umlsync"],
  		"id": "0",
  		"pageX": "266.1166826611328",
  		"pageY": "220.1166521435547",
  		"height_a": "19.76666",
  		"height_o": "19.76666"
  	}, {
  		"width": "150",
  		"height": "67",
  		"left": "922.9999834423828",
  		"top": "120.99999870117188",
  		"ctx_menu": "class",
  		"type": "class",
  		"title": "Class",
  		"menu": "us-class-menu",
  		"icon": "/dm/icons/us/es/class/Class.png",
  		"z-index": "102",
  		"name": "Class37",
  		"operations": [],
  		"attributes": [],
  		"references": [],
  		"id": "1",
  		"pageX": "922.9999834423828",
  		"pageY": "120.99999870117188",
  		"height_a": "19.76666",
  		"height_o": "19.76666"
  	}]
  };


    var HomeModule = RoutingModule.extend({

        startWithParent: false,

        routesList: {
            '/*': 'homeAction', // Try to load item
            '': 'homeAction' // New item creation
        },

        initialize: function() {
            RoutingModule.prototype.initialize.apply(this, arguments);
            console.log('HomeModule initialize');
        },

        onStart: function() {
            // Could be triggered from the select menu, to create a new empty diagram
            var that = this;
            app.vent.on("load:diagram", function(payload) {
              that.diagramView.LoadDiagram(payload);
              console.log("Load diagram type: " + payload.type);
            });
            app.vent.on("load:element", function(payload) {
              if (that.diagramView)
                that.diagramView.Element(payload);
            });
            app.vent.on("redraw:diagram", function() {
              if (that.diagramView)
                that.diagramView.RedrawConnectors();
            });
            this._helperInitializeKeyHandler();
        },

        _helperInitializeKeyHandler: function () {
            //@ifdef EDITOR
            var fw = this;
            var that = this;
            $(window).keydown(function (e) {
                    var params = null;
                    if (!that.diagramView) {
                        return;
                    }
                    var sendToHandler = false;
                    if (e.ctrlKey && e.keyCode == 17) {
                        fw.CtrlDown = true;
                    } else if (e.keyCode == 46) { // Del
                        //
                        // Prevent element remove on edit fields
                        // TODO: check for dialog open
                        //
                        if ($(".editablefield input").length == 0) {
                            sendToHandler = true;
                        }
                    }
                    if (e.keyCode == 27) { // Esc
                        var e1 = jQuery.Event("blur");
                        e1.apply = false;      // Do not apply changes
                        $(".editablefield input").trigger(e1);
                    } else if (e.keyCode == 13) { // Enter
                        $(".editablefield input").trigger('blur');
                    }

                    if (e.ctrlKey) {
                        switch (e.keyCode) {
                            case 65:// Handle Ctrl-A
                                sendToHandler = true;
                                break;
                            case 67: // Handle Ctrl-C
                                sendToHandler = true;
                                break;
                            case 88:
                                sendToHandler = true;
                                break;
                            case 86:// Handle Ctrl-V
                                sendToHandler = true;
                                break;
                            case 90:// Handle Ctrl-Z
                                sendToHandler = true;
                                break;
                            case 89:// Handle Ctrl-Y
                                sendToHandler = true;
                                break;
                            case 83:// Handle Ctrl-S
                                //
                                // STOP event propagation first, and then handle it
                                //
                                e.preventDefault();
                                e.stopPropagation();
                                e.stopImmediatePropagation();

                                if (fw.selectedContentId)
                                    fw.saveContent(fw.selectedContentId);
                                //
                                // Send to handler to mark the current position as default
                                //
                                sendToHandler = true;
                                break;
                            default:
                                break;
                        }
                    }
                    //
                    // Check if editor could handle event itself
                    //
                    if (that.diagramView && sendToHandler) {
                        that.diagramView.onKeyPressed(e);
                    }
                }
            )
                .keyup(function (e) {
                    if (e.keyCode == 17) {
                        fw.CtrlDown = false;
                    }
                }
            );
        },

        onStop: function() {
            console.log('HomeModule stop');
        },

        homeAction: function() {
            var textView = new LeftSideMenu({
                title: 'UmlSync'
            });
            app.content(textView.render(), true);

            var diagramView = new DiagramView({model: new Backbone.Model({})});
            app.content(diagramView.render());
            diagramView.LoadDiagram(jsonData);
            this.diagramView = diagramView;
        }

    });

    return app.module('home', HomeModule);

});
