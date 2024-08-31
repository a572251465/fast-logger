import localforage from "localforage";
import { equals, isEmpty } from "jsmethod-extra";

const loggerStore = localforage.createInstance({
  driver: localforage.INDEXEDDB,
  storeName: "logger_db",
});

/**
 * 删除 item 事件
 *
 * @author lihh
 * @param key 主键 key
 * @param store 使用store 默认的p1
 */
async function deleteItemHandler(key: string, store = loggerStore) {
  const allKeys = await store.keys();
  if (isEmpty(allKeys) || !allKeys.includes(key)) return;

  await store.removeItem(key);
}

/**
 * 根据 store 拿到所有的key
 *
 * @author lihh
 * @param store 指定仓库
 */
async function getAllKeysHandler(store = loggerStore) {
  return (await store.keys()) || [];
}

/**
 * 拿到全部的item
 *
 * @author lihh
 * @param store 表示默认的 store
 */
async function getAllItemHandler(store = loggerStore) {
  /* 首先 判断是否支持 indexedDB */
  if (!store.supports(store.INDEXEDDB)) return null;

  const allKeys = await store.keys();
  if (isEmpty(allKeys)) return null;

  const arrayValues: Record<string, Array<unknown>> = {};
  for (const arrayKey of allKeys) {
    arrayValues[arrayKey] = (await store.getItem(arrayKey)) as Array<unknown>;
  }
  return arrayValues;
}

/**
 * 添加 item事件
 *
 * @author lihh
 * @param key 添加的 key
 * @param value value 的集合
 * @param store 表示默认的 store
 */
async function addItemHandler(key: string, value: string, store = loggerStore) {
  await store.setItem(key, value);
}

/**
 * 通过 key 拿到 item
 *
 * @author lihh
 * @param keyOrValue 可以是key or 是value
 * @param store 默认的store
 */
async function getItemHandler(keyOrValue: string, store = loggerStore) {
  const allKeys = await store.keys();
  if (isEmpty(allKeys)) return null;

  for (const currentKey of allKeys) {
    const currentValue = await store.getItem(currentKey);

    if (equals(currentKey, keyOrValue)) return currentValue;
    if (equals(currentValue, keyOrValue)) return currentKey;
  }
  return null;
}

/**
 * 表示全局的store hook
 *
 * @author lihh
 */
export function useStore(): [
  typeof addItemHandler,
  typeof deleteItemHandler,
  typeof getAllItemHandler,
  typeof getItemHandler,
  typeof getAllKeysHandler,
] {
  return [
    addItemHandler,
    deleteItemHandler,
    getAllItemHandler,
    getItemHandler,
    getAllKeysHandler,
  ];
}