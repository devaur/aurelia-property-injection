import { metadata } from 'aurelia-metadata';
import { All, Parent, Lazy, Optional, Factory, NewInstance } from 'aurelia-dependency-injection';

var metadataType = 'design:type';
var emptyParameters = Object.freeze([]);

/**
* Decorator: Directs the TypeScript transpiler to write-out type metadata for the decorated class/property.
*/
export function autoinject(potentialTarget?: any, potentialKey?: any): any {
    const deco = function (target, key, descriptor?) {
        if (!key) {
            target.inject = metadata.getOwn(metadata.paramTypes, target, key) || emptyParameters;
        } else if (!descriptor) {
            if (!target.constructor.injectProperties) {
                target.constructor.injectProperties = Object.create(null);
            }
            target.constructor.injectProperties[key] = metadata.getOwn(metadataType, target, key);
        }
    };
    return potentialTarget ? deco(potentialTarget, potentialKey) : deco;
}

function injectFn(target, key, descriptor, ...inject: any[]) {
    if (key) {
        if (descriptor && descriptor.configurable) {
            descriptor.value.inject = inject;
        } else {
            let injectProperties = target.constructor.injectProperties;
            if (!injectProperties) {
                target.constructor.injectProperties = injectProperties = Object.create(null);
            }
            injectProperties[key] = inject[0];
            if (descriptor) {
                descriptor.writable = true;
            }
        }
    } else {
        target.inject = inject;
    }
};

/**
* Decorator: Specifies the dependencies that should be injected by the DI Container into the decorated class/function/property.
*/
export function inject(...rest: any[]): Function {
    return function (target, key, descriptor) {
        injectFn(target, key, descriptor, ...rest);
    };
}

/**
 * Decorator: Used to allow functions/classes to specify resolution of all matches to a key.
 */
export function all(type) {
    return function (target, key, desc?) {
        injectFn(target, key, desc, All.of(type));
    };
}

/**
 * Decorator: Used to inject the dependency from the parent container instead of the current one.
 */
export function parent(type) {
    return function(target, key, desc?) {
        if (!type) {
            // typescript
            type = metadata.get(metadataType, target, key);
        }
        injectFn(target, key, desc, Parent.of(type));
    };
}

/**
 * Decorator: Used to allow functions/classes to specify lazy resolution logic.
 */
export function lazy(type) {
    return function(target, key, desc?) {
        injectFn(target, key, desc, Lazy.of(type));
    };
}

/**
 * Decorator: Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
 */
export function optional(type) {
    return function(target, key, desc?) {
        if (!type) {
            // typescript
            type = metadata.get(metadataType, target, key);
        }
        injectFn(target, key, desc, Optional.of(type));
    };
}

/**
 * Decorator: Used to allow injecting dependencies but also passing data to the constructor.
 */
export function factory(type) {
    return function (target, key, desc?) {
        injectFn(target, key, desc, Factory.of(type));
    };
}

/**
 * Decorator: Used to inject a new instance of a dependency, without regard for existing
 * instances in the container.
 */
export function newInstance(type) {
    return function (target, key, desc?) {
        injectFn(target, key, desc, NewInstance.of(type));
    };
}
