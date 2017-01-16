define(['app', 'marionette'], function(app, Marionette) {
  var jsonClass =
    {
    	"type": "class",
    	"base_type": "base",
    	"multicanvas": false,
    	"fullname": "/diagrams/classDiagramCommitRefTest.umlsync",
    	"name": "diagram32",
    	"viewid": "github",
    	"connectors": [{
    		"type": "aggregation",
    		"fromId": "0",
    		"toId": "1",
    		"epoints": [{
    			"0": "368",
    			"1": "121"
    		}],
    		"labels": []
    	}],
    	"elements": [{
    		"width": "150",
    		"height": "67",
    		"left": "266.1166826611328",
    		"top": "220.1166521435547",
    		"ctx_menu": "class",
    		"type": "class",
    		"title": "Class",
    		"menu": "us-class-menu",
    		"icon": "/dm/icons/us/es/class/Class.png",
    		"z-index": "101",
    		"name": "Class34",
    		"operations": [],
    		"attributes": [],
    		"references": ["ElkaClass.umlsunc", "ElkaClass.umlsync", "packageDiagram.umlsync"],
    		"id": "0",
    		"pageX": "266.1166826611328",
    		"pageY": "220.1166521435547",
    		"height_a": "19.76666",
    		"height_o": "19.76666"
    	}, {
    		"width": "150",
    		"height": "67",
    		"left": "922.9999834423828",
    		"top": "120.99999870117188",
    		"ctx_menu": "class",
    		"type": "class",
    		"title": "Class",
    		"menu": "us-class-menu",
    		"icon": "/dm/icons/us/es/class/Class.png",
    		"z-index": "102",
    		"name": "Class37",
    		"operations": [],
    		"attributes": [],
    		"references": [],
    		"id": "1",
    		"pageX": "922.9999834423828",
    		"pageY": "120.99999870117188",
    		"height_a": "19.76666",
    		"height_o": "19.76666"
    	}]
    };


    var jsonPackage =
    {
	"type": "package",
	"base_type": "base",
	"multicanvas": false,
	"fullname": "/diagrams/DiagramIoPackages.umlsync",
	"name": "diagram81",
	"viewid": "github",
	"connectors": [],
	"elements": [{
		"width": "905",
		"height": "459",
		"left": "57.65000785644531",
		"top": "15.64999259765625",
		"selected": "true",
		"pageY": "15.64999259765625",
		"pageX": "57.65000785644531",
		"height_b": "442.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "101",
		"name": "DIAGRAMMER - HTML5 based diagram engine",
		"id": "0",
		"dropped": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
		"references": []
	}, {
		"width": "868",
		"height": "397",
		"left": "74.99998344238281",
		"top": "67.99998344238281",
		"pageY": "67.99998344238281",
		"pageX": "74.99998344238281",
		"height_b": "379.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "102",
		"name": "dm - diagram manager",
		"id": "1",
		"dropped": ["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
		"color": "#b6d7a8",
		"references": []
	}, {
		"width": "160.53334",
		"height": "58.533339999999995",
		"left": "89.65000785644531",
		"top": "88.64999259765625",
		"selected": "true",
		"pageY": "88.64999259765625",
		"pageX": "89.65000785644531",
		"height_b": "41.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "103",
		"name": "es-elements",
		"id": "2",
		"dropped": [],
		"references": ["./RegisterApplicationsSequnce.umlsync"]
	}, {
		"width": "161",
		"height": "59",
		"left": "295.23332084472656",
		"top": "106.23332084472656",
		"pageY": "106.23332084472656",
		"pageX": "295.23332084472656",
		"height_b": "41.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "104",
		"name": "cs-connectors",
		"id": "3",
		"dropped": [],
		"references": []
	}, {
		"width": "365",
		"height": "41",
		"left": "93.23332084472656",
		"top": "177.23333610351563",
		"pageY": "177.23333610351563",
		"pageX": "93.23332084472656",
		"height_b": "23.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "105",
		"name": "ds-diagrams",
		"id": "4",
		"references": []
	}, {
		"width": "431",
		"height": "174",
		"left": "492.76664604003906",
		"top": "158.76666129882813",
		"pageY": "158.76666129882813",
		"pageX": "492.76664604003906",
		"height_b": "156.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "106",
		"name": "ms-menus",
		"id": "5",
		"dropped": ["16", "17", "18", "19", "20"],
		"references": []
	}, {
		"width": "365",
		"height": "207",
		"left": "94.11668266113281",
		"top": "238.11663688476563",
		"pageY": "238.11663688476563",
		"pageX": "94.11668266113281",
		"height_b": "189.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "107",
		"name": "dm-loaders",
		"id": "6",
		"dropped": ["7", "8", "9", "10", "11", "12"],
		"references": []
	}, {
		"width": "104",
		"height": "64",
		"left": "108.11668266113281",
		"top": "286.1166368847656",
		"pageY": "286.1166368847656",
		"pageX": "108.11668266113281",
		"height_b": "46.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "108",
		"name": "basic loader",
		"id": "7",
		"dropped": [],
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "104",
		"height": "64",
		"left": "220.1166826611328",
		"top": "287.1166368847656",
		"pageY": "287.1166368847656",
		"pageX": "220.1166826611328",
		"height_b": "46.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "109",
		"name": "GithubView",
		"id": "8",
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "104",
		"height": "64",
		"left": "107.11668266113281",
		"top": "367.1166368847656",
		"pageY": "367.1166368847656",
		"pageX": "107.11668266113281",
		"height_b": "46.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "110",
		"name": "LocalhostView",
		"id": "9",
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "104",
		"height": "64",
		"left": "221.1166826611328",
		"top": "366.1166368847656",
		"pageY": "366.1166368847656",
		"pageX": "221.1166826611328",
		"height_b": "46.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "111",
		"name": "LocalfilesView",
		"id": "10",
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "114",
		"height": "64",
		"left": "336.23332084472656",
		"top": "367.2333361035156",
		"pageY": "367.2333361035156",
		"pageX": "336.23332084472656",
		"height_b": "46.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "112",
		"name": "SelfAnalysisView",
		"id": "11",
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "112",
		"height": "64",
		"left": "337.23332084472656",
		"top": "287.2333361035156",
		"pageY": "287.2333361035156",
		"pageX": "337.23332084472656",
		"height_b": "46.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "113",
		"name": "IView",
		"id": "12",
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "431",
		"height": "100",
		"left": "494.23332084472656",
		"top": "341.2333361035156",
		"pageY": "341.2333361035156",
		"pageX": "494.23332084472656",
		"height_b": "82.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "114",
		"name": "hs-handlers",
		"id": "13",
		"dropped": ["14", "15"],
		"references": []
	}, {
		"width": "105",
		"height": "59",
		"left": "508.88334525878906",
		"top": "371.88333",
		"pageY": "371.88333",
		"pageX": "508.88334525878906",
		"height_b": "41.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "115",
		"name": "framework",
		"id": "14",
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "130",
		"height": "60",
		"left": "775.8833452587891",
		"top": "369.88333",
		"pageY": "369.88333",
		"pageX": "775.8833452587891",
		"height_b": "42.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "116",
		"name": "framework_viewer",
		"id": "15",
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "162",
		"height": "60",
		"left": "504.9999834423828",
		"top": "193.99999870117188",
		"pageY": "193.99999870117188",
		"pageX": "504.9999834423828",
		"height_b": "42.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "117",
		"name": "ctx-context",
		"id": "16",
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "203",
		"height": "60",
		"left": "688.2333208447266",
		"top": "192.23333610351563",
		"pageY": "192.23333610351563",
		"pageX": "688.2333208447266",
		"height_b": "42.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "118",
		"name": "ds-diagrams",
		"id": "17",
		"dropped": [],
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "162",
		"height": "60",
		"left": "505.9999834423828",
		"top": "258.9999987011719",
		"pageY": "258.9999987011719",
		"pageX": "505.9999834423828",
		"height_b": "42.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "119",
		"name": "main-diagram select menus",
		"id": "18",
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "96",
		"height": "60",
		"left": "688.1166826611328",
		"top": "259.1166368847656",
		"pageY": "259.1166368847656",
		"pageX": "688.1166826611328",
		"height_b": "42.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "120",
		"name": "us-umlsync",
		"id": "19",
		"color": "#9fc5e8",
		"references": []
	}, {
		"width": "96",
		"height": "60",
		"left": "796.1166826611328",
		"top": "259.1166368847656",
		"pageY": "259.1166368847656",
		"pageX": "796.1166826611328",
		"height_b": "42.76666",
		"type": "package",
		"title": "Package",
		"menu": "us-package-menu",
		"icon": "./dm/icons/us/es/package/Package.png",
		"z-index": "121",
		"name": "vp - VisualParadigm",
		"id": "20",
		"color": "#9fc5e8",
		"references": []
	}]
};

var jsonSequence =
{
	"type": "sequence",
	"base_type": "sequence",
	"multicanvas": false,
	"fullname": "/diagrams/RegisterApplicationsSequnce.umlsync",
	"name": "diagram0",
	"viewid": "github",
	"connectors": [{
		"type": "llsequence",
		"fromId": "0",
		"toId": "2",
		"epoints": [{
			"0": "250.2333526611328",
			"1": "161.2333221435547"
		}],
		"labels": [{
			"name": "RegisterApplication(URL)",
			"x": "104.28333915527344",
			"y": "135.81666435058594"
		}]
	}, {
		"type": "llsequence",
		"fromId": "2",
		"toId": "4",
		"epoints": [{
			"0": "332.23332084472656",
			"1": "203.5833282470703"
		}],
		"labels": [{
			"name": "LoadScript URL",
			"x": "287.4000078564453",
			"y": "181.9333330517578"
		}]
	}, {
		"type": "llsequence",
		"fromId": "4",
		"toId": "6",
		"epoints": [{
			"0": "535.4166852587891",
			"1": "215.5833282470703"
		}],
		"labels": [{
			"name": "HttpLoad()",
			"x": "517.0500322705078",
			"y": "219.5833269482422"
		}]
	}, {
		"type": "llsequence",
		"fromId": "6",
		"toId": "7",
		"epoints": [{
			"0": "247.1166534423828",
			"1": "265.1166534423828"
		}],
		"labels": [{
			"name": "RegisterHandler(viewer, editor, converter)",
			"x": "288.2833086376953",
			"y": "244.81666435058594"
		}]
	}, {
		"type": "llsequence",
		"fromId": "8",
		"toId": "9",
		"epoints": [{
			"0": "235.00001525878906",
			"1": "357.00001525878906"
		}],
		"labels": [{
			"name": "UnregisterApplication(URL)",
			"x": "98.28333915527344",
			"y": "332.81666435058594"
		}]
	}, {
		"type": "llsequence",
		"fromId": "2",
		"toId": "11",
		"epoints": [{
			"0": "332.23332084472656",
			"1": "174.5833282470703"
		}],
		"labels": [{
			"name": "UpdateUserPereferences()",
			"x": "289.2833086376953",
			"y": "152.81666435058594"
		}]
	}, {
		"type": "llsequence",
		"fromId": "9",
		"toId": "12",
		"epoints": [{
			"0": "824.6499786376953",
			"1": "368.88331604003906"
		}],
		"labels": [{
			"name": "UpdateUserPreferences()",
			"x": "290.16667045410156",
			"y": "347.69999564941406"
		}]
	}, {
		"type": "anchor",
		"fromId": "13",
		"toId": "6",
		"epoints": [{
			"0": "681.0500030517578",
			"1": "288.5833282470703"
		}],
		"labels": []
	}],
	"elements": [{
		"width": "40",
		"height": "75",
		"left": "46.35002006347656",
		"top": "120.34998954589844",
		"image_path": "/images/actor3.svg",
		"type": "image",
		"title": "Actor",
		"menu": "us-message-menu",
		"icon": "./dm/icons/us/es/sequence/Actor.png",
		"z-index": "101",
		"name": "Image2",
		"references": [],
		"id": "0",
		"pageX": "46.35002006347656",
		"pageY": "120.34998954589844"
	}, {
		"width": "150",
		"left": "176.23332084472656",
		"top": "39.999998701171876",
		"ctx_menu": "sequence",
		"type": "objinstance",
		"title": "Object Instance",
		"menu": "us-objinstance-menu",
		"icon": "./dm/icons/us/es/component/InstanceSpecification.png",
		"z-index": "102",
		"name": "Framework",
		"references": [],
		"id": "1",
		"pageX": "176.23332084472656",
		"pageY": "39.999998701171876",
		"dropped": ["2", "7", "9"]
	}, {
		"width": "15",
		"height": "68",
		"left": "243.23332084472656",
		"top": "164.23332084472656",
		"menu": "us-objinstance-menu",
		"z-index": "103",
		"type": "llport",
		"name": "LLPort8",
		"references": [],
		"pageX": "243.23332084472656",
		"pageY": "164.23332084472656",
		"id": "2"
	}, {
		"width": "150",
		"left": "382.1166826611328",
		"top": "39.999998701171876",
		"ctx_menu": "sequence",
		"type": "objinstance",
		"title": "Object Instance",
		"menu": "us-objinstance-menu",
		"icon": "./dm/icons/us/es/component/InstanceSpecification.png",
		"z-index": "104",
		"name": "GitHub",
		"references": [],
		"id": "3",
		"pageX": "382.1166826611328",
		"pageY": "39.999998701171876",
		"dropped": ["4"]
	}, {
		"width": "15",
		"height": "31",
		"left": "449.23332084472656",
		"top": "196.23332084472656",
		"menu": "us-objinstance-menu",
		"z-index": "105",
		"type": "llport",
		"name": "LLPort14",
		"references": [],
		"pageX": "449.23332084472656",
		"pageY": "196.23332084472656",
		"id": "4"
	}, {
		"width": "150",
		"left": "580.1166826611328",
		"top": "39.999998701171876",
		"ctx_menu": "sequence",
		"type": "objinstance",
		"title": "Object Instance",
		"menu": "us-objinstance-menu",
		"icon": "./dm/icons/us/es/component/InstanceSpecification.png",
		"z-index": "106",
		"name": "CustomApplication",
		"references": [],
		"id": "5",
		"pageX": "580.1166826611328",
		"pageY": "39.999998701171876",
		"dropped": ["6"]
	}, {
		"width": "15",
		"height": "87",
		"left": "647.2333208447266",
		"top": "212.23332084472656",
		"menu": "us-objinstance-menu",
		"z-index": "107",
		"type": "llport",
		"name": "LLPort22",
		"references": [],
		"pageX": "647.2333208447266",
		"pageY": "212.23332084472656",
		"id": "6"
	}, {
		"width": "15",
		"height": "40",
		"left": "243.76664604003906",
		"top": "260.1166521435547",
		"menu": "us-objinstance-menu",
		"z-index": "108",
		"type": "llport",
		"name": "LLPort26",
		"references": [],
		"id": "7",
		"pageX": "243.76664604003906",
		"pageY": "260.1166521435547"
	}, {
		"width": "40",
		"height": "75",
		"left": "46.23332084472656",
		"top": "308.23332084472656",
		"image_path": "/images/actor3.svg",
		"type": "image",
		"title": "Actor",
		"menu": "us-message-menu",
		"icon": "./dm/icons/us/es/sequence/Actor.png",
		"z-index": "109",
		"name": "Image28",
		"references": [],
		"id": "8",
		"pageX": "46.23332084472656",
		"pageY": "308.23332084472656"
	}, {
		"width": "15",
		"height": "40",
		"left": "243.76664604003906",
		"top": "351.9999834423828",
		"menu": "us-objinstance-menu",
		"z-index": "110",
		"type": "llport",
		"name": "LLPort32",
		"references": [],
		"id": "9",
		"pageX": "243.76664604003906",
		"pageY": "351.9999834423828"
	}, {
		"width": "149.53334",
		"height": "399.53334",
		"left": "769.9999834423828",
		"top": "37.766661298828126",
		"ctx_menu": "sequence",
		"type": "objinstance",
		"title": "Object Instance",
		"menu": "us-objinstance-menu",
		"icon": "./dm/icons/us/es/component/InstanceSpecification.png",
		"z-index": "111",
		"name": "Diagram.io",
		"references": [],
		"id": "10",
		"pageX": "769.9999834423828",
		"pageY": "37.766661298828126",
		"dropped": ["11", "12"]
	}, {
		"width": "15",
		"height": "23",
		"left": "837.2333818798828",
		"top": "170.23332084472656",
		"menu": "us-objinstance-menu",
		"z-index": "112",
		"type": "llport",
		"name": "LLPort38",
		"references": [],
		"pageX": "837.2333818798828",
		"pageY": "170.23332084472656",
		"id": "11"
	}, {
		"width": "15",
		"height": "40",
		"left": "839.7667070751953",
		"top": "363.88334525878906",
		"menu": "us-objinstance-menu",
		"z-index": "113",
		"type": "llport",
		"name": "LLPort42",
		"references": [],
		"id": "12",
		"pageX": "839.7667070751953",
		"pageY": "363.88334525878906"
	}, {
		"width": "199.53334",
		"height": "75.53334",
		"left": "705.8833452587891",
		"top": "227.88334525878906",
		"selected": "true",
		"type": "note",
		"title": "Note",
		"menu": "us-note-menu",
		"icon": "/dm/icons/us/es/common/Note.png",
		"z-index": "114",
		"name": "Scope {extensions, handler}",
		"references": [],
		"id": "13",
		"pageX": "705.8833452587891",
		"pageY": "227.88334525878906"
	}]
}
;
    var BrandView =  Marionette.ItemView.extend({
        template: _.template('\
          <p id="name" class="changelog-badge">\
            <a title="UML snippets" href="/" id="home" class="drop-target">UmlSync</a>\
            <span class="HW_visible" id="HW_badge_cont">\
              <span data-count-unseen="4" class="HW_visible" id="HW_badge">4</span>\
            </span></p>'),
        className: 'branding'
	});

    var ActionModels = new Backbone.Collection([
       {
		   uid: "savenew",
		   title: "Save",
		   tooltip: "Save new Diagram (CTRL + S)",
		   icon: "pencil",
		   visibility: "visible"
	   },
       {
		   uid: "update",
		   title: "Update",
		   tooltip: "Update (CTRL + S)",
		   icon: "pencil",
		   visibility: "hidden"
	   },
       {
		   uid: "fork",
		   title: "Fork",
		   tooltip: "Fork into a new item",
		   icon: "fork",
		   visibility: "visible"
	   }
	]);

    var UmlActionModels = new Backbone.Collection([
       {
		   uid: "class",
       action: "load:diagram",
		   title: "Class",
		   tooltip: "Class Diagram",
		   icon: "class",
		   visibility: "visible"
	   },
       {
		   uid: "package",
       action: "load:diagram",
		   title: "Package",
		   tooltip: "Package Diagram",
		   icon: "package",
		   visibility: "visible"
	   },
       {
		   uid: "component",
       action: "load:diagram",
		   title: "Component",
		   tooltip: "Component Diagram",
		   icon: "component",
		   visibility: "visible"
	   },
       {
		   uid: "sequence",
       action: "load:diagram",
		   title: "Sequence",
		   tooltip: "Sequence Diagram",
		   icon: "sequence",
		   visibility: "visible"
	   }
	]);

    var UserActions = new Backbone.Collection([
       {
		   uid: "user",
		   title: "USER ID",
		   tooltip: "User detailed name",
		   icon: "gravatar",
		   visibility: "hidden"
	   },
       {
		   uid: "settings",
		   title: "Settings",
		   tooltip: "Preview Settings",
		   icon: "settings",
		   visibility: "visible",
		   dropdown: "#settings-options"
	   },
       {
		   uid: "login",
		   title: "Sign In",
		   tooltip: "LogIn with ...",
		   icon: "login",
		   visibility: "visible",
		   dropdown: "#login-options"
	   },
       {
		   uid: "logout",
		   title: "Log Out",
		   tooltip: "Log out",
		   icon: "logout",
		   visibility: "hidden"
	   }
	]);

  var ActionView =  Marionette.ItemView.extend({
      template: _.template('<a class="aiButton" id="<%= uid %>" title="<%= tooltip %>" href="#<%= uid %>"><i class="bts bt-<%= icon%>"></i><%= title %></a>'),
      className: 'actionItem',
      events: {
        click : 'onSelect'
      },
      modelEvents: {
        "change:visibility": "onRender"
      },
      onSelect: function() {
      },
      onRender: function() {
        if (this.model.get("visibility") == "hidden")
          this.$el.hide();
      }
});

    var DiagramActionView =  Marionette.ItemView.extend({
        template: _.template('<a class="aiButton" id="<%= uid %>" title="<%= tooltip %>" href="#<%= uid %>"><i class="bts bt-<%= icon%>"></i><%= title %></a>'),
        className: 'actionItem',
        events: {
          click : 'onSelect'
        },
        modelEvents: {
          "change:visibility": "onRender"
        },
        onSelect: function() {
          if (this.model.get("action") == "load:diagram") {
            if (this.model.get("uid") == "package")
              app.vent.trigger("load:diagram", jsonPackage);
            else if (this.model.get("uid") == "sequence")
              app.vent.trigger("load:diagram", jsonSequence);
            else if (this.model.get("uid") == "class")
              app.vent.trigger("load:diagram", jsonClass);
            // trigger element selected
            this.model.set("active", true);
          }
        },
        onRender: function() {
			    if (this.model.get("visibility") == "hidden")
			      this.$el.hide();
          else
            this.$el.show();
    		}
	});

  var DiagramActionsList = Marionette.CompositeView.extend({
    template: _.template('\
      <div class="actionItem" hidden id="edit_diagram">\
        <a class="aiButton" title="<%= tooltip %>"><i  id="toggleDiagramSelect" class="bts bt-close">[X]</i><input placeholder="Please add diagram title..."></a></div>\
    '),
		childView: DiagramActionView,
		tagName: 'nav',
		className: 'actionCont collapsed',
    collectionEvents: {
       "change:active": "menuSelected"
    },
    events: {
      "click #toggleDiagramSelect": "onCloseEdit"
    },
    menuSelected: function(model, view) {
      this.collection.each(function(item){
        item.set("visibility", "hidden");
      });
      $("#edit_diagram").show();
      this.model.set("tooltip", model.get("tooltip"));
    },
    onCloseEdit: function() {
      $("#edit_diagram").hide();
      this.collection.each(function(item){
        item.set("visibility", "visible");
      });
    }
	});

	var ActionsList = Marionette.CollectionView.extend({
		childView: ActionView,
		tagName: 'nav',
		className: 'actionCont collapsed'
	});

	var TopMenus = Marionette.LayoutView.extend({
      template: _.template("<div class='branding'></div><div class='actions actions-fw'></div>\
      <div class='actions actions-uml'></div><div class='actions actions-user'></div>\
      <div id='progressbar'><div class='pb'></div></div>"),
      regions: {
         brand: ".branding",
         actionsfw: ".actions-fw",
         actionsuml: ".actions-uml",
         user: ".actions-user"
      },
      onRender: function() {
		  this.getRegion('brand').show(new BrandView());
		  this.getRegion('actionsfw').show(new ActionsList({collection: ActionModels}));
		  this.getRegion('actionsuml').show(new DiagramActionsList({model: new Backbone.Model({tooltip: "Diagram    "}),collection: UmlActionModels}));
		  this.getRegion('user').show(new ActionsList({collection: UserActions}));
	  }
    });

    return new TopMenus();

});
