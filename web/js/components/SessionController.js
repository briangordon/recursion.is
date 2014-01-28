"use strict";

/**
 * Manages user session information.
 */

define(function (require) {
    var CookieUtils = require("util/CookieUtils");

    return function () {
        var _this = this;

        // Identifies our session.
        var _sessID;

        /**
         * Return the session ID if we know about a session that we can resume.
         */
        _this.getSession = function () {
            return _sessID;
        }

        /**
         * Register session information obtained from the server.
         */
        _this.setSession = function(id) {
            _sessID = id;

            writeToCookie();
        }

        /**
         * Write the current _sessID and _sessKey to a cookie for next time.
         */
        function writeToCookie() {
            CookieUtils.write("id", _sessID);
        }

        /**
         * Attempt to read session information from a cookie.
         */
        function readFromCookie() {
            _sessID = CookieUtils.read("id");
        }

        function ctor() {
            readFromCookie();
        }

        ctor();
    }
});