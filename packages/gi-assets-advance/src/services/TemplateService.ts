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

export const TemplateListService = {
  name: '查询模板列表',
  service: () => {
    return new Promise(resolve => {
      return resolve({
        success: true,
        message: 'GI 默认提供的发布模板的服务',
        data: [
          {
            queryTemplate: 'g.V({{ID}})',
            templateId: '3283',
            graphLanguageType: 'GREMLIN',
            templateName: 'defaultTemplateName',
            templateParameterList: [{ parameterName: 'ID', parameterValue: '1', valueType: 'STRING' }],
          },
        ],
      });
    });
  },
};

export const ExecTemplateQueryService = {
  name: '执行模板查询',
  service: params => {
    console.log('执行模板查询参数', params);
    const id = 'mock_template_query';
    const data = {
      nodes: [
        {
          id,
          type: 'user',
        },

        {
          id: `${id}-family`,
          type: 'user',
        },
        {
          id: `${id}-card`,
          type: 'card',
        },
      ],
      edges: [
        {
          source: id,
          target: `${id}-family`,
          type: 'family',
        },
        {
          source: id,
          target: `${id}-card`,
          type: 'own',
        },
      ],
    };
    return new Promise(resolve => {
      return resolve({
        success: true,
        data,
      });
    });
  },
};
