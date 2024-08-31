# logger-extra

> 简单 且 强大的日志输出插件, 帮助你迅速定位错误

简体中文 | [English](https://github.com/a572251465/fast-logger/blob/main/README.md)

## 为什么选择 logger-extra

- 强大的插件系统
- 支持 tree shaking
- 支持 日志按照channel 进行隔离
- 浏览器插件支持日志持久化
- 动态区分环境，易于定位错误

## 安装

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

## 简单使用

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

参照 [logger-extra Demo](https://gitee.com/li_haohao_1/logger-extra-demo)

## api 格式介绍

### getLoggerFactory

#### 参数

| field   | required | type            | default value                            | description         |
|---------|----------|-----------------|------------------------------------------|---------------------|
| appName | no       | string          | ""                                       | 程序名称                |
| tpl     | no       | string          | $appName $time $channel $signal $message | 日志输出模板              |
| plugins | yes      | Array<Function> | -                                        | 订阅消息的插件, 详细见 plugin |

#### 返回值

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

| field   | required | default value | description          |
|---------|----------|---------------|----------------------|
| channel | no       | ""            | 消息通道, 日志消息隔离 按照通道进行的 |

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

> `logger-extra` 多插件日志系统， 允许插件 安装 以及卸载
> , 所有的消息输出都是依赖于插件。`logger-extra` 仅仅为了广播消息。
> 所以 自定义插件的格式如下：

| field   | required | description |
|---------|----------|-------------|
| channel | no       | 订阅的通道       |
| signal  | no       | 订阅的信号       |
| setup   | yes      | 接受消息的回调方法   |

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

| field      | required | default value | description                |
|------------|----------|---------------|----------------------------|
| persist    | no       | false         | 输出日志的持久化，最多允许保存300条消息，滚动覆盖 |
| isPrintLog | no       | 内置函数          | 取决于合适打印日志                  |

##### return

`见 插件介绍`

#### 内置函数

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

## 区分环境的案例

> 可以通过监听window下的变量 动态决定是否打印log

```javascript
function isPrintLog() {
    if (["localhost", "127.0.0.1"].includes(location.host) || window["isPrintLog"] == 1) return true;
    return false;
}
```