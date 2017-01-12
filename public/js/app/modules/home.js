
define(['app', 'marionette', 'js/app/routing-module', "module/diagram/views/menu", "module/diagram/views/diagram_wrapper"],
function(app, Marionette, RoutingModule, LeftSideMenu, DiagramView) {
var test =
  {"type":"class",
  "base_type":"base",
  "multicanvas":"false",
  "fullname":"/diagrams/classDiagramCommitRefTest.umlsync",
  "name":"diagram32",
  "viewid":"github",
  "connectors":[{"type":"aggregation","fromId":"0","toId":"1","epoints":[{"0":"368","1":"121"}],"labels":[]}]
  ,"elements":[{"width":"150",
  "height":"67",
  "left":"266.1166826611328",
  "top":"220.1166521435547",
  "ctx_menu":"class",
  "type":"class",
  "title":"Class",
  "menu":"us-class-menu",
  "icon":"/dm/icons/us/es/class/Class.png",
  "z-index":"101",
  "name":"Class34",
  "operations":[]
  ,"attributes":[]
  ,"references":["ElkaClass.umlsunc","ElkaClass.umlsync","packageDiagram.umlsync"]
  ,"id":"0",
  "pageX":"266.1166826611328",
  "pageY":"220.1166521435547",
  "height_a":"19.76666",
  "height_o":"19.76666"},{"width":"150",
  "height":"67",
  "left":"922.9999834423828",
  "top":"120.99999870117188",
  "ctx_menu":"class",
  "type":"class",
  "title":"Class",
  "menu":"us-class-menu",
  "icon":"/dm/icons/us/es/class/Class.png",
  "z-index":"102",
  "name":"Class37",
  "operations":[]
  ,"attributes":[]
  ,"references":[]
  ,"id":"1",
  "pageX":"922.9999834423828",
  "pageY":"120.99999870117188",
  "height_a":"19.76666",
  "height_o":"19.76666"}]
};

    var HomeModule = RoutingModule.extend({

        startWithParent: false,

        routesList: {
            'home': 'homeAction',
            '': 'homeAction'
        },

        initialize: function() {
            RoutingModule.prototype.initialize.apply(this, arguments);
            console.log('HomeModule initialize');
        },

        onStart: function() {
            console.log('HomeModule start');
        },

        onStop: function() {
            console.log('HomeModule stop');
        },

        homeAction: function() {
            var textView = new LeftSideMenu({
                title: 'UmlSync'
            });
            var diagramView = new DiagramView({model: new Backbone.Model(test)});
            app.content(textView.render(), true);
            app.content(diagramView.render());
        }

    });

    return app.module('home', HomeModule);

});
