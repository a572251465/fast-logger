import {
  emitterAndTaker,
  isArray,
  isFunction,
  isNotEmpty,
  valueOrDefault,
} from "jsmethod-extra";
import { LoggerGlobalType, PluginInstanceReturnType, TypeRange } from "../type";
import { defaults } from "../utils/variable";
import { overlappingMerge, verifyTpl } from "../utils/tools";
import { LoggerFactory } from "./factory/LoggerFactory";
import { COMMON_PREFIX } from "../utils/constants";

let INSTANCE: LoggerFactory | null = null;

function fireSubscribe(plugins: Array<PluginInstanceReturnType>) {
  for (const item of plugins) {
    const newItem = Object.assign(
      {},
      defaults.defaultPluginInfo,
      item,
    ) as PluginInstanceReturnType;

    const { channel, signal, setup } = newItem;

    if (!isFunction(setup)) throw new Error("param [setup] must be a function");

    let newChannel: Array<string> = [],
      newSignal: Array<TypeRange> = [];

    if (isArray(channel) && channel.length > 0)
      newChannel = channel as Array<string>;
    if (Array.isArray(signal) && signal.length > 0)
      newSignal = signal as Array<TypeRange>;
    else
      newSignal = [
        TypeRange.DEBUG,
        TypeRange.ERROR,
        TypeRange.INFO,
        TypeRange.WARN,
      ];

    // 从这里设置订阅
    const newRs = overlappingMerge(newChannel, newSignal);
    for (const v1 of newRs) emitterAndTaker.on(COMMON_PREFIX + v1, setup);
  }
}

export function getLoggerFactory(config: LoggerGlobalType) {
  const params = Object.assign(
    {},
    defaults.defaultGlobalInfo,
    valueOrDefault(config, {}),
  );

  verifyTpl(params.tpl!);

  if (isNotEmpty(INSTANCE))
    throw new Error("LoggerFactory instance already exists");

  INSTANCE = new LoggerFactory(params);

  fireSubscribe(params.plugins);
  return INSTANCE!;
}
