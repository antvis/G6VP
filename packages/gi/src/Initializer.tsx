import * as React from 'react';
import { useContext } from './context';
import {isStyles, isPosition} from "./utils"
import { GIService } from './typing';


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
          const newData = transform(res, true);
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
