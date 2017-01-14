define(['app', 'marionette', 'jquery-ui/jquery-ui',
'module/diagram/assets/main_menu',
'module/diagram/assets/class_menu',
'module/diagram/assets/package_menu',
'module/diagram/assets/component_menu',
'module/diagram/assets/sequence_menu'],
function(Framework, Marionette, ui, MainMenu, Class, Package, Component, Sequence) {

   var elementView = Marionette.ItemView.extend({
       tagName: 'li',
       className: 'element-selector',
       template: _.template("<a style=\"cursor:pointer;background-image:url('<%= icon %>');\"><%= title %></a>"),
       events: {
           'click': 'onSelectMenuItem'
       },
       onSelectMenuItem: function() {
           if (Framework && Framework.vent) {
               var opt = this.model.get("options");

               if (opt) {
                 opt.type = this.model.get("type");
                 opt.name = this.model.get("title");
                 Framework.vent.trigger("load:element", opt);
               }
           } else {
               alert("FRAMEWORK WAS NOT DEFINED FOR DIAGRAM MENU ITEM !!!");
           }
       }
   });
   // Collection of the elements icons
   var elementsCollection = Marionette.CollectionView.extend({
       tagName: 'ul',
       childView: elementView,

         // Filter hidden items
       addChild: function(child, ChildView, index){
           var hasIcon = child.has("icon");
           var isHidden = child.get("hidden");
           if (child.has("icon") && child.get("hidden") != true) {
               Marionette.CollectionView.prototype.addChild.apply(this, arguments);
           }
       }
   });

   var connectorView = Marionette.ItemView.extend({
       tagName: 'li',
       className: 'connector-selector',
       template: _.template("<a style=\"cursor:pointer;background-image:url('<%= icon %>');\"><%= title %></a>")
   });

    var connectorsCollection = Marionette.CollectionView.extend({
        tagName: 'ul',
        childView: connectorView,

        // Filter hidden items
        addChild: function(child, ChildView, index){
            var hasIcon = child.has("icon");
            var isHidden = child.get("hidden");
            if (child.has("icon") && child.get("hidden") != true) {
                Marionette.CollectionView.prototype.addChild.apply(this, arguments);
            }
        }
    });

   // <h3 class="ui-accordion-header ui-helper-reset ui-state-default ui-state-active ui-corner-top" aux="class">
   // <span class=""></span><a tabindex="-1" href="#">class diagram</a></h3>

   var itemView = Marionette.ItemView.extend({
       tagName:"h3",
       className:"umlsync-accordion-item ui-accordion-header ui-helper-reset ui-state-default ui-state-active ui-corner-top us-inactive",
       template:_.template('<span class="ui-icon ui-icon-triangle-1-s"></span><a tabindex="-1" href="#"><%= title%></a>'),
       events: {
           'click': 'onSelectMenu'
       },
       onRender: function() {
           // add an extra attribute
           this.$el.attr("id", this.cid);
       },
       onSelectMenu: function(event) {
           // hide all accordions
           this.$el.parent().children("DIV").hide();
           // show only active one
           this.$el.parent().children("DIV.ui-item-"+ this.model.get("id")).show();
       },
       onBeforeDestroy: function() {
           this.$el.parent().children("DIV.ui-item-"+ this.model.get("id")).remove();
       },
       onShow: function() {
           this.$el.trigger("click");
       }
       });

    var collectionView = Marionette.CollectionView.extend({
       childView: itemView,
       addMenu: function(model, data) {
           this.collection.add(model);

           this.elements  = new elementsCollection({collection: new Backbone.Collection(data.elements)});
           this.connectors = new connectorsCollection({collection: new Backbone.Collection(data.connectors)});

           this.elements.render();
           this.$el.append(this.elements.$el);
           this.connectors.render();
           //this.$el.append();
           this.elements.$el
           .wrap('<div aria-hidden="false" role="tabpanel" aria-labelledby="ui-id-3" style="display: block; min-height: 119px;" class="ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active ui-item-'+model.id+'"></div>')
               .parent()    .append(this.connectors.$el);
//           .wrap('<p></p>');
       },
       hasMenu: function(model) {
           var response = this.collection.where({type: model.type});
           // Just to prevent multiple load of the same item
           // we have to check it in the collection
           if (response && response.length > 0) {
               return true;
           }
           return false;
       },
       initialize: function(options) {
//           Framework = options.Framework
       }
    });

    var ContentView = Marionette.LayoutView.extend({
		template: _.template('<div id="sidebar"></div><div id="content"></div>'),
		regions: {
			sidemenu: "#sidebar",
			content: "#content",
		},
		onRender: function() {
			this.accordion = new collectionView({collection : new Backbone.Collection()});
			this.getRegion('sidemenu').show(this.accordion);
			// todo reuire and then initalize items
			this.accordion.addMenu(MainMenu[0], Class);
			this.accordion.addMenu(MainMenu[1], Package);
			this.accordion.addMenu(MainMenu[2], Component);
			this.accordion.addMenu(MainMenu[3], Sequence);

			//this.getRegion('content').show(new ElementsMenu());
		}
	});

    return ContentView;

});
