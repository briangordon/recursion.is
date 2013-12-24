"use strict";

/**
 * This is the interface through which we interact with the Java server.
 *
 * Parameters:
 *  serverAddress    - The URI where the Java server is reachable. This should include the port number.
 *  outputController - An instance of OutputController to which we can write results
 */
define(function (require) {

    return function (serverAddress, outputController) {
        var _this = this;

        /**
         * Receive a statement to be submitted to the server for evaluation.
         */
        _this.submit = function (statement) {
            // For now just echo the statement right back into the outputController
            outputController.write(statement);
        }
    }
});