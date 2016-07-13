import { NewInstance, Container } from "aurelia-dependency-injection";
export declare class DynamicNewInstance extends NewInstance {
    key: any;
    asKey: any;
    dynamicDependencies: any[];
    constructor(key: any, ...dynamicDependencies: any[]);
    get(container: Container): any;
    static of(key: any, ...dynamicDependencies: any[]): DynamicNewInstance;
}
