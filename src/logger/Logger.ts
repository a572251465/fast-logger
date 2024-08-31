import { BaseParamSignalInfo, LoggerGlobalType, TypeRange } from "../type";
import { isMark } from "../utils/tools";
import { emitterAndTaker, timeFormatting, TimeType } from "jsmethod-extra";
import { COMMON_PREFIX } from "../utils/constants";
import { fieldWrapper } from "../wrapper/fieldWrapper";

export class Logger {
  constructor(
    public channel: string,
    public globalInfo: LoggerGlobalType,
  ) {
    this.channel = channel;
    this.globalInfo = globalInfo;
  }

  private commonHandler(type: TypeRange, message: string) {
    const composeK = isMark(this.channel) + type;
    const { tpl, appName } = this.globalInfo;

    const compareMap = new Map([
      ["$appName", appName!],
      ["$time", timeFormatting(TimeType.TWO)],
      ["$channel", this.channel],
      ["$signal", type],
      ["$message", message],
    ]);

    const realData = tpl!
      .split(" ")
      .map((k) => fieldWrapper(k, compareMap.get(k)!))
      .join(" ");

    const otherParam: BaseParamSignalInfo & { tpl: string } = {
      channel: this.channel,
      signal: [type],
      tpl: tpl!,
    };
    emitterAndTaker.emit(COMMON_PREFIX + composeK, realData, otherParam);
    emitterAndTaker.emit(COMMON_PREFIX + type, realData, otherParam);
  }

  public info(message: string) {
    this.commonHandler(TypeRange.INFO, message);
  }

  public debug(message: string) {
    this.commonHandler(TypeRange.DEBUG, message);
  }

  public warn(message: string) {
    this.commonHandler(TypeRange.WARN, message);
  }

  public error(message: string) {
    this.commonHandler(TypeRange.ERROR, message);
  }
}
