define(['app', 'marionette', 'module/umlsync/dm/loader'],
    function(app, Marionette, DiagramLoader) {

        var ContentView = Marionette.ItemView.extend({
            template: _.template('\
       <div id="tabs" style="width: 1640px; background: transparent none repeat scroll 0% 0%; height: 439px;" class="ui-tabs ui-widget ui-widget-content ui-corner-all">\
         <canvas id="SingleCanvas" class="us-canvas ui-droppable" style="left: 5px; top: 5px;" width="1609" height="375" init="true">YOUR BROWSER DOES not SUPPORT CANVAS </canvas>\
         <div id="diagram-c100" style="height:100%; width:80%">\
         </div>'),
            className: 'ui-scrollable-tabs ui-widget-content ui-corner-all',
            initialize: function() {
                var that = this;
                // Make diagram editable or not
                app.vent.on("diagram:mode", function(mode) {
                    if (that.activeDiagram) {
                        that.activeDiagram._setWidgetsOption("editable", (mode == "edit"));

                        that.activeDiagram.options.editable = (mode == "edit");
                        console.log("MAKE EDITABLE: " + that.activeDiagram.options.editable);
                    }
                });
                app.vent.on("diagram:action", function(action) {
                    if (that.activeDiagram) {
                        if (action == "undo")
                            that.activeDiagram.opman.revertOperation();
                        else
                            that.activeDiagram.opman.repeatOperation();
                    }
                });
                app.vent.on("umlsync:action", function(action, title) {
                    if (that.activeDiagram) {
                        var payload = {
                            content: that.model.get("content"),
                            type: "uml",
                            title: title || "",
                            data: that.activeDiagram.getDescription()
                        };
                        app.vent.trigger("payload:" + action, payload);
                    } else if (that.activeMarkdown) {
                        var payload = {
                            type: "markdown",
                            title: title,
                            data: that.activeDiagram.getDescription()
                        };
                        app.vent.trigger("payload:" + action, payload);
                    }
                });
            },

            onRender: function() {
                // temporaty solution
                $.log = $.log || function(msg) {
                    console.log(msg)
                };
                if (!this.diagramLoader)
                    this.diagramLoader = new DiagramLoader('module/umlsync');
            },
            RedrawConnectors: function() {
                if (this.activeDiagram)
                    this.activeDiagram.draw();
            },
            LoadDiagram: function(jsonDataString, editable2) {
              var editable = editable2 || false;
                var jsonData = (typeof jsonDataString == "string" ? JSON.parse(jsonDataString) : jsonDataString);
                jsonData.editable = editable;

                //var jsonData = {baseTyp: "base", type: "class"};
                $("#diagram-c100").empty();
                var that = this;
                jsonData.editable = editable;
                jsonData.multicanvas = false;
                this.diagramLoader.Diagram(
                    jsonData.type,
                    jsonData.base_type || "base",
                    jsonData,
                    "#diagram-c100",
                    function(obj) {
                        that.activeDiagram = obj;
                        obj.draw(); // re-draw connectors
                        that.diagramLoader.OnLoadComplete(function() {
                            setTimeout(function() {
                                obj.onFocus(true);
                                app.vent.trigger("diagram:mode", "edit");
                                if (!editable)
                                  app.vent.trigger("diagram:mode", "preview");
                            }, 500);
                        });

                    });
            },
            Element: function(jsonData) {
                this.activeDiagram.Element(jsonData.type, jsonData);
            },
            onKeyPressed: function(e) {
                // diagram object
                var did = this.activeDiagram;

                if (e.ctrlKey) {
                    switch (e.keyCode) {
                        case 65: // Handle Ctrl-A
                            if (did) {
                                did._setWidgetsOption("selected", true);
                            }
                            e.preventDefault();
                            break;

                        case 67: // Handle Ctrl-C
                            // 1. Get focus manager
                            // 2. if element ? => copy it on clipboard
                            //          stop propagate
                            if (did) {
                                this.clippy = did.getDescription("selected", true);
                            } else {
                                this.clippy = undefined;
                            }
                            break;
                        case 88:
                            // Handle Ctrl-X
                            // 1. Get focus manager
                            // 2. if element ? => copy it on clipboard
                            //          stop propagate
                            // 3. Remove element
                            if (did) {
                                if (did.clickedElement != undefined) {
                                    did.clickedElement._update();
                                    this.clippy = did.clickedElement.getDescription();
                                    $("#" + did.clickedElement.euid + "_Border").remove();
                                } else {
                                    this.clippy = undefined;
                                }
                            } else {
                                this.clippy = undefined;
                            }
                            break;
                        case 86: // Handle Ctrl-V
                            // 1. Get focus manager
                            // 2. if diagram ? => try copy element from clipboard
                            //          stop propagate if success
                            if ((this.clippy) && (did)) {
                                // Make selected only inserter items
                                did._setWidgetsOption("selected", false);
                                did.multipleSelection = true;
                                var obj = $.parseJSON(this.clippy),
                                    es = obj["elements"],
                                    cs = obj["connectors"];
                                for (var j in es) {
                                    es[j].pageX = parseInt(es[j].pageX) + 10;
                                    $.log("pzgeX: " + es[j].pageX);
                                    es[j].pageY = parseInt(es[j].pageY) + 10;
                                    did.Element(es[j].type, es[j], function(obj) {
                                        es[j].euid = obj.euid;
                                    });
                                }

                                dm.dm.loader.OnLoadComplete(function() {
                                    for (var c in cs) {
                                        for (var j in es) {
                                            if (es[j].id == cs[c].fromId) {
                                                cs[c].fromId = es[j].euid;
                                            }
                                            // Can not use else because of selfassociation connector
                                            if (es[j].id == cs[c].toId) {
                                                cs[c].toId = es[j].euid;
                                            }

                                        }
                                        did.Connector(cs[c].type, cs[c]);
                                    }
                                });

                                //for (j in cs)
                                //did.Connector(cs[j].type, cs[j]);
                                this.clippy = undefined;
                            }
                            break;
                        case 90: // Handle Ctrl-Z
                            // 1. Get focus manager
                            // 2. if diagram => get operation sequence manager
                            //         -> goBack()
                            if (did) {
                                did.opman.revertOperation();
                            }
                            break;
                        case 89: // Handle Ctrl-Y
                            // 1. Get focus manager
                            // 2. if diagram => get operation sequence manager
                            //         -> goForward()
                            if (did) {
                                did.opman.repeatOperation();
                            }
                            break;
                        case 83: // Handle Ctrl-S
                            // Keep the current state as not modified
                            if (did) did.saveState();
                            break;
                        default:
                            break;
                    }
                }
                return true;
            },

        });

        return ContentView;
    });
