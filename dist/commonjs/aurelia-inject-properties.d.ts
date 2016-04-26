declare module 'aurelia-inject-properties' {
  import {
    metadata
  } from 'aurelia-metadata';
  import {
    InvocationHandler
  } from 'aurelia-dependency-injection';
  
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
    invoke(container: any, dynamicDependencies: any): any;
    
    /**
        * Injects property dependencies if the conventional `injectProperties` is defined.
        * @param container The calling container.
        * @param instance The target of injection.
        * @return The instance with injected properties.
        */
    injectProperties(container: any, instance: any): any;
  }
  
  /**
  * Decorator: Directs the TypeScript transpiler to write-out type metadata for the decorated class/property.
  */
  export function autoinject(potentialTarget: any, potentialKey: any): any;
  
  /**
  * Decorator: Specifies the dependencies that should be injected by the DI Container into the decorated class/function/property.
  */
  export function inject(...rest: any[]): any;
}