define(['marionette'], function(Marionette) {

    var BrandView = Marionette.ItemView.extend({
        template: _.template('\
          <p id="name" class="changelog-badge">\
            <a title="UML snippets" href="/" id="home" class="drop-target">UmlSync</a>\
            <span class="HW_visible" id="HW_badge_cont">\
              <span data-count-unseen="4" class="HW_visible" id="HW_badge">4</span>\
            </span></p>'),
        className: 'branding'
    });

    var ActionModels = new Backbone.Collection([{
        uid: "save",
        title: "Save",
        tooltip: "Save new Diagram (CTRL + S)",
        icon: "pencil",
        visibility: "visible"
    }, {
        uid: "update",
        title: "Update",
        tooltip: "Update (CTRL + S)",
        icon: "pencil",
        visibility: "hidden"
    }, {
        uid: "fork",
        title: "Fork",
        tooltip: "Fork into a new item",
        icon: "fork",
        visibility: "visible"
    }]);

    var UmlActionModels = new Backbone.Collection([{
        uid: "class",
        title: "Class",
        tooltip: "Class Diagram",
        icon: "class",
        visibility: "visible"
    }, {
        uid: "package",
        title: "Package",
        tooltip: "Package Diagram",
        icon: "package",
        visibility: "visible"
    }, {
        uid: "component",
        title: "Component",
        tooltip: "Component Diagram",
        icon: "component",
        visibility: "visible"
    }, {
        uid: "sequence",
        title: "Sequence",
        tooltip: "Sequence Diagram",
        icon: "sequence",
        visibility: "visible"
    }]);

    var UserActions = new Backbone.Collection([{
        uid: "user",
        title: "USER ID",
        tooltip: "User detailed name",
        icon: "gravatar",
        visibility: "hidden"
    }, {
        uid: "settings",
        title: "Settings",
        tooltip: "Preview Settings",
        icon: "settings",
        visibility: "visible",
        dropdown: "#settings-options"
    }, {
        uid: "login",
        title: "Sign In",
        tooltip: "LogIn with ...",
        icon: "login",
        visibility: "visible",
        dropdown: "#login-options"
    }, {
        uid: "logout",
        title: "Log Out",
        tooltip: "Log out",
        icon: "logout",
        visibility: "hidden"
    }]);

    var ActionView = Marionette.ItemView.extend({
        template: _.template('<a class="aiButton" id="<%= uid %>" title="<%= tooltip %>" href="#<%= uid %>"><i class="bts bt-<%= icon%>"></i><%= title %></a>'),
        className: 'actionItem',
        events: {
          'click a.aiButton' : 'onAction'
        },
        onRender: function() {
            if (this.model.get("visibility") == "hidden")
                this.$el.hide();
        },
        onAction: function() {
          if (app)
            app.vent.trigger("menu:" + this.model.get("uid"), "some title:");
        }
    });

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
            this.getRegion('actionsfw').show(new ActionsList({
                collection: ActionModels
            }));
            this.getRegion('actionsuml').show(new ActionsList({
                collection: UmlActionModels
            }));
            this.getRegion('user').show(new ActionsList({
                collection: UserActions
            }));
        }
    });

    return new TopMenus();

});
