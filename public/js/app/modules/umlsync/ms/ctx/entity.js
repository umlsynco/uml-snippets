/**
  *   Class: context menu for class element
  *
  */
  define(['module/umlsync/ds/diagram'], function(diagram) {(function( $, dm, undefined ) {

dm.ms.ctx.entity = function(menuBuilder) {
  var url = menuBuilder.loader.url;

  return new dm.ms.ctx['common'](menuBuilder, {'id': "entity", 'uid':"classECtx"}, {
           '  Add field': {
                click: function(element) {
                  if (element.options.type == 'entity') {
                    element.addField("NAME", "INTEGER", "PRIMARY");
                  }
               },
               klass: "menu-item-1" // a custom css class for this menu item (usable for styling)
            }
        });
}
//@aspect
})(jQuery, dm);

return true;
});
