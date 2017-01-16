define('app', ['marionette', 'backbone', 'jquery', 'js/app/controllers/firebase_storage'], function(Marionette, Backbone, $, Storage) {

    // Redefine Marionette.Renderer.render for production using.
    if (window.JST) {

        Marionette.Renderer.render = function(templateId, data){
            if (!window.JST[templateId]) {
                throw new Marionette.Error({
                    name: 'NoTemplateError',
                    message: 'Could not find template: "' + templateId + '"'
                });
            }
            return window.JST[templateId](data);
        };
    }

    var app = new Marionette.Application({

        currentModule: '',

        regions: {
            Header: '#header',
            ContentLeft: '#content>#content-left',
            ContentRight: '#content>#content-right',
            Footer: '#footer'
        },

        navigate: function(route) {
            Backbone.history.navigate(route, {
                trigger: true
            });
        },

        startModule: function(module) {
            if (this.currentModule && this.currentModule === module) {
                return;
            }
            this.currentModule && this.currentModule.stop();

            this.currentModule = module;
            this.currentModule.start();
        },

        content: function(view, left) {
            if (left)
              this.ContentLeft.show(view);
            else
              this.ContentRight.show(view);
        },

    });

    app.on('start', function() {
        if (!Backbone.history) return;
        require(['js/app/menu', 'module/users', 'module/home'], function(menu) {
            app.Header.show(menu);
            Backbone.history.start({pushState: true});
            // handle history state according to content
            var updateHistory = function(content) {

            };


            ////////////////////////////////////////////////
            // User login/logout
            ////////////////////////////////////////////////
            // Allocate storage and subscribe on user change
            app.storage = new Storage({onAuthStateChanged: function(user) {
              app.vent.trigger("user:change", user);
            }});
            // Make user log-in/out functionality
            app.vent.on("user:login", function(method) {
              app.storage.singIn(method);
            });
            // Make user log-in/out functionality
            app.vent.on("user:logout", function(method) {
              app.storage.singOut();
            });
            ////////////////////////////////////////////////
            // Payload save/update/load
            ////////////////////////////////////////////////
            // Save
            app.vent.on("payload:save", function(type, payload) {
              app.storage.saveContent(type, payload, function(content) {
                  alert("content was saved !!!");
              });
            });
            // update
            app.vent.on("payload:update", function(type, uid, payload) {
              app.storage.updateContent(type, uid, payload, function(content) {
                  alert("content was updated !!!");
              });
            });
            // fork
            app.vent.on("payload:fork", function(type, uid, payload) {
              app.storage.forkContent(type, uid, payload, function(content) {
                  alert("content was updated !!!");
              });
            });
            // Save
            app.vent.on("payload:load", function(type, uid) {
              app.storage.loadContent(type, uid, function(content) {
                  alert("content was loaded !!!");
                  app.vent.trigger("payload:loaded", content);
              });
            });
            ////////////////////////////////////////////////
            // menu events
            ////////////////////////////////////////////////
            app.vent.on("menu:save", function(title) {
              app.trigger("umlsync:action", "save", title);
            });
            app.vent.on("menu:update", function(title) {
              app.trigger("umlsync:action", "update", title);
            });
            app.vent.on("menu:fork", function(title) {
              app.trigger("umlsync:action", "fork", title);
            });
        });
    });

    $(document).click(function(event) {
        if (event.target.nodeName !== 'A') return;

        var href = event.target.attributes.item('href') ? event.target.attributes.item('href').value : false;
        if (!href || href === '#' || href.indexOf('http') === 0) return;

        event.preventDefault();
        app.navigate(href);
    });

    window.app = app;
    return app;
});
