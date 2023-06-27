import $i18n from '../i18n';
export const WatermarkService = {
  name: $i18n.get({ id: 'basic.src.services.WatermarkService.WatermarkService', dm: '水印服务' }),
  req: '',
  res: $i18n.get({
    id: 'basic.src.services.WatermarkService.ExportInterfaceWatermarkresparamsSaveSuccessfully',
    dm: '\n  export interface WatermarkResParams {\n    /** 保存是否成功 */\n    success: boolean;\n    /** 信息提示 **/\n    msg: string;\n    /** 返回数据 */\n    data: {\n      /** 水印文字内容 */\n      content ?: string[] | string;\n      /** 水印图片源\n       * 注意：优先级 image > content, 当使用图片水印且图片加载异常, 会使用 content */\n      image ?: string;\n    }\n  }\n  ',
  }),

  service: async () => {
    //@ts-ignore
    const { GI_USER_INFO: user } = window;
    let data = { content: $i18n.get({ id: 'basic.src.services.WatermarkService.ThisIsALineOf', dm: '这是一行水印' }) };
    if (user) {
      const { realName, outUserNo, nickName } = user;
      data = { content: `${realName}(${nickName})${outUserNo}` };
    }
    return {
      success: true,
      msg: $i18n.get({ id: 'basic.src.services.WatermarkService.TheWatermarkIsObtained', dm: '获取水印成功！' }),
      data,
    };
  },
};
