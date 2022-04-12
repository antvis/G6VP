import * as React from 'react';
import { useContext } from './context';
import { GIService } from './typing';

const isPosition = nodes => {
  //若收到一个空数组，Array.prototype.every() 方法在一切情况下都会返回 true
  if (nodes.length === 0) {
    return false;
  }

  return nodes.every(node => !window.isNaN(node.x) && !window.isNaN(node.y));
};
const isStyles = nodes => {
  if (nodes.length === 0) {
    return false;
  }
  return nodes.every(node => node.style);
};
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
        const { nodes } = res;
        const position = isPosition(nodes);
        const style = isStyles(nodes);
        if (position) {
          draft.layout.type = 'preset';
        }
        if (style) {
          draft.data = res;
          draft.source = res;
        } else {
          const newData = transform(res);
          draft.data = newData;
          draft.source = { ...res };
        }
        draft.initialized = true;
        draft.layoutCache = false;
      });
    });
  }, []);

  return null;
};

export default Initializer;
