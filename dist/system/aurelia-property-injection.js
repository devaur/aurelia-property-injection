"use strict";

System.register(["./invocation-handler-wrapper", "./decorators"], function (_export, _context) {
    "use strict";

    var InvocationHandlerWrapper;
    return {
        setters: [function (_invocationHandlerWrapper) {
            InvocationHandlerWrapper = _invocationHandlerWrapper.InvocationHandlerWrapper;
        }, function (_decorators) {
            var _exportObj = {};

            for (var _key in _decorators) {
                if (_key !== "default") _exportObj[_key] = _decorators[_key];
            }

            _export(_exportObj);
        }],
        execute: function () {
            function configure(frameworkConfiguration) {
                frameworkConfiguration.container.setHandlerCreatedCallback(function (handler) {
                    return new InvocationHandlerWrapper(handler.fn, handler.invoker, handler.dependencies);
                });
            }

            _export("configure", configure);

            _export("InvocationHandlerWrapper", InvocationHandlerWrapper);
        }
    };
});