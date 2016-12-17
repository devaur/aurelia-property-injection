import { Container, InvocationHandler } from 'aurelia-dependency-injection';
/**
* Invocation handler to inject properties.
*/
export declare class PropertyInvocationHandler extends InvocationHandler {
    /**
    * Invokes the function.
    * @param container The calling container.
    * @param dynamicDependencies Additional dependencies to use during invocation.
    * @return The result of the function invocation.
    */
    invoke(container: Container, dynamicDependencies?: any[]): any;
    /**
    * Injects property dependencies if the conventional `injectProperties` is defined.
    * @param container The calling container.
    * @param instance The target of injection.
    * @return The instance with injected properties.
    */
    injectProperties(container: Container, instance: any): any;
}
/**
* Invocation handler to inject properties available in constructor.
*/
export declare class PropertyConstructorInvocationHandler extends InvocationHandler {
    /**
    * Invokes the function.
    * @param container The calling container.
    * @param dynamicDependencies Additional dependencies to use during invocation.
    * @return The result of the function invocation.
    */
    invoke(container: Container, dynamicDependencies?: any[]): any;
}
