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
            loadContent: function(uid, callback) {
                if (type != "uml" && typ != "markdown")
                    return;
                this.messagesRef = this.database.ref('.' + type + 's/' + uid).once('value').then(function(snapshot) {
                    if (callback)
                        callback(snapshot.val());
                });

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
            updateContent: function(uid, payload) {

            },
            //
            // Fork an existing content
            //
            forkContent: function(uid, payload) {

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