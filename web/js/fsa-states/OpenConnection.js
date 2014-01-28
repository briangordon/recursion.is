"use strict";

/**
 * A state which exists only to open a WebSocket and transition to either SessionStart or 
 * SessionResume depending on whether the client already has a session.
 */

define(function (require) {
    var config = require("module").config();

    return {
        /**
         * This function is always called upon entering this state.
         */
        enter: function (components, asyncTransitioner) {
            var ws = new WebSocket(config.url);

            ws.onerror = function () {
                components.alert.addRedNotification("Connection error", "Couldn't connect to the recursion.is server.")

                asyncTransitioner.transition("Error");
            }

            ws.onopen = function () {
                components.output.write("OK Connected to server.");

                // Register the new WebSocket with the global WebSocketHolder.
                components.ws.replace(ws);

                // Set WebSocket events to delegate through the FSA.
                ws.onmessage = components.fsa.message;
                ws.onclose = components.fsa.close;

                // Do we already have a session?
                if(components.session.getSession()) {
                    // Resume the existing session.
                    asyncTransitioner.transition("ResumeSession");
                } else { 
                    // Start a new session.
                    asyncTransitioner.transition("StartSession");
                }
            }
        }
    };
});