define(['backbone'], function (Backbone) {
  var menu = [
  {
   "elements": [
	{"type": "package",
	 "title": "Package",
         "options": {
		   "width": 150,
		   "height": 80
		 },
	 "icon": "/images/icons/us/es/package/Package.png"
	},
	{"type": "package",
	 "title": "Subsystem",
	 "options": {
	   "width": 150,
	   "height": 66,
	   "aux": "subsystem"
	 },
 	 "icon": "/images/icons/us/es/package/Subsystem.png"
	},
	{"type": "note",
	 "title": "Note",
         "options": {
		   "width": 150,
		   "height": 60},
	 "icon": "/images/icons/us/es/common/Note.png"
	}
    ],
    "connectors": [
      {"type":"dependency",
	   "title":"Dependency",
	   "icon": "/images/icons/us/cs/dependency.png"
	  },
      {"type":"dependency",
	   "title":"Import",
	   "icon": "/images/icons/us/cs/Import.png"
	  },
      {"type":"dependency",
	   "title":"Access",
	   "icon": "/images/icons/us/cs/Access.png"
	  },
      {"type":"generalization",
	   "title":"Generalization",
	   "icon": "/images/icons/us/cs/generalization.png"
	  },
      {"type":"dependency",
	   "title":"Merge",
	   "icon": "/images/icons/us/cs/Merge.png"
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
