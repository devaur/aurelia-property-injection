import {metadata} from 'aurelia-metadata';
import {All,Parent,Lazy,Optional,Factory} from 'aurelia-dependency-injection';

import { InvocationHandler } from "aurelia-dependency-injection";

/**
* Wraps the core `InvocationHandler` to inject into properties.
*/
export class InvocationHandlerWrapper extends InvocationHandler {

    /**
    * Invokes the function.
    * @param container The calling container.
    * @param dynamicDependencies Additional dependencies to use during invocation.
    * @return The result of the function invocation.
    */
    invoke(container, dynamicDependencies) {
        let instance = super.invoke(container, dynamicDependencies);
        return this.injectProperties(container, instance);
    }

    /**
    * Injects property dependencies if the conventional `injectProperties` is defined.
    * @param container The calling container.
    * @param instance The target of injection.
    * @return The instance with injected properties.
    */
    injectProperties(container, instance) {
        if ("injectProperties" in this.fn) {
            let dependencies = this.fn["injectProperties"];
            for (let property in dependencies) {
                instance[property] = container.get(dependencies[property]);
            }
            if ("afterConstructor" in instance) {
                instance.afterConstructor.call(instance);
            }
        }
        return instance;
    }

}

/**
* Decorator: Directs the TypeScript transpiler to write-out type metadata for the decorated class/property.
*/
export function autoinject(potentialTarget?: any, potentialKey?: any): any {
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
export function inject(...rest: any[]): any {
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
export function all(type) {
    return function (target, key, desc) {
        inject(All.of(type))(target, key, desc ? desc : {});
    };
}

/**
 * Decorator: Used to inject the dependency from the parent container instead of the current one.
 */
export function parent(type) {
    return function(target, key, desc) {
        if (type === undefined) {
            // typescript
            type = metadata.get('design:type', target, key);
        }
        inject(Parent.of(type))(target, key, desc ? desc : {});
    };
}

/**
 * Decorator: Used to allow functions/classes to specify lazy resolution logic.
 */
export function lazy(type) {
    return function(target, key, desc) {
        inject(Lazy.of(type))(target, key, desc ? desc : {});
    };
}

/**
 * Decorator: Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
 */
export function optional(type) {
    return function(target, key, desc) {
        if (type === undefined) {
            // typescript
            type = metadata.get('design:type', target, key);
        }
        inject(Optional.of(type))(target, key, desc ? desc : {});
    };
}

/**
 * Decorator: Used to allow injecting dependencies but also passing data to the constructor.
 */
export function factory(type) {
    return function (target, key, desc) {
        inject(Factory.of(type))(target, key, desc ? desc : {});
    };
}
