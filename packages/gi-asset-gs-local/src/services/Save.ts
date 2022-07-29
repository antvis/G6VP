export const Save = {
  name: "保存分享",
  service: (params, localData) => {
    debugger;
    return fetch(`http://dev.alipay.net:7001/share/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((res) => {
        return res.data;
      });
  },
};
