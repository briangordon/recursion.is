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
    var format = require("util/OutputFormatter");

    return function (outputBoxID, maxLines) {
        var _this = this;

        var _outputBox = $(document.getElementById(outputBoxID));

        // The number of lines currently displayed in the output box
        var _numLines = 0;

        // When the same line is outputted multiple times we want to add a "x2" or "x3" badge rather than duplicate the output.
        // These variables track that state.
        var _lastText;
        var _lastElement;
        var _multiplier;
        var _multiplierElement;

        /**
         * Add the given text to the bottom of the output box.
         */
        _this.write = function (text) {
            if(!text) {
                return;
            }

            if(text === _lastText) {
                // The output was the same as the last line's output, so increment the multiple value instead of printing the text again.
                if(!_multiplierElement) {
                    _multiplierElement = $("<span class=\"badge myBadge\" /> ");
                    _lastElement.prepend(_multiplierElement);
                }
                _multiplier++;
                _multiplierElement.text(_multiplier);

            } else {
                _lastText = text;
                _lastElement = format(text);
                _multiplier = 1;
                _multiplierElement = undefined;

                _outputBox.append(_lastElement);

                // Enforce maximum number of output lines on-screen to avoid lag
                if(_numLines >= maxLines) {
                    _outputBox.children().first().remove();
                } else {
                    _numLines++;
                }

                // Scroll to the bottom
                _outputBox.scrollTop(_outputBox.prop("scrollHeight") - _outputBox.height())
            }
        }
    }
});