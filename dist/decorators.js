"use strict";
var aurelia_metadata_1 = require('aurelia-metadata');
var aurelia_dependency_injection_1 = require('aurelia-dependency-injection');
var metadataType = 'design:type';
var emptyParameters = Object.freeze([]);
/**
* Decorator: Directs the TypeScript transpiler to write-out type metadata for the decorated class/property.
*/
function autoinject(potentialTarget, potentialKey) {
    var deco = function (target, key, descriptor) {
        if (!key) {
            target.inject = aurelia_metadata_1.metadata.getOwn(aurelia_metadata_1.metadata.paramTypes, target, key) || emptyParameters;
        }
        else if (!descriptor) {
            if (!target.constructor.injectProperties) {
                target.constructor.injectProperties = Object.create(null);
            }
            target.constructor.injectProperties[key] = aurelia_metadata_1.metadata.getOwn(metadataType, target, key);
        }
    };
    return potentialTarget ? deco(potentialTarget, potentialKey) : deco;
}
exports.autoinject = autoinject;
function injectFn(target, key, descriptor) {
    var inject = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        inject[_i - 3] = arguments[_i];
    }
    if (key) {
        if (descriptor && descriptor.configurable) {
            descriptor.value.inject = inject;
        }
        else {
            var injectProperties = target.constructor.injectProperties;
            if (!injectProperties) {
                target.constructor.injectProperties = injectProperties = Object.create(null);
            }
            injectProperties[key] = inject[0];
            if (descriptor) {
                descriptor.writable = true;
            }
        }
    }
    else {
        target.inject = inject;
    }
}
;
/**
* Decorator: Specifies the dependencies that should be injected by the DI Container into the decorated class/function/property.
*/
function inject() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i - 0] = arguments[_i];
    }
    return function (target, key, descriptor) {
        injectFn.apply(void 0, [target, key, descriptor].concat(rest));
    };
}
exports.inject = inject;
/**
 * Decorator: Used to allow functions/classes to specify resolution of all matches to a key.
 */
function all(type) {
    return function (target, key, desc) {
        injectFn(target, key, desc, aurelia_dependency_injection_1.All.of(type));
    };
}
exports.all = all;
/**
 * Decorator: Used to inject the dependency from the parent container instead of the current one.
 */
function parent(type) {
    return function (target, key, desc) {
        if (!type) {
            // typescript
            type = aurelia_metadata_1.metadata.get(metadataType, target, key);
        }
        injectFn(target, key, desc, aurelia_dependency_injection_1.Parent.of(type));
    };
}
exports.parent = parent;
/**
 * Decorator: Used to allow functions/classes to specify lazy resolution logic.
 */
function lazy(type) {
    return function (target, key, desc) {
        injectFn(target, key, desc, aurelia_dependency_injection_1.Lazy.of(type));
    };
}
exports.lazy = lazy;
/**
 * Decorator: Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
 */
function optional(type) {
    return function (target, key, desc) {
        if (!type) {
            // typescript
            type = aurelia_metadata_1.metadata.get(metadataType, target, key);
        }
        injectFn(target, key, desc, aurelia_dependency_injection_1.Optional.of(type));
    };
}
exports.optional = optional;
/**
 * Decorator: Used to allow injecting dependencies but also passing data to the constructor.
 */
function factory(type) {
    return function (target, key, desc) {
        injectFn(target, key, desc, aurelia_dependency_injection_1.Factory.of(type));
    };
}
exports.factory = factory;
/**
 * Decorator: Used to inject a new instance of a dependency, without regard for existing
 * instances in the container.
 */
function newInstance(type) {
    var dynamicDependencies = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        dynamicDependencies[_i - 1] = arguments[_i];
    }
    return function (target, key, desc) {
        injectFn(target, key, desc, aurelia_dependency_injection_1.NewInstance.of.apply(aurelia_dependency_injection_1.NewInstance, [type].concat(dynamicDependencies)));
    };
}
exports.newInstance = newInstance;
//# sourceMappingURL=decorators.js.map