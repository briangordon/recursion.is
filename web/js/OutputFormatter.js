"use strict";

/**
 * Given a text string, return a div containing it.
 */

define(function () {
    return function (text) {
        var lineDiv = $("<div class='output-line'/>");
        if(text.substr(0, 2) === "> ") {
            lineDiv.addClass("echoedStatement");
        }

        lineDiv.text(text);

        return lineDiv;
    }
});