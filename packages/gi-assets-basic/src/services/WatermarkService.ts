export const WatermarkService = {
  name: '水印服务',
  service: async () => {
    //@ts-ignore
    const { GI_USER_INFO: user } = window;
    let data = { content: '暂无用户信息' };
    if (user) {
      const { realName, outUserNo, nickName } = user;
      data = { content: `${realName}(${nickName})${outUserNo}` };
    }
    return {
      success: true,
      msg: '获取水印成功！',
      data,
    };
  },
};
