// import { notification } from 'antd';
import * as React from 'react';
import { useContext } from './context';
import { GIService } from './typing';
import { isPosition, isStyles } from './utils';

export interface IProps {
  serviceId: string;
}

export const defaultInitializerCfg = {
  id: 'Initializer',
  props: {
    GI_INITIALIZER: true,
    serviceId: 'GI_SERVICE_INTIAL_GRAPH',
  },
};

const Initializer: React.FunctionComponent<IProps> = props => {
  const context = useContext();
  const { serviceId } = props;
  const { services, updateContext, transform } = context;

  React.useEffect(() => {
    const { service } = services.find(s => s.id === serviceId) as GIService;
    service().then((res = { nodes: [], edges: [] }) => {
      updateContext(draft => {
        const { nodes, edges } = res;
        const position = isPosition(nodes);
        const style = isStyles(nodes);
        if (position) {
          draft.layout.type = 'preset';
        }
        if (style) {
          draft.data = res;
          draft.source = res;
        } else {
          const newData = transform(res, true);
          draft.rawData = { ...res };
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
                nodes: [...newData.nodes].splice(0, 2000),
                edges: [...newData.edges].splice(0, 100),
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
