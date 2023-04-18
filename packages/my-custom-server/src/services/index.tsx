import * as Initializer from './Initializer';
import Server from './Server';
export default {
  id: 'MyServer',
  type: 'api',
  name: '我的服务',
  desc: 'MyServer',
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*3YEZS6qSRgAAAAAAAAAAAAAAARQnAQ',
  component: Server,
  services: {
    ...Initializer,
  },
};
