"use strict";

/**
 * Handles input from the input box.
 *
 * Parameters:
 *  inputBoxID    - The DOM ID string of the small input textarea.
 *  inputButtonID - The DOM ID string of the button to the right of the input box.
 *  _components   - A container object containing each of the page's components
 */

define(function (require) {
    var $ = require("jquery");

    return function (inputBoxID, inputButtonID, _components) {
        var _this = this;

        var _inputBox = $(document.getElementById(inputBoxID));
        var _inputButton = $(document.getElementById(inputButtonID));

        // The history of all statements which have been submitted through the input box.
        var _history = [];

        // The user can use the up/down arrows to search back and forward through the history. This is the 
        // index of the currently selected history item, where 0 is the index of the most recent item. -1 
        // signifies that no history item is selected.
        var _historyIndex = -1;

        /**
         * Function which is called on keydown within the input box.
         */
        function keyDownHandler(event) {
            // The enter key was pressed so submit the query.
            if (event.which === 13) {
                event.preventDefault();

                submitStatement();

            // The up key was pressed so go back in the history
            } else if (event.which === 38) {
                event.preventDefault();

                if(_historyIndex + 1 < _history.length) {
                    _historyIndex++;
                    _inputBox.val(_history[_historyIndex]);
                    _components.layout.refresh();
                }

            // The down key was pressed so go forward in the history
            } else if (event.which === 40) {
                event.preventDefault();

                if(_historyIndex >= 0) {
                    _historyIndex--;
                    if(_historyIndex == -1) {
                        _inputBox.val("");
                    } else {
                        _inputBox.val(_history[_historyIndex]);
                    }
                    _components.layout.refresh();
                }
            }
        }

        /**
         * This method will be called by the FSA if it accepts the submitted statement.
         */
        _this.statementAccepted = function () {
            // Add this statement to the local history.
            _historyIndex = -1;
            _history.unshift(value);

            // Clear the box right away to give the illusion of responsiveness.
            _inputBox.val("");

            // Notify the PageLayoutController that we've altered the contents of the input box.
            _components.layout.refresh();
        }

        /**
         * Submit the current contents of the input box.
         */
        function submitStatement() {
            var value = _inputBox.val();

            // Don't trigger the whole userInput event stuff if it's just an empty string.
            if(value.length === 0 || value === " " || value === "  ") {
                return;
            }

            _components.fsa.userInput(value);
        }

        /**
         * Disable the "Execute" button.
         */
        _this.disableInput = function () {
            _inputButton.prop("disabled", true);
        }

        /**
         * Re-enable the "Execute" button.
         */
        _this.enableInput = function () {
            _inputButton.prop("disabled", false);
        }

        /**
         * Focus on the input box.
         */
        _this.refocus = function () {
            _inputBox.focus();
        }

        /**
         * Constructor
         */
        function ctor() {
            _inputBox.keydown(keyDownHandler);
            _inputButton.click(function () {
                _inputBox.focus();
                submitStatement();
            });

            _inputBox.focus(function () {
                _inputButton.addClass("activeButtonAddon");
            });

            _inputBox.blur(function () {
                _inputButton.removeClass("activeButtonAddon");
            });

            _this.disableInput();

            _this.refocus();
        }

        ctor();
    }
});