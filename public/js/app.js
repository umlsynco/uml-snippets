define('app', ['marionette', 'backbone', 'jquery'], function(Marionette, Backbone, $) {

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

subscribedForResize: false,
        content: function(view, left) {
            if (left)
              this.ContentLeft.show(view);
            else
              this.ContentRight.show(view);


var self = this;
self._helperUpdateFrameWork(true);

if (!this.subscribedForResize) {
  this.subscribedForResize = true;
  $(window).resize(function (e) {
    if ((e.target === window) || (e.target == window)) {
        self._helperUpdateFrameWork(true);
        self.vent.trigger("redraw:diagram");
    }
  });
}
        },
        //
        // update framework sizes
        //
        _helperUpdateFrameWork: function (resizeAll, ui) {
              if (resizeAll) {
                  // setup height for content and left - resize -right conent DIV's
                  // header border 1px => total 2px (border top, border-bottom)
                  // content border 1px => total 2px (border top, border-bottom)
                  // and -1 to get real height
                  var hhh = $(window).height() - $('header').outerHeight(true) - 5 - $("footer").outerHeight(true);

                  var $ch1 = $("main#content").height(hhh)  // set height of middle:  #content
                      .children("DIV").height(hhh)          // #content-left; #content-right; #content-left-right-resize;  No border for this items available
                      .children(".ui-scrollable-tabs").height(hhh - 2)    // 1px solid border defined for .ui-scrollable-tabs
                      .children("#tabs").height(hhh - 8);        // 3px border defined for .ui-tabs BUT if we will shift it than it is possible to observe cool effect

                  var $ch, $md;
                  // recalculate the content
                  var wd = $("main#content").width() - $("#content-left").width() - 6;
                  $("#content-right").width(wd);

                  // Update the markdown text area
                  if ($md && $md.length != 0) {
                      $md.width(wd - 37 * 2);
                  }

                  var canvas = window.document.getElementById('SingleCanvas');
                  if (canvas) {
                      if ($ch) {
                          var s = $ch.offset();
                          if (s) {
                              $(canvas).offset(s);
                          }
                      }
                      canvas.height = hhh - 11; // 11-is scroll element size
                      if ($(".us-diagram").length) {
                          canvas.width = ($(".us-diagram").width() - 12);
                      } else {
                          canvas.width = wd - 40 - 12;
                      }
                  }
              }
          }
    });

    app.on('start', function() {
        if (!Backbone.history) return;
        require(['js/app/menu', 'module/users', 'module/home'], function(menu) {
            app.Header.show(menu);
            Backbone.history.start({pushState: true});
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
