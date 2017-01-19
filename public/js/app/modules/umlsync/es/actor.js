/**
  *
  */
define(['module/umlsync/ds/diagram'], function(diagram) {

(function( $, dm, undefined ) {

dm.base.diagram("es.actor", dm.es.element, {
    'options': {
        'nameTemplate': "Actor",
   	    "image_path":"/images/icons/fw/actor3.svg",
        'width': 20,
        'height': 20
    },
    '_create': function() {
      // HTML for class structure creation
      this.innerHtml = '<div id="' + this.euid + '" style="width:100%;height:100%;" class="us-element-resizable-area">\
        <img id="'+ this.euid + 'img" src="' + this.options['image_path'] +  '" width="' + this.options.width +'px"></img>\
      </div>';
      $("#" + this.parrent.euid).append(this.innerHtml);
      this.element = $("#"  + this.euid);
    },
    '_init': function() {
      // TODO: REPLACE THIS METHOD ON RESIZE OPTION TO KEEP RATIO
      var self = '#' + this.euid;
      $('#' + this.euid + "_Border").width(this.options.width).bind( "resize", function(event, ui) {
         var w = $(self).width(),
             h = $(self).height();
         var m = w;
         if (w > h )
            m = h;
         $(self + " img"+self +"img").width(m).height(m);
      });
	  if (this.options['left']) {
        $('#' + this.euid + "_Border").css("left", this.options['left']);
      }

      if (this.options['top'])
        $('#' + this.euid + "_Border").css('top', this.options['top']);
    }
});

//@aspect
})(jQuery, dm);

    return dm.es.actor;
});
