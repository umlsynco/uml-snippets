requirejs.config({

    baseUrl: '/',
    paths: {
        'backbone': 'js/lib/backbone/backbone',
        'marionette': 'js/lib/backbone.marionette/lib/backbone.marionette',
        'underscore': 'js/lib/underscore/underscore',
        'jquery': 'js/lib/jquery/dist/jquery',
        'jquery-ui': 'js/lib/jquery-ui',
        'jquery-editable': 'js/lib/editable/editable',
        'combomenu': 'js/lib/jquery.combomenu',
        'app': 'js/app',
        'module': 'js/app/modules',
        'model': 'js/app/models',
        'view': 'js/app/views',
        'colorpicker': 'js/lib/jquery-simplecolorpicker/jquery.simplecolorpicker'
    },
    shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'marionette': {
            deps: ['backbone'],
            exports: 'Marionette'
        },
        'jquery-editable': {
            deps: ['jquery']
        },
        'colorpicker': {
            deps: ['jquery']
        },
        'underscore': {
            exports: '_'
        },
        jquery: {
            exports: '$'
        }
    }
});

require(['app'], function(app) {
    app.start();
});
