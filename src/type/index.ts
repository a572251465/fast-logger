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

export type PluginInstanceParamType = Partial<{
  persist: boolean;
  isPrintLog: (params: BaseParamSignalInfo) => boolean;
}>;

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

export interface LoggerGlobalType {
  tpl?: string;
  appName?: string;
  plugins: Array<PluginInstanceReturnType>;
}
