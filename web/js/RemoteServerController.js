"use strict";

/**
 * This is the interface through which we interact with the Java server. It maintains a single WebSocket 
 * connection.
 *
 * Parameters:
 *  serverAddress    - The URI where the Java server is reachable. This should include the port number.
 *  outputController - An instance of OutputController to which we can write results.
 */
define(function (require) {

    return function (serverAddress, outputController) {
        var _this = this;

        // After submitting a statement, we "lock" until a response comes back. During this time the user 
        // cannot submit another statement, although they can type freely. We start locked until a 
        // WebSocket connection is established.
        var _locked;

        // Current WebSocket object, which may be replaced in the event of an error or close.
        var _ws;

        // The pending query, which may need to be retried in the event of an error or clsoe.
        var _pendingQuery;

        // A little stub object from InputController which is capable of enabling and disabling user input 
        // in the UI. You can call .enable() and .disable() on this object.
        var _inputToggler;

        /**
         * Receive a statement to be submitted to the server for evaluation.
         */
        _this.submit = function (statement) {
            // First echo the statement into the outputController
            outputController.write("> " + statement);

            _pendingQuery = statement;
            runPendingQueryIfPossible();
        }

        /**
         * Prevent the user from submitting any new statements until the unlock method is called.
         *
         * This returns false if we were already locked.
         */
        function lock () {
            if(_locked) {
                return false;
            } else {
                if(_inputToggler) {
                    _inputToggler.disable();
                }
                return _locked = true;
            }
        }

        /**
         * Allow the user to submit a statement again.
         *
         * This returns false if we were not already locked.
         */
        function unlock () {
            if(!_locked) {
                return false;
            } else {
                if(_inputToggler) {
                    _inputToggler.enable();
                }
                _locked = false;
                return true;
            }
        }

        /**
         * Returns true iff we are locked.
         */
        _this.isLocked = function () {
            return _locked;
        }

        /**
         * Register an inputToggler object which can .enable() and .disable() user input.
         */
        _this.registerInput = function (inputToggler) {
            _inputToggler = inputToggler;
        }

        function newSocket() {
            _ws = new WebSocket(serverAddress);
            _ws.addEventListener("open", openHandler);
            _ws.addEventListener("close", closeHandler);
            _ws.addEventListener("error", errorHandler);
            _ws.addEventListener("message", messageHandler);
        }

        function openHandler() {
            unlock();
            runPendingQueryIfPossible();
        }

        function closeHandler() {
            console.log("Closed");
        }

        function errorHandler(err) {
            console.log("Error");
            console.log(err);
        }

        function messageHandler(message) {
            outputController.write(message.data);
            unlock();
        }

        function runPendingQueryIfPossible() {
            if(_pendingQuery && lock()) {
                _ws.send(_pendingQuery);
                _pendingQuery = undefined;
            }
        }

        _this.start = function () {
            // Start locked. We'll unlock when the WebSocket connection opens.
            lock();

            newSocket();
        }
    }
});