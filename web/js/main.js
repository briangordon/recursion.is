"use strict";

/**
 * The main entry point for the page's scripts.
 */

// Configure requirejs
require.config({
    baseUrl: "js/",
    paths: {
        "jquery":           "lib/jquery-2.0.3",
        "jquery.autosize":  "lib/jquery.autosize",
        "bootstrap":        "lib/bootstrap"
    },
    shim: {
        "jquery.autosize":  ["jquery"],
        "bootstrap":        ["jquery"]
    },

    // Add a cache-busting query string if we're NOT running in Rhino (where the optimizer runs). 
    // Checking for the Packages identifier is how r.js detects if it's running in Rhino.
    urlArgs: ((typeof Packages === "undefined") ? "noCache=" + new Date().getTime() : undefined)
});

// Start application
require(["Application"]);