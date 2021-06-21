import localforage from "localforage"

localforage.config({
  name: 'gi_'
})
const { getItem, setItem } = localforage;


const customGet = async (key: string, callback: (err: any, value: any) => void) => {
  const res = await getItem(key, callback);
  let value;
  try {
    value = JSON.parse(res);
  } catch {
    if (res) {
      value = res;
    }
  }
  return value;
}

// 存储前序列化
const customSet = (key: string, value: any, callback: (err: any, value: any) => void) => {
  try {
    const stringedT = JSON.stringify(value);
    return setItem(key, stringedT, callback);
  } catch {
    throw new Error('stringify your data failed');
  }
}

// fix localforage can't save function property to indexeddb
localforage.getItem = customGet;
//@ts-ignore
localforage.setItem = customSet;