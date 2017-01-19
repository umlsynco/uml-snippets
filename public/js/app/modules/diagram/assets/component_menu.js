define(['backbone'], function (Backbone) {
  var menu = [
  {
   "elements": [
	{"type": "component",
	 "title": "Component",
	 "icon": "/images/icons/us/es/component/Component.png",
         "options": {
		   "width": 150,
		   "height": 66
		 }
	},
	{"type": "interface",
	 "title": "Interface",
	 "options": {
	   "width": 17,
	   "height": 17
	 },
	 "icon": "/images/icons/us/es/component/Interface.png"
	},
	{"type": "port",
	 "title": "Port",
         "options": {
		   "width": 25,
		   "height": 25
		 },
	 "icon": "/images/icons/us/es/component/Port.png"
	},
	{"type": "empty",
	 "title": "Empty",
         "options": {
		   "width": 25,
		   "height": 25
		 },
	 "hidden": true
	},
	{"type": "instance",
	 "title": "Instance Specification",
         "options": {
		   "width": 150,
		   "height": 66
		 },
	 "icon": "/images/icons/us/es/component/InstanceSpecification.png"
	},
	{"type": "note",
	 "title": "Note",
         "options": {
		   "width": 150,
		   "height": 66
		 },
	 "icon": "/images/icons/us/es/common/Note.png"
	}
    ],
    "connectors": [
      {"type":"dependency",
	   "title":"Dependency",
	   "icon": "/images/icons/us/cs/dependency.png"
	  },
      {"type":"arc",
	   "title":"Interface Observer",
	   "icon": "/images/icons/us/cs/interface_required.png"
	  },
      {"type":"realization",
	   "title":"Realization",
	   "icon": "/images/icons/us/cs/realization.png"
	  },
      {"type":"association",
	   "title":"Association",
	   "icon": "/images/icons/us/cs/association.png"
	  },
      {"type":"aggregation",
	   "title":"Aggregation",
	   "icon": "/images/icons/us/cs/aggregation.png"
	  },
      {"type":"composition",
	   "title":"Composition",
	   "icon": "/images/icons/us/cs/composition.png"
	  },
      {"type":"anchor",
	   "title":"Anchor",
	   "icon": "/images/icons/us/cs/AnchorToNote.png"
	  },
      {"type":"anchor",
	   "title":"Constraint",
	   "icon": "/images/icons/us/cs/Constrain.png"
	  },
      {"type":"nested",
	   "title":"Containment",
	   "icon": "/images/icons/us/cs/nested.png"
	  }
    ]
   }
];
   	return menu[0];
});
