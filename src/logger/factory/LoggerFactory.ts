import { LoggerGlobalType } from "../../type";
import { Logger } from "../Logger";
import { valueOrDefault } from "jsmethod-extra";

export class LoggerFactory {
  private readonly globalConfig: LoggerGlobalType;

  constructor(globalConfig: LoggerGlobalType) {
    this.globalConfig = globalConfig;
  }

  getLogger(channel?: string) {
    const newChannel = valueOrDefault(channel, "*")!;
    return new Logger(newChannel, this.globalConfig);
  }
}
