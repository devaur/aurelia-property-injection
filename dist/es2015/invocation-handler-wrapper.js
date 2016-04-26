import { InvocationHandler } from "aurelia-dependency-injection";

export let InvocationHandlerWrapper = class InvocationHandlerWrapper extends InvocationHandler {
    invoke(container, dynamicDependencies) {
        let instance = super.invoke(container, dynamicDependencies);
        return this.injectProperties(container, instance);
    }

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

};