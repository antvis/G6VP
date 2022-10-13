export interface ServiceObject {
  name: string;
  service: (params: any) => Promise<{}>;
}

export const PublishTemplate: ServiceObject = {
  name: '发布模板',
  service: params => {
    const uid = 'mock_publish_template';
    console.log('参数', params);
    return new Promise(resolve => {
      return resolve({
        success: true,
        message: 'GI 默认提供的发布模板的服务',
        data: {
          ...params,
          uid,
        },
      });
    });
  },
};
