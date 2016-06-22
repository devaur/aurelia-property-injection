"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var invocation_handler_wrapper_1 = require("./invocation-handler-wrapper");
exports.InvocationHandlerWrapper = invocation_handler_wrapper_1.InvocationHandlerWrapper;
function configure(frameworkConfiguration) {
    frameworkConfiguration.container.setHandlerCreatedCallback(function (handler) {
        return new invocation_handler_wrapper_1.InvocationHandlerWrapper(handler.fn, handler.invoker, handler.dependencies);
    });
}
exports.configure = configure;
__export(require("./decorators"));
//# sourceMappingURL=index.js.map