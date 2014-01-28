"use strict";

/**
 * In this state, we have a connection to the server but we haven't yet established a session. The goal is to 
 * start a brand-new session.
 */

define(function () {
    return {
        /**
         * This function is always called upon entering this state.
         */
        enter: function (components, asyncTransitioner) {
            var startRequest = {
                "operation": "start"
            };

            components.ws.write(startRequest);
        },

        /**
         * Function to be called when the WebSocket receives a message while the FSA is in this state.
         */
        receiveMessage: function (components, message, asyncTransitioner) {
            if(message.result === "ok") {
                components.session.setSession(message.sessionid);

                return "WaitingForUser";
            }

            components.alert.addRedNotification("Unexpected problem.", "We couldn't create a new session for you.");
            return "Error";
        },

        /**
         * Function to be called when the WebSocket closes while the FSA is in this state.
         */
        receiveClose: function (components, asyncTransitioner) {
            return "OpenConnection";
        }
    };
});