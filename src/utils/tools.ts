import { expressionCache } from "./variable";
import { equals, isEmpty, isHas, isNotEmpty, isObject } from "jsmethod-extra";

export function isLocal() {
  // 浏览器端 这个一定存在的
  if (
    equals(typeof location, "undefined") ||
    !isObject(location) ||
    !isHas(location, "host")
  )
    return true;
  return ["localhost", "127.0.0.1"].includes(location.host);
}

export function isMark(mark: string) {
  return equals("-", mark) || equals("*", mark) ? "" : mark;
}

export function verifyTpl(tpl: string) {
  const notExistExpression = [];

  const tplArr = [...new Set(tpl.split(" "))];
  for (const item of tplArr)
    if (!expressionCache.includes(item)) notExistExpression.push(item);

  if (isNotEmpty(notExistExpression))
    throw new Error(`mark [${notExistExpression.join(",")}] unidentified`);

  if (!tplArr.includes("$message") || !tpl.endsWith("$message"))
    throw new Error("mark [$message] must be at the end");
}

const mergeNextHandler = (
  readIdx: number,
  source: Array<Array<string>>,
  res: Array<string>,
  total: Array<string>,
) => {
  if (readIdx === source.length) {
    total.push(res.join(""));
    return;
  }

  const currArr = source[readIdx];
  for (const item of currArr) {
    const newRes = [...res, item];
    mergeNextHandler(readIdx + 1, source, newRes, total);
    newRes.pop();
  }
};

// 回溯法
export function overlappingMerge(...args: Array<Array<string>>): Array<string> {
  const rs: Array<string> = [];

  const l = args.length;
  if (isEmpty(l)) return rs;

  const newArr = args.filter(isNotEmpty);
  if (isEmpty(newArr)) return rs;

  mergeNextHandler(0, newArr, [], rs);
  return rs;
}
