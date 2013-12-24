"use strict";

define(function (require) {
    var PageLayoutController   = require("PageLayoutController");
    var OutputController       = require("OutputController");
    var InputController        = require("InputController");
    var RemoteServerController = require("RemoteServerController");

    // Execute when the DOM is ready
    $(function () {
        var layout = new PageLayoutController("container", "outputBox", "inputBox", "inputButton");
        var output = new OutputController("outputBox", 100);
        var remote = new RemoteServerController("app.recursion.is:1123", output);
        var input = new InputController(layout, remote, "inputBox", "inputButton");
    });
});