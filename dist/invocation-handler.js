"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var aurelia_dependency_injection_1 = require('aurelia-dependency-injection');
/**
* Invocation handler to inject properties.
*/
var PropertyInvocationHandler = (function (_super) {
    __extends(PropertyInvocationHandler, _super);
    function PropertyInvocationHandler() {
        _super.apply(this, arguments);
    }
    /**
    * Invokes the function.
    * @param container The calling container.
    * @param dynamicDependencies Additional dependencies to use during invocation.
    * @return The result of the function invocation.
    */
    PropertyInvocationHandler.prototype.invoke = function (container, dynamicDependencies) {
        var instance = _super.prototype.invoke.call(this, container, dynamicDependencies);
        return this.injectProperties(container, instance);
    };
    /**
    * Injects property dependencies if the conventional `injectProperties` is defined.
    * @param container The calling container.
    * @param instance The target of injection.
    * @return The instance with injected properties.
    */
    PropertyInvocationHandler.prototype.injectProperties = function (container, instance) {
        var injectProperties = this.fn.injectProperties;
        for (var property in injectProperties) {
            instance[property] = container.get(injectProperties[property]);
        }
        if (instance.afterConstructor) {
            instance.afterConstructor.call(instance);
        }
        return instance;
    };
    return PropertyInvocationHandler;
}(aurelia_dependency_injection_1.InvocationHandler));
exports.PropertyInvocationHandler = PropertyInvocationHandler;
/**
* Invocation handler to inject properties available in constructor.
*/
var PropertyConstructorInvocationHandler = (function (_super) {
    __extends(PropertyConstructorInvocationHandler, _super);
    function PropertyConstructorInvocationHandler() {
        _super.apply(this, arguments);
    }
    /**
    * Invokes the function.
    * @param container The calling container.
    * @param dynamicDependencies Additional dependencies to use during invocation.
    * @return The result of the function invocation.
    */
    PropertyConstructorInvocationHandler.prototype.invoke = function (container, dynamicDependencies) {
        var injectProperties = this.fn.injectProperties;
        var injectProps = Object.create(null);
        for (var property in injectProperties) {
            injectProps[property] = {
                configurable: true,
                enumerable: true,
                writable: true,
                value: container.get(injectProperties[property])
            };
        }
        // inject properties as soon as object is created, before calling constructor
        var instance = Object.create(this.fn.prototype || null, injectProps);
        var i = this.dependencies.length;
        var args = new Array(i);
        while (i--) {
            args[i] = container.get(this.dependencies[i]);
        }
        if (dynamicDependencies) {
            args = args.concat(dynamicDependencies);
        }
        // call constructor
        this.fn.apply(instance, args);
        return instance;
    };
    return PropertyConstructorInvocationHandler;
}(aurelia_dependency_injection_1.InvocationHandler));
exports.PropertyConstructorInvocationHandler = PropertyConstructorInvocationHandler;
//# sourceMappingURL=invocation-handler.js.map