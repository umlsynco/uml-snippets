/**
 *   Class: context menu for class element
 *
 */
 define(['module/umlsync/ds/diagram'], function(diagram) {
(function( $, dm, undefined ) {
    dm.ms.ctx['class'] = function(menuBuilder) {
        return new dm.ms.ctx.common(menuBuilder, {'id': "class", 'uid':"classECtx"}, [
        {
            title: 'Remove',
            click: function(element) {  // element is the jquery obj clicked on when context menu launched
              // Remove all connectors from this element
              element.parrent.removeConnector(element.euid, undefined,undefined);
              // Remove all connectors to this element
              element.parrent.removeConnector(undefined, element.euid, undefined);
              // Remove element
              element.parrent.removeElement(element.euid);
            }
        },
/*
        {
            title: 'Template On/Off',
            click: function(element){
            if (element.handleTemplate != undefined)
                element.handleTemplate();
            }
        },
        {
            title: 'Subroutine On/Off',
            click: function(element){
            if (element.handleSubroutine != undefined)
                element.handleSubroutine();
            }
        },
*/
        {
            title: 'Add method',
            click: function(element){
            if (element.addOperation != undefined)
                element.addOperation({text:"private newmethod(int, int, void*)"});
            }
        },
        {
            title: 'Add field',
            click: function(element){
            if (element.addAttribute != undefined)
                element.addAttribute({text:"private int newfield"});
            }
        }
        ]);
    };
})(jQuery, dm);

return true;
});
