"use strict";

/**
 * In this state we're just waiting for the user to give us a command.
 */

define(function () {
    return {
        /**
         * This function is always called upon entering this state.
         */
        enter: function (components, asyncTransitioner) {
            components.input.enableInput();
        },

        /**
         * Function to be called when the WebSocket receives a message while the FSA is in this state.
         */
        receiveMessage: function (components, message, asyncTransitioner) {
            
        },

        /**
         * Function to be called when the WebSocket closes while the FSA is in this state.
         */
        receiveClose: function (components, asyncTransitioner) {
            components.input.disableInput();

            components.alert.addYellowNotification("Connection problem.", "Lost connection to the server. Reconnecting.");

            return "OpenConnection";
        },

        /**
         * Function to be called when the user submits input while the FSA is in this state.
         */
        receiveUserInput: function (components, statement, asyncTransitioner) {
            components.input.statementAccepted();
            components.input.disableInput();

            var evaluateRequest = {
                "operation": "evaluate",
                "expression": statement
            }

            components.ws.write(evaluateRequest);
        }
    };
});