import { metadata } from 'aurelia-metadata';

/**
* Decorator: Directs the TypeScript transpiler to write-out type metadata for the decorated class/property.
*/
export function autoinject(potentialTarget, potentialKey) {
    let deco = function (target, key, descriptor) {
        if (key === undefined) {
            target.inject = metadata.getOwn(metadata.paramTypes, target, key) || Object.freeze([]);
        }
        else if (descriptor === undefined) {
            if (target.constructor.injectProperties === undefined) {
                target.constructor.injectProperties = Object.create(null);
            }
            target.constructor.injectProperties[key] = metadata.getOwn("design:type", target, key);
        }
    };
    return potentialTarget ? deco(potentialTarget, potentialKey) : deco;
}

/**
* Decorator: Specifies the dependencies that should be injected by the DI Container into the decorated class/function/property.
*/
export function inject(...rest) {
    return function (target, key, descriptor) {
        if (key !== undefined) {
            if (descriptor.configurable) {
                const fn = descriptor.value;
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

/**
 * Decorator: Used to allow functions/classes to specify resolution of all matches to a key.
 */
export function all(type: any) {
    return function (target, key) {
        inject(All.of(type))(target, key);
    };
}

/**
 * Decorator: Used to inject the dependency from the parent container instead of the current one.
 */
export function parent(type?: any) {
    return function(target, key) {
        type = type ? type : metadata.get('design:type', target, key);
        inject(Parent.of(type))(target, key);
    };
}

/**
 * Decorator: Used to allow functions/classes to specify lazy resolution logic.
 */
export function lazy(type) {
    return function(target, key) {
        inject(Lazy.of(type))(target, key);
    };
}

/**
 * Decorator: Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
 */
export function optional(type) {
    return function(target, key) {
        type = (type !== undefined) ? type : metadata.get('design:type', target, key);
        inject(Optional.of(type))(target, key);
    };
}

/**
 * Decorator: Used to allow injecting dependencies but also passing data to the constructor.
 */
export function factory(type) {
    return function (target, key) {
        inject(Factory.of(type))(target, key);
    };
}
