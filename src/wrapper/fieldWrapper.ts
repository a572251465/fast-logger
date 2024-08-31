import { isEmpty, strFormat } from "jsmethod-extra";

export function fieldWrapper(k: string, v: string) {
  if (!["$channel", "$appName"].includes(k) || isEmpty(v)) return v;
  return strFormat("[%s]", v);
}
