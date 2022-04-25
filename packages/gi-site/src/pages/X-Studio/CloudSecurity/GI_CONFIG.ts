/**  由GI平台自动生成的，请勿修改 start **/

export const GI_SERVICES_OPTIONS = [
  {
    id: 'GI_SERVICE_INTIAL_GRAPH',
    content:
      'export default (localData)=>{\n      return new Promise((resolve)=>{\n        resolve(localData)\n      })\n    }',
    mode: 'MOCK',
    name: '初始化接口',
  },
  {
    id: 'Mock/PropertiesPanel',
    mode: 'MOCK',
    name: 'Mock/PropertiesPanel',
    content:
      'export default function service(params, localData) {\n      var data = params.data;\n      return new Promise(function (resolve) {\n        return resolve(data);\n      });\n    }',
  },
];
export const GI_PROJECT_CONFIG = {
  nodes: [
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#ddd',
        label: ['id'],
        advanced: {
          icon: {
            type: 'font',
            value: '',
            fill: '#FF6A00',
          },
          keyshape: {
            fillOpacity: 1,
          },
          label: {
            visible: true,
            fill: '#000',
            fontSize: 12,
            position: 'bottom',
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: '默认样式',
      expressions: [],
      logic: true,
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#3056E3',
        label: ['Name'],
        advanced: {
          icon: {
            type: 'font',
            value: 'wifi',
            fill: 'rgba(255,255,255,1)',
            visible: true,
          },
          keyshape: {
            fillOpacity: 1,
          },
          label: {
            visible: true,
            fill: '#000',
            fontSize: 12,
            position: 'bottom',
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: 'ATTACKER_IP TYPE',
      expressions: [
        {
          name: 'Type',
          operator: 'eql',
          value: 'ATTACKER_IP',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: 'rgba(65,117,5,1)',
        label: ['Name'],
        advanced: {
          icon: {
            type: 'font',
            value: 'desktop',
            fill: 'rgba(65,117,5,1)',
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.1,
          },
          label: {
            visible: true,
            fill: '#000',
            fontSize: 12,
            position: 'bottom',
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: 'AEGIS_ALERT TYPE',
      expressions: [
        {
          name: 'Type',
          operator: 'eql',
          value: 'AEGIS_ALERT',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#82E6C7',
        label: ['Name'],
        advanced: {
          icon: {
            type: 'font',
            value: 'attachment',
            fill: '#82E6C7',
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.1,
          },
          label: {
            visible: true,
            fill: '#000',
            fontSize: 12,
            position: 'bottom',
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: 'UUID TYPE',
      expressions: [
        {
          name: 'Type',
          operator: 'eql',
          value: 'UUID',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleNode',
      props: {
        size: 26,
        color: '#F6D87B',
        label: ['Name'],
        advanced: {
          icon: {
            type: 'font',
            value: 'file',
            fill: '#F6D87B',
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.1,
          },
          label: {
            visible: true,
            fill: '#000',
            fontSize: 12,
            position: 'bottom',
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: 'LOGIN_EVENT TYPE',
      expressions: [
        {
          name: 'Type',
          operator: 'eql',
          value: 'LOGIN_EVENT',
        },
      ],
      logic: true,
    },
  ],
  edges: [
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: '#ddd',
        label: ['id'],
        advanced: {
          keyshape: {
            customPoly: false,
            lineDash: [],
            opacity: 1,
            poly: 10,
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: '#ddd',
            backgroundEnable: false,
            backgroundFill: '#ddd',
            backgroundStroke: '#fff',
          },
          animate: {
            visible: false,
          },
        },
      },
      groupName: '默认样式',
      expressions: [],
      logic: true,
    },
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: '#F6D87B',
        label: ['id'],
        advanced: {
          keyshape: {
            customPoly: true,
            lineDash: [],
            opacity: 1,
            poly: 10,
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: '#ddd',
            backgroundEnable: false,
            backgroundFill: '#ddd',
            backgroundStroke: '#fff',
          },
          animate: {
            visible: true,
            type: 'circle-running',
            dotColor: '#F6D87B',
            repeat: true,
            duration: 3000,
          },
        },
      },
      groupName: 'ALERT_JOIN_LOGIN TYPE',
      expressions: [
        {
          name: 'Type',
          operator: 'eql',
          value: 'ALERT_JOIN_LOGIN',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: '#3056E3',
        label: ['id'],
        advanced: {
          keyshape: {
            customPoly: true,
            lineDash: [],
            opacity: 1,
            poly: 10,
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: '#ddd',
            backgroundEnable: false,
            backgroundFill: '#ddd',
            backgroundStroke: '#fff',
          },
          animate: {
            visible: false,
          },
        },
      },
      groupName: 'IP_JOIN_ALERT TYPE',
      expressions: [
        {
          name: 'Type',
          operator: 'eql',
          value: 'IP_JOIN_ALERT',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: '#3056E3',
        label: ['id'],
        advanced: {
          keyshape: {
            customPoly: true,
            lineDash: [],
            opacity: 1,
            poly: 10,
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: '#ddd',
            backgroundEnable: false,
            backgroundFill: '#ddd',
            backgroundStroke: '#fff',
          },
          animate: {
            visible: true,
            type: 'circle-running',
            dotColor: '#3056E3',
            repeat: true,
            duration: 3000,
          },
        },
      },
      groupName: 'ATTACKERIP_JOIN_LOGIN TYPE',
      expressions: [
        {
          name: 'Type',
          operator: 'eql',
          value: 'ATTACKERIP_JOIN_LOGIN',
        },
      ],
      logic: true,
    },
    {
      id: 'SimpleEdge',
      props: {
        size: 1,
        color: 'rgba(65,117,5,1)',
        label: ['id'],
        advanced: {
          keyshape: {
            customPoly: true,
            lineDash: [],
            opacity: 1,
            poly: 10,
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: '#ddd',
            backgroundEnable: false,
            backgroundFill: '#ddd',
            backgroundStroke: '#fff',
          },
          animate: {
            visible: false,
          },
        },
      },
      groupName: 'UUID_JOIN_ALERT TYPE',
      expressions: [
        {
          name: 'Type',
          operator: 'eql',
          value: 'UUID_JOIN_ALERT',
        },
      ],
      logic: true,
    },
  ],
  layout: {
    id: 'Dagre',
    name: '有向分层布局',
    category: 'basic',
    props: {
      rankdir: 'LR',
      align: 'DR',
      nodesep: 30,
      ranksep: 70,
      type: 'dagre',
    },
    meta: {
      rankdir: {
        type: 'select',
        caption: '布局方向',
        default: 'TB',
        options: [
          {
            label: '自上而下',
            value: 'TB',
          },
          {
            label: '自下而上',
            value: 'BT',
          },
          {
            label: '自左而右',
            value: 'LR',
          },
          {
            label: '自右而左',
            value: 'RL',
          },
        ],
      },
      align: {
        type: 'select',
        caption: '对齐方式',
        default: null,
        options: [
          {
            label: '请选择',
            value: null,
          },
          {
            label: 'UL',
            value: 'UL',
          },
          {
            label: 'UR',
            value: 'UR',
          },
          {
            label: 'DL',
            value: 'DL',
          },
          {
            label: 'DR',
            value: 'DR',
          },
        ],
      },
      nodesep: {
        type: 'slider',
        caption: '节点间距',
        default: 10,
        min: 1,
        max: 200,
        step: 1,
      },
      ranksep: {
        type: 'slider',
        caption: '层间距',
        default: 10,
        min: 1,
        max: 200,
        step: 1,
      },
    },
  },
  components: [
    {
      id: 'NodeLegend',
      props: {
        sortKey: 'type',
        textColor: '#ddd',
        placement: 'LB',
        offset: [100, 20],
      },
      enable: true,
    },
    {
      id: 'PropertiesPanel',
      name: '属性面板',
      category: 'data-analysis',
      props: {
        serviceId: 'Mock/PropertiesPanel',
      },
      meta: {
        serviceId: {
          name: '数据服务',
          type: 'select',
          default: 'Mock/PropertiesPanel',
          options: [
            {
              value: 'GI_SERVICE_INTIAL_GRAPH',
              label: 'GI_SERVICE_INTIAL_GRAPH',
            },
            {
              value: 'Mock/PropertiesPanel',
              label: 'Mock/PropertiesPanel',
            },
          ],
        },
      },
    },
  ],
};
export const GI_LOCAL_DATA = {
  nodes: [
    {
      id: 'caa2995bd0a95fd363db094dc7399901',
      nodeType: 'ATTACKER_IP',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'ATTACKER_IP',
        Uuid: '',
        NeighborList: [],
        Position: '',
        PositionId: '',
        Time: '2021-06-18 13:33:37',
        Id: 'caa2995bd0a95fd363db094dc7399901',
        Name: '211.11.17.22',
      },
    },
    {
      id: '1c0f7b0cf39764ea98510f8dbb37290f',
      nodeType: 'AEGIS_ALERT',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'AEGIS_ALERT',
        Uuid: '720604da-db62-488e-ab44-1961670e77d0',
        NeighborList: [
          {
            HasMore: false,
            Type: 'ATTACKER_IP',
            Count: 1,
          },
        ],
        Position: '',
        PositionId: '',
        Time: 'null',
        Id: '1c0f7b0cf39764ea98510f8dbb37290f',
        Name: '弱口令账户登录(公网)',
      },
    },
    {
      id: 'ae09af076c89e9224e89225aec2b6591',
      nodeType: 'UUID',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'UUID',
        Uuid: '0417cdb7-62c8-4be8-b187-dd67ce0caa4f',
        NeighborList: [],
        Position: '',
        PositionId: '',
        Time: 'null',
        Id: 'ae09af076c89e9224e89225aec2b6591',
        Name: '0417cdb7-62c8-4be8-b187-dd67ce0caa4f',
      },
    },
    {
      id: '18d1f5067b8ba3de02f94787ea4cf7b6',
      nodeType: 'LOGIN_EVENT',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'LOGIN_EVENT',
        Uuid: '0417cdb7-62c8-4be8-b187-dd67ce0caa4f',
        NeighborList: [
          {
            HasMore: false,
            Type: 'ATTACKER_IP',
            Count: 1,
          },
        ],
        Position: '',
        PositionId: '',
        Time: '2021-07-08 14:55:48.000',
        Id: '18d1f5067b8ba3de02f94787ea4cf7b6',
        Name: 'SSH',
      },
    },
    {
      id: '046b8e32f9a948b98247384d44bbd4c4',
      nodeType: 'UUID',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'UUID',
        Uuid: '720604da-db62-488e-ab44-1961670e77d0',
        NeighborList: [],
        Position: '',
        PositionId: '',
        Time: 'null',
        Id: '046b8e32f9a948b98247384d44bbd4c4',
        Name: '720604da-db62-488e-ab44-1961670e77d0',
      },
    },
    {
      id: 'a67f8753c013b874c0d0f2f2c3139aee',
      nodeType: 'UUID',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'UUID',
        Uuid: '519183f1-f21c-46e3-9c47-3b32d28a825a',
        NeighborList: [],
        Position: '',
        PositionId: '',
        Time: 'null',
        Id: 'a67f8753c013b874c0d0f2f2c3139aee',
        Name: '519183f1-f21c-46e3-9c47-3b32d28a825a',
      },
    },
    {
      id: 'b0b8d3dd8d81ae21e3f0c90cfd9a79d0',
      nodeType: 'AEGIS_ALERT',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'AEGIS_ALERT',
        Uuid: '9630d633-e35c-452a-8f96-22ae9ad8ac0a',
        NeighborList: [
          {
            HasMore: false,
            Type: 'ATTACKER_IP',
            Count: 1,
          },
        ],
        Position: '',
        PositionId: '',
        Time: '2021-07-02 22:16:19',
        Id: 'b0b8d3dd8d81ae21e3f0c90cfd9a79d0',
        Name: '弱口令账户登录(公网)',
      },
    },
    {
      id: '74b38c3ec01e59a773b0f324c70df769',
      nodeType: 'AEGIS_ALERT',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'AEGIS_ALERT',
        Uuid: '20dfda77-4cad-45b8-a205-b2957bd7e60a',
        NeighborList: [
          {
            HasMore: false,
            Type: 'ATTACKER_IP',
            Count: 1,
          },
        ],
        Position: '',
        PositionId: '',
        Time: '2021-07-02 22:16:35',
        Id: '74b38c3ec01e59a773b0f324c70df769',
        Name: '弱口令账户登录(公网)',
      },
    },
    {
      id: '5e8f1f1f1e068c81c6fc0e21478ceb1c',
      nodeType: 'AEGIS_ALERT',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'AEGIS_ALERT',
        Uuid: '0417cdb7-62c8-4be8-b187-dd67ce0caa4f',
        NeighborList: [
          {
            HasMore: false,
            Type: 'ATTACKER_IP',
            Count: 1,
          },
        ],
        Position: '',
        PositionId: '',
        Time: 'null',
        Id: '5e8f1f1f1e068c81c6fc0e21478ceb1c',
        Name: 'login_common_account',
      },
    },
    {
      id: '3a8d071fd9293fe4d62bd23dc0b84634',
      nodeType: 'AEGIS_ALERT',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'AEGIS_ALERT',
        Uuid: '519183f1-f21c-46e3-9c47-3b32d28a825a',
        NeighborList: [
          {
            HasMore: false,
            Type: 'ATTACKER_IP',
            Count: 1,
          },
        ],
        Position: '',
        PositionId: '',
        Time: '2021-07-02 22:15:06',
        Id: '3a8d071fd9293fe4d62bd23dc0b84634',
        Name: '弱口令账户登录(公网)',
      },
    },
    {
      id: 'd131673467c120556c4e0ac8e8e6ad5a',
      nodeType: 'UUID',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'UUID',
        Uuid: '9630d633-e35c-452a-8f96-22ae9ad8ac0a',
        NeighborList: [],
        Position: '',
        PositionId: '',
        Time: 'null',
        Id: 'd131673467c120556c4e0ac8e8e6ad5a',
        Name: '9630d633-e35c-452a-8f96-22ae9ad8ac0a',
      },
    },
    {
      id: 'f00a8fba85490aa7382613b8317fda38',
      nodeType: 'AEGIS_ALERT',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'AEGIS_ALERT',
        Uuid: '0417cdb7-62c8-4be8-b187-dd67ce0caa4f',
        NeighborList: [
          {
            HasMore: false,
            Type: 'LOGIN_EVENT',
            Count: 1,
          },
        ],
        Position: '',
        PositionId: '',
        Time: 'null',
        Id: 'f00a8fba85490aa7382613b8317fda38',
        Name: '恶意破坏客户端进程',
      },
    },
    {
      id: '7367e63846eea9efa2a7a09ae52fc9ef',
      nodeType: 'UUID',
      nodeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'UUID',
        Uuid: '20dfda77-4cad-45b8-a205-b2957bd7e60a',
        NeighborList: [],
        Position: '',
        PositionId: '',
        Time: 'null',
        Id: '7367e63846eea9efa2a7a09ae52fc9ef',
        Name: '20dfda77-4cad-45b8-a205-b2957bd7e60a',
      },
    },
  ],
  edges: [
    {
      source: '18d1f5067b8ba3de02f94787ea4cf7b6',
      target: 'f00a8fba85490aa7382613b8317fda38',
      edgeType: 'ALERT_JOIN_LOGIN',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'ALERT_JOIN_LOGIN',
        EndId: 'f00a8fba85490aa7382613b8317fda38',
        EndType: 'AEGIS_ALERT',
        Time: '1625727397000',
        Id: '18d1f5067b8ba3de02f94787ea4cf7b6-f00a8fba85490aa7382613b8317fda38',
        StartType: 'LOGIN_EVENT',
        StartId: '18d1f5067b8ba3de02f94787ea4cf7b6',
        Name: '1625727397000',
      },
    },
    {
      source: 'caa2995bd0a95fd363db094dc7399901',
      target: '3a8d071fd9293fe4d62bd23dc0b84634',
      edgeType: 'IP_JOIN_ALERT',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'IP_JOIN_ALERT',
        EndId: '3a8d071fd9293fe4d62bd23dc0b84634',
        EndType: 'AEGIS_ALERT',
        Time: '1625235306000',
        Id: 'caa2995bd0a95fd363db094dc7399901-3a8d071fd9293fe4d62bd23dc0b84634',
        StartType: 'ATTACKER_IP',
        StartId: 'caa2995bd0a95fd363db094dc7399901',
        Name: '1625235306000',
      },
    },
    {
      source: 'caa2995bd0a95fd363db094dc7399901',
      target: '18d1f5067b8ba3de02f94787ea4cf7b6',
      edgeType: 'ATTACKERIP_JOIN_LOGIN',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'ATTACKERIP_JOIN_LOGIN',
        EndId: '18d1f5067b8ba3de02f94787ea4cf7b6',
        EndType: 'LOGIN_EVENT',
        Time: '2021-07-08 14:58:39.000',
        Id: 'caa2995bd0a95fd363db094dc7399901-18d1f5067b8ba3de02f94787ea4cf7b6',
        StartType: 'ATTACKER_IP',
        StartId: 'caa2995bd0a95fd363db094dc7399901',
        Name: '2021-07-08 14:58:39.000',
      },
    },
    {
      source: '1c0f7b0cf39764ea98510f8dbb37290f',
      target: '046b8e32f9a948b98247384d44bbd4c4',
      edgeType: 'UUID_JOIN_ALERT',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'UUID_JOIN_ALERT',
        EndId: '046b8e32f9a948b98247384d44bbd4c4',
        EndType: 'UUID',
        Time: '1625638748000',
        Id: '1c0f7b0cf39764ea98510f8dbb37290f-046b8e32f9a948b98247384d44bbd4c4',
        StartType: 'AEGIS_ALERT',
        StartId: '1c0f7b0cf39764ea98510f8dbb37290f',
        Name: '1625638748000',
      },
    },
    {
      source: 'b0b8d3dd8d81ae21e3f0c90cfd9a79d0',
      target: 'd131673467c120556c4e0ac8e8e6ad5a',
      edgeType: 'UUID_JOIN_ALERT',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'UUID_JOIN_ALERT',
        EndId: 'd131673467c120556c4e0ac8e8e6ad5a',
        EndType: 'UUID',
        Time: '1625235379000',
        Id: 'b0b8d3dd8d81ae21e3f0c90cfd9a79d0-d131673467c120556c4e0ac8e8e6ad5a',
        StartType: 'AEGIS_ALERT',
        StartId: 'b0b8d3dd8d81ae21e3f0c90cfd9a79d0',
        Name: '1625235379000',
      },
    },
    {
      source: 'caa2995bd0a95fd363db094dc7399901',
      target: '5e8f1f1f1e068c81c6fc0e21478ceb1c',
      edgeType: 'IP_JOIN_ALERT',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'IP_JOIN_ALERT',
        EndId: '5e8f1f1f1e068c81c6fc0e21478ceb1c',
        EndType: 'AEGIS_ALERT',
        Time: '1625727349000',
        Id: 'caa2995bd0a95fd363db094dc7399901-5e8f1f1f1e068c81c6fc0e21478ceb1c',
        StartType: 'ATTACKER_IP',
        StartId: 'caa2995bd0a95fd363db094dc7399901',
        Name: '1625727349000',
      },
    },
    {
      source: 'caa2995bd0a95fd363db094dc7399901',
      target: '1c0f7b0cf39764ea98510f8dbb37290f',
      edgeType: 'IP_JOIN_ALERT',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'IP_JOIN_ALERT',
        EndId: '1c0f7b0cf39764ea98510f8dbb37290f',
        EndType: 'AEGIS_ALERT',
        Time: '1625638748000',
        Id: 'caa2995bd0a95fd363db094dc7399901-1c0f7b0cf39764ea98510f8dbb37290f',
        StartType: 'ATTACKER_IP',
        StartId: 'caa2995bd0a95fd363db094dc7399901',
        Name: '1625638748000',
      },
    },
    {
      source: '3a8d071fd9293fe4d62bd23dc0b84634',
      target: 'a67f8753c013b874c0d0f2f2c3139aee',
      edgeType: 'UUID_JOIN_ALERT',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'UUID_JOIN_ALERT',
        EndId: 'a67f8753c013b874c0d0f2f2c3139aee',
        EndType: 'UUID',
        Time: '1625235306000',
        Id: '3a8d071fd9293fe4d62bd23dc0b84634-a67f8753c013b874c0d0f2f2c3139aee',
        StartType: 'AEGIS_ALERT',
        StartId: '3a8d071fd9293fe4d62bd23dc0b84634',
        Name: '1625235306000',
      },
    },
    {
      source: '5e8f1f1f1e068c81c6fc0e21478ceb1c',
      target: 'ae09af076c89e9224e89225aec2b6591',
      edgeType: 'UUID_JOIN_ALERT',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'UUID_JOIN_ALERT',
        EndId: 'ae09af076c89e9224e89225aec2b6591',
        EndType: 'UUID',
        Time: '1625727349000',
        Id: '5e8f1f1f1e068c81c6fc0e21478ceb1c-ae09af076c89e9224e89225aec2b6591',
        StartType: 'AEGIS_ALERT',
        StartId: '5e8f1f1f1e068c81c6fc0e21478ceb1c',
        Name: '1625727349000',
      },
    },
    {
      source: '74b38c3ec01e59a773b0f324c70df769',
      target: '7367e63846eea9efa2a7a09ae52fc9ef',
      edgeType: 'UUID_JOIN_ALERT',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'UUID_JOIN_ALERT',
        EndId: '7367e63846eea9efa2a7a09ae52fc9ef',
        EndType: 'UUID',
        Time: '1625235395000',
        Id: '74b38c3ec01e59a773b0f324c70df769-7367e63846eea9efa2a7a09ae52fc9ef',
        StartType: 'AEGIS_ALERT',
        StartId: '74b38c3ec01e59a773b0f324c70df769',
        Name: '1625235395000',
      },
    },
    {
      source: 'caa2995bd0a95fd363db094dc7399901',
      target: 'b0b8d3dd8d81ae21e3f0c90cfd9a79d0',
      edgeType: 'IP_JOIN_ALERT',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'IP_JOIN_ALERT',
        EndId: 'b0b8d3dd8d81ae21e3f0c90cfd9a79d0',
        EndType: 'AEGIS_ALERT',
        Time: '1625235379000',
        Id: 'caa2995bd0a95fd363db094dc7399901-b0b8d3dd8d81ae21e3f0c90cfd9a79d0',
        StartType: 'ATTACKER_IP',
        StartId: 'caa2995bd0a95fd363db094dc7399901',
        Name: '1625235379000',
      },
    },
    {
      source: 'f00a8fba85490aa7382613b8317fda38',
      target: 'ae09af076c89e9224e89225aec2b6591',
      edgeType: 'UUID_JOIN_ALERT',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'UUID_JOIN_ALERT',
        EndId: 'ae09af076c89e9224e89225aec2b6591',
        EndType: 'UUID',
        Time: '1625727397000',
        Id: 'f00a8fba85490aa7382613b8317fda38-ae09af076c89e9224e89225aec2b6591',
        StartType: 'AEGIS_ALERT',
        StartId: 'f00a8fba85490aa7382613b8317fda38',
        Name: '1625727397000',
      },
    },
    {
      source: 'caa2995bd0a95fd363db094dc7399901',
      target: '74b38c3ec01e59a773b0f324c70df769',
      edgeType: 'IP_JOIN_ALERT',
      edgeTypeKeyFromProperties: 'Type',
      data: {
        Type: 'IP_JOIN_ALERT',
        EndId: '74b38c3ec01e59a773b0f324c70df769',
        EndType: 'AEGIS_ALERT',
        Time: '1625235395000',
        Id: 'caa2995bd0a95fd363db094dc7399901-74b38c3ec01e59a773b0f324c70df769',
        StartType: 'ATTACKER_IP',
        StartId: 'caa2995bd0a95fd363db094dc7399901',
        Name: '1625235395000',
      },
    },
  ],
};
/**  由GI平台自动生成的，请勿修改 end **/
