"use strict";

/**
 * Handles output to the output box.
 *
 * Parameters:
 *  outputBoxID - The DOM ID string of the big textarea where output will appear.
 *  maxLines    - The maximum number of lines to retain in the output box. If more than this number of 
 *                lines is outputted then the earliest remaining line is removed.
 */

define(function (require) {
    var $      = require("jquery");
    var format = require("OutputFormatter");

    return function (outputBoxID, maxLines) {
        var _this = this;

        var _outputBox;

        // The number of lines currently displayed in the output box
        var _numLines = 0;

        /**
         * Add the given text to the bottom of the output box.
         */
        _this.write = function (text) {
            _outputBox.append(format(text));

            // Enforce maximum number of output lines on-screen to avoid lag
            if(_numLines >= maxLines) {
                _outputBox.children().first().remove();
            } else {
                _numLines++;
            }

            // Scroll to the bottom
            _outputBox.scrollTop(_outputBox.prop("scrollHeight") - _outputBox.height())
        }

        /**
         * Constructor
         */
        function ctor() {
            _outputBox = $(document.getElementById(outputBoxID));
        }

        ctor();
    }
});