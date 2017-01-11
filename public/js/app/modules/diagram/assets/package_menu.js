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
	 "icon": "./assets/icons/us/es/package/Package.png"
	},
	{"type": "package",
	 "title": "Subsystem",
	 "options": {
	   "width": 150,
	   "height": 66,
	   "aux": "subsystem"
	 },
 	 "icon": "./assets/icons/us/es/package/Subsystem.png"
	},
	{"type": "note",
	 "title": "Note",
         "options": {
		   "width": 150,
		   "height": 60},
	 "icon": "./assets/icons/us/es/common/note.png"
	}
    ],
    "connectors": [
      {"type":"dependency",
	   "title":"Dependency",
	   "icon": "./assets/icons/us/cs/dependency.png"
	  },
      {"type":"dependency",
	   "title":"Import",
	   "icon": "./assets/icons/us/cs/Import.png"
	  },
      {"type":"dependency",
	   "title":"Access",
	   "icon": "./assets/icons/us/cs/Access.png"
	  },
      {"type":"generalization",
	   "title":"Generalization",
	   "icon": "./assets/icons/us/cs/generalization.png"
	  },
      {"type":"dependency",
	   "title":"Merge",
	   "icon": "./assets/icons/us/cs/Merge.png"
	  },
      {"type":"nested",
	   "title":"Containment",
	   "icon": "./assets/icons/us/cs/nested.png"
	  }
    ]
   }
];
   	return menu[0];
});
