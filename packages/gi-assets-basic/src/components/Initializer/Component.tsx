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
    console.log('Initializer effect....');
    const { service: initialService } = services.find(s => s.id === serviceId) as GIService;
    const { service: schemaService } = (services.find(s => s.id === schemaServiceId) as GIService) || {
      service: () => Promise.resolve(null),
    };

    Promise.all([schemaService(), initialService()]).then(([schema, data = { nodes: [], edges: [] }]) => {
      updateContext(draft => {
        const { nodes, edges } = data;

        if (schema) {
          // 更新schemaData
          draft.schemaData = schema as any;
          const style = utils.generatorStyleConfigBySchema(schema);
          draft.config.nodes = style.nodes;
          draft.config.edges = style.edges;
          // if (updateGISite) {
          //   updateGISite({ schemaData: schema, config: style });
          // }
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
