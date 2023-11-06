import type { ElementAsset, GIAssets, GIConfig, GIService, LayoutAsset } from '@antv/gi-sdk';
import GISDK, { useContext } from '@antv/gi-sdk';
import React, { useEffect } from 'react';
import { data, schemaData } from './const';
interface DEMOProps {}

/** components */
const Counter = props => {
  const { context, updateContext, graph } = useContext();

  const { title } = props;
  const nodes = graph.getAllNodesData().length;
  console.log('Counter render....', nodes);
  const handleClick = () => {
    updateContext(draft => {
      draft.layout = {
        id: 'ForceLayout',
        props: {
          type: 'grid',
        },
      };
    });
  };

  return (
    <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
      <button onClick={handleClick}>click....{JSON.stringify(context.layout)}</button>
      {title}: {nodes}
    </div>
  );
};
/** initializer */

const Initializer = props => {
  const { services, updateContext } = useContext();
  const { serviceId, schemaServiceId } = props;
  useEffect(() => {
    let initialService = services.find(s => s.id === serviceId) as GIService;
    let schemaService = services.find(s => s.id === schemaServiceId) as GIService;

    Promise.all([schemaService.service(), initialService.service()]).then(([schemaData, graphData]) => {
      console.log('Initializer', Initializer);
      updateContext(draft => {
        draft.data = graphData;
        draft.schemaData = schemaData;
        draft.initialized = true;
      });
    });
  }, []);
  return null;
};
/** elements */
const SimpleNode: ElementAsset = {
  info: {
    type: 'NODE',
    id: 'SimpleNode',
    name: 'SimpleNode',
    category: 'element',
  },
  registerShape: () => {},
  registerMeta: () => {},
  registerTransform: nodeCfg => {
    //@ts-ignore
    const { color, size, label } = nodeCfg.props;
    return node => {
      // console.log('node >>>>', node);
      const { data, id } = node;
      const { x, y, z } = data;
      const LABEL_KEY = label[0] || 'id';
      return {
        id: id,
        data: {
          x,
          y,
          z,
          keyShape: {
            fill: color,
            r: size,
          },
          labelShape: {
            text: data[LABEL_KEY],
          },
        },
      };
    };
  },
};
/** elements */
const SimpleEdge: ElementAsset = {
  info: {
    type: 'EDGE',
    id: 'SimpleEdge',
    name: 'SimpleEdge',
    category: 'element',
  },
  registerShape: () => {},
  registerMeta: () => {},
  registerTransform: edgeCfg => edge => edge,
};
/** Force Layout*/
const ForceLayout: LayoutAsset = {
  info: {
    type: 'LAYOUT',
    id: 'ForceLayout',
    name: 'ForceLayout',
    category: 'layout',
    options: { type: 'force' },
  },
  registerLayout: () => {},
  registerMeta: () => {},
};

const assets: GIAssets = {
  elements: {
    SimpleEdge,
    SimpleNode,
  },
  layouts: {
    ForceLayout,
  },
  components: {
    Initializer: {
      component: Initializer,
      info: {
        name: '初始化器',
        id: 'Initializer',
        type: 'INITIALIZER',
        category: 'system-interaction',
      },
      registerMeta: () => ({}),
    },
    Counter: {
      component: Counter,
      info: {
        name: '计数器',
        id: 'Counter',
        type: 'AUTO',
        category: 'workbook',
      },
      registerMeta: () => ({}),
    },
  },
};

const config: GIConfig = {
  nodes: [
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: 'red',
        label: [],
      },
      name: '官方节点',
      expressions: [],
      logic: true,
      groupName: '默认样式',
    },
    {
      id: 'SimpleNode',
      expressions: [
        {
          name: 'id',
          operator: 'eql',
          value: 'account_7',
        },
      ],
      props: {
        size: 26,
        color: '#3056E3',
        label: ['id'],
      },
      name: '官方节点',
      logic: true,
      groupName: 'Account_7 TYPE',
    },
  ],
  edges: [
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: 'red',
        label: [],
      },
      name: 'SimpleEdge',
      logic: true,
      groupName: 'Default',
    },
  ],
  components: [
    {
      id: 'Initializer',
      type: 'INITIALIZER',
      name: '初始化器',
      props: {
        serviceId: 'GI/GI_SERVICE_INTIAL_GRAPH',
        schemaServiceId: 'GI/GI_SERVICE_SCHEMA',
        GI_INITIALIZER: true,
        aggregate: false,
        transByFieldMapping: false,
      },
    },
    {
      id: 'Counter',
      type: 'AUTO',
      props: {
        title: '画布节点数量',
      },
    },
  ],
  layout: {
    id: 'ForceLayout',
    props: {
      type: 'force',
      presetLayout: {},
    },
  },
  //@ts-ignore
  pageLayout: {},
};

const services: GIService[] = [
  {
    name: '初始化查询',
    method: 'GET',
    id: 'GI/GI_SERVICE_INTIAL_GRAPH',
    service: async () => {
      return new Promise(resolve => {
        resolve(data);
      });
    },
  },
  {
    name: '查询图模型',
    method: 'GET',
    id: 'GI/GI_SERVICE_SCHEMA',
    service: async () => {
      return new Promise(resolve => {
        resolve(schemaData);
      });
    },
  },
];

const DEMO: React.FunctionComponent<DEMOProps> = props => {
  return <GISDK assets={assets} config={config} services={services} />;
};

export default DEMO;
