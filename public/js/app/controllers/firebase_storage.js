define(['marionette'],
    function(Marionette) {
        var Controller = Marionette.Controller.extend({
            //
            // Initialize firebase and authentication callback
            //
            initialize: function(options) {
                // make firebase initialization here
                this.auth = firebase.auth();
                this.database = firebase.database();
                this.storage = firebase.storage();
                // Initiates Firebase auth and listen to auth state changes.
                this.auth.onAuthStateChanged(this._onAuthStateChanged.bind(this));
                this.authCallback = options.onAuthStateChanged;
            },
            //
            // Helper method to handle sign-in change behaviour
            //
            _onAuthStateChanged: function(user) {
                this.user = user;
                if (this.authCallback) {
                    // probably it could trigger firebase:auth event
                    this.authCallback(user);
                }
            },
            //
            // Load content by key
            //
            loadContent: function(uid, version, callback) {
                var that = this;
                var handler = function(snapshot) {
                    if (callback)
                        callback(snapshot.val());
                        var xxx = snapshot.val();
                        console.dir(xxx);
                };
                var handler2 = function(snapshot) {
                    if (callback) {
                        var xxx = snapshot.val();
                        for (var x in xxx) {
                          console.log(x);
                          console.dir(xxx[x]);
                          callback(xxx[x]);
                        }
                    }
                };

                if (version) {
                  console.log("LOADING: messages/" + uid + "/" + version);
                  var ref = this.database.ref('messages/' + uid+"/"+version);
                  ref.limitToFirst(1).once("value").then(handler2);
                }
                else {
                  this.messagesRef = this.database.ref('messages/' + uid).once('value').then(handler);
                }
            },
            //
            // Helper method to select an active database references
            // There are reveral database refereces could be supported:
            // 1. uml diagrams
            // 2. markdown texts
            // 3. user comments
            //
            _getMessageRef: function(type) {
                if (type == 'content') {
                    if (!this.umlsRef) {
                        this.umlsRef = this.database.ref('messages');
                    }
                    return this.umlsRef;
                }
            },
            //
            // Unified method to save content of the login'd user
            // and unknown user
            //
            saveContent: function(payload, callback) {
                var messagesRef = this._getMessageRef('content');
                if (!messagesRef)
                    callback(null);

                var currentUser = this.auth.currentUser;
                messagesRef.push({
                    version: 0, // default is 0
                    name: currentUser ? currentUser.displayName : "unknown",
                    title: payload.title, // UML title
                    type: payload.type, // uml/class etc or markdown
                    data: payload.data, // JSON description
                }).then(function(snapshot) {
                    if (callback) {
                      callback(snapshot.path);
                    }
                }.bind(this)).catch(function(error) {
                    var text = 'Error writing new message to Firebase Database';
                    console.error(text, error);
                    callback(null, text);
                });

            },
            //
            // Update an existing content
            //
            updateContent: function(uid, payload, callback) {
              var msg = this._getMessageRef('content');
              if (msg) {
                var ref = msg.child("-" +uid);
                ref.child('version').once('value').then(function(x) {
                  var position = x.val()+1;
                  ref
                  .child(position)
                  .push({data: payload.data, title: payload.title, type: payload.type})
                  .then(function(snapshot) {
                      if (callback) {
                        callback(snapshot.path);
                      }
                      ref.update({version: position});
                  }.bind(this))
                  .catch(function(error) {
                      var text = 'Error updating existing content to Firebase Database';
                      console.error(text, error);
                      callback(null, text);
                  });
                }); // ref get value
              }
            },
            //
            // User pop-up based authentication
            //
            signIn: function(method) {
                var provider;
                if (method == "Google")
                    provider = new firebase.auth.GoogleAuthProvider();
                if (provider)
                    this.auth.signInWithPopup(provider);
            },
            //
            // Sign-out from the current account
            //
            signOut: function() {
                this.auth.signOut();
            }
        });

        return Controller;
    }
);
