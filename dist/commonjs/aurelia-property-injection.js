"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InvocationHandlerWrapper = undefined;
exports.configure = configure;

var _decorators = require("./decorators");

Object.keys(_decorators).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function get() {
            return _decorators[key];
        }
    });
});

var _invocationHandlerWrapper = require("./invocation-handler-wrapper");

function configure(frameworkConfiguration) {
    frameworkConfiguration.container.setHandlerCreatedCallback(function (handler) {
        return new _invocationHandlerWrapper.InvocationHandlerWrapper(handler.fn, handler.invoker, handler.dependencies);
    });
}

exports.InvocationHandlerWrapper = _invocationHandlerWrapper.InvocationHandlerWrapper;