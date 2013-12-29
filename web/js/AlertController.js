"use strict";

/**
 * Creates banner notices across the top of the screen.
 *
 * Parameters:
 *  noticeID - The DOM ID string of the container where notices will appear
 *  _layout  - An instance of PageLayoutController which will be notified when we add a notification 
 *             or when the user closes a notification.
 */

define(function (require) {
    require("bootstrap");

    return function (noticeID, _layout) {
        var _this = this;

        var _noticeContainer = $(document.getElementById(noticeID));

        _this.addBlueNotification = function (headline, text) {
            addNotification("alert-info", headline, text);
        }

        _this.addRedNotification = function (headline, text) {
            addNotification("alert-danger", headline, text);
        }

        _this.addYellowNotification = function (headline, text) {
            addNotification("alert-warning", headline, text);
        }

        _this.addGreenNotification = function (headline, text) {
            addNotification("alert-success", headline, text);
        }

        function addNotification (className, headline, text) {
            var notification = $("<div class=\"alert alert-dismissable\">");
            notification.addClass(className);

            var closeButton = $("<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>");
            notification.append(closeButton);

            if(headline && headline !== "") {
                notification.append($("<strong>" + headline + "</strong>"));
                text = " " + text;
            }
            var message = document.createTextNode(text);
            notification.append(message);
            //notification.alert();
            notification.bind("closed.bs.alert", function () {
                notification.remove();

                // Resize the output box to fill the space left by the closed alert.
                _layout.refreshJustOutputBox();
            });

            _noticeContainer.append(notification);
            _layout.refreshJustOutputBox();
        }
    }
});