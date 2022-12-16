import { GIConfig, GraphSchemaData } from '@antv/gi-sdk';
import { GraphinData } from '@antv/graphin';

export interface SaveReqParams {
  /** 保存的名称 */
  name: string;
  /** 保存的描述 */
  description: string;
  /** 保存的数据，带布局信息 **/
  data: GraphinData;
  /** GISDK的配置，可以还原画布状态 */
  config: GIConfig;
  /** 图的 Schema 结构 */
  schemaData: GraphSchemaData;
  /** 画布的截图 */
  cover: string;
  /** 保存的时间 */
  gmtCreate: Date;
}

export interface SaveResParams {
  /** 保存是否成功 */
  success: boolean;
  /** 保存跳转的URL地址 **/
  data: string;
  /** 保存后，生成的UUID */
  shareId: string;
}
export const Save = {
  name: '保存分享',
  req: `
  export interface SaveReqParams {
    /** 保存的名称 */
    name: string;
    /** 保存的描述 */
    description: string;
    /** 保存的数据，带布局信息 **/
    data: GraphinData;
    /** GISDK的配置，可以还原画布状态 */
    config: GIConfig;
    /** 图的 Schema 结构 */
    schemaData: GraphSchemaData;
    /** 画布的截图 */
    cover: string;
    /** 保存的时间 */
    gmtCreate: Date;
  }
  `,
  res: `
  export interface SaveResParams {
    /** 保存是否成功 */
    success: boolean;
    /** 保存跳转的URL地址 **/
    data: string;
    /** 保存后，生成的UUID */
    shareId: string;
  }
  `,
  service: (params: SaveReqParams, localData): Promise<SaveResParams> => {
    const uuid = `${Math.random().toString(36).substr(2)}`;
    const href = window.location.origin + '/#/share/' + uuid;
    //  window.localforage 是 G6VP 平台提供的全局变量，详情参考：https://github.com/localForage/localForage
    //@ts-ignore
    const { localforage } = window;
    localforage.setItem(uuid, {
      id: uuid,
      type: 'save',
      params: JSON.stringify(params),
    });
    return new Promise(resolve => {
      return resolve({
        success: true,
        data: href,
        shareId: uuid,
      });
    });
  },
};
