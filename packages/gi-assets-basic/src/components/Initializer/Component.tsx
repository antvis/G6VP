// import { notification } from 'antd';
import { useContext, utils } from '@alipay/graphinsight';
import * as React from 'react';
const { isPosition, isStyles } = utils;

export type GIService = any;
export interface IProps {
  serviceId: string;
  schemaServiceId: string;
  aggregate: boolean;
}

const Initializer: React.FunctionComponent<IProps> = props => {
  const context = useContext();
  const { serviceId, schemaServiceId, aggregate } = props;
  const { services, updateContext, transform, largeGraphLimit } = context;

  React.useEffect(() => {
    const { service: initialService } = services.find(s => s.id === serviceId) as GIService;
    const { service: schemaService } = (services.find(s => s.id === schemaServiceId) as GIService) || {
      service: () => Promise.resolve(null),
    };

    Promise.all([schemaService(), initialService()]).then(([schema, data = { nodes: [], edges: [] }]) => {
      updateContext(draft => {
        const { nodes } = data;

        /** 判断是否保存样式和位置 */
        const position = isPosition(nodes);
        const style = isStyles(nodes);
        /** 取消布局缓存 */
        draft.initialized = true;
        draft.layoutCache = false;

        /** 如果接口有 schema，就更新 schemaData */
        if (schema) {
          draft.schemaData = schema as any;
        }
        /** 只有当 config 中没有 nodes 和 edges 的时候，才会用 schema 生成一个默认样式 */

        if (schema && (draft.config.nodes?.length === 0 || draft.config.edges?.length === 0)) {
          const schemaStyle = utils.generatorStyleConfigBySchema(schema);
          draft.config.nodes = schemaStyle.nodes;
          draft.config.edges = schemaStyle.edges;
        }
        /** 如果有布局信息 */
        if (position) {
          draft.layout.type = 'preset';
        }
        /** 如果有样式数据 */
        if (style) {
          draft.data = data;
          draft.source = data;
          return;
        }
        /** 如果是大图模式 */
        if (nodes.length > largeGraphLimit) {
          console.warn(
            '加载的数据量过大，建议聚合数据，默认切换到网格布局。您也可以在「资产中心」中加载「大图组件」启用 3D 渲染',
          );
          const newData = transform(data, true);
          draft.largeGraphMode = true;
          draft.largeGraphData = newData;
          draft.source = newData;
          draft.data = {
            nodes: [],
            edges: [],
          };
          return;
        }
        /** 如果是聚合模式 */
        if (aggregate) {
          const newData = transform(data, true);
          draft.rawData = { ...data };
          draft.source = newData;
          draft.largeGraphMode = false;
          draft.largeGraphData = undefined;
          draft.data = transform(utils.aggregateEdges(data), true);
          return;
        }
        /** 默认是普通模式 */
        const newData = transform(data, true);
        draft.rawData = { ...data };
        draft.data = newData;
        draft.source = newData;
        draft.largeGraphMode = false;
        draft.largeGraphData = undefined;
      });
    });
  }, [largeGraphLimit, aggregate]);

  return null;
};

export default Initializer;
