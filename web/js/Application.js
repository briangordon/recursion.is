"use strict";

// Global variables for debug access in the JavaScript console.
var LAYOUT, ALERT, OUTPUT, REMOTE, INPUT;

define(function (require) {
    var PageLayoutController   = require("PageLayoutController");
    var OutputController       = require("OutputController");
    var InputController        = require("InputController");
    var RemoteServerController = require("RemoteServerController");
    var AlertController        = require("AlertController");

    // Execute when the DOM is ready
    $(function () {
        var layout = new PageLayoutController("container", "notificationBox", "outputBox", "inputBox", "inputButton");
        var alert = new AlertController("notificationBox", layout);
        var output = new OutputController("outputBox", 100);
        var remote = new RemoteServerController("ws://app.recursion.is:1123", output);
        var input = new InputController(layout, remote, "inputBox", "inputButton");

        // Now that the InputController is registered with the RemoteServerController, we're ready to make 
        // a WebSocket connection. We don't want to start making the connection during the construction of  
        // RemoteServerController because it's not super explicitly clear that registerInput will have been 
        // called by the time the 
        remote.start();

        // Set debug variables
        LAYOUT = layout;
        ALERT = alert;
        OUTPUT = output;
        REMOTE = remote;
        INPUT = input;
    });
});