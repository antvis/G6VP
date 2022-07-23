import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_graphinsight_375A';

  // add your egg config in here
  config.middleware = [];

  config.multipart = {
    mode: 'file',
    whitelist: ['.csv', '.txt'],
    // 表单 Field 文件名长度限制
    fieldNameSize: 10000,
    // 表单 Field 内容大小
    fieldSize: '2400mb',
    // 表单 Field 最大个数
    fields: 150,

    // 单个文件大小
    fileSize: '230mb',
    // 允许上传的最大文件数
    files: 10,
  };

  config.security = {
    csrf: {
      enable: false,
      // ignoreJSON: true
    },
  };

  config.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
