/**
 * Decorator: Directs the TypeScript transpiler to write-out type metadata for the decorated class/property.
 */
export declare function autoinject(potentialTarget?: any, potentialKey?: any): any;
/**
 * Decorator: Specifies the dependencies that should be injected by the DI Container into the decorated class/function/property.
 */
export declare function inject(...rest: any[]): Function;
/**
 * Decorator: Used to allow functions/classes to specify resolution of all matches to a key.
 */
export declare function all(type: any): (target: any, key: any, desc?: any) => void;
/**
 * Decorator: Used to inject the dependency from the parent container instead of the current one.
 */
export declare function parent(type: any): (target: any, key: any, desc?: any) => void;
/**
 * Decorator: Used to allow functions/classes to specify lazy resolution logic.
 */
export declare function lazy(type: any): (target: any, key: any, desc?: any) => void;
/**
 * Decorator: Used to allow functions/classes to specify an optional dependency, which will be resolved only if already registred with the container.
 */
export declare function optional(type: any): (target: any, key: any, desc?: any) => void;
/**
 * Decorator: Used to allow injecting dependencies but also passing data to the constructor.
 */
export declare function factory(type: any): (target: any, key: any, desc?: any) => void;
/**
 * Decorator: Used to inject a new instance of a dependency, without regard for existing
 * instances in the container.
 */
export declare function newInstance(type: any, ...dynamicDependencies: any[]): (target: any, key: any, desc?: any) => void;
