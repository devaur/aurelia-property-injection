import {metadata} from 'aurelia-metadata';

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
