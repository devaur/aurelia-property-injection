import { InvocationHandler } from "aurelia-dependency-injection";
/**
* Wraps the core `InvocationHandler` to inject into properties.
*/
export declare class InvocationHandlerWrapper extends InvocationHandler {
    /**
    * Invokes the function.
    * @param container The calling container.
    * @param dynamicDependencies Additional dependencies to use during invocation.
    * @return The result of the function invocation.
    */
    invoke(container: any, dynamicDependencies: any): any;
    /**
    * Injects property dependencies if the conventional `injectProperties` is defined.
    * @param container The calling container.
    * @param instance The target of injection.
    * @return The instance with injected properties.
    */
    injectProperties(container: any, instance: any): any;
}
