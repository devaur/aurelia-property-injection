# aurelia-property-injection

[![CircleCI](https://circleci.com/gh/heruan/aurelia-property-injection.svg?style=shield)](https://circleci.com/gh/heruan/aurelia-property-injection)

This plugin enables the core Aurelia's DI Container to inject dependencies into class instance properties,
lifting the constructor from being the dependency bearer and decoupling child classes from parent dependencies.

The implementation follows the _Convention over configuration_ paradigm, assuming the presence of a static `injectProperties` enumeration of `property: Type` to satisfy dependencies. For example, having a class like this:

```javascript
import {Router} from 'aurelia-router';

export class MyClass {

  static injectProperties = {
    router: Router
  };

}
```
the container will produce an instance of `MyClass` with the current `Router` available in the `router` property.

It also provides extended implementations of the core `inject` and `autoinject` decorators, e.g.

```javascript
import {inject} from 'aurelia-property-injection';
import {Router} from 'aurelia-router';

export class MyClass {

  @inject(Router)
  router;

}
```

and for TypeScript

```typescript
import {autoinject} from 'aurelia-property-injection';

export class MyClass {

  @autoinject
  private router: Router;

}
```

## Installing the plugin

Install the plugin via NPM:

```shell
npm install --save aurelia-property-injection
```

## Enabling the plugin

To enable the plugin, simply `use` it in the Aurelia's main configuration of your application:

```javascript
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('aurelia-property-injection');

  aurelia.start().then(() => aurelia.setRoot());
}
```
