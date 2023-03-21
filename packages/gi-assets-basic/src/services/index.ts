import * as Initializer from './Initializer';
import * as NeighborsQueryServices from './NeighborsQuery';
import * as PropertiesPanel from './PropertiesPanel';
import * as Save from './Save';

export default {
  id: 'GI',
  type: 'file',
  name: 'GraphJSON',
  desc: 'G6VP 官方提供的本地文件导入服务，根据部署环境的不同，可以将数据存储在浏览器 IndexDB 或者 云端服务器中',
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*3YEZS6qSRgAAAAAAAAAAAAAAARQnAQ',
  services: {
    ...PropertiesPanel,
    ...NeighborsQueryServices,
    ...Initializer,
    ...Save,
  },
};
