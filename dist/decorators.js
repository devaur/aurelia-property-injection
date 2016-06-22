"use strict";
var aurelia_metadata_1 = require('aurelia-metadata');
var aurelia_dependency_injection_1 = require('aurelia-dependency-injection');
/**
* Decorator: Directs the TypeScript transpiler to write-out type metadata for the decorated class/property.
*/
function autoinject(potentialTarget, potentialKey) {
    var deco = function (target, key, descriptor) {
        if (key === undefined) {
            target.inject = aurelia_metadata_1.metadata.getOwn(aurelia_metadata_1.metadata.paramTypes, target, key) || Object.freeze([]);
        }
        else if (descriptor === undefined) {
            if (target.constructor.injectProperties === undefined) {
                target.constructor.injectProperties = Object.create(null);
            }
            target.constructor.injectProperties[key] = aurelia_metadata_1.metadata.getOwn("design:type", target, key);
        }
    };
    return potentialTarget ? deco(potentialTarget, potentialKey) : deco;
}
exports.autoinject = autoinject;
/**
* Decorator: Specifies the dependencies that should be injected by the DI Container into the decorated class/function/property.
*/
function inject() {
    var rest = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        rest[_i - 0] = arguments[_i];
    }
    return function (target, key, descriptor) {
        if (key !== undefined) {
            if (descriptor.configurable) {
                var fn = descriptor.value;
                fn.inject = rest;
            }
            else {
                if (target.constructor.injectProperties === undefined) {
                    target.constructor.injectProperties = Object.create(null);
                }
                target.constructor.injectProperties[key] = rest[0];
                descriptor.writable = true;
            }
        }
        else {
            target.inject = rest;
        }
    };
}
exports.inject = inject;
/**
 * Decorator: Used to allow functions/classes to specify resolution of all matches to a key.
 */
function all(type) {
    return function (target, key, desc) {
        inject(aurelia_dependency_injection_1.All.of(type))(target, key, desc ? desc : {});
    };
}
exports.all = all;
/**
 * Decorator: Used to inject the dependency from the parent container instead of the current one.
 */
function parent(type) {
    return function (target, key, desc) {
        if (type === undefined) {
            // typescript
            type = aurelia_metadata_1.metadata.get('design:type', target, key);
        }
        inject(aurelia_dependency_injection_1.Parent.of(type))(target, key, desc ? desc : {});
    };
}
exports.parent = parent;
/**
 * Decorator: Used to allow functions/classes to specify lazy resolution logic.
 */
function lazy(type) {
    return function (target, key, desc) {
        inject(aurelia_dependency_injection_1.Lazy.of(type))(target, key, desc ? desc : {});
    };
}
exports.lazy = lazy;
/**
 * Decorator: Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
 */
function optional(type) {
    return function (target, key, desc) {
        if (type === undefined) {
            // typescript
            type = aurelia_metadata_1.metadata.get('design:type', target, key);
        }
        inject(aurelia_dependency_injection_1.Optional.of(type))(target, key, desc ? desc : {});
    };
}
exports.optional = optional;
/**
 * Decorator: Used to allow injecting dependencies but also passing data to the constructor.
 */
function factory(type) {
    return function (target, key, desc) {
        inject(aurelia_dependency_injection_1.Factory.of(type))(target, key, desc ? desc : {});
    };
}
exports.factory = factory;
//# sourceMappingURL=decorators.js.map