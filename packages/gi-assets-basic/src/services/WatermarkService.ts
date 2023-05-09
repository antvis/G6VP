export const WatermarkService = {
  name: '水印服务',
  req: '',
  res: `
  export interface WatermarkResParams {
    /** 保存是否成功 */
    success: boolean;
    /** 信息提示 **/
    msg: string;
    /** 返回数据 */
    data: {
      /** 水印文字内容 */
      content ?: string[] | string;
      /** 水印图片源
       * 注意：优先级 image > content, 当使用图片水印且图片加载异常, 会使用 content */
      image ?: string;
    }
  }
  `,
  service: async () => {
    //@ts-ignore
    const { GI_USER_INFO: user } = window;
    let data = { content: '这是一行水印' };
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
