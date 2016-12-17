"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var aurelia_dependency_injection_1 = require("aurelia-dependency-injection");
var DynamicNewInstance = DynamicNewInstance_1 = (function (_super) {
    __extends(DynamicNewInstance, _super);
    function DynamicNewInstance(key) {
        var dynamicDependencies = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            dynamicDependencies[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, key) || this;
        _this.dynamicDependencies = dynamicDependencies;
        return _this;
    }
    DynamicNewInstance.prototype.get = function (container) {
        var dynamicDependencies = this.dynamicDependencies.length > 0 ?
            this.dynamicDependencies.map(function (dependency) { return dependency["protocol:aurelia:resolver"] ?
                dependency.get(container) : container.invoke(dependency); }) : undefined;
        var instance = container.invoke(this.key, dynamicDependencies);
        container.registerInstance(this.asKey, instance);
        return instance;
    };
    DynamicNewInstance.of = function (key) {
        var dynamicDependencies = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            dynamicDependencies[_i - 1] = arguments[_i];
        }
        return new (DynamicNewInstance_1.bind.apply(DynamicNewInstance_1, [void 0, key].concat(dynamicDependencies)))();
    };
    return DynamicNewInstance;
}(aurelia_dependency_injection_1.NewInstance));
DynamicNewInstance = DynamicNewInstance_1 = __decorate([
    aurelia_dependency_injection_1.resolver(),
    __metadata("design:paramtypes", [Object, Object])
], DynamicNewInstance);
exports.DynamicNewInstance = DynamicNewInstance;
var DynamicNewInstance_1;

//# sourceMappingURL=resolvers.js.map
