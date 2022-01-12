import * as React from 'react';
import { useContext } from './context';

const hasPosition = nodes => {
  return nodes.every(node => !window.isNaN(Number(node.x)) && !window.isNaN(Number(node.y)));
};
const hasStyles = nodes => {
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
    const { service } = services.find(s => s.id === serviceId);
    service().then((res = { nodes: [], edges: [] }) => {
      updateContext(draft => {
        const { nodes } = res;
        const position = hasPosition(nodes);
        const style = hasStyles(nodes);
        if (position) {
          //@ts-ignore
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
      });
    });
  }, []);

  return null;
};

export default Initializer;
