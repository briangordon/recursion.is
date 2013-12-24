"use strict";

/**
 * Given a text string, return a div containing it.
 */

define(function () {
    return function (text) {
        var lineDiv = $("<div class='output-line'/>");
        lineDiv.text(text);

        return lineDiv;
    }
});