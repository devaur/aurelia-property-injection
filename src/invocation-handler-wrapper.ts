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
