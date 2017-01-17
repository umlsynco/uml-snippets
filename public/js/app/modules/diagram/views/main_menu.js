define(['app', 'marionette','module/diagram/assets/main_menu'],
function(Framework, Marionette, MainMenu) {

   var elementView = Marionette.ItemView.extend({
       tagName: 'li',
       className: 'element-selector',
       template: _.template("<span style=\"cursor:pointer;list-style-image:url('<%= icon %>');\"><a><%= title %></a></span>"),
       events: {
           'click': 'onSelectMenuItem'
       },
       onSelectMenuItem: function() {
          var opt = this.model.attributes;
          if (opt)
            app.vent.trigger("diagram:init", {baseType : opt.base_type, type: opt.type, connectors:[], elements:[]});
       }
   });
   // Collection of the elements icons
   var elementsCollection = Marionette.CollectionView.extend({
       tagName: 'ul',
       className: 'us-main-menu',
       childView: elementView
   });

    return elementsCollection;

});
