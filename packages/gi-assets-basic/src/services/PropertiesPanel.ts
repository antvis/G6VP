export interface ReqPropertiesPanel {
  /** 节点 或者 边的详细信息 */
  data: any;
}
export interface ResPropertiesPanel {
  /** 节点 或 边的详细信息 */
  [key: string]: any;
}

export const PropertiesPanel = {
  name: '查询属性详情',
  req: `
  export interface ReqPropertiesPanel {
    /** 节点 或者 边的详细信息 */
    data: any;
  }
  `,
  res: `
  export interface ResPropertiesPanel {
    /** 节点 或 边的详细信息 */
    [key: string]: any;
  }
  `,
  service: (params: ReqPropertiesPanel): Promise<ResPropertiesPanel> => {
    const { data } = params;
    return new Promise(resolve => {
      return resolve(data);
    });
  },
};
