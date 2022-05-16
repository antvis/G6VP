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
  const { serviceId, schemaServiceId } = props;
  const { services, updateContext, transform } = context;

  React.useEffect(() => {
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
          const newData = transform(data, true);
          draft.rawData = { ...data };
          draft.data = newData;
          draft.source = newData;

          if (nodes.length > 1000 || edges.length > 1000) {
            // notification.warn({
            //   message: '数据过大',
            //   description:
            //     '加载的数据量过大，建议聚合数据，默认切换到网格布局。您也可以在「资产中心」中加载「大图组件」启用 3D 渲染',
            // });

            console.warn(
              '加载的数据量过大，建议聚合数据，默认切换到网格布局。您也可以在「资产中心」中加载「大图组件」启用 3D 渲染',
            );
            draft.layout.type = 'grid';
            if (nodes.length > 2000 || edges.length > 2000) {
              /** 数据量过大，需要裁剪 */
              draft.data = {
                nodes: [...newData.nodes].splice(0, 1000),
                edges: [],
              };
              console.warn('加载的数据量过大，默认裁剪节点为2000，边为100');
            }
          }
        }
        draft.initialized = true;
        draft.layoutCache = false;
      });
    });
  }, []);

  return null;
};

export default Initializer;
