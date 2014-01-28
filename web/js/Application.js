"use strict";

// Global variable for debug access in the JavaScript console.
var GOD;

define(function (require) {
    var PageLayoutController = require("components/PageLayoutController");
    var OutputController     = require("components/OutputController");
    var InputController      = require("components/InputController");
    var AlertController      = require("components/AlertController");
    var SessionController    = require("components/SessionController");
    var WebSocketHolder      = require("components/WebSocketHolder");
    var FSA                  = require("FSA");

    // Execute when the DOM is ready
    $(function () {
        // ID strings used in index.html.
        var domIDs = {
            notification: "notificationBox",
            output:       "outputBox",
            inputBox:     "inputBox",
            inputButton:  "inputButton",
            container:    "container"
        }

        // Container object to allow different components to easily call methods on each other.
        var components = {};

        components.layout  = new PageLayoutController(domIDs.container, domIDs.notification, domIDs.output, domIDs.inputBox, domIDs.inputButton);
        components.alert   = new AlertController(domIDs.notification, components);
        components.output  = new OutputController(domIDs.output, 100);
        components.input   = new InputController(domIDs.inputBox, domIDs.inputButton, components);
        components.session = new SessionController();
        components.ws      = new WebSocketHolder();
        components.fsa     = new FSA(components);

        components.fsa.start();

        // Set debug variable
        GOD = components;
    });
});