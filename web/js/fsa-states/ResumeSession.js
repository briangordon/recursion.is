"use strict";

/**
 * In this state, we have a connection to the server but we haven't yet established a session. The goal is to 
 * resume an already-existing session which was found in a cookie.
 */

define(function () {
    return {
        /**
         * This function is always called upon entering this state.
         */
        enter: function (components, asyncTransitioner) {
            var sessionID = components.session.getSession();

            if(!sessionID) {
                // This shouldn't be possible.
                throw "Entered ResumeSession state without a session.";
            }

            var resumeRequest = {
                "operation": "resume",
                "id": sessionID
                "clock": ?? // make sure that the server you're connecting to has the LATEST session info, not just "some" session info.
            };

            components.ws.write(resumeRequest);
        },

        /**
         * Function to be called when the WebSocket receives a message while the FSA is in this state.
         */
        receiveMessage: function (components, message, asyncTransitioner) {
            if(message.result === "id not found") {
                components.alert.addRedNotification("Error!", "Sorry, we couldn't resume your session. " + 
                    "Instead, we started a new one.");

                return "StartSession";
            } else if(message.result === "wait") {
                components.alert.addYellowNotification("Please wait.", "We're having some trouble loading your session from the database. Hold on a moment.");

                return;
            } else if(message.result === "ok") {
                components.alert.addGreenNotification("All right!", "Resumed your previous session.");

                return "WaitingForUser";
            }
        },

        /**
         * Function to be called when the WebSocket closes while the FSA is in this state.
         */
        receiveClose: function (components, asyncTransitioner) {
            return "OpenConnection";
        }
    };
});