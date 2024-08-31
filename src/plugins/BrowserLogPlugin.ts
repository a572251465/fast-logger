import {
  PluginInstanceParamType,
  PluginInstanceReturnType,
  TypeRange,
} from "../type";
import { isEmpty, isNotEmpty, strFormat, valueOrDefault } from "jsmethod-extra";
import { defaults, signalColorCache } from "../utils/variable";
import { useStore } from "../persist";

function insertColorInStr(tpl: Array<string>, msgs: Array<string>) {
  const idx = tpl.indexOf("$signal"),
    timeIdx = tpl.indexOf("$time");

  let newIdx = idx;
  if (timeIdx < idx) newIdx = idx + 1;

  const type: TypeRange = msgs[newIdx] as TypeRange;

  msgs[newIdx] = strFormat("%c%s", msgs[newIdx]);
  if (idx < tpl.length - 1) {
    msgs[newIdx + 1] = strFormat("%c%s", msgs[newIdx + 1]);
  }

  return [
    msgs.join(" "),
    `font-size: 20px; color: ${signalColorCache.get(type)};`,
    "",
  ];
}

async function dataPersistHandler(message: string) {
  if (isEmpty(message)) return;

  const [addItemHandler, deleteItemHandler, getAllItemHandler] = useStore();
  const values = await getAllItemHandler(),
    allKeys = isEmpty(values) ? [] : Object.keys(values!);

  if (isNotEmpty(values) && allKeys.length >= 300)
    await deleteItemHandler(allKeys[0]);
  await addItemHandler(message, message);
}

export function BrowserLogPlugin(
  obj?: PluginInstanceParamType,
): PluginInstanceReturnType {
  const returnInfo: Omit<PluginInstanceReturnType, "setup"> = {
    channel: "*",
    signal: "*",
  };

  return {
    ...returnInfo,
    setup: (message: string, params) => {
      const loggerParams = Object.assign(
        {},
        defaults.defaultBrowserLogParams,
        valueOrDefault(obj, {}),
      );

      if (!loggerParams.isPrintLog(params)) return;

      const { tpl } = params;
      const tplArr = tpl.split(" ");

      if (isNotEmpty(obj) && obj!.persist) dataPersistHandler(message);

      if (tplArr.includes("$signal")) {
        console.log(...insertColorInStr(tplArr, message.split(" ")));
        return;
      }

      console.log(message);
    },
  };
}
