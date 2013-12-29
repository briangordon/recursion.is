"use strict";

/**
 * Given a text string, return a div containing it.
 *
 * Parameters:
 *  text - The string to format. 
 */

define(function () {
    return function (text) {
        var lineDiv = $("<div class='output-line'/>");
        if(text.substr(0, 2) === "> ") {
            lineDiv.addClass("echoedStatement");
            text = text.slice(2);
        }

        lineDiv.text(text);

        return lineDiv;
    }
});