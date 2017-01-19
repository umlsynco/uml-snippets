define(['backbone'], function (Backbone) {
  var menu = [
  {"type": "sequence",
   "elements": [
	{"type": "objinstance",
	 "title": "Object Instance",
         "options": {"width":150, "height": 250},
	 "icon": "/images/icons/us/es/component/InstanceSpecification.png"
	},
	{"type": "llport",
	 "title": "Port",
         "options": {"width":15, "height": 25},
	 "hidden": true
	},
	{"type": "message",
	 "title": "Lost/Found Message",
	  "options": {"width":15, "height": 15},
	 "icon": "/images/icons/us/es/common/message.png"
	},
	{"type": "lldel",
	 "title": "Del object",
	 "options":{"hidden": true, "width":15, "height": 15},
	 "icon": "/images/icons/us/es/common/del.png"
	},
	{"type": "llalt",
	 "title": "Alt",
	  "options": {"width":350, "height": 150, "title":"Alt"},
	 "icon": "/images/icons/us/es/common/alt.png"
	},
	{"type": "llalt",
	 "title": "Option",
	  "options": {"width":350, "height": 150, "title":"Option"},
	 "icon": "/images/icons/us/es/common/opt.png"
	},
	{"type": "llalt",
	 "title": "Loop",
	  "options": {"width":350, "height": 150, "title":"Loop"},
	 "icon": "/images/icons/us/es/common/loop.png"
	},
	{"type": "llalt",
	 "title": "Break",
         "options": {"width":350, "height": 150, "title":"Break"},
	 "icon": "/images/icons/us/es/common/break.png"
	},
	{"type": "llalt",
	 "title": "Parallel",
         "options": {"width":350, "height": 150, "title":"Parallel"},
	 "icon": "/images/icons/us/es/common/par.png"
	},
	{"type": "llalt",
	 "title": "Strict",
         "options": {"width":350, "height": 150, "title":"Strict"},
	 "icon": "/images/icons/us/es/common/strict.png"
	},
	{"type": "actor",
	 "title": "Actor",
	     "options": {"width":50, "height": 150},
	 "icon": "/images/icons/us/es/sequence/Actor.png"
	},
	{"type": "note",
	 "title": "Note",
         "options": {"width": 150, "height":66},
	 "icon": "/images/icons/us/es/common/Note.png"
	}

    ],
    "connectors": [
      {"type":"llsequence",
	   "title":"Life Line Sequence",
	   "createObject": true,
	   "icon": "/images/icons/us/cs/dependency.png"
	  },
      {"type":"llselfcall",
	   "title":"Self Call",
	   "icon": "/images/icons/us/cs/composition.png"
	  },
      {"type":"generalization",
	   "title":"Generalization",
	   "icon": "/images/icons/us/cs/generalization.png"
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
