// import { notification } from 'antd';
import * as React from 'react';
import { useContext } from './context';
import { isPosition, isStyles } from './process';
import { GIService } from './typing';

export interface IProps {
  serviceId: string;
  schemaServiceId: string;
}

export const defaultInitializerCfg = {
  id: 'Initializer',
  props: {
    GI_INITIALIZER: true,
    serviceId: 'GI_SERVICE_INTIAL_GRAPH',
    schemaServiceId: 'GI_SERVICE_SCHEMA',
  },
};

const Initializer: React.FunctionComponent<IProps> = props => {
  const context = useContext();
  console.log('inner Initializer render....');
  const { serviceId, schemaServiceId } = props;
  const { services, updateContext, transform, largeGraphLimit } = context;

  React.useEffect(() => {
    console.log('inner Initializer effect....');
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
