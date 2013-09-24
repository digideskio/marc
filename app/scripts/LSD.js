/*global define*/

// LSD.js - localStorage, Distributed.

(function () {
    'use strict';

    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(factory);
        } else {
            // Browser globals
            root.LSD = factory();
        }
    }(this, function () {
        return localStorage;
    }));
}());

