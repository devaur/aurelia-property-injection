define(["exports", "./decorators", "./invocation-handler-wrapper"], function (exports, _decorators, _invocationHandlerWrapper) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.InvocationHandlerWrapper = undefined;
    exports.configure = configure;
    Object.keys(_decorators).forEach(function (key) {
        if (key === "default") return;
        Object.defineProperty(exports, key, {
            enumerable: true,
            get: function () {
                return _decorators[key];
            }
        });
    });
    function configure(frameworkConfiguration) {
        frameworkConfiguration.container.setHandlerCreatedCallback(function (handler) {
            return new _invocationHandlerWrapper.InvocationHandlerWrapper(handler.fn, handler.invoker, handler.dependencies);
        });
    }

    exports.InvocationHandlerWrapper = _invocationHandlerWrapper.InvocationHandlerWrapper;
});