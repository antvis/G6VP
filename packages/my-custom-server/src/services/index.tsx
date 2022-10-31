import React from 'react';
import * as Initializer from './Initializer';

export default {
  id: 'MyServer',
  type: 'api',
  name: '我的服务',
  desc: 'MyServer',
  cover: 'https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*3YEZS6qSRgAAAAAAAAAAAAAAARQnAQ',
  component: ({ updateGISite }) => {
    return (
      <button
        onClick={() => {
          updateGISite({
            engineId: 'MyServer',
            schemaData: {
              nodes: [],
              edges: [],
            },
          });
        }}
      >
        启动引擎...
      </button>
    );
  },
  services: {
    ...Initializer,
  },
};
