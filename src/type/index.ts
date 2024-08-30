// 导出类型范围
export const enum TypeRange {
  INFO = "info",
  ERROR = "error",
  WARNING = "warning",
}

// 插件类型实例
export interface PluginInstanceType {
  channel: string;
  signal: Array<TypeRange> | "*";
  setup: (
    message: string,
    params: {
      channel: string;
      signal: Array<TypeRange>;
    },
  ) => void;
}

export type LoggerConfigInfo = {};
