define(['jquery', 'jquery-ui/jquery-ui', 'jquery-editable'], function(jQuery, jui) {

    var dm = (function(window, undefined) {
        var dm = {};
        dm.base = {};
        dm.menu = {};
        dm.ds = {};
        dm.cs = {};
        dm.hs = {};
        dm.dm = {};
        dm.ms = {
            ctx: {},
            ds: {}
        };

        dm.at = {
            cs: {
                created: null,
                selected: null
            }
        }; // Automated testing helpers

        return dm;
    })(window);

    window['dm'] = dm;

    //export namespaces for minifier
    dm['base'] = dm.base;
    dm['menu'] = dm.menu;
    dm['ds'] = dm.ds;
    dm['cs'] = dm.cs;
    dm['es'] = dm.es;
    dm['hs'] = dm.hs;
    dm['dm'] = dm.dm;
    dm['ms'] = dm.ms;
    dm['ms']['ctx'] = dm.ms.ctx;
    dm['at'] = dm.at; //automated testing


    (function($, dm, undefined) {

        // Function to remove tags
        dm.base.convert = function(str) {
            var c = {
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;',
                '#': '&#035;'
            };
            return str.replace(/[<>'"#]/g, function(s) {
                return c[s];
            });
        };

        dm.base.opman = function(diagram) {
            this.queueLimit = 24; // Limit for count of operations.
            this.diagram = diagram;
            this.queue = new Array();
            this.revertedQueue = new Array();
            this.started = false;
            this.count = 0;
            this.processing = false;
            // skip all operations report
            // during diagram loading
            this.skipall = true;
            // Position which is equal to original
            this.savedPosition = 0;
            // last reported modificatoin state
            this.lastReportedState = false;
        }


        dm.base.opman.prototype = {
            startReporting: function() {
                this.skipall = false;
            },
            _hasModification: function(newReported) {
                // New state overwite the stable state
                if (newReported && this.queue.length == this.savedPosition) {
                    this.savedPosition = -1;
                }
                return (this.savedPosition == -1) || (this.queue.length != this.savedPosition);
            },
            notifyObserver: function(newReported) {
                // report state change
                if (this.lastReportedState != this._hasModification(newReported)) {
                    this.lastReportedState = this._hasModification(newReported);
                    this.diagram._onModified(this.lastReportedState);
                }
            },
            saveNewPosition: function() {
                this.savedPosition = this.queue.length;
                this.lastReportedState = false;
            },
            startTransaction: function() {
                if (this.skipall)
                    return;
                this.count++;
                if (this.started) {
                    return;
                }
                this.started = true;
                this.working = {};
                this.working_stack = new Array();
            },
            stopTransaction: function() {
                if (this.skipall)
                    return;

                if (!this.started) {
                    alert("Transaction was not started");
                    return;
                }

                this.count--;

                if (this.count > 0) {
                    return;
                }

                this._commitQueue();

                this.started = false;
            },
            _commitQueue: function() {
                if (Object.keys(this.working).length > 0) {
                    this.queue.push({
                        step: this.working,
                        stack: this.working_stack
                    }); // Add to the queue
                    var q = this.revertedQueue.splice(0, this.revertedQueue.length); // Revert queue
                    for (var s in q) {
                        var step = q[s].step;
                        for (var sub in step) {
                            // Check if some added element was reverted
                            if (step[sub]["add"]) {
                                var start = step[sub]["add"]["start"];
                                if (start) {
                                    this.diagram.removeElement(sub); // FINAL REMOVE, NOT RESTORABLE
                                } else {
                                    // FINAL REMOVE, NOT RESTORABLE
                                    if (start != undefined) this.diagram.removeConnectorById(sub);
                                }
                            }
                        }
                    }
                }

                this.notifyObserver(true);

                while (this.queue.length > this.queueLimit) {
                    var item = this.queue.shift();
                    var step = item.step;
                    for (var sub in step) {
                        // Check if some added element was reverted
                        if (step[sub]["remove"]) {
                            var start = step[sub]["remove"]["start"];
                            if (start) {
                                this.diagram.removeElement(sub); // FINAL REMOVE, NOT RESTORABLE
                            } else {
                                // FINAL REMOVE, NOT RESTORABLE
                                if (start != undefined)
                                    this.diagram.removeConnectorById(sub);
                            }
                        }
                    }
                    delete step;
                    delete item;
                    // It is not possible to return to original state
                    // if too many operations were done
                    if (this.savedPosition != -1)
                        this.savedPosition--;
                }

                delete this.working; // Clean the current working copy !!!
                delete this.working_stack; // Clean stack too
            },
            //
            // type : drag, resize, remove, add
            // euid : element unique id
            // options: element options which changed
            reportStart: function(type, euid, options) {
                if (this.skipall)
                    return;

                if (this.processing)
                    return;
                this.working[euid] = this.working[euid] || {};
                this.working[euid][type] = this.working[euid][type] || {};
                this.working[euid][type]["start"] = $.extend({}, this.working[euid][type]["start"], options);
                this.working_stack.push({
                    id: euid,
                    type: type
                });
            },
            reportStop: function(type, euid, options) {
                if (this.skipall)
                    return;

                if (this.processing)
                    return;
                this.working[euid] = this.working[euid] || {};
                this.working[euid][type] = this.working[euid][type] || {};
                this.working[euid][type]["stop"] = $.extend({}, this.working[euid][type]["stop"], options);
            },
            reportShort: function(type, euid, before, after) {
                if (this.skipall)
                    return;

                if (this.processing)
                    return;
                $.log("reportShort: " + euid + " OP " + type);
                this.working_stack = this.working_stack || new Array();
                this.working = this.working || {};
                this.working[euid] = this.working[euid] || {};
                this.working[euid][type] = this.working[euid][type] || {};
                this.working[euid][type]["stop"] = this.working[euid][type]["stop"] || after;
                this.working[euid][type]["start"] = this.working[euid][type]["start"] || before; // Prevent options overwrite

                this.working_stack.push({
                    id: euid,
                    type: type
                });

                // Push the result if it is not transaction
                if (!this.started) {
                    this._commitQueue();
                }
            },
            revertOperation: function() {
                if (this.skipall)
                    return;

                if (this.queue.length == 0) {
                    return; // nothing to revert !!!
                }

                function _getMethodName(prefix, string) {
                    return prefix + string.charAt(0).toUpperCase() + string.slice(1);
                }

                this.processing = true;

                var item = this.queue.pop();
                if (item) {
                    this.revertedQueue.push(item);

                    var op = item.step;

                    for (var o = item.stack.length - 1; o >= 0; --o) { // elements
                        var i = item.stack[o].id; // euid

                        var e = this.diagram.elements[i]; // it could be element or connector
                        if (e == undefined) e = this.diagram.connectors[i];

                        var j = item.stack[o].type; { // types of operation
                            var start = op[i][j]["start"];
                            if (j == "remove") {
                                this.diagram.restoreItem(i);
                            } else if (j == "add") {
                                if (start) {
                                    this.diagram.removeElement(i);
                                } else {
                                    this.diagram.removeConnectorById(i);
                                }
                            } else if (j == "option") { // CSS
                                e._setOptions(start); // revert to original state
                            } else if (j == "recon") { // CSS
                                e.from = start.fromId;
                                e.toId = start.toId;
                            } else if (j == "drop") { // CSS
                                if (e) {
                                    if (start) {
                                        var prev = this.diagram.elements[start];
                                        prev._dropped[i] = i;
                                    }
                                    if (op[i][j]["stop"]) {
                                        var next = this.diagram.elements[op[i][j]["stop"]]
                                        delete next._dropped[i];
                                    }
                                }
                            } else if (j[0] == '+') { // ADD
                                var f = j.substr(1, j.length - 1),
                                    u = _getMethodName("rm", f); // rm is oposite for add
                                if (e[u]) {
                                    e[u](start);
                                } else { // No method for item processing
                                    f += 's';
                                    var tmp = e[f].splice(start.idx, 1);
                                    delete tmp;
                                }
                            } else if (j[0] == '-') { // REMOVE
                                var f = j.substr(1, j.length - 1),
                                    u = _getMethodName("add", f); // rm is oposite for add
                                if (e[u]) {
                                    e[u](start);
                                } else {
                                    e[f + 's'].splice(start.idx, 0, start.value);
                                }
                            } else if (j[0] == '#') { // DRAGGABLE
                                var f = j.substr(1, j.length - 1),
                                    u = _getMethodName("move", f);

                                if (e[u]) {
                                    e[u](start);
                                } else {
                                    if (start.idx) {
                                        e[f + 's'][start.idx] = start.value;
                                    } else {
                                        $("#" + i + " " + j).css({
                                            left: start.left,
                                            top: start.top
                                        });
                                    }
                                }
                            } else if (j[0] == '%') { // SORTABLE
                                var f = j.substr(1, j.length - 1),
                                    u = _getMethodName("move", f); // up/down item
                                var stop = op[i][j]["stop"];
                                if (e[u]) {
                                    e[u](start, stop);
                                }
                            } else if (j[0] == '~') { // EDITABLE
                                var f = j.substr(1, j.length - 1);
                                if (start.idx) {
                                    e[f][start.idx] = start.value;
                                } else {
                                    $("#" + i + " #" + f).html(start);
                                    if (e) e.options[f] = start; // for connector's labels the "e" variable could be undefined !!!
                                }
                            }
                        }
                    }
                    this.diagram.draw();
                }
                this.processing = false;

                this.notifyObserver(false);
            },
            repeatOperation: function() {
                if (this.skipall)
                    return;

                this.processing = true;
                var item = this.revertedQueue.pop();

                function _getMethodName(prefix, string) {
                    return prefix + string.charAt(0).toUpperCase() + string.slice(1);
                }

                if (item) {
                    this.queue.push(item);
                    var op = item.step;
                    for (var o = item.stack.length - 1; o >= 0; --o) { // elements
                        var i = item.stack[o].id; // euid

                        var e = this.diagram.elements[i];
                        if (e == undefined) e = this.diagram.connectors[i];

                        var j = item.stack[o].type;
                        var stop = op[i][j]["stop"];
                        var start = op[i][j]["start"]; { // types of operation
                            if (j == "remove") {
                                if (start) {
                                    this.diagram.removeElement(i);
                                } else {
                                    if (start != undefined)
                                        this.diagram.removeConnectorById(i);
                                }
                            } else if (j == "add") {
                                this.diagram.restoreItem(i);
                            } else if (j == "option") {
                                e._setOptions(stop); // revert to original state
                            } else if (j == "recon") { // CSS
                                e.from = stop.fromId;
                                e.toId = stop.toId;
                            } else if (j == "drop") { // CSS
                                if (e) {
                                    if (stop) {
                                        var prev = this.diagram.elements[stop];
                                        prev._dropped[i] = i;
                                    }
                                    if (op[i][j]["start"]) {
                                        var next = this.diagram.elements[op[i][j]["start"]]
                                        delete next._dropped[i];
                                    }
                                }
                            } else if (j[0] == '+') {
                                var f = j.substr(1, j.length - 1),
                                    u = _getMethodName("add", f); // rm is oposite for add
                                if (e[u]) {
                                    e[u](start);
                                } else {
                                    e[f + 's'].splice(stop.idx, 0, stop.value);
                                }
                            } else if (j[0] == '-') {
                                var f = j.substr(1, j.length - 1),
                                    u = _getMethodName("rm", f); // rm is oposite for add
                                if (e[u]) {
                                    e[u](start);
                                } else { // No method for item processing
                                    f += 's';
                                    //var item = e[f].splice(start.idx, 1);
                                }
                            } else if (j[0] == '#') {
                                var f = j.substr(1, j.length - 1),
                                    u = _getMethodName("move", f);

                                if (e[u]) {
                                    e[u](stop);
                                } else {
                                    if (stop.idx) {
                                        e[f + 's'][stop.idx] = stop.value;
                                    } else {
                                        $("#" + i + " " + j).css({
                                            left: stop.left,
                                            top: stop.top
                                        });
                                    }
                                }
                            } else if (j[0] == '%') { // SORTABLE
                                var f = j.substr(1, j.length - 1),
                                    u = _getMethodName("move", f); // up/down item
                                var start = op[i][j]["start"];
                                if (e[u]) {
                                    e[u](stop, start);
                                }
                            } else if (j[0] == '~') {
                                var f = j.substr(1, j.length - 1);
                                if (stop.idx) {
                                    if (e[f]) {
                                        e[f][stop.idx] = stop.value;
                                    } else {
                                        $("#" + i + " #" + f).html(stop.value);
                                    }
                                } else {
                                    $("#" + i + " #" + f).html(stop);
                                    if (e) e.options[f] = stop;
                                }
                            }
                        }
                    }
                }
                this.processing = false;
                this.diagram.draw();

                this.notifyObserver(false);
            },
        };

        dm.base.chain = function(handler, object, method, data, sync) {
            this.handler = handler;
            this.object = object;
            this.method = method;
            this.data = data;
            this.sync = sync;
        };

        dm.base.chain.prototype = {
            run: function(callback) {
                var result = true,
                    self = this;

                do {
                    if (this.sync) {
                        // return false if chain have to be canceled
                        if (this.object && this.object[this.method]) {
                            result = this.object[this.method](data);
                            break;
                        }
                    } else {
                        if (this.object && this.object[this.method]) {
                            this.object[this.method](data, function(result) {
                                if (result && self.handler) {
                                    self.handler.run();
                                }
                            });

                        };
                        result = false;
                        break;
                    }
                } while (false);

                if (result && self.handler) {
                    this.handler.run();
                }
            }
        };

        //@export:dm.base.diagram:plain
        dm.base.diagram = function(name, base, prototype) {
            var ns = name.split("."),
                fullName = ns[0] + "-" + ns[1],
                fullPath = "dm." + name;
            namespace = ns[0],
                name = ns[1];

            if (!prototype) {
                prototype = base;
                base = dm.base.DiagramElement;
            }

            dm = dm || {};
            dm[namespace] = dm[namespace] || {};
            dm[namespace][name] = function(options, parrent) {
                // allow instantiation without initializing for simple inheritance
                if (arguments.length) {
                    options = options || {};
                    if (options['type'] == undefined)
                        options['type'] = name;
                    this._createDiagram(options, parrent);
                }
            };

            var basePrototype = new base();

            // TODO: the same options cloning happen in _CreateDiagram method
            var tmp_opt = $.extend(true, {}, basePrototype.options);
            basePrototype.options = tmp_opt;

            dm[namespace][name].prototype = $.extend(true, {}, basePrototype, {
                'namespace': namespace,
                diagramName: name,
                diagramEventPrefix: dm[namespace][name].prototype.diagramEventPrefix || name,
                'diagramBaseClass': fullPath,
                inherited: base.prototype.diagramBaseClass
            }, prototype);
        };
        //@print

        dm.base.DiagramElement = function(options, parent) {
            // allow instantiation without initializing for simple inheritance
            if (arguments.length) {
                this._createDiagram(options, parent);
            }
        };

        //@export:dm.base.DiagramElement:plain
        dm.base.DiagramElement.prototype = {
            'options': {
                'editable': true,
                'nameTemplate': 'base'
            },
            diagramBaseClass: 'dm.base.DiagramElement',
            _createDiagram: function(options, parent) {
                // extend the basic options
                var tmp_opt = $.extend(true, {}, this.options, options);
                this.options = tmp_opt;
                //this._setOptions(options); // Extended class could re-define some options setup

                //@proexp
                this.parrent = parent;
                //@proexp
                this.euid = this.options['type'] + dm.ds.diagram.ec;

                if (this.options['name'] == undefined) {
                    this.options['name'] = this.options['nameTemplate'] + dm.ds.diagram.ec;
                }
                dm.ds.diagram.ec++;

                // it is responsible for this.element instance creation
                this['_create']();

                //@overwrite
                this.element = $(this.element);

                if (this.element) {
                    // element unique id
                    $(this.element).data(this.euid, this);
                    this._baseinit();

                    var self = this;
                    $(this.element).bind("remove." + this.euid, self, function(event) {
                        event.data.destroy();
                    });

                    this['_init']();
                } else {
                    // TODO: change on even to ERROR manager !!!
                    alert("Please, declare method _create() for diagram element " + this.euid);
                }
            },

            getDescription: function(key, value) {
                var kv = !(key || value || false);
                var simple = (key && !value);

                var proto = Object.getPrototypeOf(this);
                var item = '{',
                    comma = '';
                this._update();
                for (var i in this.options) {
                    if (this.options[i] != undefined) {
                        if (proto.options[i] != undefined) {
                            if ((proto.options[i] != this.options[i]) || (['type', 'left', 'top'].indexOf(i) >= 0)) {
                                item += comma + '"' + i + '":"' + this.options[i] + '"';
                                comma = ',\n';
                            }
                        } else {
                            var obj = this.options[i];
                            if (obj instanceof Array) {
                                // simple options only
                                if (simple) {
                                    continue;
                                }

                                var c = '';
                                item += comma + '"' + i + '":[';
                                comma = ',';
                                for (var j in obj) {
                                    // Do not add element if it is not selected
                                    if (kv || (obj[j].option(key) == value)) {
                                        if (obj[j] && obj[j].getDescription) {
                                            item += c + obj[j].getDescription();
                                        } else {
                                            //item += c + '{"' + j + '":"' + obj[j] + '"}';
                                            item += c + '"' + obj[j] + '"';
                                        }
                                        c = ',';
                                    }
                                }
                                item += ']\n';
                            } else {
                                if (typeof(obj) != 'object') {
                                    item += comma + '"' + i + '":"' + obj + '"';
                                    comma = ',\n';
                                }
                            }
                        }
                    } // this.options[i] != undefined
                }
                item += '}';
                return item;
            },

            _onModified: function(flag) {
                if (this.onModified) {
                    this.onModified(this.parrent, flag);
                }
            },
            _update: function() {
                $.log("_update");
            },


            _create: function() {
                $.log("_create");
            },

            _init: function() {
                $.log("_init");
            },

            _baseinit: function() {
                $.log("_baseinit");
            },


            _destroy: function() {
                $.log("_destroy");
            },
            destroy: function() {
                this['_destroy']();

                this.element
                    .unbind("." + this.euid)
                    .removeData(this.euid);
            },

            option: function(key, value) {
                var options = key;

                if (arguments.length === 0) {
                    // don't return a reference to the internal hash
                    return $.extend({}, this.options);
                }

                if (typeof key === "string") {
                    if (value === undefined) {
                        return this.options[key];
                    }
                    options = {};
                    options[key] = value;
                }

                this._setOptions(options);

                return this;
            },

            _setOptions: function(options) {
                var self = this;
                for (var r in options) {
                    self._setOption(r, options[r]);
                }
            },

            _setOption: function(key, value) {
                this.options[key] = value;
                // TODO: REDIRECT ON inherited function !!!
            },
        };

        //@print

        /**
         * jQuery.dm.base.diagram class.
         * The base class for all diagrams types. It is consist of base div which has
         * canvas, element and connector childs.
         * Options could be overwritten via heritage mehanizm - dm.base.diagram or
         * on diagram creation or via JSON description which provided as argument of
         * constructor
         * \jsonDesc - JSON description of diagram. It could consist of diagram
         *             specific desciption and elements and connectors JSON
         * \parrent  - The parrent element reference, which diagram should be
         *             attached
         */
        //@export:dm.ds.diagram
        dm.base.diagram("ds.diagram", {
            'options': {
                'nameTemplate': 'diagram',
                'type2': 'diagram', // hack while we do not have a project manager
                'editable': true
            },

            _create: function() {
                //<div class="us-canvas-bg" style="width:' + this.options['width'] + 'px;height:' + this.options['height'] + 'px">
                //this.options.multicanvas = true; ~ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! USES for DROP SOME NODES FROM DYNATREE
                if (this.options.multicanvas) {
                    var p = this._getDiagramSize(this.options);
                    var sx = false,
                        sy = false; // Scroll X and Y correspondingly
                    // Alignement of the parent frame by width and height
                    var $par = $(this.parrent);
                    // if width undefined or smaller than canvas
                    if (!this.options.width || parseInt(this.options.width) < p.width) {
                        $par.width(this.options.width);
                        sx = true;
                    } else {
                        $par.width(p.width + 30);
                    }

                    if (!this.options.height || parseInt(this.options.height) < p.height - 40) {
                        $par.height(this.options.height);
                        sy = true;
                    } else {
                        $par.height(p.height + 40);
                    }
                    // Parent setup complete

                    this.canvasEuid = this.euid + '_Canvas';
                    this.element = $(this.parrent).append('<div id="' + this.euid + '" class="us-diagram" width="100%" height="100%">\
          <canvas id="' + this.euid + '_Canvas" class="us-canvas" width=' + p.width + 'px height=' + p.height + 'px>\
          <p>Unfortunately your browser doesn\'t support canvas.</p></canvas>\
          <div class="us-canvas-bg" style="width:100%;height:100%;">\
          </div></div>');

                    $.log("=========================== NAME: #" + this.euid + ".us-diagram");
                    $("#" + this.euid + ".us-diagram").css({
                        "overflow-x": (sx ? "scroll" : "hidden"),
                        "overflow-y": (sy ? "scroll" : "hidden")
                    });

                } else {
                    this.element = $(this.parrent).append('<div id="' + this.euid + '" class="us-diagram" width="100%" height="100%">\
          <div class="us-canvas-bg" style="width:100%;height:100%;">\
          </div></div>');
                    this.canvasEuid = 'SingleCanvas';
                }
                this.canvas = window.document.getElementById(this.canvasEuid);
                this.max_zindex = 100;

                // Diagram canvas drop element
                // It is not necessary for regular usage
                // TODO: make it as a separate functionality which glue
                //       file tree and diagram engine

                var iDiagram = this;
                $("#" + this.euid + ".us-diagram").scroll(function() {
                    iDiagram.draw();
                });

                if ($("#" + this.canvasEuid).attr("init") != "true") {
                    $("#" + this.canvasEuid).droppable({
                            drop: function(event, ui) {
                                var iDiagram = dm.dm.fw.getActiveDiagram();
                                // do nothing
                                if (iDiagram == null)
                                    return;

                                var source = ui.helper.data("dtSourceNode"); // dynatree node
                                var thisOffset = $(this).offset();
                                if (!source)
                                    return;
                                $.log("source: " + source.data.addClass);
                                if (source.data.addClass == "iconclass" || source.data.addClass == "iconinterface") {
                                    var key = "",
                                        separator = "",
                                        filenode = source,
                                        isInterface = source.data.addClass == "iconinterface";
                                    if (source.data.description) {
                                        key = source.data.description;
                                    } else {
                                        while ((filenode.data.addClass == 'iconinterface') ||
                                            (filenode.data.addClass == 'iconclass') ||
                                            (filenode.data.addClass == 'namespace')) {
                                            key = filenode.data.title + separator + key;
                                            separator = "::";
                                            filenode = filenode.parent;
                                        }
                                    }

                                    if (iDiagram.options['type'] == "sequence") {
                                        var element = {
                                            'viewid': source.data.viewid,
                                            type: "objinstance"
                                        };
                                        element.pageX = ui.position.left - thisOffset.left;
                                        element.left = element.pageX;
                                        element.name = key;
                                        element.filepath = filenode.getAbsolutePath();
                                        var ename = iDiagram.Element(element.type, element);
                                        return;
                                    }

                                    if (iDiagram.options['type'] == "component") {
                                        var element = {
                                            'viewid': source.data.viewid
                                        };
                                        element.type = (isInterface) ? "interface" : "component";
                                        element.left = ui.position.left - thisOffset.left;
                                        element.top = ui.position.top - thisOffset.top;
                                        element.name = key;
                                        element.filepath = filenode.getAbsolutePath();
                                        var ename = iDiagram.Element(element.type, element);
                                        return;
                                    }
                                    if (iDiagram.menuIcon != undefined) {
                                        var element = {
                                            'viewid': source.data.viewid,
                                            type: "class"
                                        };

                                        if (element != undefined) {
                                            element.left = ui.position.left - thisOffset.left;
                                            element.top = ui.position.top - thisOffset.top;
                                            element.name = key;
                                            if (isInterface) element.aux = "interface";
                                            element.filepath = filenode.getAbsolutePath();
                                            var ename = iDiagram.Element(element.type, element);
                                        }
                                    } else {
                                        iDiagram.Element("class", {
                                            name: source.data.title,
                                            filepath: source.getAbsolutePath(),
                                            editable: true,
                                            'viewid': source.data.viewid
                                        });
                                    }
                                } else if (source.data.addClass == "diagramclass") {
                                    // Add sub-diagram to element
                                    $.eee = ui;
                                    $.uuu = event;
                                    iDiagram._dropSubDiagram(source.getAbsolutePath(), event, ui);
                                } else if (source.data.isFs) {
                                    if (iDiagram.options['type'] == "component") {
                                        var element = {
                                            'viewid': source.data.viewid,
                                            type: "component"
                                        };
                                        if (element != undefined) {
                                            element.left = ui.position.left - thisOffset.left;
                                            element.top = ui.position.top - thisOffset.top;
                                            element.name = source.data.title;
                                            element.filepath = source.getAbsolutePath();
                                            var ename = iDiagram.Element(element.type, element);
                                            return;
                                        }
                                    }
                                    var element = {
                                        'viewid': source.data.viewid,
                                        type: "package"
                                    };

                                    if (element != undefined) {
                                        element.name = source.data.title;
                                        element.left = ui.position.left - thisOffset.left;
                                        element.top = ui.position.top - thisOffset.top;
                                        element.filepath = source.getAbsolutePath();
                                        var ename = iDiagram.Element(element.type, element);
                                    }

                                }
                            }
                        })
                        .attr("init", "true");
                }

                /** Canvas extra functionality handling:
                 *   1. Hide resize GUI helpers on canvas click
                 *   2. Position locator is debug functionality
                 *   3. Mouse Up/Down for connector stransforms perform
                 */
                var diag = this;
                $("#" + this.euid)
                    .dblclick(function(e) {
                        e.preventDefault();
                        $.log("DBL CLICK");
                        e.stopPropagation();
                    })
                    .click(function(evt) {
                        $.log("clicked");
                        // it could be undefined !!!
                        //$("#tabs #us-editable").hide();
                        diag._setWidgetsOption("selected", false);

                        // Work-around for references
                        $("#" + diag.euid + " .us-references").hide();
                        // hide all context menus
                        $(".context-menu").hide();
                        // hide the color picker's menu
                        $(".us-context-toolbox").hide();
                        /*
                             // Hide elements selectors on click
                             //$(".ui-resizable-handle").css({'visibility':'hidden'});

                             // Hack to notify about click
                             //if (diag.clickedconntector) {
                               diag.clickedconntector.selected = false;
                             }

                             if (diag.selectedconntector) {
                               if (diag.clickedconntector != diag.selectedconntector) {
                                 diag.clickedconntector = diag.selectedconntector;
                               }

                               diag.selectedconntector.selected = true;

                               if (diag.selectedconntector._showMenu)
                                 diag.selectedconntector._showMenu(x, y, true, diag.selectedconntector);
                             } else {
                               diag.clickedconntector = undefined;
                             }
                             this.selectedElement = undefined;
                         */
                        diag.draw();
                        evt.stopPropagation();
                    })

                .mousemove(function(e) { // DEBUG FUNCTIONALITY.
                        var p = $(this).offset(),
                            x = e.pageX - p.left,
                            y = e.pageY - p.top;
                        var status = diag.isPointOnLine(x, y);
                        if (status) {
                            dm.at.mouse = dm.at.mouse || {};
                            dm.at.mouse.x = x;
                            dm.at.mouse.y = y;
                            //$("#possition_locator").val("X:" + x + "  y:" + y + " on");
                            e.stopPropagation();
                        }
                    })
                    .mouseup(function(e) {
                        var p = $(this).offset(),
                            x = e.pageX - p.left,
                            y = e.pageY - p.top;
                        diag.stopConnectorTransform(x, y);
                    })
                    .mousedown(function(e) {

                        var p = $(this).offset(),
                            x = e.pageX - p.left,
                            y = e.pageY - p.top;

                        // Selenium can't clickAndHold at concreate position
                        if (x < 1 && y < 1) {
                            x = dm.at.mouse.x;
                            y = dm.at.mouse.y;
                        }

                        if (e.which != 3) {
                            diag.startConnectorTransform(x, y);
                        }

                        if ((diag.selectedconntector) &&
                            (!dm['dm']['fw']['CtrlDown'])) {
                            diag.selectedconntector._setOption("selected", true);
                            e.stopPropagation();
                        }
                    })
                    .bind('contextmenu', function(e) {
                        $.log("CONTEXT MENU PRESSED !!!");
                        if (diag.selectedconntector && diag.menuCtx) {
                            diag.menuCtx['hideAll']();
                            diag.menuCtx['visit'](diag.selectedconntector, e.pageX, e.pageY);
                            e.preventDefault();
                            diag.multipleSelection = true; // work around to hide connector selection on click
                        }
                    })

                ;

                // create an empty lists for connectors and elements
                this.connectors = [];
                this.elements = [];

                this.removedConnectors = [];
                this.removedElements = [];

                // For all elements in JSON description try to create an element
                for (var i in this.options['elements']) {
                    // How to get options which described in menu JSON ?
                  this.Element(this.options['elements'][i].type, this.options['elements'][i]);
                }

                // For all connectors in JSON description try to create a connector
                for (var i in this.options['connectors']) {
                    this.options['connectors'][i]['stored'] = true;
                    this.Connector(this.options['connectors'][i]['type'], this.options['connectors'][i]);
                    // TODO: find elements IDs and add connectors between elements
                    //       How to handle use-case when connector created,
                    //                               but element was not creat yet?
                    // TODO: think about queued operations which could be loaded
                    //       sequentially even if one should be loaded but another
                    //       one already exists
                }

                // Perform function on diagram load completion
                dm.dm.loader.OnLoadComplete(function() {
                    diag.opman.startReporting();
                    for (var i in diag.elements) {
                        var d = diag.elements[i].options['dropped'];
                        if (d) {
                            diag.elements[i]._dropped = {};
                            for (var ii in d) {
                                for (var iii in diag.elements) {
                                    if (diag.elements[iii].options['id'] == d[ii]) {
                                        var idd = diag.elements[iii].euid;
                                        diag.elements[i]._dropped[idd] = idd;
                                        break; // from the neares for
                                    }
                                } // iii
                            } // ii
                        }
                    } // i
                });

                this.opman = new dm.base.opman(this);

                if (this.options.force) {
                    dm.dm.loader.OnLoadComplete(function(self) {
                        var x = 0,
                            y = 0;
                        for (var r in self.elements) {
                            var z = parseInt(self.elements[r].options.pageY) + parseInt(self.elements[r].options.height);
                            y = (z > y) ? z : y;
                            z = parseInt(self.elements[r].options.pageX) + parseInt(self.elements[r].options.width);
                            x = (z > x) ? z : x;
                        }
                        x += 40;
                        y += 40;
                        $(self.parrent).css('height', y).css('width', x).css('margin', '0 auto')
                            .children('.us-diagram').css('background-image', 'none').css('overflow', 'hidden');
                        self.canvas.width = x;
                        self.canvas.height = y;
                    }, this);
                }

            },

            getSvgDescription: function() {
                this._update();
                var desc = '<?xml version="1.0" encoding="utf-8" ?>\n<svg umlsync="v1.0" baseProfile="full" height="100%" version="1.1" width="100%" xmlns="http://www.w3.org/2000/svg" xmlns:ev="http://www.w3.org/2001/xml-events" xmlns:xlink="http://www.w3.org/1999/xlink">\n<desc>' + this.getDescription(true) + '</desc>\n<g id="elements" fill="#ECF3EC" stroke="black" stroke-width="1" style="font-size:11px;font-family:Verdana,Arial,sans-serif;">\n';

                for (var v in this.elements) {
                    // each element is group
                    desc += '<g id="' + this.elements[v].options.type + '-' + this.elements[v].options.id + '">\n<desc>' + this.elements[v].getDescription() + '</desc>\n';
                    if (this.elements[v].getSvgDescription) {
                        desc += this.elements[v].getSvgDescription();
                    }
                    desc += '</g>\n';
                }
                desc += '</g>\n';

                desc += '<g id="connectors" fill="none" stroke="black" stroke-width="1">\n';
                for (var v in this.connectors) {
                    if (this.connectors[v].getSvgDescription) {
                        desc += this.connectors[v].getSvgDescription();
                    }
                }
                desc += '</g>\n';
                desc = desc + '</svg>';
                return desc;
            },

            _update: function() {
                this.options['connectors'] = this.connectors;
                var i = 0;
                for (var r in this.elements) {
                    this.elements[r].options['id'] = i;
                    i++;
                }
                this.options['elements'] = this.elements;

            },


            _init: function() {
                // It is necessary to init mouse over listener
                // to detect connections types
            },
            _destroy: function() {
                if (this.onDestroyObserver) {
                    this.onDestroyObserver();
                }
            },
            onDestroy: function(func) {
                this.onDestroyObserver = func;
            },
            //
            //
            //
            _getDiagramSize: function(json) {
                var w = 100,
                    h = 100;
                if (json) {
                    for (var v in json.elements) {
                        var e = json.elements[v];
                        var tmp = parseInt(e.left) + parseInt(e.width);
                        if (w < tmp) {
                            w = tmp;
                        }
                        tmp = parseInt(e.top) + parseInt(e.height);
                        if (h < tmp) {
                            h = tmp;
                        }
                    }
                    for (var v in json.connectors) {
                        for (var c in json.connectors[v].epoints) {
                            var p = json.connectors[v].epoints[c];
                            if (w < parseInt(p["0"])) {
                                w = parseInt(p["0"]);
                            }
                            if (h < parseInt(p["1"])) {
                                h = parseInt(p["1"]);
                            }
                        }
                    }
                } else {
                    // TODO: redraw.
                }
                return {
                    width: w,
                    height: h
                };
            },
            /**
             * \class Function.
             * Create an element with \eid and unique name.
             * Call element load if was not create.
             * \uid Unique element type ID which corresponding to JS class
             * \options Extra options which overwrite base class options
             * \jsonDesc - JSON which could understand loaded element JS class
             *
             * Note: for now we use ElementLoaded callback method which doesn't
             *       required at all.
             *       TODO: provide ElementLoaded functionality as
             *             argument-function of loader.Element
             */

            Element: function(type, options, callback) {
                if (this.options.acceptElements) {
                    if (this.options.acceptElements.indexOf(type) >= 0) {} else {
                        $.log(type + " is not in the list of accepted elements");
                        return;
                    }
                }
                dm.ds.diagram.ec++;
                options = options || {};

                var self = this;
                self.max_zindex++;
                options["z-index"] = self.max_zindex; //options["z-index"] || ();
                options["ctx_menu"] = options["ctx_menu"] || "default"; //options["z-index"] || ();

                dm.dm.loader['Element'](type, options, this, function(obj) {
                    if (obj != undefined)
                        self.elements[obj.euid] = obj;

                    self.opman.reportShort("add", obj.euid, true);

                    if (callback)
                        callback(obj);
                });

                // If it is editable diagram
                if (this.options['editable']) {

                    // Load the context menu for element
                    if (this.menuCtx) {
                        this.menuCtx['load'](options.type, this);
                    }

                    // Load the icons menu for element
                    if (this.menuIcon != undefined) {
                        this.menuIcon['load'](type, this);
                    }
                }

                return options.euid;
            },


            _setWidgetsOption: function(key, value) {
                if (key == "selected") {
                    this.multipleSelection = value;
                    for (var i in this.elements) {
                        this.elements[i]._setOption(key, value);
                    }
                    for (var i in this.connectors) {
                        this.connectors[i]._setOption(key, value);
                    }

                    this.selectedElement = undefined;
                    this.selectedConnector = undefined;

                } else if (key == "z-index") { // Z-index supported by elements only (not applicable for connectors)
                    var newmax = this.max_zindex,
                        min_z = undefined,
                        max_z = undefined,
                        min_not_selected_z = undefined;
                    // Identify the minimal z-index in selection
                    for (var i in this.elements) {
                        var r = this.elements[i].option(key);
                        if (this.elements[i].option("selected")) {
                            min_z = ((min_z == undefined) || r < min_z) ? r : min_z;
                            max_z = ((max_z == undefined) || r > max_z) ? r : max_z;
                        } else
                            min_not_selected_z = ((min_not_selected_z == undefined) || r < min_not_selected_z) ? r : min_not_selected_z;
                    }

                    if ((min_not_selected_z == undefined) || (min_z == undefined))
                        return; // all or nothing selected; nothing to relocate;

                    $.log("Min Z-INDEX: " + min_z);
                    var flag = (value == "front") ? true : false;
                    for (var i in this.elements)
                        if (this.elements[i].option("selected")) {
                            if (flag) {
                                var zi = this.elements[i].option(key) + this.max_zindex - min_z + 1;
                                $.log("new Z-INDEX: " + zi + " D: " + this.elements[i].option(key));
                                this.elements[i]._setOption(key, zi);
                                if (zi > newmax)
                                    newmax = zi;
                            }
                        } else {
                            if (!flag) {
                                var zi = this.elements[i].option(key) - min_not_selected_z + max_z + 1;
                                $.log("new2 Z-INDEX: " + zi + " D: " + this.elements[i].option(key));
                                this.elements[i]._setOption(key, zi);
                                if (zi > newmax)
                                    newmax = zi;
                            }
                        }
                    this.max_zindex = newmax + 1;
                } else if (key == "editable") {
                    if (this.options[key] != value) {
                        this.options[key] = value;
                        for (var i in this.elements) {
                            this.elements[i]._setOption(key, value);
                        }
                        for (var i in this.connectors) {
                            this.connectors[i]._setOption(key, value);
                        }
                        if (!value) {
                            if (this.menuIcon != undefined)
                                this.menuIcon['Disable'](this.euid);
                            if (this.menuCtx != undefined)
                                this.menuCtx['hideAll']();
                        }
                    }
                } else {
                    var isSel = ("selected" != key);
                    isSel && this.opman.startTransaction();
                    for (var i in this.elements)
                        if (this.elements[i].option("selected")) {
                            var opb = {},
                                opa = {};
                            opb[key] = this.elements[i].options[key];
                            opa[key] = value;
                            isSel && this.opman.reportShort("option",
                                this.elements[i].euid,
                                opb,
                                opa);
                            $.log("SET KEY : " + key + "  VALUE : " + value);
                            this.elements[i]._setOption(key, value);
                        }
                    for (var i in this.connectors)
                        if (this.connectors[i].option("selected")) {
                            opb[key] = this.connectors[i].options[key];
                            opa[key] = value;
                            if (this.connectors[i]._setOption(key, value)) { // FALSE if option not supported
                                isSel && this.opman.reportShort("option",
                                    this.elements[i].euid,
                                    opb,
                                    opa);
                            };
                        }

                    isSel && this.opman.stopTransaction();

                }

                this.draw(); // work-around to re-draw connectors after options update
            },

            /**
             * \class Function.
             * TODO: think about lifeline diagram
             */

            checkdrop: function(x, y) {
                for (var d in this.elements) {
                    var p = $("#" + this.elements[d].euid + "_Border").position();

                    if ((x > p.left) && (x < p.left + 140) && (y > p.top) && (y < p.top + 140)) {
                        return this.elements[d].euid;
                    }
                }
                return undefined;
            },
            setDropHelper: function(dh) {
                if (dh == undefined) {
                    delete this.dropHelper;
                    $("#" + this.euid + " .us-element-border").draggable("option", "helper", 'original');
                    return;
                }
                this.dropHelper = dh;
                $("#" + this.euid + " .us-element-border").draggable("option", "helper", function(event) {
                    return $("<div id='ConnectionHelper_Border' style='border:solid black;border-width:1px;'>\
          <div id='ConnectionHelper' style='border:solid yellow;border-width:1px;'> [ x ]</div></div>");
                });
            },

            /**
             * \class Function.
             */

            setMenuBuilder: function(type, menu) {
                if (type == "main") {

                    this.menuMain = menu;
                }
                if (type == "context") {

                    this.menuCtx = menu;
                }
                if (type == "icon") {

                    this.menuIcon = menu;
                }

            },


            removeSelectedElements: function() {
                var el = this.elements;
                this.opman.startTransaction();
                for (var k in el) {
                    if (el[k].options.selected) {
                        var euid = el[k].euid;
                        this.removeConnector(el[k].euid, undefined);
                        this.removeConnector(undefined, el[k].euid);
                        this.removeElement(el[k].euid);
                    }
                }
                this.opman.stopTransaction();
            },

            removeElement: function(euid) {
                var el = this.elements;

                // REMOVE ELEMENT FINALLY !!!
                if (this.removedElements[euid]) {
                    $.log("REMOVING: " + euid);
                    $('#' + euid + '_Border').remove();
                    delete this.removedElements[euid];
                    return;
                }

                for (var k in el) {
                    if (el[k]._dropped != undefined) {
                        for (var gg in el[k]._dropped) {
                            if (gg == euid || el[k]._dropped[gg] == euid) {
                                this.opman.reportShort("drop", euid, k, undefined);
                                delete el[k]._dropped[gg]; // remove element from dropped
                                //break; // element could be dropped into one element only
                            }
                        }
                    }
                }

                // Hide icon menu to prevent icon menu usage after element removal
                this.menuIcon['Disable'](euid);

                this.opman.reportShort("remove", euid, true);

                this.removedElements[euid] = el[euid];
                delete el[euid];

                $('#' + euid + '_Border').hide(); //remove(); // Think about removal !!!!
            },

            /**
             * \class Function.
             * remove connector from the list of updatable connectors
             * if fromId or toId is undefined than remove
             * all elements to or from element
             * if both Ids are undefined than remove all connectors
             */

            removeConnector: function(fromId, toId, type) {

                if (Object.keys(this.connectors).length > 0) {
                    for (var c in this.connectors) {
                        if (((this.connectors[c]['from'] == fromId) || (fromId == undefined)) &&
                            ((this.connectors[c]['toId'] == toId) || (toId == undefined))) {
                            this.removeConnectorById(c);
                        }
                    }
                    this.draw();
                }

            },
            removeConnectorById: function(euid) {
                if (this.removedConnectors[euid]) {
                    for (var i in this.removedConnectors[euid].labels) {
                        this.removedConnectors[euid].labels[i].remove();
                    }
                    delete this.removedConnectors[euid];
                    return;
                }

                for (var i in this.connectors[euid].labels) {
                    this.connectors[euid].labels[i].hide();
                }
                this.removedConnectors[euid] = this.connectors[euid];
                if (this.removedConnectors[euid].options.toId != 'ConnectionHelper') {
                    this.opman.reportShort("remove", euid, false);
                }
                delete this.connectors[euid];
            },
            restoreItem: function(euid) {
                if (this.removedConnectors[euid]) {
                    this.connectors[euid] = this.removedConnectors[euid];
                    delete this.removedConnectors[euid];
                    for (var l in this.connectors[euid].labels) {
                        this.connectors[euid].labels[l].show();
                    }
                }
                if (this.removedElements[euid]) {
                    this.elements[euid] = this.removedElements[euid];
                    $("#" + euid + "_Border").show();
                    delete this.removedElements[euid];
                }
            },


            /**
             * \class Function.
             * Load and create a connector instance.
             * TODO: Why we do not use clallback method in that case ?
             *       How to load connector correctly ?
             *
             */

            Connector: function(type, options, callback) {
                // Loader is responsible for connector creation
                var self = this;

                dm.dm.loader['Connector'](type, options, this, function(connector) {
                    if (connector != undefined // Failed to create connector
                    ) {
                        // If something wrong happened to the
                        // connectable elements
                        if (!connector["from"] // Failed to load "from" element
                            ||
                            !connector["toId"]) { // Failed to load "to" element
                            delete connector;
                            return;
                        }

                        self.connectors[connector.euid] = connector;
                        if (connector.options.toId != 'ConnectionHelper') {
                            $.log("REPORT: " + connector.options.toId + "   FROM : " + connector.options.fromId);

                            self.opman.reportShort("add", connector.euid, false);

                        }

                        self.draw();
                        if (callback)
                            callback(connector);
                    }
                });
            },


            _dropConnector: function(ui) {
                var result = undefined,
                    scrollLeft = $("#" + this.euid).scrollLeft(),
                    scrollTop = $("#" + this.euid).scrollTop();
                for (var i in this.elements) {
                    if (this.elements[i].options.single)
                        continue;

                    var e = $("#" + this.elements[i].euid + "_Border");
                    var p = e.position(),
                        w = e.width(),
                        h = e.height();

                    if ((ui.position.left > p.left + scrollLeft) &&
                        (ui.position.left < p.left + w + scrollLeft) &&
                        (ui.position.top > p.top + scrollTop) &&
                        (ui.position.top < p.top + h + scrollTop)) {
                        result = this.elements[i];
                    }
                }
                return result;
            },

            _dropSubDiagram: function(path, event, ui) {
                var d, z = 0;
                for (var i in this.elements) {
                    var e = $("#" + this.elements[i].euid + "_Border");
                    var p = e.offset(),
                        w = e.width(),
                        h = e.height();
                    $.log("UI: " + ui.position.left + "  " + ui.position.top + "  P:" + p.left + "  " + p.top);
                    if ((ui.position.left > p.left) &&
                        (ui.position.left < p.left + w) &&
                        (ui.position.top > p.top) &&
                        (ui.position.top < p.top + h)) {
                        if (this.elements[i].option("z-index") > z) {
                            z = this.elements[i].option("z-index");
                            d = this.elements[i];
                        }
                    }
                }

                if (d != undefined) {
                    if (d.options['subdiagrams'] != undefined) {
                        d.options['subdiagrams'] = path;
                        $("img#" + d.euid + "_REF").attr('title', path);
                        return;
                    }
                    d.options['subdiagrams'].push(path);

                    var self = this;
                    $("img#" + d.euid + "_REF").attr('title', path).click(function() {
                        var path = $(this).attr("title");
                        if (path != "") {
                            dm.dm.fw['loadDiagram'](self.options['viewid'], {
                                getAbsolutePath: function() {
                                    return path;
                                }
                            });
                        }
                    });
                }
            },

            _dropElement: function(element, ui) {
                var eeuid = element.euid;
                var prev, next;
                for (var i in this.elements) {
                    if (this.elements[i].options['acceptdrop'] &&
                        (this.elements[i].euid != eeuid)) {
                        var e = $("#" + this.elements[i].euid + "_Border");
                        var p = e.position(),
                            w = e.width(),
                            h = e.height();

                        if ((ui.position.left > p.left) &&
                            (ui.position.left < p.left + w) &&
                            (ui.position.top > p.top) &&
                            (ui.position.top < p.top + h)) {
                            this.elements[i]._dropped = this.elements[i]._dropped || {};
                            if (this.elements[i]._dropped[eeuid] == undefined) { // prevent double insertion of element
                                $.log("DRRRRRRRRRRRRROP: " + eeuid + "   INTO: " + this.elements[i].euid);
                                this.elements[i]._dropped[eeuid] = eeuid;
                                next = i;
                            }
                        } else {
                            if (this.elements[i]._dropped != undefined && this.elements[i]._dropped[eeuid] != undefined) { // prevent double insertion of element
                                delete this.elements[i]._dropped[eeuid]; // clean previous drop value of element
                                if (this.elements[i]._dropped[eeuid] != undefined) {
                                    alert("NOT REMOVED !!!");
                                }
                                prev = i;
                                //this.elements[i]._dropped.splice(eeuid, 1);
                            }
                        }
                    }
                }
                if (prev != next) { // both undefined
                    this.opman.reportShort("drop", eeuid, prev, next);
                }
            },


            onElementDragStart: function(el, ui) {
                this.opman.startTransaction();

                // Add one more option, therefore get the list of options first !!!
                el.onDragStart(ui);


                if (this.multipleSelection)
                    for (var i in this.elements) {
                        var ee = this.elements[i];
                        if (ee != el &&
                            ee.option("selected") &&
                            ee.option("dragStart") == undefined) {
                            ee.onDragStart(ui);
                        }
                    }

                for (var i in this.connectors)
                    if (this.elements[this.connectors[i]['from']].option("dragStart") &&
                        this.elements[this.connectors[i]['toId']].option("dragStart"))
                        this.connectors[i].onDragStart(ui);

            },


            onElementDragMove: function(el, ui) {
                for (var i in this.elements)
                    if (this.elements[i].option("dragStart") != undefined &&
                        this.elements[i] != el)
                        this.elements[i].onDragMove(ui);
                for (var i in this.connectors)
                    if (this.connectors[i].option("dragStart"))
                        this.connectors[i].onDragMove(ui);
            },

            onElementDragStop: function(el, ui) {
                el.onDragStop(ui);
                for (var i in this.elements) {
                    var ee = this.elements[i];
                    if (ee.option("dragStart") != undefined &&
                        ee != el) {
                        ee.onDragStop(ui);
                    }
                }

                for (var i in this.connectors)
                    if (this.connectors[i].option("dragStart"))
                        this.connectors[i].onDragStop(ui);

                this.opman.stopTransaction();
            },


            /**
             * \class Function.
             * Clear the canvas rectangle and re-draw
             * all connectors on the Canvas.
             */

            draw: function() {
                if (!this.canvas)
                    return;
                var ctx = this.canvas.getContext("2d");

                ctx.fillStyle = "#EEEEEE"; //"rgba(140,140,140,1)";
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                if (Object.keys(this.connectors).length > 0) {
                    //    ctx.strokeRect(0, 0, 1000, 500);


                    for (var c in this.connectors) {
                        ctx.lineWidth = 1;

                        if (this.connectors[c].options['linewidth'] != undefined) {
                            ctx.lineWidth = this.connectors[c].options['linewidth'];
                        }

                        if (this.connectors[c].options['selected']) {
                            ctx.lineWidth += 2;
                            this.connectors[c].redraw(ctx, "#43EC28");
                            ctx.lineWidth -= 2;
                            this.connectors[c].redraw(ctx);
                        } else if (this.selectedconntector == this.connectors[c]) {
                            this.connectors[c].redraw(ctx, "#43EC28");

                        } else {
                            if (this.connectors[c].options['color'])
                                this.connectors[c].redraw(ctx, this.connectors[c].options['color']);
                            else
                                this.connectors[c].redraw(ctx);
                        }
                    }
                    ctx.lineWidth = 1;
                }
            },
            /**
             * \class Function.
             * Check that point is on the line.
             * It is necessary to hightlight connectors on mouseover
             * and it seems that capability of browser is good enought
             * to support such actions
             */

            isPointOnLine: function(x, y) {
                if (Object.keys(this.connectors).length > 0) {
                    if (this.transformStarted == true) {
                        this.selectedconntector.TransformTo(x, y);
                        this.draw();
                        return true;
                    }
                    for (var c in this.connectors) {
                        if (this.connectors[c].isPointOnLine(x, y)) {
                            if (this.connectors[c] != this.selectedconntector) {
                                this.selectedconntector = this.connectors[c];
                                this.draw();
                            }
                            return true;
                        }
                    }
                }

                // Hide selected connector
                // because it is no longer highlited
                if (this.selectedconntector != undefined) {
                    if (this.selectedconntector._showMenu != undefined) {
                        this.selectedconntector._showMenu(x, y, false);
                    }
                    this.selectedconntector = undefined;
                    dm.at.cs.mouseover = null;
                    this.draw();
                }

                return false;
            },

            /**
             * \class Function.
             * The connector transfomation function.
             */

            startConnectorTransform: function(x, y) {
                if (this.selectedconntector != undefined) {
                    this.transformStarted = true;
                    this.selectedconntector.startTransform(x, y);
                }
            },
            /**
             * \class Function.
             * The connector transfomation function.
             */

            stopConnectorTransform: function(x, y) {
                if ((this.transformStarted == true) &&
                    (this.selectedconntector != undefined))
                    this.selectedconntector.stopTransform(x, y);
                this.transformStarted = false;
            },

            setSnippetMode: function(mode, ISnippetObserver) {
                this.ISnippetObserver = ISnippetObserver;
                if (this.snippetMode != mode && this.snippetMode) {
                    this.snippetMode = mode;
                    if (this.activeSnippet) {
                        var val3 = $(this.activeSnippet + " p").text();
                        $(this.activeSnippet).remove();
                        this.activeSnippet = null;
                        return val3;
                    } else {
                        return null;
                    }
                }
                this.snippetMode = mode;
            },

            showSnippetBubble: function(activeElement) {
                if (activeElement == undefined) {
                    return;
                }
                var p = $("#" + activeElement.euid + "_Border").position();
                p.left += $("#" + activeElement.euid + "_Border").width();
                p.top += $("#" + activeElement.euid + "_Border").height();

                this.ISnippetObserver.onSnippetClick(p); // left and top
            },

            /**
             * \class Function.
             */

            _mouseClick: function(refElement) {
                var mtype = (refElement == undefined) ? undefined : refElement.options['type'];
                var ctrlDown = dm['dm']['fw']['CtrlDown'];
                this.clickedElement = refElement;

                if (this.snippetMode) {
                    this.showSnippetBubble(refElement);
                }

                // Hide all context menus
                if (this.menuCtx)
                    this.menuCtx['hideAll']();

                // Nothing to add for multiple selection
                if (ctrlDown) {
                    $.log("Ctl Down");
                    if (refElement == undefined) {
                        $.log("ref element undefined");
                        return;
                    }

                    if ((this.selectedElement != undefined) &&
                        (this.selectedElement != refElement)) {
                        if (this.menuIcon != undefined)
                            this.menuIcon['Disable'](this.selectedElement);
                    }

                    if (refElement != undefined) {
                        $.log("ref element is: " + refElement.euid + " OPT: " + refElement.option("selected"));
                        refElement._setOption("selected", (refElement.option("selected") ? false : true));
                    }
                    this.multipleSelection = true;
                    this.selectedElement = undefined;
                    return;
                }

                if (this.multipleSelection) {
                    $.log("SET WG OPTIONS");
                    this._setWidgetsOption("selected", false);
                    this.multipleSelection = false;
                }

                // Do not hide menu if it is the same element
                if ((refElement == undefined) || (this.selectedElement != refElement)) {
                    if (this.selectedElement != undefined) {
                        this.selectedElement._setOption("selected", false);
                    }

                    // If element icon menu exists
                    if (this.menuIcon != undefined) {
                        // Disable icon menu for the current element
                        if (this.selectedElement != undefined)
                            this.menuIcon['Disable'](this.selectedElement);

                        if (refElement != undefined && this.options.editable) {
                            // Enable menu for the newely selected element
                            if (mtype != undefined) {
                                this.menuIcon['Enable'](refElement);
                            }
                            this.menuIcon['Show'](refElement);
                        }
                    }

                    this.selectedElement = refElement;
                    if (refElement == undefined) {
                        this.selectedElement = refElement;
                        return;
                    }

                    // Hide selected elements and hightlight selected only
                    this.selectedElement._setOption("selected", true);
                    this.draw();
                }

            },
            //
            // Save the current operation manager state
            // and use it to check that content was modified or not
            //
            saveState: function() {
                // Save the current position
                this.opman.saveNewPosition();
            },
            //
            // on focus handler
            //
            onFocus: function(flag) {
                if (flag) {
                    this.draw();
                    if (this.menuIcon) {
                        if (this.selectedElement) {
                            this.menuIcon['Enable'](this.selectedElement);
                        }
                    }
                } else {
                    if (this.selectedElement) {
                        this.menuIcon['Disable'](this.selectedElement);
                    }
                }
            },

            getElementMenu: function(menu, element) {
                if (menu == "icon") {
                    if (element.options.type == "note") {
                        return "us-" + this.options.type + "-" + element.options.type + "-menu";
                    } else {
                        return "us-" + element.options.type + "-menu";
                    }
                }
                if (menu == "context") {
                    return "us-ctx-common-menu";
                }
            }

        });


        //
        // Helper method which implements a common approach for
        // editable element
        //
        dm.base.editable = function(self, $items, removeEmpty, shift) {
            $.each(
                $items,
                function(index, item) {
                    $(item).editable({
                        onSubmit: function(data) {
                            if (data["current"] == data["previous"])
                                return;
                            var id = $(this).attr("id"),
                                sid = id.split("-"),
                                optId = sid[0];

                            // argument-N
                            if (sid.length == 2) {
                                // <ul><li><a id="operation-0">Editable</a></li></ul>
                                var $par = $(this).parent(),
                                    idx = $par.parent().children().index($par);
                                // list of references is shifted on one item
                                if (shift && idx >= shift) idx -= shift;

                                self.options[optId + "s"][idx] = data["current"];
                                if (data["current"] == "") {
                                    if (removeEmpty) {
                                        self.options[optId + "s"].splice(idx, 1);
                                        var methodName = "rm" + optId.charAt(0).toUpperCase() + optId.slice(1);
                                        if (self[methodName]) {
                                            self[methodName]({
                                                idx: idx
                                            })
                                        }
                                        $par.remove();
                                        if ($par.parent().hasClass("us-sortable")) {
                                            $par.parent().sortable("refresh");
                                        }
                                    }
                                }
                            }
                            // name
                            else if (sid.length == 1) {
                                self.options[optId] = data["current"];
                            } else {
                                alert("Unkown option change reported");
                                return false;
                            }
                            self.parrent.opman.reportShort("~" + id, self.euid, data["previous"], data["current"]);
                            return true;
                        }
                    });
                });
        };


        //  Global elements counter
        //  Entroduced to avoid side-effecst because of
        //  incorrectly implemented jquery requests
        //  @export:dm.es.element
        dm.base.diagram("es.element", {
            'options': {
                'drop': false,
                'nameTemplate': 'Element',
                'width': 140,
                'height': 200,
                'left': 140,
                'top': 200,
                'selected': false,
                'area': "none",
                'ctx_menu': "default",
                'editable': true
            },
            _create: function() {
                // if parent element is undefined, do nothing
                // create element at possition which described in jsonDesc
                alert("Could not create virtual element !!!");
            },

            _update: function() {
                var p = $("#" + this.euid + "_Border").position();
                this.options['pageX'] = p.left;
                this.options['pageY'] = p.top;
                this.options['left'] = p.left;
                this.options['top'] = p.top;
                this.options['width'] = $("#" + this.euid + "_Border").width();
                this.options['height'] = $("#" + this.euid + "_Border").height();

                if (this._dropped) {
                    this.options['dropped'] = new Array();
                    for (var i in this._dropped) {
                        if (this.parrent.elements[i]) {
                            this.options['dropped'].push(this.parrent.elements[i].options['id']);
                        } else alert("NOTE FOUND: " + i);
                    }
                }
            },


            _init: function() {
                if (this.options['height']) {
                    $('#' + this.euid)
                        .css('width', this.options['width']).css('height', this.options['height']);
                    $('#' + this.euid + "_Border").css("width", this.options['width']);
                }

                if (this.options['top'])
                    $('#' + this.euid)
                    .css('top', this.options['top']);
            },

            /**
             * \class Function.
             *  Initialization of base operations of element:
             *  Wrap with boarder-div, add resizable handlers, css etc
             *  Add the behaviour: editable, draggale, menu hide/show
             *  TODO: refactoring is coming
             */

            _baseinit: function() {
                //wrap with border
                var poz = "";
                if ((this.options['pageX'] != undefined) &&
                    (this.options['pageY'] != undefined)) {
                    poz = " style='top:" + this.options['pageY'] + "px;left:" + this.options['pageX'] + "px;' ";
                }

                $(this.element).wrap('<div id="' + this.euid + '_Border"' + poz + ' class="us-element-border" original-title="<textarea>SOME text should be here</textarea>"></div>');

                // Setup menu attribute for automated testing
                if (this.options.menu) {
                    $("#" + this.euid + "_Border").attr("menu", this.options.menu);
                }

                var parrentClass = this.parrent;
                var self = this;
                self.highlighted = false;
                this.refN = 0;
                this.options.references = this.options.references || new Array();

                var subDiagramPaths = self.options['subdiagrams'] || self.options['references'] || {};
                var subDiagramRefs = "<div class='us-references us-list'><ul class='context-menu-3'><li id='reference-new'><a>new reference</a></li>";
                subDiagramRefs += "</ul></div>";

                var axis111 = this.options['axis'] || false;
                var elmt = $('#' + this.euid + '_Border')
                .resizable({
                        'containment': "#" + this.parrent.euid, // to prevent jumping of element on resize start
                        'scroll': true,
                        'handles': this.options['resizable_h'] || 'n-u,e-u,s-u,w-u,nw-u,sw-u,ne-u,se-u',
                        'alsoResize': '#' + this.euid + '_Border .us-element-resizable-area',
                        'start': function() {
                            self._update();
                            self.operation_start = {
                                top: self.options.top,
                                left: self.options.left,
                                width: self.options.width,
                                height: self.options.height
                            };
                            $("#tabs #us-editable").hide();
                        },
                        'stop': function() {
                            self._update();
                            self.parrent.opman.reportShort("option",
                                self.euid,
                                self.operation_start, {
                                    top: self.options.top,
                                    left: self.options.left,
                                    width: self.options.width,
                                    height: self.options.height
                                });
                            delete self.operation_start;

                            if (self.onResizeComplete) {
                                self.onResizeComplete();
                            }
                            $('#' + self.euid + '_Border .us-element-resizable-area').css('width', '');
                            self.parrent.draw();
                        },
                        'resize': function(event, ui) {
                            var dh = ui.size.height - $(this).css("height");
                            $(this).css("height", ui.size.height);
                            $('#' + self.euid + '_Border .us-element-resizable-area').width($('#' + self.euid + "_Border").width()); // work-around for synchronization of resizeAlso area

                            if (self.onResizeComplete) {
                                self.onResizeComplete();
                            }
                            self.parrent.draw();
                            event.stopPropagation();
                        }
                    })
                    .draggable({
                        'containment': "#" + this.parrent.euid, // to prevent jumping of element on resize start
                        'grid': [2, 2],
                        'scroll': true,
                        'start': function(event, ui) {
                            self.operation_start = {
                                left: ui.position.left,
                                top: ui.position.top
                            };

                            if (parrentClass.dropHelper != undefined) {
                                var sel = self.euid;
                                parrentClass.Connector(parrentClass.dropHelper, {
                                    fromId: sel,
                                    toId: "ConnectionHelper"
                                });
                                return;
                            }

                            parrentClass['onElementDragStart'](self, ui);
                            $("#tabs #us-editable").hide();
                        },
                        'drag': function(event, ui) {
                            if (parrentClass != undefined) {
                                parrentClass.draw();
                            }

                            if (parrentClass.dropHelper) {
                                return;
                            }

                            if (self.$moveit != undefined) {
                                $("#" + self.$moveit).css("left", 200);
                            }
                            parrentClass['onElementDragMove'](self, {
                                left: ui.position.left - self.operation_start.left,
                                top: ui.position.top - self.operation_start.top
                            });
                        },
                        'stop': function(event, ui) {
                            if (parrentClass.dropHelper) {
                                var offset = $("#" + parrentClass.euid).position();
                                var name = parrentClass.checkdrop(ui.position.left, ui.position.top);

                                var selConn = parrentClass.dropHelper;
                                // Remove the temporary connector
                                var sel = self.euid;
                                //sel = sel.substr(0, sel.length -7);
                                parrentClass.removeConnector(sel, "ConnectionHelper", selConn);

                                if (name != undefined)
                                    parrentClass.Connector(selConn, {
                                        fromId: sel,
                                        toId: name
                                    });
                                // Remove selection from menu item
                                $('.connector-selector').removeClass('selected');

                                parrentClass.setDropHelper();

                                parrentClass.draw();
                                return;
                            }

                            if (ui.position.top < 0) {
                                $(this).css("top", 3);
                                ui.position.top = 3;
                            }

                            if (ui.position.left < 0) {
                                $(this).css("left", 0);
                                ui.position.left = 0;
                            }
                            parrentClass['onElementDragStop'](self, {
                                left: ui.position.left - self.operation_start.left,
                                top: ui.position.top - self.operation_start.top
                            });

                            /*  if (self.options['droppable']) {
                                  if (self.parrent != undefined) {
                                    self.parrent._dropElement(self, ui);
                                  }
                                }
                             */
                            if (self.onDropComplete) {
                                self.onDropComplete();
                            }
                            //self.operationStop();
                            //self.parrent.reportOperation("move", self.euid, self.operation_start, {left: ui.position.left, top: ui.position.top});
                        },
                        'scope': self.options['droppable'],
                        'axis': axis111
                    })
                    /*{
                      start: function(event, ui) {
                               // if this is a connection helper
                               // => add connector to for redrawing
                               if (self.parrentClass != undefined) {
                                   self.parrentClass.startConnection(self.id);
                               }
                             },
                      drag: function(event, ui) {
                          if (parrentClass != undefined) {
                             parrentClass.draw();
                          }
                            },
                      stop: function(event, ui) {
                              // remove connection helper
                              // create connection it is possible because element should be available yet
                              // TODO: check that connection supported (menu which describe connections should contain such connection declaration !!!!)
                              if (self.parrentClass != undefined) {
                                   self.parrentClass.stopConnection(self.id);
                              }
                            }
                    } // draggable completed*/
                    // CSS  hack for chnaging view of resizable element "ui-resizable-*-u"
                    .bind('contextmenu', function(e) {
                        $("#tabs #us-editable").hide();
                        e.preventDefault();
                        // Check that context menu manager already loaded
                        var poz = $("#" + self.euid).position();
                        if (self.parrent.menuCtx) {
                            self.parrent.menuCtx['hideAll']();

                            // Prevent the context menu usage
                            if (self.parrent && self.parrent.options.editable)
                                self.parrent.menuCtx['visit'](self, e.pageX, e.pageY);
                        }
                    })

                .css({
                        'position': 'absolute'
                    })
                    .css('top', this.options['pageY'])
                    .css('left', this.options['pageX']);

                // Hide element resize points which was
                // added on the previous step
                $('#' + this.euid + '_Border ' + ".ui-resizable-handle").css({
                    'visibility': 'hidden'
                });

                // You need to select element to start DND
                $('#' + this.euid)
                    .click(self, function(event) {

                        var element = event.data;
                        element.parrent._mouseClick(element);
                        event.stopPropagation();

                        // Hide previous references
                        $("#" + element.parrent.euid + " .us-references").hide();
                    })
                    .mouseenter(self, function(event) {
                        var element = event.data;
                        if (!element.options.selected && !element.highlighted) {
                            element.highlighted = true;
                            var $bw = $('#' + this.id + '_Border').css({
                                'border-width': '3px'
                            });
                            var bw = $bw.css('border-left-width');
                            $bw.css({
                                left: '-=' + bw,
                                top: '-=' + bw
                            });
                        }

                        // Show "REFERENCE" in editable mode only
                        if (!element.parrent.options.editable &&
                            (element.options.subdiagrams || element.options.references.length != 0)) {
                            $('#' + this.id + '_REF').css({
                                'visibility': 'visible'
                            });
                        }

                        // Show the  menu if element was selected
                        if (element.parrent.menuIcon &&
                            element.options.selected &&
                            element.parrent.options.editable) {
                            element.parrent.menuIcon['Show'](element);
                            $('#' + this.id + '_REF').css({
                                'visibility': 'visible'
                            });
                        }

                        //$(".elmenu-" + self.menutype).stop().animate({opacity:"1"});;
                    })
                    .mouseleave(self, function(event) {
                        var element = event.data;
                        if (!element.options.selected && element.highlighted) {
                            var $bw = $('#' + this.id + '_Border');
                            var bw = $bw.css('border-left-width');
                            $bw.css({
                                'border-width': '0px'
                            }).css({
                                left: '+=' + bw,
                                top: '+=' + bw
                            });
                            element.highlighted = false;
                        }

                        //Check if this.euid is the same as selected
                        if (element.parrent.menuIcon &&
                            element.parrent.options.editable) {
                            element.parrent.menuIcon['Hide'](element);
                        }

                        $('#' + this.id + '_REF').css({
                            'visibility': 'hidden'
                        });

                    })
                    .append("<img id='" + this.euid + "_REF' title='REFERENCE' src='./images/reference.png' class='us-element-ref' style='z-index:99999;visibility:hidden;'></img>")
                    .parent()
                    .append(subDiagramRefs);

                for (var g in subDiagramPaths) {
                    self.addReference({
                        text: subDiagramPaths[g]
                    }, true);
                }

                // Hide references by default and
                // prevent propagation of click event
                $('#' + this.euid + '_Border .us-references')
                    .hide()
                    .click(function(e) {
                        e.stopPropagation();
                    });

                $('#' + this.euid + "_Border #reference-new a").editable({
                    onSubmit: function(data) {
                        if (data["current"] == data["previous"])
                            return;

                        $(this).text("new reference");
                        if (data["current"] == "")
                            return;

                        self.addReference({
                            text: data["current"]
                        });
                        return true;
                    }
                });


                /*
                      $('#' + this.euid  + '_Border .us-references ul li a').bind("click", self, function(event) {
                        var element = event.data;
                        if (!element.parrent.options.editable) {
                          dm.dm.fw.loadContent2(element.parrent.parrent, $(this).text());
                        }
                      });

                */
                //if (this.options['subdiagram'])
                {
                    $("img#" + this.euid + "_REF")
                        .attr('title', this.options['subdiagrams'])
                        .click(self, function(event) {
                            var element = event.data;
                            var isShown = $("#" + element.euid + " .us-references").css('display') == "none";

                            // Hide all references on diagram
                            $("#" + element.parrent.euid + " .us-references").hide();

                            // open item if it was closed
                            if (!isShown) {
                                var pos = $(this).position();
                                $('#' + element.euid + '_Border .us-references')
                                    .show()
                                    .css({
                                        top: pos.top + 20,
                                        left: pos.left
                                    });
                            }
                            event.stopPropagation();
                        });
                }


                // enable editable fields
                // if this diagram is editable
                dm.base.editable(this, $("#" + this.euid + " .editablefield"));

                //
                if (!this.parrent.options['editable']) {
                    $.each($("#" + this.euid + "_Border .editablefield"),
                        function(index, item) {
                            $(item).editable("disable");
                        });
                }

                if (this.options['color'])
                    this._setOption("color", this.options['color']);

                if (this.options['borderwidth'])
                    this._setOption("borderwidth", this.options['borderwidth']);

                if (this.options["font-family"])
                    this._setOption("font-family", this.options["font-family"]);

                if (this.options["z-index"])
                    $('#' + this.euid + "_Border").css("z-index", this.options["z-index"]);
            },

            'addReference': function(opt, isInit) {
                var self = this;

                var old_attr;

                if (opt.id) {
                    old_attr = opt.id;
                    self.options.references.splice(opt.idx, 0, opt.text);
                } else

                {
                    old_attr = 'reference-' + this.refN;
                    ++this.refN;

                    // Do not update references on initialization
                    if (!isInit)
                        self.options.references.push(opt.text);
                }

                var idx = (opt.idx == undefined) ? this.refN : opt.idx,
                    $ch =
                    $("<li id='reference'><a id='" + old_attr + "' class='editablefield reference'>" + opt.text + "</a>" +
                        "<a class='ui-corner-all'><span class='ui-test ui-icon ui-icon-close' style='float:right;'></span></a></li>"),
                    $idx = $("#" + self.euid + "_Border .us-references ul li:eq(" + idx + ")");

                // if the position for insertion was found
                if ($idx.length == 1) {
                    $ch = $ch.insertAfter($idx);
                } else {
                    $ch = $ch.appendTo("#" + self.euid + "_Border div.us-references ul");
                }

                $ch.children("A").children("span.ui-icon-close").bind("click", self, function(event) {
                    var element = event.data;
                    if (element.parrent.options.editable) {
                        var nextid = $(this).parent().parent().children("a.reference").attr("id");
                        element.rmReference({
                            selector: "#" + element.euid + "_Border #" + nextid
                        });
                    }

                });

                $ch = $ch.children("A.reference")
                    .bind("click", self, function(event) {
                        var element = event.data;
                        if (!element.parrent.options.editable) {
                            dm.dm.fw.loadContent2(element.parrent.parrent, $(this).text());
                        }
                        event.stopPropagation();
                    });



                // Common approach for editable
                dm.base.editable(this, $ch, true, 1);

                // Do not report operation if it was reported before
                if (opt.idx == undefined) {
                    var hg = $ch.height();
                    this.parrent.opman.startTransaction();
                    this.parrent.opman.reportShort("+reference",
                        self.euid, {
                            idx: $("#" + this.euid + "_Border .reference").length - 1,
                            text: opt.text,
                            id: old_attr
                        });
                    this.parrent.opman.stopTransaction();
                }

            },

            'rmReference': function(opt) {
                // selector is path to ul>li>a object
                if (opt.selector) {
                    var text = $(opt.selector).text();
                    var idx = $(opt.selector.split(" ")[0] + " li").index($(opt.selector).parent()) - 1;

                    // Update options
                    // On the first line a "new reference" message
                    this.options.references.splice(idx, 1);

                    // Report reference.
                    this.parrent.opman.reportShort("-reference",
                        this.euid, {
                            idx: idx,
                            text: text,
                            id: opt.selector.split(" ")[1].substring(1)
                        });
                    // It is necessary to remove li object
                    // but selector refs to li>a
                    $(opt.selector).parent().remove();
                } else {
                    // It is not necessary to report attribute
                    // because this case happen on revert attribute only
                    var rm_idx = opt.idx + 1;
                    this.options.references.splice(opt.idx, 1);
                    $("#" + this.euid + "_Border .us-references ul li:eq(" + rm_idx + ")").remove();
                }

            },

            _setOption: function(key, value) {
                var old_val = this.options[key];

                if (this._setOption2 != undefined && this._setOption2(key, value)) {
                    // redefine the base options in inherited class
                } else if (key == "editable") {

                    $('#' + this.euid + '_Border')
                        .resizable("option", "disabled", !value)
                        .draggable("option", "disabled", !value);

                    // Work-around for elements without editable fields
                    if ($("#" + this.euid + "_Border .editablefield").length) {
                        $.each($("#" + this.euid + "_Border .editablefield"),
                            function(index, item) {
                                $(item).editable(value ? "enable" : "disable");
                            });
                        $("#" + this.euid + "_Border #reference-new").css("display", value ? "block" : "none"); //css("visibility", value ?  "visible":"hidden");
                    }

                } else if (key == "font-color") {
                    $("#" + this.euid + "_Border.us-element-border a").css("color", value);
                } else if (key == "left") {
                    $("#" + this.euid + "_Border").css(key, value);
                } else if (key == "top") {
                    $("#" + this.euid + "_Border").css(key, value);
                } else if (key == "color") {
                    $("#" + this.euid).css("background-color", value || "");
                } else if (key == "borderwidth") {
                    $("#" + this.euid).css("border-width", value || "");
                } else if (key == "width") {
                    $("#" + this.euid + "_Border").css("width", value);
                } else if (key == "height") {
                    $("#" + this.euid + "_Border").css("height", value);
                    if (old_val && value != old_val) {
                        var v = parseInt(value) - parseInt(old_val);
                        var inc = (v > 0) ? ("+=" + v) : ("-=" + Math.abs(v));
                        if (v != 0)
                            $("#" + this.euid + "_Border .us-element-resizable-area").css("height", inc);
                    }
                } else if (key == "font-family") {
                    $("#" + this.euid).css(key, value || "");
                } else if (key == "selected") {
                    if (value) {
                        $('#' + this.euid + '_Border ' + ".ui-resizable-handle").css({
                            'visibility': 'visible'
                        });
                        if (!this.highlighted) {
                            var $bw = $('#' + this.euid + '_Border').css({
                                'border-width': '3px'
                            });
                            var bw = $bw.css('border-left-width');
                            $bw.css({
                                left: '-=' + bw,
                                top: '-=' + bw
                            });
                            this.highlighted = true;
                        }
                    } else {
                        $('#' + this.euid + '_Border ' + ".ui-resizable-handle").css({
                            'visibility': 'hidden'
                        });
                        if (this.highlighted) {
                            var $bw = $('#' + this.euid + '_Border');
                            var bw = $bw.css('border-left-width');
                            $bw.css({
                                'border-width': '0px'
                            }).css({
                                left: '+=' + bw,
                                top: '+=' + bw
                            });
                        }
                        this.highlighted = false;
                    }
                } else if (key == "z-index") {
                    $("#" + this.euid + '_Border ').css(key, value || "");
                }
                this.options[key] = value;
            },


            onDragStart: function(ui, skipDropped) {

                if (this.options.dragStart != undefined)
                    return;

                this.parrent.opman.reportStart("option", this.euid, {
                    left: this.options.left,
                    top: this.options.top
                });

                if (skipDropped) {
                    // Do nothing with dropped elements
                } else {
                    for (var i in this._dropped) {
                        $.log("DSP:" + i);
                        if (this.parrent.elements[i])
                            this.parrent.elements[i].onDragStart(ui);
                    }
                }

                this.options.dragStart = true;

                //    if (isbase == undefined) {
                var p = $("#" + this.euid + "_Border").position(),
                    scrollLeft = $("#" + this.parrent.euid).scrollLeft(),
                    scrollTop = $("#" + this.parrent.euid).scrollTop();

                this.options.left = p.left + scrollLeft;
                this.options.top = p.top + scrollTop;

                this.start_operation = {
                    left: this.options.left,
                    top: this.options.top
                };
                //    }
            },

            onDragMove: function(ui) {
                if (this.options.dragStart === undefined)
                    return;
                if (this.start_operation === undefined)
                    alert("THERE IS NO this.start_operation for: " + this.euid + "  " + this.options.dragStart);
                $("#" + this.euid + "_Border")
                    .css({
                        'left': this.start_operation.left + ui.left,
                        'top': this.start_operation.top + ui.top
                    });

                this.options.left = this.start_operation.left + ui.left;
                this.options.top = this.start_operation.top + ui.top;


            },

            onDragStop: function(ui) {
                if (ui) {
                    //this.onDragMove(ui); // TODO: This operation lead to jump of element on drag stop
                    if (this.options['droppable']) {
                        if (this.parrent != undefined) {
                            this.parrent._dropElement(this, {
                                position: {
                                    'left': this.start_operation.left + ui.left,
                                    'top': this.start_operation.top + ui.top
                                }
                            });
                        }
                    }

                }

                this.options.left = this.start_operation.left + ui.left;
                this.options.top = this.start_operation.top + ui.top;

                this.parrent.opman.reportStop("option", this.euid, {
                    left: this.options.left,
                    top: this.options.top
                });

                $.log("DSTOP: " + this.euid);
                delete this.options.dragStart;
                delete this.start_operation;
            }

        });

        dm.ds.diagram = dm.ds.diagram || {};
        dm.ds.diagram.ec = 0;

        //  @export:dm.cs.connector
        dm.base.diagram("cs.connector", {
            'options': {
                'selected': false,
                'nameTemplate': 'Connector'
            },
            //
            // Add text label
            //
            addLabel: function(opt) {
                var self = this,
                    lid = opt.lid != undefined ? opt.lid : this.euid + "_l" + this.label_count; // uniqie label name to simplify revert editable

                if (opt.lid == undefined) ++this.label_count;

                var $item = $("<div id='" + lid + "' class='editablefield' style=\"position:absolute;z-index:99999;background-color:white;\">" + opt.text + "</div>")
                    .appendTo("#" + this.parrent.euid)
                    .css("left", opt.left)
                    .css("top", opt.top)
                    .draggable({
                        start: function(event, ui) {
                            $(this).data('startPosition', ui.helper.position());
                        },
                        stop: function(event, ui) {
                            var idx;
                            var pos = $(this).data("startPosition");
                            var p = ui.helper.position();
                            for (var t in self.labels) {
                                if ($item == self.labels[t]) {
                                    idx = t;
                                    break;
                                }
                            }
                            self.parrent.opman.reportShort("#label", self.euid, {
                                idx: idx,
                                left: pos.left,
                                top: pos.top
                            }, {
                                idx: idx,
                                left: p.left,
                                top: p.top
                            });
                        }
                    })
                    .editable({
                        onSubmit: function(data) {
                            if (data["current"] == data["previous"])
                                return;
                            var id = $(this).attr("id");
                            //self.options[id] = data["current"];
                            self.parrent.opman.reportShort("~" + id, self.parrent.euid, data["previous"], data["current"]);
                            return true;
                        }
                    })
                    .mouseenter(function() {
                        self.options.selected = true;
                        self.parrent.draw();
                        for (var i in self.labels)
                            $(self.labels[i]).addClass("us-connector-hover")
                    })
                    .mouseleave(function() {
                        self.options.selected = false;
                        self.parrent.draw();
                        for (var i in self.labels)
                            $(self.labels[i]).removeClass("us-connector-hover")
                    });
                if (opt.idx) {
                    // add label to the special place in array
                    this.labels.splice(opt.idx, 0, $item);
                } else {
                    this.labels.push($item);
                }
                this.parrent.opman.reportShort("+label",
                    this.euid, {
                        idx: this.labels.length - 1,
                        left: opt.left,
                        top: opt.top,
                        text: opt.text,
                        lid: lid
                    });
            },
            rmLabel: function(opt) {
                var l = this.labels[opt.idx];
                this.parrent.opman.reportShort("-label", this.euid, {
                    idx: opt.idx,
                    left: l.css("left"),
                    top: l.css("top")
                });
                (this.labels.splice(opt.idx, 1))[0].remove();

            },
            moveLabel: function(opt) {
                this.labels[opt.idx].css({
                    left: opt.left,
                    top: opt.top
                });
            },

            getSvgDescription: function() {
                var desc;
                this.points = this['_getConnectionPoints'](this['from'], this['toId'], this.epoints);
                var rrr = this.draw(null, this.points, this.options.color || "black", true);
                // Draw method has svg support
                if (rrr) {
                    // TODO: fromId and toId
                    desc = '<g id="' + this.options.type + '-' + this.euid + '"><desc>' + this.getDescription() + '</desc>' + rrr + '</g>';
                    return desc;
                }
                return '';
            },

            getDescription: function() {
                this.options['fromId'] = this.from;
                this.options['toId'] = this.toId;

                var item = '{',
                    fromId = this.parrent.elements[this.options['fromId']].options['id'],
                    toId = this.parrent.elements[this.options['toId']].options['id'];

                item += '"type":"' + this.options['type'] + '",';
                item += '"fromId":"' + fromId + '",';
                item += '"toId":"' + toId + '",';
                item += '"epoints":[';
                var comma = "",
                    c;
                for (var i in this.epoints) {
                    item += comma + '{';
                    comma = ',\n';
                    c = '';
                    for (var j in this.epoints[i]) {
                        item += c + '"' + j + '":"' + this.epoints[i][j] + '"';
                        c = ',';
                    }
                    item += '}';
                }
                item += ']';

                if (this.labels) {
                    item += ',"labels":[';
                    comma = "";
                    c = "";
                    for (var i in this.labels) {
                        var p = this.labels[i].position();
                        item += comma + '{"name":"' + this.labels[i].html() + '","x":"' + p.left + '","y":"' + p.top + '"}';
                        comma = ',\n';
                    }
                    item += ']';
                }
                item += '}';
                return item;
            },
            _setOption: function(key, value) {
                if (value == undefined) {
                    delete this.options[key];
                    return;
                }

                if (key == "epoints") {
                    for (var i in value) {
                        this.epoints[i][0] = value[i][0];
                        this.epoints[i][1] = value[i][1];
                    }
                } else if (key == "labels") {
                    for (var i in value) {
                        this.labels[i].css({
                            left: value[i][0],
                            top: value[i][1]
                        });
                    }
                } else if (key == "editable") {
                    for (var i in this.labels) {
                        $.each(this.labels[i],
                            function(index, item) {
                                $(item).draggable("option", "disabled", !value)
                                    .editable(value ? "enable" : "disable");
                            });
                    }
                } else {
                    this.options[key] = value;
                }
            },

            _create: function() {
                this.epoints = [];
                var self = this;
                if (this.options.epoints != undefined) {
                    $.each(this.options.epoints, function(idx, item) {
                        self.epoints[idx] = [];
                        self.epoints[idx][0] = parseInt(item[0]);
                        self.epoints[idx][1] = parseInt(item[1]);
                    });
                }
                this.label_count = 0;
                this.cleanOnNextTransform = false;

                dm.at.cs.created = {
                    euid: this.euid,
                    from: this.options.fromId,
                    to: this.options.toId
                };

                if (this.options['stored']) {
                    for (var i in this.parrent.elements) {
                        //        alert("ELEMENT: " + this.parrent.elements[i].euid);
                        if (this.parrent.elements[i].options['id'] == this.options['fromId']) {
                            this['from'] = this.parrent.elements[i].euid;
                        }
                        if (this.parrent.elements[i].options['id'] == this.options['toId']) {
                            this['toId'] = this.parrent.elements[i].euid;
                        }
                    }

                    if (!this['toId'] || !this['from']) {
                        $.log("Failed to create " + this.options.type);
                        return false;
                    }

                    if (this.options['epoints']) {
                        dm.debug = dm.debug || {};
                        dm.debug[this.euid] = this.options['epoints'];
                        this.epoints = new Array();
                        for (var i in this.options['epoints']) {
                            this.epoints[i] = {};
                            this.epoints[i][0] = parseInt(this.options['epoints'][i][0], 10);
                            this.epoints[i][1] = parseInt(this.options['epoints'][i][1], 10);
                        }
                    }
                    this.options['fromId'] = this['from'];
                    this.options['toId'] = this['toId'];
                } else {
                    this['from'] = this.options['fromId'];
                    this['toId'] = this.options['toId'];
                }
                this.labels = new Array();
                for (var i in this.options['labels']) {
                    var l = this.options['labels'][i];
                    this.addLabel({
                        text: l.name,
                        left: parseInt(l.x),
                        top: parseInt(l.y)
                    });
                }
            },

            _init: function() {
                // this.element.draggable().resizable().selectable().border()
            },

            _baseinit: function() {
                // TODO: add on mouse drag&drop
            },

            drawSelected: function(c, points, color) {
                c.beginPath();
                c.fillStyle = color;
                c.strokeStyle = color;

                c.moveTo(points[0][0], points[0][1]);
                for (var i = 1; i < points.length; ++i) {
                    c.lineTo(points[i][0], points[i][1]);
                }
                c.stroke();
                c.closePath();
            },

            draw: function(ctx, points, color) {},


            redraw: function(ctx, color) {
                var context = ctx;
                var col = color || "rgba(0,0,0,1)";
                if (ctx == undefined) {
                    // TODO: identify context by this,parent
                    return;
                }
                this.points = this['_getConnectionPoints'](this['from'], this['toId'], this.epoints);
                this.gip = [];
                for (var i = 0; i < this.points.length - 1; ++i) {
                    var dy = this.points[i][1] - this.points[i + 1][1],
                        dx = this.points[i][0] - this.points[i + 1][0];
                    this.gip[i] = Math.sqrt(dx * dx + dy * dy);
                }


                // !!! It looks like conflict of naming. Diagram has draw method too,
                //     But with different signature
                // !!!
                // ???
                // Is is problem
                // Why it is possible to re-define methods for elements
                // but not possible for connector
                // ???
                this['draw'](context, this.points, col);
            },


            _getRValue: function(x1, x2, w) {
                var diffx = x2 - x1;
                if (diffx > 0) {
                    if (diffx > w)
                        return x1 + w;
                    return x2;
                }
                return x1;
            },

            isPointOnLine: function(x, y) {
                if (this.points == undefined)
                    return false;

                // Check if mouse is near to some extra point ?
                for (var c = 0; c < this.epoints.length; ++c) {
                    if ((this.epoints[c][0] - 12 < x) && (this.epoints[c][0] + 12 > x) &&
                        (this.epoints[c][1] - 12 < y) && (this.epoints[c][1] + 12 > y)) {
                        dm.at.cs.mouseover = {
                            euid: this.euid,
                            idx: c
                        };
                        return true;
                    }
                }

                for (var i = 0; i < this.points.length - 1; ++i) {
                    var dx1 = x - this.points[i][0],
                        dy1 = y - this.points[i][1],
                        dx = this.points[i + 1][0] - x,
                        dy = this.points[i + 1][1] - y,
                        gip1 = Math.sqrt(dx1 * dx1 + dy1 * dy1),
                        gip = Math.sqrt(dx * dx + dy * dy);

                    if (((gip1 + gip) - this.gip[i]) < 0.2) {
                        dm.at.cs.mouseover = {
                            euid: this.euid
                        };
                        return true;
                    }
                }
                return false;
            },
            canRemovePoint: function(p1, p2, rp) {
                if ((p1 == undefined) ||
                    (p2 == undefined)) {
                    return false;
                }
                var dx = p1[0] - p2[0],
                    dy = p1[1] - p2[1],
                    dx1 = p1[0] - rp[0],
                    dy1 = p1[1] - rp[1],
                    dx2 = p2[0] - rp[0],
                    dy2 = p2[1] - rp[1],
                    gip1 = Math.sqrt(dx1 * dx1 + dy1 * dy1),
                    gip2 = Math.sqrt(dx2 * dx2 + dy2 * dy2),
                    gip = Math.sqrt(dx * dx + dy * dy);
                if (((gip1 + gip2) - gip) < 0.5)
                    return true;
                return false;
            },
            startTransform: function(x1, y1) {
                if (!this.parrent.options.editable)
                    return;

                var opman = this.parrent.opman;
                opman.startTransaction();

                // Clena extra point position
                this.eppos = undefined;

                // Some scrolling stuff, do not take in account
                var x = x1 + $("#" + this.parrent.euid).scrollLeft(),
                    y = y1 + $("#" + this.parrent.euid).scrollTop();

                // cleanOnNextTransform allow us to move vertical and horizontal
                //                      lines between elements.
                //                      It is single extra point which should be removed on next DND
                if ((this.cleanOnNextTransform) && (this.epoints.length == 1)) {
                    this.cleanOnNextTransform = false;
                    this.epoints.splice(0, 1);
                }

                // Check if mouse is near to some extra point ?
                for (var c = 0; c < this.epoints.length; ++c) {
                    if ((this.epoints[c][0] - 12 < x) && (this.epoints[c][0] + 12 > x) &&
                        (this.epoints[c][1] - 12 < y) && (this.epoints[c][1] + 12 > y)) {
                        this.eppos = c;
                        break;
                    }
                }

                if (this.epoints.length == 0) { // Don't need to identify position
                    // in array for the first element
                    this.eppos = 0;
                    this.epoints[this.eppos] = [];
                    this.report = "+epoint";
                } else {
                    // means that it is not move on existing point
                    //            it is not first point of replaced first point
                    if (this.eppos == undefined) {

                        // Get the list of connection points
                        this.points = this['_getConnectionPoints'](this['from'], this['toId'], this.epoints);
                        newPoint = [];
                        newPoint[0] = x1;
                        newPoint[1] = y1;
                        var zi = 0;
                        for (; zi < this.points.length - 1; ++zi) {
                            if (this.canRemovePoint(this.points[zi], this.points[zi + 1], newPoint)) { // Is Point on Line ?  Stuipid double check on mouseMove !!!
                                this.eppos = zi;
                                this.epoints.splice(zi, 0, newPoint);
                                break;
                            }
                        }
                        this.report = "+epoint";
                    } else {
                        this.report = "#epoint";
                        this.epoints[this.eppos] = [];
                    }
                }

                opman.reportStart(this.report, this.euid, {
                    idx: this.eppos,
                    value: [x, y]
                });

                this.epoints[this.eppos][0] = x;
                this.epoints[this.eppos][1] = y;


                if (this.onStartTransform != undefined)
                    this.onStartTransform(x, y);
            },

            stopTransform: function(x1, y1) {
                if (this.eppos == undefined) {
                    return;
                }
                var x = x1 + $("#" + this.parrent.euid).scrollLeft(),
                    y = y1 + $("#" + this.parrent.euid).scrollTop();

                this.parrent.opman.reportStop(this.report, this.euid, {
                    idx: this.eppos,
                    value: [x, y]
                });

                this.epoints[this.eppos][0] = x;
                this.epoints[this.eppos][1] = y;

                var isEqualPoint = function(p1, p2) {
                    if ((p1[0] - 12 < p2[0]) &&
                        (p1[0] + 12 > p2[0]) &&
                        (p1[1] - 12 < p2[1]) &&
                        (p1[1] + 12 > p2[1])) {
                        return true;
                    }
                    return false;
                };

                if (this.eppos < this.epoints.length - 1) {
                    if (isEqualPoint(this.epoints[this.eppos], this.epoints[this.eppos + 1])) {
                        $.log("REPORT             1 ");
                        this.parrent.opman.reportShort("-epoint", this.euid, {
                            idx: this.eppos + 1,
                            value: this.epoints[this.eppos + 1]
                        });
                        this.epoints.splice(this.eppos + 1, 1);
                    }
                }

                if (this.eppos > 0) {
                    if (isEqualPoint(this.epoints[this.eppos], this.epoints[this.eppos - 1])) {
                        this.eppos--;
                        $.log("REPORT             2 ");
                        this.parrent.opman.reportShort("-epoint", this.euid, {
                            idx: this.eppos,
                            value: this.epoints[this.eppos]
                        });
                        this.epoints.splice(this.eppos, 1);

                    }
                }

                if (this.canRemovePoint(this.points[this.eppos], this.points[this.eppos + 2], this.points[this.eppos + 1])) {
                    if (this.epoints.length > 1) {
                        $.log("REPORT             3:  " + this.eppos + "   COUNT: " + this.epoints.length);
                        this.parrent.opman.reportShort("-epoint", this.euid, {
                            idx: this.eppos,
                            value: this.epoints[this.eppos]
                        });
                        this.epoints.splice(this.eppos, 1);
                        $.log("REPORT AFTER       3:  " + this.eppos + "   COUNT: " + this.epoints.length);

                    } else {
                        this.cleanOnNextTransform = true;
                    }
                }

                this.eppos = undefined;

                if ($.isFunction(this.onStopTransform))
                    this.onStopTransform(x, y);

                this.parrent.opman.stopTransaction();
                delete this.report; // remove the value

            },

            TransformTo: function(x1, y1) {
                if (this.eppos != undefined) {
                    var x = x1 + $("#" + this.parrent.euid).scrollLeft(),
                        y = y1 + $("#" + this.parrent.euid).scrollTop();
                    this.epoints[this.eppos][0] = x;
                    this.epoints[this.eppos][1] = y;
                    if ($.isFunction(this.onTransform))
                        this.onTransform(x, y);
                }
            },

            _getConnectionPoints: function(fromId, toId, epoints) {

                var p1 = $('#' + fromId).position();
                var p2 = $('#' + toId).position();
                if (p2 == null) {
                    return;
                }
                ///////////////////////////////////////////    PERFORMANCE IMPROVMENT REQUIRED  !!!!!!!!! ///////////////////////////////////
                ///////////////////////////////////////////    Do not recalculate coordinates for all elements !!!!!!!!! ////////////////////
                ///////////////////////////////////////////    It is necessary for draggable and resizable elements only !!!!!!!!! //////////
                var p11 = $('#' + fromId + "_Border").position();
                if (!p11) {
                    return;
                }
                var p21 = $('#' + toId + "_Border").position();

                var scrollTop = $("#" + this.parrent.euid).scrollTop(),
                    scrollLeft = $("#" + this.parrent.euid).scrollLeft();

                if ((epoints == undefined) || (epoints.length == 0)) {
                    var x1 = this._getRValue(p1.left + p11.left, p2.left + p21.left, $('#' + fromId).width());
                    var y1 = this._getRValue(p1.top + p11.top, p2.top + p21.top, $('#' + fromId).height());

                    var x2 = this._getRValue(p2.left + p21.left, p1.left + p11.left, $('#' + toId).width());
                    var y2 = this._getRValue(p2.top + p21.top, p1.top + p11.top, $('#' + toId).height());

                    if (this.parrent.options.multicanvas) {
                        var newpoints = [
                            [x1 + scrollLeft, y1 + scrollTop],
                            [x2 + scrollLeft, y2 + scrollTop]
                        ];
                        return newpoints;
                    } else {
                        var newpoints = [
                            [x1, y1],
                            [x2, y2]
                        ];
                        return newpoints;
                    }
                } else {
                    var lln = epoints.length - 1;
                    var x1 = this._getRValue(p1.left + p11.left, epoints[0][0] - scrollLeft, $('#' + fromId).width());
                    var y1 = this._getRValue(p1.top + p11.top, epoints[0][1] - scrollTop, $('#' + fromId).height());

                    var x2 = this._getRValue(p2.left + p21.left, epoints[lln][0] - scrollLeft, $('#' + toId).width());
                    var y2 = this._getRValue(p2.top + p21.top, epoints[lln][1] - scrollTop, $('#' + toId).height());


                    /*
                     var x1 = p1.left + p11.left;
                     var y1 = p1.top + p11.top;
                     var x2 = p2.left + p21.left;
                     var y2 = p2.top + p21.top;
                     */
                    if (this.parrent.options.multicanvas) {
                        var newpoints = [];
                        newpoints[0] = [x1 + scrollLeft, y1 + scrollTop];
                        for (var i = 1; i <= epoints.length; ++i) {
                            newpoints[i] = [epoints[i - 1][0], epoints[i - 1][1]]; //epoints[i-1];
                        }
                        newpoints[epoints.length + 1] = [x2 + scrollLeft, y2 + scrollTop];
                        return newpoints;
                    } else {
                        // Canvas doesn't corresponding to diagram type
                        // and not scrollable
                        // therefore keep x,y on place and shift extra points
                        var newpoints = [];
                        newpoints[0] = [x1, y1];
                        for (var i = 1; i <= epoints.length; ++i) {
                            newpoints[i] = [epoints[i - 1][0], epoints[i - 1][1]]; //epoints[i-1];
                            newpoints[i][0] -= scrollLeft;
                            newpoints[i][1] -= scrollTop;
                        }
                        newpoints[epoints.length + 1] = [x2, y2];
                        return newpoints;
                    }
                }
            },

            onDragStart: function(ui) {
                if (this.epoints.length > 0) {

                    this.epoints_drag = [];
                    // clone this.epoints
                    for (var i in this.epoints) {
                        this.epoints_drag[i] = {};
                        this.epoints_drag[i][0] = this.epoints[i][0];
                        this.epoints_drag[i][1] = this.epoints[i][1];
                    }
                    this.options.dragStart = true;
                }
                if (this.labels && this.labels.length > 0) {
                    this.labels_drag = [];
                    // clone this.epoints
                    for (var i in this.labels) {
                        var p = this.labels[i].position();
                        this.labels_drag[i] = {};
                        this.labels_drag[i][0] = p.left;
                        this.labels_drag[i][1] = p.top;
                    }
                }

                this.parrent.opman.reportStart("option", this.euid, {
                    'epoints': this.epoints_drag,
                    'labels': this.labels_drag
                });

            },

            onDragMove: function(ui) {
                if (this.options.dragStart == undefined)
                    return;
                for (var i in this.epoints_drag) {
                    this.epoints[i][0] = this.epoints_drag[i][0] + ui.left;
                    this.epoints[i][1] = this.epoints_drag[i][1] + ui.top;
                }

                for (var i in this.labels_drag) {
                    this.labels[i].css({
                        left: this.labels_drag[i][0] + ui.left,
                        top: this.labels_drag[i][1] + ui.top
                    });
                }
            },

            onDragStop: function(ui) {
                if (ui == undefined) {
                    return;
                }

                this.parrent.opman.reportStop("option", this.euid, {
                    'epoints': this.epoints.slice(0),
                    'labels': this.labels.slice(0)
                });

                delete this.options['dragStart'];
                delete this.epoints_drag;
                delete this.labels_drag;
            }

        });
    })(jQuery, dm);

    return dm.ds.diagram;
});
