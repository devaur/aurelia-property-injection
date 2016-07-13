"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var invocation_handler_1 = require('./invocation-handler');
__export(require('./decorators'));
function configure(frameworkConfiguration, config) {
    var Handler = config && config.injectConstructor ? invocation_handler_1.PropertyConstructorInvocationHandler : invocation_handler_1.PropertyInvocationHandler;
    frameworkConfiguration.container.setHandlerCreatedCallback(function (handler) {
        return handler.fn.injectProperties ? new Handler(handler.fn, handler.invoker, handler.dependencies) : handler;
    });
}
exports.configure = configure;
//# sourceMappingURL=index.js.map