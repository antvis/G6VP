import * as Initializer from './Initializer';
import * as NeighborsQueryServices from './NeighborsQuery';
import * as PropertiesPanel from './PropertiesPanel';
import * as Save from './Save';

export default {
  id: 'GI',
  services: {
    ...PropertiesPanel,
    ...NeighborsQueryServices,
    ...Initializer,
    ...Save,
  },
};
