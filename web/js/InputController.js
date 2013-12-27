"use strict";

/**
 * Handles input from the input box.
 *
 * Parameters:
 *  layout        - An instance of PageLayoutController which will be notified when we clear the input box.
 *  remote        - An instance of RemoteServerController which will be used when the user submits a statement.
 *  inputBoxID    - The DOM ID string of the small input textarea.
 *  inputButtonID - The DOM ID string of the button to the right of the input box.
 */

define(function (require) {
    var $ = require("jquery");

    return function (layout, remote, inputBoxID, inputButtonID) {
        var _this = this;

        var _inputBox;
        var _inputButton;

        // The history of all statements which have been submitted through the input box.
        var _history = [];

        // The user can use the up/down arrows to search back and forward through the history. This is the 
        // index of the currently selected history item, where 0 is the index of the most recent item. -1 
        // signifies that no history item is selected.
        var _historyIndex = -1;

        // After submitting a statement, we "lock" until a response comes back. During this time the user 
        // cannot submit another statement, although they can type freely.
        var _locked = false;

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
                    layout.refresh();
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
                    layout.refresh();
                }
            }
        }

        /**
         * Submit the current contents of the input box and clear it.
         */
        function submitStatement() {
            // Don't do anything if we're already waiting on another statement.
            if(_locked) {
                return;
            }

            lock();

            var value = _inputBox.val();

            // Don't do anything if the user didn't input anything.
            if(value.length === 0 || value === " ") {
                return;
            }

            _historyIndex = -1;
            _history.unshift(value);

            // Clear the box right away to give the illusion of responsiveness
            _inputBox.val("");

            // Notify the PageLayoutController that we've altered the contents of the input box
            layout.refresh();

            // Now submit the statement to the RemoteServerController
            remote.submit(value, unlock);
        }

        /**
         * Prevent the user from submitting any new statements until the unlock method is called.
         */
        function lock() {
            _locked = true;

            _inputButton.disabled = true;
        }

        function unlock() {
            _locked = false;

            _inputButton.disabled = false;
        }

        /**
         * Constructor
         */
        function ctor() {
            _inputBox = $(document.getElementById(inputBoxID));
            _inputButton = $(document.getElementById(inputButtonID));

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
            })

            _inputBox.focus();
        }

        ctor();
    }
});