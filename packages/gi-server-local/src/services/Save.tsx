export const Save = {
  name: '保存分享',
  service: (params, localData) => {
    const uuid = `${Math.random().toString(36).substr(2)}`;
    const href = window.location.origin + '/#/share/' + uuid;
    //  window.localforage 是 GraphInsight 平台提供的全局变量，详情参考：https://github.com/localForage/localForage
    //@ts-ignore
    const { localforage } = window;
    localforage.setItem(uuid, {
      id: uuid,
      type: 'save',
      params: JSON.stringify(params),
    });
    return new Promise(resolve => {
      return resolve({
        success: true,
        data: href,
        shareId: uuid,
      });
    });
  },
};
