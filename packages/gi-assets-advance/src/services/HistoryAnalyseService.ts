import { utils } from '@antv/gi-sdk';

export interface ServiceObject {
  name: string;
  service: (params: any) => Promise<{}>;
}

export const SaveHistoryTemplateService: ServiceObject = {
  name: '保存分析链路模版',
  service: async params => {
    const { GI_SITE_PROJECT_ID: projectId } = utils.getProjectContext();
    let success;
    try {
      //@ts-ignore
      const { GI_PROJECT_DB } = window;
      const origin = await GI_PROJECT_DB.getItem(projectId);
      const { _history_template = [] } = origin || {};
      _history_template.push(params);
      GI_PROJECT_DB.setItem(projectId, { ...origin, _history_template });
      success = true;
    } catch (error) {
      success = false;
    }
    return new Promise(resolve => {
      return resolve({
        success,
        message: 'GI 默认提供的保存分析链路服务',
        data: params,
      });
    });
  },
};

export const RemoveHistoryTemplateService: ServiceObject = {
  name: '删除分析链路模版',
  service: async params => {
    const { GI_SITE_PROJECT_ID: projectId } = utils.getProjectContext();
    let successMsg;
    try {
      //@ts-ignore
      const { GI_PROJECT_DB } = window;
      const origin = await GI_PROJECT_DB.getItem(projectId);
      const { _history_template } = origin || {};
      const { ids } = params;
      if (ids?.length && _history_template?.length) {
        ids.forEach(id => {
          const template = _history_template.find(historyTemplate => historyTemplate.id === id);
          if (template) {
            const idx = _history_template.indexOf(template);
            _history_template.splice(idx, 1);
          }
        });
        GI_PROJECT_DB.setItem(projectId, { ...origin, _history_template });
      }
    } catch (error) {
      successMsg = error;
    }
    return new Promise(resolve => {
      return resolve({
        success: !successMsg,
        message: `GI 默认提供的删除分析链路服务。错误信息：${successMsg}`,
        data: params,
      });
    });
  },
};

export const ListHistoryTemplateService = {
  name: '查询历史分析链路模版列表',
  service: async () => {
    const { GI_SITE_PROJECT_ID: projectId } = utils.getProjectContext();
    //@ts-ignore
    const { GI_PROJECT_DB } = window;
    const project = await GI_PROJECT_DB.getItem(projectId);
    const history_template = project._history_template || [];

    return new Promise(resolve => {
      return resolve({
        success: true,
        message: 'GI 默认提供的查询历史分析链路模版服务',
        data: history_template,
      });
    });
  },
};
