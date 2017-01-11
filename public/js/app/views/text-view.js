define(['marionette', "module/diagram/views/menu"],
function(Marionette, ElementsMenu) {

    var ContentView = Marionette.LayoutView.extend({
		template: _.template('<div id="sidebar"></div><div id="content"></div>'),
		regions: {
			sidemenu: "#sidebar",
			content: "#content",
		},
		onRender: function() {
			this.getRegion('sidemenu').show(new ElementsMenu());
			//this.getRegion('content').show(new ElementsMenu());
		}
	});

    return ContentView;

});
