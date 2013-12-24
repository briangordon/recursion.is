"use strict";

/**
 * Sets up events to control the relative sizes of the input and output boxes on the page.
 *
 * Parameters:
 *  containerID   - The DOM ID string of the container div around the input box and output box.
 *  outputBoxID   - The DOM ID string of the big textarea where output will appear.
 *  inputBoxID    - The DOM ID string of the small input textarea.
 *  inputButtonID - The DOM ID string of the button to the right of the input box.
 */

define(function (require) {
    var $ = require("jquery");
            require("jquery.autosize");

    return function (containerID, outputBoxID, inputBoxID, inputButtonID) {
        var _this = this;

        var _container;
        var _outputBox;
        var _inputBox;
        var _inputButton;

        /**
         * Trigger a refresh of the page's layout. This is useful when resizing the page or manually changing the text in the input box.
         */
        _this.refresh = function () {
            _inputBox.trigger("autosize.resize");
        }

        /**
         * Function which is called when the input box is automatically resized by jquery.autosize.
         */
        function inputResizedCallback() {
            // Resize the button in the input group to match the new height of the input box because Bootstrap won't do that itself.
            _inputButton.height(_inputBox.height());

            // Since the input box's height has changed, we also need to change the height of the output box so that they fit the page snugly.
            resizeOutputBox();
        }

        /**
         * Grow or shrink the _outputBox to fill the _container.
         */
        function resizeOutputBox() {
            var inputHeight = _inputBox.height();
            var containerHeight = _container.height();

            _outputBox.height(containerHeight - inputHeight - 35);
        }

        /**
         * Constructor
         */
        function ctor() {
            _container = $(document.getElementById(containerID));
            _outputBox = $(document.getElementById(outputBoxID));
            _inputBox = $(document.getElementById(inputBoxID));
            _inputButton = $(document.getElementById(inputButtonID));

            _inputBox.autosize({callback: inputResizedCallback});
            $(window).resize(resizeOutputBox);
        }

        ctor();
    };
});