# logger-extra

> Simple and powerful log output plugin, Help you troubleshoot errors

English | [简体中文](https://github.com/a572251465/fast-logger/blob/main/README-zh.md)

## why choose logger-extra

- powerful plugin system
- support tree shaking
- support logger isolation by channel
- browser logger plugin support persistence
- dynamically differentiate the environment, easy to locate bugs

## install

- pnpm

```shell
pnpm install logger-extra
```

- npm

```shell
npm install logger-extra
```

- yarn

```shell
yarn add logger-extra
```

## simple use

```javascript
import {getLoggerFactory, BrowserLogPlugin} from "logger-extra";

const LoggerFactory = getLoggerFactory({
    appName: "myProject",
    // BrowserLogPlugin Browser print log plugin 
    plugins: [BrowserLogPlugin()],
});

const Logger = LoggerFactory.getLogger("channel-1");

Logger.warn("hehe1"); //  [myProject] 2024-08-31 16:58:20 [channel-1] warn hehe1
```

see [logger-extra Demo](https://gitee.com/li_haohao_1/logger-extra-demo)

## api format

### getLoggerFactory

#### params

| field   | required | type            | default value                            | description                               |
|---------|----------|-----------------|------------------------------------------|-------------------------------------------|
| appName | no       | string          | ""                                       | program name                              |
| tpl     | no       | string          | $appName $time $channel $signal $message | print template                            |
| plugins | yes      | Array<Function> | -                                        | subscribe message plugin. see plugin page |

#### return

`LoggerFactory` instance

#### use example

```javascript
const LoggerFactory = getLoggerFactory({
    tpl: "$appName $time $channel $signal $message",
    appName: "myProject",
    plugins: [BrowserLogPlugin()],
});
```

### LoggerFactory

#### params

| field   | required | default value | description                                  |
|---------|----------|---------------|----------------------------------------------|
| channel | no       | ""            | message channel, Basis for message isolation |

#### return

`Logger` instance

#### use example

```javascript
const LoggerFactory = getLoggerFactory({
    tpl: "$appName $time $channel $signal $message",
    appName: "myProject",
    plugins: [BrowserLogPlugin()],
});

const Logger = LoggerFactory.logger({channel: "test"});
```

### Logger

#### method

- `Logger.info(xxx)`
- `Logger.warn(xx)`
- `Logger.error(xx)`
- `Logger.debug(xx)`

#### use example

```javascript
const LoggerFactory = getLoggerFactory({
    tpl: "$appName $time $channel $signal $message",
    appName: "myProject",
    plugins: [BrowserLogPlugin()],
});

const Logger = LoggerFactory.logger({channel: "test"});

Logger.info("test");
```

## Plugin Introduction

> `logger-extra` Multi plugin logger system， allow the plugin install and
> uninstall, all message outputs depend on plugins。`logger-extra` just
> responsible for broadcasting
> so, custom plugin format as follows

| field   | required | description                      |
|---------|----------|----------------------------------|
| channel | no       | subscription chanel              |
| signal  | no       | subscription signal              |
| setup   | yes      | received message callback method |

`TS type definition`

```typescript
export const enum TypeRange {
    INFO = "info",
    ERROR = "error",
    DEBUG = "debug",
    WARN = "warn",
}

export type BaseParamSignalInfo = {
    channel: string;
    signal: Array<TypeRange>;
};

export interface PluginInstanceReturnType {
    channel: Array<string> | "*";
    signal: Array<TypeRange> | "*";
    setup: (
        message: string,
        params: BaseParamSignalInfo & {
            tpl: string;
        },
    ) => void;
}
```

### Inner Plugin Introduction

#### BrowserLogPlugin

##### params

| field      | required | default value      | description                 |
|------------|----------|--------------------|-----------------------------|
| persist    | no       | false              | output log persistence      |
| isPrintLog | no       | Built in functions | Whether to print or not log |

##### return

`see Plugin Introduction`

#### Built-in functions

```typescript
export function isLocal() {
    if (
        equals(typeof location, "undefined") ||
        !isObject(location) ||
        !isHas(location, "host")
    )
        return true;
    return ["localhost", "127.0.0.1"].includes(location.host);
}
```

## Distinguish environmental cases

> You can dynamically determine whether to print logs by monitoring variables
> under the window

```javascript
function isPrintLog() {
    if (["localhost", "127.0.0.1"].includes(location.host) || window["isPrintLog"] == 1) return true;
    return false;
}
```