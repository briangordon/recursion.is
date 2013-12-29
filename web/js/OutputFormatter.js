"use strict";

/**
 * Given a text string, return a div containing it.
 *
 * Parameters:
 *  text - The string to format. 
 */

define(function () {
    return function (text) {
        var lineDiv = $("<div class=\"output-line\"/>");
        if(text.substr(0, "> ".length) === "> ") {
            lineDiv.addClass("echoedStatement");
            text = "↪ " + text.slice("> ".length);
        } else if(text.substr(0, "ERROR ".length) === "ERROR ") {
            var errorLabel = $("<span class=\"label label-danger myBadge\">Error</span>");
            lineDiv.append(errorLabel);
            text = text.slice("ERROR ".length);
        }

        lineDiv.append(document.createTextNode(text));

        return lineDiv;
    }
});