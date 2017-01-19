define(['app', 'marionette', 'js/app/routing-module',
        "module/diagram/views/menu",
        "module/diagram/views/main_menu",
        "module/diagram/assets/main_menu",
        "module/diagram/views/diagram_wrapper"
    ],
    function(app, Marionette, RoutingModule,
        LeftSideMenu, DiagramMainMenu, MainMenuData, DiagramView) {

        var HomeModule = RoutingModule.extend({

            startWithParent: false,

            routesList: {
                ':content': 'homeAction', // Try to load item
                ':content/:id': 'homeAction', // Try to load item
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
                app.vent.on("diagram:fork", function(url) {
                    if (that.diagramView)
                        that.diagramView.model.set("content", url);
                });

                this._helperInitializeKeyHandler();
            },

            _helperInitializeKeyHandler: function() {
                //@ifdef EDITOR
                var fw = this;
                var that = this;
                $(window).keydown(function(e) {
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
                            e1.apply = false; // Do not apply changes
                            $(".editablefield input").trigger(e1);
                        } else if (e.keyCode == 13) { // Enter
                            $(".editablefield input").trigger('blur');
                        }

                        if (e.ctrlKey) {
                            switch (e.keyCode) {
                                case 65: // Handle Ctrl-A
                                    sendToHandler = true;
                                    break;
                                case 67: // Handle Ctrl-C
                                    sendToHandler = true;
                                    break;
                                case 88:
                                    sendToHandler = true;
                                    break;
                                case 86: // Handle Ctrl-V
                                    sendToHandler = true;
                                    break;
                                case 90: // Handle Ctrl-Z
                                    sendToHandler = true;
                                    break;
                                case 89: // Handle Ctrl-Y
                                    sendToHandler = true;
                                    break;
                                case 83: // Handle Ctrl-S
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
                    })
                    .keyup(function(e) {
                        if (e.keyCode == 17) {
                            fw.CtrlDown = false;
                        }
                    });
            },

            onStop: function() {
                console.log('HomeModule stop');
            },

            homeAction: function(content, id) {

                var diagramMenu = new LeftSideMenu({
                    title: 'UmlSync'
                });
                app.content(diagramMenu.render(), true);
                //diagramMenu.$el.hide();
                app.vent.on("diagram:menu", function(on) {
                    diagramMenu.$el.parent().toggle(on);
                    $("#content-left-right-resize").toggle(on);
                    app._helperUpdateFrameWork(true);
                    app.vent.trigger("redraw:diagram");
                });


                if (content) {
                    this.diagramView = new DiagramView({
                        model: new Backbone.Model({
                            content: content
                        })
                    });
                    app.content(this.diagramView.render());
                    // load content

                    app.vent.trigger("payload:load", "-" + content, id);
                } else {
                    var that = this;
                    var selectDiagram = new DiagramMainMenu({
                        collection: new Backbone.Collection(MainMenuData)
                    });
                    app.content(selectDiagram);
                    app.vent.on("diagram:init", function(data) {
                        // trigger menu show
                        app.vent.trigger("menu:status", "new");
                        that.diagramView = new DiagramView({
                            model: new Backbone.Model({})
                        });
                        app.content(that.diagramView.render());
                        that.diagramView.LoadDiagram(data);
                        app.vent.trigger("diagram:menu", true);
                    });
                }
            }

        });

        return app.module('home', HomeModule);

    });
