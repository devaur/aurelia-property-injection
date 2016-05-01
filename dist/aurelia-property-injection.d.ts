declare module 'aurelia-property-injection' {
  import {
    metadata
  } from 'aurelia-metadata';
  import {
    All,
    Parent,
    Lazy,
    Optional,
    Factory
  } from 'aurelia-dependency-injection';
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
  
  /**
   * Decorator: Used to allow functions/classes to specify resolution of all matches to a key.
   */
  export function all(type: any): any;
  
  /**
   * Decorator: Used to inject the dependency from the parent container instead of the current one.
   */
  export function parent(type: any): any;
  
  /**
   * Decorator: Used to allow functions/classes to specify lazy resolution logic.
   */
  export function lazy(type: any): any;
  
  /**
   * Decorator: Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
   */
  export function optional(type: any): any;
  
  /**
   * Decorator: Used to allow injecting dependencies but also passing data to the constructor.
   */
  export function factory(type: any): any;
}