define([], function () {
  var menu = [
  {
   "elements": [
	{"type": "class",
	 "title": "Class",
	 "icon": "/images/icons/us/es/class/Class.png",
         "options":{
            "attributes": [],
            "operations": [],
		   "width": 150,
		   "height": 66
         }
	},
	{"type": "class",
	 "title": "Interface",
	 "options": {
  	   "aux": "Interface",
	   "nameTemplate": "Interface",
	   "attributes": [],
	   "operations": [],
	   "width": 150,
	   "height": 66
	 },
	 "icon": "/images/icons/us/es/class/ClassInterface.png"
	},
	{"type": "class",
	 "title": "Enumeration",
	 "options":{
	   "attributes": [],
	   "operations": [],
	   "width": 150,
	   "height": 66,
	   "aux": "Enumeration"
	 },
	 "icon": "/images/icons/us/es/class/ClassEnumeration.png"
	},
	{"type": "class",
	 "title": "Template",
	 "options": {
	   "attributes": [],
	   "operations": [],
	   "width": 150,
	   "height": 66,
            "aux": "Template"
	 },
	 "icon": "/images/icons/us/es/class/ClassTemplate.png"
	},
	{"type": "note",
	 "title": "Note",
	 "icon": "/images/icons/us/es/common/Note.png",
         "options": {
           "description": "Please! Add some note here!!!",
		   "width": 150,
		   "height": 66
         }
	}
    ],
    "connectors": [
      {"type":"aggregation",
	   "title":"Aggregation",
	   "icon": "/images/icons/us/cs/aggregation.png"
	  },
      {"type":"realization",
	   "title":"Realization",
	   "icon": "/images/icons/us/cs/realization.png"
	  },
      {"type":"selfassociation",
	   "title":"Self Association",
	   "oneway":"true",
	   "icon": "/images/icons/us/cs/composition.png"
	  },
      {"type":"dependency",
	   "title":"Dependency",
	   "icon": "/images/icons/us/cs/dependency.png"
	  },
      {"type":"generalization",
	   "title":"Generalization",
	   "icon": "/images/icons/us/cs/generalization.png"
	  },
      {"type":"nested",
	   "title":"Nested",
	   "icon": "/images/icons/us/cs/nested.png"
	  },
      {"type":"composition",
	   "title":"Composition",
	   "icon": "/images/icons/us/cs/composition.png"
	  }
    ],
	"menus": [
	  {"id":"class-menu",
	   "items": [
				{"el":"Class",
				 "cs":[
						{"connector":"association",
						 "image":"/images/icons/cs/class/class/association.png"
						},
						{"connector":"aggregation",
						 "image":"/images/icons/cs/class/class/aggregation.png"
						},
						{"connector":"composition",
						 "image":"/images/icons/cs/class/class/composition.png"
						},
						{"connector":"Self Association",
						 "image":"/images/icons/cs/class/class/self-association.png"
						},
						{"connector":"dependency",
						 "image":"/images/icons/cs/class/class/dependency.png"
						},
						{"connector":"realization",
						 "image":"/images/icons/cs/class/class/realization.png"
						},
						{"connector":"generalization",
						 "image":"/images/icons/cs/class/class/generalization.png"
						},
						{"connector":"nested",
						 "image":"/images/icons/cs/class/class/nested.png"
						}
					  ]
				},
				{"el":"Note",
				 "cs":[
						{"connector":"anchor",
						 "image":"/images/icons/cs/diagram/anchor_with_note.gif"}
					  ]
				}
			 ]
	  },
	  {"id":"note-menu",
	   "items": [
				{"el":"Class",
				 "cs":[
						{"connector":"anchor",
						 "image":"/images/icons/cs/diagram/anchor_with_note.gif"}
					  ]
				},
				{"el":"Note",
				 "cs":[
						{"connector":"anchor",
						 "image":"/images/icons/cs/diagram/anchor_with_note.gif"}
					  ]
				}
			 ]
	  }
	]
   }];
   	return menu[0];
});
