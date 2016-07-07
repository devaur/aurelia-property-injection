import { Container, InvocationHandler } from 'aurelia-dependency-injection';

/**
* Invocation handler to inject properties.
*/
export class PropertyInvocationHandler extends InvocationHandler {

    /**
    * Invokes the function.
    * @param container The calling container.
    * @param dynamicDependencies Additional dependencies to use during invocation.
    * @return The result of the function invocation.
    */
    invoke(container: Container, dynamicDependencies?: any[]): any {
        const instance = super.invoke(container, dynamicDependencies);
        return this.injectProperties(container, instance);
    }

    /**
    * Injects property dependencies if the conventional `injectProperties` is defined.
    * @param container The calling container.
    * @param instance The target of injection.
    * @return The instance with injected properties.
    */
    injectProperties(container: Container, instance: any): any {
        const injectProperties = (<any>this.fn).injectProperties;
        for (let property in injectProperties) {
            instance[property] = container.get(injectProperties[property]);
        }
        if (instance.afterConstructor) {
            instance.afterConstructor.call(instance);
        }
        return instance;
    }

}

/**
* Invocation handler to inject properties available in constructor.
*/
export class PropertyConstructorInvocationHandler extends InvocationHandler {

    /**
    * Invokes the function.
    * @param container The calling container.
    * @param dynamicDependencies Additional dependencies to use during invocation.
    * @return The result of the function invocation.
    */
    invoke(container: Container, dynamicDependencies?: any[]): any {
        const injectProperties = (<any>this.fn).injectProperties;
        const injectProps = Object.create(null);
        for (let property in injectProperties) {
            injectProps[property] = {
                value: container.get(injectProperties[property])
            };
        }
        // inject properties as soon as object is created, before calling constructor
        const instance = Object.create(this.fn.prototype || null, injectProps);
        let i = this.dependencies.length;
        let args = new Array(i);

        while (i--) {
            args[i] = container.get(this.dependencies[i]);
        }

        if (dynamicDependencies) {
            args = args.concat(dynamicDependencies);
        }

        // call constructor
        this.fn.apply(instance, args);
        return instance;
    }

}
