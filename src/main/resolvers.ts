import { resolver, NewInstance, Container } from "aurelia-dependency-injection";

@resolver()
export class DynamicNewInstance extends NewInstance {

    public key: any;

    public asKey: any;

    public dynamicDependencies: any[];

    public constructor(key, ...dynamicDependencies: any[]) {
        super(key);
        this.dynamicDependencies = dynamicDependencies;
    }

    public get(container: Container): any {
        let dynamicDependencies = this.dynamicDependencies.length > 0 ?
            this.dynamicDependencies.map(dependency => dependency["protocol:aurelia:resolver"] ?
            dependency.get(container) : container.invoke(dependency)) : undefined;
        const instance = container.invoke(this.key, dynamicDependencies);
        container.registerInstance(this.asKey, instance);
        return instance;
    }

    static of(key, ...dynamicDependencies: any[]) {
        return new DynamicNewInstance(key, ...dynamicDependencies);
    }

}
