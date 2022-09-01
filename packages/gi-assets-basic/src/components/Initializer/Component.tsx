// import { notification } from 'antd';
import { useContext, utils } from '@alipay/graphinsight';
import * as React from 'react';
const { isPosition, isStyles } = utils;

export type GIService = any;
export interface IProps {
  serviceId: string;
  schemaServiceId: string;
}

const Initializer: React.FunctionComponent<IProps> = props => {
  const context = useContext();
  const { serviceId, schemaServiceId } = props;
  const { services, updateContext, transform, largeGraphLimit } = context;

  React.useEffect(() => {
    const { service: initialService } = services.find(s => s.id === serviceId) as GIService;
    const { service: schemaService } = (services.find(s => s.id === schemaServiceId) as GIService) || {
      service: () => Promise.resolve(null),
    };

    Promise.all([schemaService(), initialService()]).then(([schema, data = { nodes: [], edges: [] }]) => {
      updateContext(draft => {
        const { nodes } = data;

        if (schema) {
          // 更新schemaData
          draft.schemaData = schema as any;
          //只有当config中没有nodes和edges的时候，才会用schema生成一个默认样式
          if (draft.config.nodes?.length === 0 || draft.config.edges?.length === 0) {
            const schemaStyle = utils.generatorStyleConfigBySchema(schema);
            draft.config.nodes = schemaStyle.nodes;
            draft.config.edges = schemaStyle.edges;
          }
        }

        const position = isPosition(nodes);
        const style = isStyles(nodes);
        if (position) {
          draft.layout.type = 'preset';
        }
        if (style) {
          draft.data = data;
          draft.source = data;
        } else {
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
          } else {
            const newData = transform(data, true);
            draft.rawData = { ...data };
            draft.data = newData;
            draft.source = newData;
            draft.largeGraphMode = false;
            draft.largeGraphData = undefined;
          }
        }
        draft.initialized = true;
        draft.layoutCache = false;
      });
    });
  }, [largeGraphLimit]);

  return null;
};

export default Initializer;
