"use strict";

/**
 * The error state. We go here if something terrible has gone wrong and there's no way to recover.
 * It is impossible to transition out of this state.
 */

define(function () {
    return {
        /**
         * This function is always called upon entering this state.
         */
        enter: function (components, asyncTransitioner) {
            
        },

        /**
         * Function to be called when the user submits input while the FSA is in this state.
         */
        receiveUserInput: function (components, statement, asyncTransitioner) {
            components.output.write("ERROR The application has previously encountered an error so it cannot accept user input.");
        }
    };
});