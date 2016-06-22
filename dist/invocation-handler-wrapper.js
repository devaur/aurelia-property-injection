"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
/**
* Wraps the core `InvocationHandler` to inject into properties.
*/
var InvocationHandlerWrapper = (function (_super) {
    __extends(InvocationHandlerWrapper, _super);
    function InvocationHandlerWrapper() {
        _super.apply(this, arguments);
    }
    /**
    * Invokes the function.
    * @param container The calling container.
    * @param dynamicDependencies Additional dependencies to use during invocation.
    * @return The result of the function invocation.
    */
    InvocationHandlerWrapper.prototype.invoke = function (container, dynamicDependencies) {
        var instance = _super.prototype.invoke.call(this, container, dynamicDependencies);
        return this.injectProperties(container, instance);
    };
    /**
    * Injects property dependencies if the conventional `injectProperties` is defined.
    * @param container The calling container.
    * @param instance The target of injection.
    * @return The instance with injected properties.
    */
    InvocationHandlerWrapper.prototype.injectProperties = function (container, instance) {
        if ("injectProperties" in this.fn) {
            var dependencies = this.fn["injectProperties"];
            for (var property in dependencies) {
                instance[property] = container.get(dependencies[property]);
            }
            if ("afterConstructor" in instance) {
                instance.afterConstructor.call(instance);
            }
        }
        return instance;
    };
    return InvocationHandlerWrapper;
}(aurelia_dependency_injection_1.InvocationHandler));
exports.InvocationHandlerWrapper = InvocationHandlerWrapper;
//# sourceMappingURL=invocation-handler-wrapper.js.map