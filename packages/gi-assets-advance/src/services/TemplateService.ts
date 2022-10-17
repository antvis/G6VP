export interface ServiceObject {
  name: string;
  service: (params: any) => Promise<{}>;
}
import { utils } from '@alipay/graphinsight';

const DEFAULT_LANGUAGE_TEMPLATE = [
  {
    queryTemplate: 'g.V({{ID}})',
    templateId: '3283',
    graphLanguageType: 'GREMLIN',
    templateName: 'defaultTemplateName',
    templateParameterList: [{ parameterName: 'ID', parameterValue: '1', valueType: 'STRING' }],
  },
  {
    queryTemplate: 'MATCH n RETURN n LIMIT {{count}}',
    templateId: '13283',
    graphLanguageType: 'CYPHER',
    templateName: 'defaultTemplateName',
    templateParameterList: [{ parameterName: 'count', parameterValue: '1', valueType: 'STRING' }],
  },
];

export const PublishTemplate: ServiceObject = {
  name: '发布模板',
  service: async params => {
    const { GI_SITE_PROJECT_ID: projectId } = utils.getProjectContext();
    //@ts-ignore
    const { localforage } = window;
    const project = await localforage.getItem(projectId);
    const gremlin_template = project && project._gremlin_template ? project._gremlin_template : [];
    //project.themes = [...themes, theme];
    const new_gremlin_template = [
      ...gremlin_template,
      {
        ...params,
        templateId: Math.random()
          .toString(36)
          .slice(3),
      },
    ];

    localforage.setItem(projectId, { ...project, _gremlin_template: new_gremlin_template });

    return new Promise(resolve => {
      return resolve({
        success: true,
        message: 'GI 默认提供的发布模板的服务',
        data: params,
      });
    });
  },
};

export const TemplateListService = {
  name: '查询模板列表',
  service: async () => {
    const { GI_SITE_PROJECT_ID: projectId } = utils.getProjectContext();
    //@ts-ignore
    const { localforage } = window;
    const project = await localforage.getItem(projectId);
    const gremlin_template = project._gremlin_template || [DEFAULT_LANGUAGE_TEMPLATE];

    return new Promise(resolve => {
      return resolve({
        success: true,
        message: 'GI 默认提供的发布模板的服务',
        data: gremlin_template,
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
