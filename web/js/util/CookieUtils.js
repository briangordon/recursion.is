"use strict";

/**
 * Functions for manipulating cookies.
 */
define(function () {
    return {
        /**
         * If the given key is set, return its value. Otherwise return undefined.
         */
        read: function (key) {
            var key = key + "=";

            var keyValuePairs = document.cookie.split(";");

            for(var i = 0; i < keyValuePairs.length; i++) {
                var cur = keyValuePairs[i].trim();
                if(cur.indexOf(key) === 0) {
                    return cur.substr(key.length);
                }
            }

            return;
        },

        /**
         * Set the given key/value pair with an expiration date 5 years in the future.
         */
        write: function (key, value) {
            if(!key || !value || key === "" || value === "") {
                return;
            }

            // Expire 5 years in the future.
            var expiry = new Date();
            expiry.setFullYear(expiry.getFullYear() + 5);

            document.cookie = key + "=" + value + "; expires=" + expiry.toGMTString();
        }
    };
});