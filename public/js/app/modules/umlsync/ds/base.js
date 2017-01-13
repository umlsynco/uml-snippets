define(['module/umlsync/ds/diagram'], function(diagram, loader) {

(function( $, dm, undefined ) {
    dm.base.diagram("ds.base", dm.ds['diagram'], {
        diagramName: "BaseDiagram",
        diagramEventPrefix: "CD",
        'options': {
            'width': 1300,
            'height': 700,
            'type': 'base'
        },
        '_init': function() {
        }
    });

	dm.base.diagram("ds.class", dm.ds.diagram, {
      diagramName: "ClassDiagram",
      options: {
        type: 'class',
		acceptElements: ['class','package','note']
      }
    });

	dm.base.diagram("ds.component", dm.ds.diagram, {
		diagramName: "ComponentDiagram",
		options: {
			type: 'component',
			acceptElements:'component,interface,port,empty,instance,note,package'
		},
		_init: function() {
		}
	});

	dm.base.diagram("ds.package", dm.ds.diagram, {
		diagramName: "PackageDiagram",
		options: {
			type: 'package',
			acceptElements: ['class','package','note']
		}
	});
})(jQuery, window.dm);

});
