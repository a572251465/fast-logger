import { isLocal } from "./tools";
import { LoggerGlobalType, PluginInstanceParamType } from "../type";

export const expressionCache = [
  "$appName",
  "$time",
  "$channel",
  "$signal",
  "$message",
];
export const signalColorCache = new Map<string, string>([
  ["info", ""],
  ["error", "#ff595a"],
  ["debug", "#1878ff"],
  ["warn", "#fece00"],
]);
export const defaults = {
  defaultBrowserLogParams: {
    persist: false,
    isPrintLog: isLocal,
  } as Required<PluginInstanceParamType>,
  defaultGlobalInfo: {
    tpl: expressionCache.join(" "),
    appName: "-",
    plugins: [],
  } as LoggerGlobalType,
  defaultPluginInfo: {
    channel: "*",
    signal: "*",
  },
};
