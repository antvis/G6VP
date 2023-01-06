## G6VP 站点服务

G6VP 作为开源产品，为了用户的数据安全考虑，我们将站点数据全部存储在用户浏览器本地（IndexedDB），同时为了能够满足私有化部署需求，让数据共享在云端，我们也提供 HTTP 接口规范。

| 方法   | 接口名   | 接口                   | 入参            | 出参                                 |
| ------ | -------- | ---------------------- | --------------- | ------------------------------------ |
| GET    | 查询项目 | `/project/:id`         |                 | `{ success:boolean,data:IProject}`   |
| POST   | 项目列表 | `/project/list`        |                 | `{ success:boolean,data:IProject[]}` |
| GET    | 案例项目 | `/project/case`        |                 | `{ success:boolean,data:IProject[]}` |
| POST   | 删除项目 | `/project/delete`      |                 |                                      |
| POST   | 创建项目 | `/project/create`      | `IProject`      |                                      |
| POST   | 更新项目 | `/project/update`      | `IProject`      |                                      |
| POST   | 保存分享 | `/share/create`        | `SaveReqParams` | `SaveResParams`                      |
| GET    | 查询分享 | `/share/list/:shareId` |                 |                                      |
| DELETE | 删除分享 | `/share/list/:shareId` |                 |                                      |
| GET    | 分享列表 | `/share/list`          |                 |                                      |
| GET    | 获取用户 | `/user/info`           |                 |                                      |

```ts
export interface IProject {
  /** 引擎ID */
  engineId: string;
  /** 引擎的上下文，用于服务接口的额外参数 */
  engineContext: Record<string, any>;
  /** 项目激活的资产ID */
  activeAssetsKeys: IActiveAssetsKeys;
  /** 项目数据 */
  data?: {
    transFunc?: string;
    transData: GraphinData;
    inputData: any[];
  };
  /** 项目类型 */
  type?: 'case' | 'project' | 'save';
  id?: string;
  /** 项目名称 */
  name?: string;
  cover?: string;
  description?: string;
  members?: { name: string; id: string; state: 'master' | 'user' }[];
  projectConfig?: GIConfig;
  status?: number;
  tag?: string;
  gmtCreate?: any;
  schemaData: GraphSchemaData;
  config?: GIConfig;
  themes?: any[];
}

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
```
