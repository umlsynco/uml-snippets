define(['app', 'marionette'], function(app, Marionette) {
    var BrandView =  Marionette.ItemView.extend({
        template: _.template('\
          <p id="name" class="changelog-badge">\
            <a title="UML snippets" href="/" id="home" class="drop-target">UmlSync</a>\
            <span class="HW_visible" id="HW_badge_cont">\
              <span data-count-unseen="4" class="HW_visible" id="HW_badge">4</span>\
            </span></p>'),
        className: 'branding',
        events: {
          click : 'onSelect'
        },
        onSelect: function(e) {
          e.stopPropagation();
          Backbone.navigate("/", {trigger:true});
        }
    });

    var ActionModels = new Backbone.Collection([
       {
		   uid: "save",
		   title: "Save",
		   tooltip: "Save new Diagram (CTRL + S)",
		   icon: "pencil",
		   visibility: "visible"
	   },
       {
		   uid: "update",
		   title: "Update",
		   tooltip: "Update (CTRL + S)",
		   icon: "pencil",
		   visibility: "hidden"
	   },
       {
		   uid: "fork",
		   title: "Fork",
		   tooltip: "Fork into a new item",
		   icon: "fork",
		   visibility: "visible"
	   }
	]);

    var UserActions = new Backbone.Collection([
       {
		   uid: "user",
		   title: "USER ID",
		   tooltip: "User detailed name",
		   icon: "gravatar",
		   visibility: "hidden"
	   },
       {
		   uid: "settings",
		   title: "Settings",
		   tooltip: "Preview Settings",
		   icon: "settings",
		   visibility: "visible",
		   dropdown: "#settings-options"
	   },
       {
		   uid: "login",
		   title: "Sign In",
		   tooltip: "LogIn with ...",
		   icon: "login",
		   visibility: "visible",
		   dropdown: "#login-options"
	   },
       {
		   uid: "logout",
		   title: "Log Out",
		   tooltip: "Log out",
		   icon: "logout",
		   visibility: "hidden"
	   }
	]);

  var ActionView =  Marionette.ItemView.extend({
      template: _.template('<a class="aiButton" id="<%= uid %>" title="<%= tooltip %>" href="#<%= uid %>"><i class="bts bt-<%= icon%>"></i><%= title %></a>'),
      className: 'actionItem',
      events: {
        'click  a.aiButton': 'onSelect'
      },
      modelEvents: {
        "change:visibility": "onRender"
      },
      onSelect: function() {
        if (app)
          app.vent.trigger("menu:" + this.model.get("uid"), "some title:");
      },
      onRender: function() {
        if (this.model.get("visibility") == "hidden")
          this.$el.hide();
      }
});

  var DiagramActionsList = Marionette.ItemView.extend({
    template: _.template('\
    <div style="display: block; width:55px;" class="actionItem"><a class="aiButton" id="edit_diagram_btn" title="Edit Diagram" href="#"><i class="bts bt-class"></i>Edit</a></div>\
    <div style="display: none; width:55px;" class="actionItem"><a class="aiButton" id="preview_diagram" title="Preview Diagram" href="#"><i class="bts bt-class"></i>View</a></div>\
    <div class="actionItem" id="edit_diagram">\
        <a class="aiButton closeButton" title="<%= tooltip %>" href="#"><input id="uniquerDiagramName" placeholder="Please add diagram title..."></a></div>\
    <div style="display: none;" class="actionItem"><a class="aiButton" id="undo_diagram" title="Undo Ctrl-Z" href="#"><i class="bts bt-class"></i>Bw</a></div>\
    <div style="display: none;" class="actionItem"><a class="aiButton" id="redo_diagram" title="Redo Ctrl-Y" href="#"><i class="bts bt-class"></i>Fw</a></div>\
    '),
		tagName: 'nav',
		className: 'actionCont collapsed',
    ui: {
      edit: 'a#edit_diagram_btn'
    },
    events: {
      "click @ui.edit": "editDiagram",
      "click div.actionItem>a#preview_diagram": "previewDiagram",
      "click a.closeButton": "onCloseEdit",
      "click #undo_diagram": "undo",
      "click #redo_diagram": "redo"
    },
    undo: function(e) {
      e.preventDefault();
      e.stopPropagation();
      app.vent.trigger("diagram:action", "undo");
    },
    redo: function(e) {
      e.preventDefault();
      e.stopPropagation();
      app.vent.trigger("diagram:action", "redo");
    },
    onCloseEdit: function(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    editDiagram: function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Show/hide buttons
      this.ui.edit.parent().hide();
      $("#preview_diagram").parent().show();

      // make diagram title editable
      $("#uniquerDiagramName").prop("readonly", false);
      $("#undo_diagram").parent().show();
      $("#redo_diagram").parent().show();
      // change the diagram mode
      app.vent.trigger("diagram:mode", "edit");
      app.vent.trigger("diagram:menu", true);
    },
    previewDiagram: function(e) {
      // re-user methods from the class above
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Show/hide buttons
      this.ui.edit.parent().show();
      $("#preview_diagram").parent().hide();
      $("#undo_diagram").parent().hide();
      $("#redo_diagram").parent().hide();

      // Make diagram title not editable
      $("#uniquerDiagramName").prop("readonly", true);
      // change the diagram mode
      app.vent.trigger("diagram:mode", "preview");
      app.vent.trigger("diagram:menu", false);
    }
  });

  // UML actioons
  var actionsUml = new DiagramActionsList({model: new Backbone.Model({tooltip: "Diagram    "})});

	var ActionsList = Marionette.CollectionView.extend({
		childView: ActionView,
		tagName: 'nav',
		className: 'actionCont collapsed'
	});

	var TopMenus = Marionette.LayoutView.extend({
      template: _.template("<div class='branding'></div><div class='actions actions-fw'></div>\
      <div class='actions actions-uml'></div><div class='actions actions-user'></div>\
      <div id='progressbar'><div class='pb'></div></div>"),
      regions: {
         brand: ".branding",
         actionsfw: ".actions-fw",
         actionsuml: ".actions-uml",
         user: ".actions-user"
      },
      onRender: function() {
		  this.getRegion('brand').show(new BrandView());
		  this.getRegion('actionsfw').show(new ActionsList({collection: ActionModels}));
		  this.getRegion('actionsuml').show(actionsUml);
		  this.getRegion('user').show(new ActionsList({collection: UserActions}));
      var that = this;
      app.vent.on("menu:status", function(status, payload) {
        if (status == "new") {
$("#update").parent().hide();
$("#save").parent().show();
$("#fork").parent().hide();
          actionsUml.editDiagram();
        }
        else if (status == "update") {

          actionsUml.previewDiagram();

          $("#update").parent().show();
          $("#save").parent().hide();
          $("#fork").parent().show();
          $("#uniquerDiagramName").val(payload);
        }
        else if (status == "error") {
          $("div.actions-fw").hide();
          $("div.actions-uml").hide();
        }
      });
	  }
    });

    return new TopMenus();

});
