"use strict";

/**
 * Finite state automaton which facilitates a stateful approach to interacting with the server.
 *
 * The FSA is in one state at any given time, and it is this state which determines how to handle 
 * each of the following types of events:
 *     - User input (enter key or Execute button)
 *     - Message from the server
 *     - WebSocket connection closed
 *
 * An FSA state definition can implement the following functions:
 *     - enter(components, asyncTransitioner) 
 *         Called when transitioning into the state.
 *     - receiveUserInput(components, message, asyncTransitioner)
 *         Called when the user clicks Execute or hits the enter key in the input box.
 *     - receiveMessage(components, message, asyncTransitioner)
 *         Called when a message arrives from the server.
 *     - receiveClose(components, asyncTransitioner)
 *         Called when the WebSocket connection closes.
 * 
 * Each of these methods returns the name of the state to transition to, or returns undefined 
 * to stay at the same state. State implementations can also use the asyncTransitioner to cause 
 * a transition to occur at some point after returning undefined.
 *
 * Parameters:
 *  components - A container object containing references to each of the page's components
 */
define(function (require) {
    // Require the definitions of the various FSA states.
    var states = {};
    states.OpenConnection = require("fsa-states/OpenConnection");
    states.StartSession = require("fsa-states/StartSession");
    states.ResumeSession = require("fsa-states/ResumeSession");
    states.WaitingForUser = require("fsa-states/WaitingForUser");
    states.WaitingForResult = require("fsa-states/WaitingForResult");
    states.Error = require("fsa-states/Error");

    return function (components) {
        var _this = this;

        var _currentState;

        // Total number of times the FSA has transitioned to a different state.
        var _transitionCounter = 0;

        /**
         * Receive user input and delegate it to the handler associated with the current FSA state.
         */
        _this.userInput = function (statement) {
            var receiveUserInput = states[_currentState].receiveUserInput;

            if(!receiveUserInput) {
                console.log("The receiveUserInput event can't be handled in the current state! (" + _currentState + ")");
                return;
            }

            console.log("Received userInput in state " + _currentState);
            
            var newState = receiveUserInput(components, statement, new SafeTransitioner());
            transition(newState);
        }

        /**
         * Receive a message from the WebSocket and delegate it to the handler associated with the current FSA state.
         * The data sent from the server should be a JSON object. That object is what's passed into the FSA state handler.
         */
        _this.message = function (message) {
            var data = JSON.parse(message.data);
            
            var receiveMessage = states[_currentState].receiveMessage;

            if(!receiveMessage) {
                console.log("The receiveMessage event can't be handled in the current state! (" + _currentState + ")");
                return;
            }

            console.log("Received message in state " + _currentState);

            var newState = receiveMessage(components, data, new SafeTransitioner());
            transition(newState);
        }

        /**
         * Let the handler associated with the current FSA state know that the WebSocket has closed.
         */
        _this.close = function () {
            var receiveClose = states[_currentState].receiveClose;

            if(!receiveClose) {
                console.log("The receiveClose event can't be handled in the current state! (" + _currentState + ")");
                return;
            }

            console.log("Received close in state " + _currentState);

            var newState = receiveClose(components, new SafeTransitioner());
            transition(newState);
        }

        /**
         * Start the FSA with the startingState.
         */
        _this.start = function () {
            transition("OpenConnection");
        }

        /**
         * Switch to the given state, running the new state's enter() function if it's defined.
         */
        function transition(to) {
            // If the "to" state is undefined then stay in the same state.
            if(!to) {
                return;
            }

            // Increment transitionCounter before entering the new state so that the SafeTransitioner isn't completely 
            // worthless in the new state.
            _transitionCounter++;

            // Don't run the enter function if we're already at that state.
            // if(to === _currentState) {
            //     return;
            // }

            console.log("Transitioning from " + _currentState + " to " + to);

            _currentState = to;

            if(to.enter) {
                to.enter(components, new SafeTransitioner());
            }
        }

        /**
         * An instance of this inner class allows a state to call transition() as long as no other transitions have 
         * occurred since the instance was created.
         */
        function SafeTransitioner() {
            var __this = this;
            var __originalCount = _transitionCounter;

            __this.transition = function (to) {
                // Make sure that the SafeTransitioner isn't stale.
                if(__originalCount === _transitionCounter) {
                    return transition(to);
                } else {
                    throw "An FSA state tried to transition asynchronously but we've transitioned already.";
                }
            }
        }
    }
});