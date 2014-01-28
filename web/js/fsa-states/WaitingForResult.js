"use strict";

/**
 * We've received user input and sent it to the server. In this state we wait for a response and 
 * refuse further input from the user.
 */

define(function () {
    return {
        /**
         * Function to be called when the WebSocket receives a message while the FSA is in this state.
         */
        receiveMessage: function (components, message, asyncTransitioner) {
            if(message.result === "timeout") {
                components.output.write("WARNING Your expression took too long to evaluate so it was aborted.")
            } else if(message.result === "error") {
                components.output.write("ERROR Your expression caused an exception in the server.");
            } else if(message.result === "buffer_flush") {
                components.output.write(message.buffer);
            } else if(message.result === "done") {
                if(message.buffer) {
                    components.output.write(message.buffer);
                }

                return "WaitingForUser";
            }
        },

        /**
         * Function to be called when the WebSocket closes while the FSA is in this state.
         */
        receiveClose: function (components, asyncTransitioner) {
            components.output.write("ERROR Lost connection to the server in the middle of evaluation.");

            return "OpenConnection";
        }
    };
});