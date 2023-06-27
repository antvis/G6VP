import $i18n from '../i18n';
export interface ReqPropertiesPanel {
  /** 节点 或者 边的详细信息 */
  data: any;
}
export interface ResPropertiesPanel {
  /** 节点 或 边的详细信息 */
  [key: string]: any;
}

export const PropertiesPanel = {
  name: $i18n.get({ id: 'basic.src.services.PropertiesPanel.QueryAttributeDetails', dm: '查询属性详情' }),
  req: $i18n.get({
    id: 'basic.src.services.PropertiesPanel.ExportInterfaceReqpropertiespanelDetailsOf',
    dm: '\n  export interface ReqPropertiesPanel {\n    /** 节点 或者 边的详细信息 */\n    data: any;\n  }\n  ',
  }),

  res: $i18n.get({
    id: 'basic.src.services.PropertiesPanel.ExportInterfaceRespropertiespanelDetailsOf',
    dm: '\n  export interface ResPropertiesPanel {\n    /** 节点 或 边的详细信息 */\n    [key: string]: any;\n  }\n  ',
  }),

  service: (params: ReqPropertiesPanel): Promise<ResPropertiesPanel> => {
    const { data } = params;
    return new Promise(resolve => {
      return resolve(data);
    });
  },
};
