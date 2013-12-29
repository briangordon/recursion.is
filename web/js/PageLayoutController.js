"use strict";

/**
 * Sets up events to control the relative sizes of the input and output boxes on the page.
 *
 * Parameters:
 *  containerID       - The DOM ID string of the container div around the input box and output box.
 *  notificationBoxID - The DOM ID string of the box for alert popups at the top of the screen.
 *  outputBoxID       - The DOM ID string of the big textarea where output will appear.
 *  inputBoxID        - The DOM ID string of the small input textarea.
 *  inputButtonID     - The DOM ID string of the button to the right of the input box.
 */

define(function (require) {
    var $ = require("jquery");
            require("jquery.autosize");

    return function (containerID, notificationBoxID, outputBoxID, inputBoxID, inputButtonID) {
        var _this = this;

        var _container;
        var _notificationBox;
        var _outputBox;
        var _inputBox;
        var _inputButton;

        /**
         * Trigger a refresh of the page's layout. This is useful when manually changing the text in the input box.
         */
        _this.refresh = function () {
            _inputBox.trigger("autosize.resize");
        }

        /**
         * Trigger a refresh of the page's layout, but only update the size of the output box, not the input box.
         */
        _this.refreshJustOutputBox = function () {
            resizeOutputBox();
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
            var notificationHeight = _notificationBox.height();

            _outputBox.height(containerHeight - inputHeight - notificationHeight - 35);
        }

        /**
         * Constructor
         */
        function ctor() {
            _container = $(document.getElementById(containerID));
            _notificationBox = $(document.getElementById(notificationBoxID));
            _outputBox = $(document.getElementById(outputBoxID));
            _inputBox = $(document.getElementById(inputBoxID));
            _inputButton = $(document.getElementById(inputButtonID));

            _inputBox.autosize({callback: inputResizedCallback});
            $(window).resize(resizeOutputBox);

            // Trigger the resize event manually in case the browser doesn't do it automatically. When I viewed the page on an old android 
            // tablet the resize didn't seem to occur on page load like it does in Chrome.
            $(window).resize();
        }

        ctor();
    };
});