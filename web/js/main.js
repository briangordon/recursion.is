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
    urlArgs: "noCache=" + new Date().getTime(),
});

// Start application
require(["Application"]);