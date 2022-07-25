import * as Initializer from './Initializer';
import * as NeighborsQueryServices from './NeighborsQuery';
import * as PropertiesPanel from './PropertiesPanel';
import * as Save from './Save';
import ServerComponent from './ServerComponent';

export default {
  id: 'GI',
  name: 'GraphInsight',
  desc: 'GraphInsight 官方数据服务',
  component: ServerComponent,
  services: {
    ...PropertiesPanel,
    ...NeighborsQueryServices,
    ...Initializer,
    ...Save,
  },
};
