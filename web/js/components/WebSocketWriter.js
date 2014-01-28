"use strict";

/**
 * Allows clients to write into the WebSocket without having access to anything else like changing the 
 * event handlers or closing the connection.
 */

define(function () {
    return function () {
        var _this = this;

        var _ws;

        /**
         * Hold a new WebSocket.
         */
        _this.replace = function (newWs) {
            _ws = newWs;
        }

        /**
         * Write into the WebSocket we're currently holding.
         */
        _this.write = function (message) {
            if(!_ws) {
                throw "Tried to write to the WebSocketHolder before it was initialized.";
            }

            _ws.send(message);
        }
    }
});