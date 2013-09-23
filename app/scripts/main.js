/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        codemirror: {
            exports: 'CodeMirror'
        },
        '../bower_components/codemirror/mode/htmlmixed/htmlmixed': {
            deps: [
                'codemirror_css',
                'codemirror_javascript',
                'codemirror_xml'
            ]
        },
        jqTree: {
            deps: ['jquery']
        },
        bootstrap: {
            deps: ['jquery']
        },
        matchbrackets: {
            deps: ['codemirror']
        },
        foldcode: {
            deps: ['codemirror']
        },
        foldgutter: {
            deps: ['foldcode']
        },
        'match-highlighter': {
            deps: ['codemirror']
        },
        'brace-fold': {
            deps: ['foldgutter']
        },
        'comment-fold': {
            deps: ['foldgutter']
        },
        'indent-fold': {
            deps: ['foldgutter']
        },
        'xml-fold': {
            deps: ['foldgutter']
        },
        matchtags: {
            deps: ['xml-fold']
        },
        'active-line': {
            deps: ['codemirror']
        },
        'bootstrap-switch': {
            deps: ['jquery']
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/lodash/dist/lodash',
        codemirror: '../bower_components/codemirror/lib/codemirror',
        codemirror_css: '../bower_components/codemirror/mode/css/css',
        codemirror_javascript: '../bower_components/codemirror/mode/javascript/javascript',
        codemirror_xml: '../bower_components/codemirror/mode/xml/xml',
        jqTree: '../bower_components/jqtree/tree.jquery',
        localStorage: '../bower_components/Backbone.localStorage/backbone.localStorage',
        snap: '../bower_components/snapjs/snap',
        enquire: '../bower_components/enquire/dist/enquire',
        fastclick: '../bower_components/fastclick/lib/fastclick',
        bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
        matchbrackets: '../bower_components/codemirror/addon/edit/matchbrackets',
        foldcode: '../bower_components/codemirror/addon/fold/foldcode',
        foldgutter: '../bower_components/codemirror/addon/fold/foldgutter',
        'match-highlighter': '../bower_components/codemirror/addon/search/match-highlighter',
        'brace-fold': '../bower_components/codemirror/addon/fold/brace-fold',
        'comment-fold': '../bower_components/codemirror/addon/fold/comment-fold',
        'indent-fold': '../bower_components/codemirror/addon/fold/indent-fold',
        'xml-fold': '../bower_components/codemirror/addon/fold/xml-fold',
        matchtags: '../bower_components/codemirror/addon/edit/matchtags',
        'active-line': '../bower_components/codemirror/addon/selection/active-line',
        dropbox: '../bower_components/dropbox-build/dropbox',
        'bootstrap-switch': '../bower_components/bootstrap-switch/static/js/bootstrap-switch'
    }
});

require([
    'backbone',
    'views/sidebar',
    'views/githubmodal',
    'collections/fileList',
    'routes/application',
    'snap',
    'enquire',
    'fastclick',
    'utilities/filelistloader',
    'bootstrap',
    'jqTree',
    'dropbox',
    'bootstrap-switch'
], function (Backbone, Sidebar, GithubModalView, FileList, ApplicationRouter,
        Snap, enquire, FastClick, FileListLoader) {
    new ApplicationRouter;
    Backbone.history.start();

    enquire.register('screen and (min-width: 768px)', {
        openSnapper: function (side) {
            if (this.matched) {
                this.$snapContent.css(side, 0);
                this.$snapContent.css(side === 'left' ? 'right' : 'left', '266px');
            }
            this.snapper.open(side);
        },
        closeSnapper: function () {
            if (this.matched) {
                this.$snapContent.css({
                    left: 0,
                    right: 0
                });
            }
            this.snapper.close();
        },
        toggleSnapper: function (snapper, side) {
            return function () {
                if (snapper.state().state === side) {
                    this.closeSnapper();
                } else {
                    this.openSnapper(side);
                }
            };
        },
        setup: function () {
            this.$snapContent = $('.snap-content');
            this.snapper = new Snap({
                element: document.getElementById('content')
            });
            $('.navbar-tree').click(_.bind(
                this.toggleSnapper(this.snapper, 'left'), this));
            $('.navbar-settings').click(_.bind(
                this.toggleSnapper(this.snapper, 'right'), this));
        },
        match: function () {
            this.snapper.disable();
            this.matched = true;
            this.openSnapper('left');
        },
        unmatch: function () {
            this.closeSnapper();
            this.matched = false;
            this.snapper.enable();
        }
    });

    var sidebar = new Sidebar({
        el: '.snap-drawer-left',
        collection: FileList
    });


    var data = [{
        label: '/',
        id: '/'
    }];
    $('#dropbox-tree-view').tree({
        data: data,
        autoOpen: false,
        onLoadFailed: function (response) {
            alert("boo!");
            console.log(response);
        }
    });

    $('#dropbox-tree-view').bind(
        'tree.open',
        function (e) {
            console.log(e.node);
        }
    );

    FastClick.attach(document.body);

    $('#add-from-github').click(function() {
        GithubModalView.showModal();
    });

    // TEMP.
    $('#add-from-server').click(function() {
        FileListLoader.loadExistingFiles();
    });
});
