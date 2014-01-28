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
            var label = $("<span class=\"label label-danger myBadge\">Error</span>");
            lineDiv.append(label);
            text = text.slice("ERROR ".length);
        } else if(text.substr(0, "WARNING ".length) === "WARNING ") {
            var label = $("<span class=\"label label-warning myBadge\">Warning</span>");
            lineDiv.append(label);
            text = text.slice("WARNING ".length);
        } else if(text.substr(0, "OK ".length) === "OK ") {
            var label = $("<span class=\"label label-success myBadge\">OK</span>");
            lineDiv.append(label);
            text = text.slice("OK ".length);
        }

        lineDiv.append(document.createTextNode(text));

        return lineDiv;
    }
});