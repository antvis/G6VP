export const GI_SERVICES_OPTIONS = [
  {
    id: "GI_SERVICE_INTIAL_GRAPH",
    content:
      "export default (localData)=>{\n      return new Promise((resolve)=>{\n        resolve(localData)\n      })\n    }",
    mode: "MOCK",
    name: "初始化接口"
  },
  {
    id: "GI_SERVICE_SCHEMA",
    content:
      "export default (localData,schemaData)=>{\n      return new Promise((resolve)=>{\n        resolve(schemaData)\n      })\n    }",
    mode: "MOCK",
    name: "初始化接口"
  },
  {
    id: "Mock/PropertiesPanel",
    mode: "MOCK",
    name: "Mock/PropertiesPanel",
    content:
      "export default function service(params, localData) {\n      var data = params.data;\n      return new Promise(function (resolve) {\n        return resolve(data);\n      });\n    }"
  },
  {
    id: "GraphScope/PropertiesPanel",
    mode: "MOCK",
    name: "GraphScope/PropertiesPanel",
    content:
      "export default function service(params) {\n      var id = params.id;\n      return fetch(\"http://dev.alipay.net:7001/graphcompute/properties\", {\n        method: 'post',\n        headers: {\n          'Content-Type': 'application/json;charset=utf-8'\n        },\n        body: JSON.stringify({\n          id: [id],\n          gremlinServer: localStorage.getItem('graphScopeGremlinServer')\n        })\n      }).then(function (response) {\n        return response.json();\n      }).then(function (res) {\n        var success = res.success,\n            data = res.data;\n\n        if (success) {\n          return data[id];\n        }\n\n        return res;\n      });\n    }"
  },
  {
    id: "Mock/NeighborsQuery",
    mode: "MOCK",
    name: "Mock/NeighborsQuery",
    content:
      'export default function service(params, localData) {\n      var ids = params.ids,\n          _params$data = params.data,\n          DATA = _params$data === void 0 ? {} : _params$data;\n      var _DATA$type = DATA.type,\n          type = _DATA$type === void 0 ? \'user\' : _DATA$type;\n      console.log(\'邻居查询\', params, ids, type);\n\n      var transfrom = function transfrom(p) {\n        var nodes = p.nodes,\n            edges = p.edges;\n        return {\n          nodes: nodes.map(function (c) {\n            return {\n              id: c.id,\n              data: c,\n              nodeType: c.type,\n              nodeTypeKeyFromProperties: \'type\'\n            };\n          }),\n          edges: edges.map(function (c) {\n            return {\n              source: c.source,\n              target: c.target,\n              id: "".concat(c.source, "-").concat(c.target),\n              data: c,\n              edgeType: c.type,\n              edgeTypeKeyFromProperties: \'type\'\n            };\n          })\n        };\n      };\n\n      var datas = ids.map(function (id) {\n        return {\n          nodes: [{\n            id: id,\n            type: type\n          }, {\n            id: "".concat(id, "-1"),\n            type: type\n          }, {\n            id: "".concat(id, "-2"),\n            type: type\n          }, {\n            id: "".concat(id, "-3"),\n            type: type\n          }, {\n            id: "".concat(id, "-4"),\n            type: type\n          }],\n          edges: [{\n            source: id,\n            target: "".concat(id, "-1")\n          }, {\n            source: id,\n            target: "".concat(id, "-2")\n          }, {\n            source: id,\n            target: "".concat(id, "-3")\n          }]\n        };\n      }).reduce(function (acc, curr) {\n        return {\n          nodes: [].concat(acc.nodes, curr.nodes),\n          edges: [].concat(acc.edges, curr.edges)\n        };\n      }, {\n        nodes: [],\n        edges: []\n      });\n      return new Promise(function (resolve) {\n        return resolve(transfrom(datas));\n      });\n    }'
  },
  {
    id: "GraphScope/NeighborsQuery",
    mode: "MOCK",
    name: "GraphScope/NeighborsQuery",
    content:
      "export default function service(params, localData) {\n      var id = params.id,\n          sep = params.sep; // 根据 sep 拼接 .bothE() 个数\n\n      var str = '';\n\n      for (var i = 0; i < sep - 1; i++) {\n        str += '.both()';\n      }\n\n      return fetch(\"http://dev.alipay.net:7001/graphcompute/gremlinQuery\", {\n        method: 'post',\n        headers: {\n          'Content-Type': 'application/json;charset=utf-8'\n        },\n        body: JSON.stringify({\n          // statement: `g.V('${id}').repeat(bothE()).times(${sep})`,\n          statement: \"g.V(\".concat(id, \")\").concat(str, \".bothE()\"),\n          gremlinServer: localStorage.getItem('graphScopeGremlinServer')\n        })\n      }).then(function (response) {\n        return response.json();\n      }).then(function (res) {\n        if (res.success) {\n          return res.data;\n        }\n\n        return {\n          nodes: [],\n          edges: []\n        };\n      });\n    }"
  },
  {
    id: "MOCK/Save",
    mode: "MOCK",
    name: "MOCK/Save",
    content:
      "export default function service(params, localData) {\n      var uuid = \"\".concat(Math.random().toString(36).substr(2));\n      var href = window.location.origin + '/#/share/' + uuid; //  window.localforage 是 GraphInsight 平台提供的全局变量，详情参考：https://github.com/localForage/localForage\n      //@ts-ignore\n\n      var _window = window,\n          localforage = _window.localforage;\n      localforage.setItem(uuid, {\n        id: uuid,\n        type: 'save',\n        params: JSON.stringify(params)\n      });\n      return new Promise(function (resolve) {\n        return resolve({\n          success: true,\n          data: href\n        });\n      });\n    }"
  },
  {
    id: "Mock/GremlinQuery",
    mode: "MOCK",
    name: "Mock/GremlinQuery",
    content:
      'export default t=>{const e="mock_gremlin_query",r={nodes:[{id:e,type:"user"},{id:`${e}-family`,type:"user"},{id:`${e}-card`,type:"card"}],edges:[{source:e,target:`${e}-family`,type:"family"},{source:e,target:`${e}-card`,type:"own"}]};return new Promise((t=>t({success:!0,data:r})))}'
  },
  {
    id: "GraphScope/GremlinQuery",
    mode: "MOCK",
    name: "GraphScope/GremlinQuery",
    content:
      'export default (t={})=>{const{value:e="g.V().limit(5)"}=t;return fetch("https://storehouse.test.alipay.net/graphcompute/gremlinQuery",{method:"post",headers:{"Content-Type":"application/json;charset=utf-8"},body:JSON.stringify({statement:e,gremlinServer:localStorage.getItem("graphScopeGremlinServer")})}).then((t=>t.json()))}'
  }
];
export const GI_PROJECT_CONFIG = {
  nodes: [
    {
      id: "SimpleNode",
      props: {
        size: 26,
        color: "#ddd",
        label: []
      },
      groupName: "默认样式",
      expressions: [],
      logic: true
    },
    {
      id: "SimpleNode",
      props: {
        size: 26,
        color: "#3056E3",
        label: ["account_balance.id"],
        advanced: {
          icon: {
            type: "font",
            value: "bank",
            fill: "#fff",
            visible: true
          },
          keyshape: {
            fillOpacity: 0.8
          },
          label: {
            visible: true,
            fill: "#000",
            fontSize: 12,
            position: "bottom"
          },
          badge: {
            visible: false
          }
        }
      },
      groupName: "ACCOUNT_BALANCE TYPE",
      expressions: [
        {
          name: "icon",
          operator: "eql",
          value: "account_balance"
        }
      ],
      logic: true
    },
    {
      id: "SimpleNode",
      props: {
        size: 26,
        color: "rgba(245,166,35,1)",
        label: ["account_box.id"],
        advanced: {
          icon: {
            type: "font",
            value: "user",
            fill: "#fff",
            visible: true
          },
          keyshape: {
            fillOpacity: 0.8
          },
          label: {
            visible: true,
            fill: "#000",
            fontSize: 12,
            position: "bottom"
          },
          badge: {
            visible: false
          }
        }
      },
      groupName: "ACCOUNT_BOX TYPE",
      expressions: [
        {
          name: "icon",
          operator: "eql",
          value: "account_box"
        }
      ],
      logic: true
    },
    {
      id: "SimpleNode",
      props: {
        size: 26,
        color: "#795AE1",
        label: ["-.id"]
      },
      groupName: "- TYPE",
      expressions: [
        {
          name: "icon",
          operator: "eql",
          value: "-"
        }
      ],
      logic: true
    }
  ],
  edges: [
    {
      id: "SimpleEdge",
      props: {
        size: 1,
        color: "#ddd",
        label: []
      },
      groupName: "默认样式",
      expressions: [],
      logic: true
    },
    {
      id: "SimpleEdge",
      props: {
        size: 1,
        color: "#3056E3",
        label: ["ib_txn.amount"],
        advanced: {
          keyshape: {
            customPoly: false,
            lineDash: [],
            opacity: 1
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: "#3056E3",
            backgroundEnable: true,
            backgroundFill: "#fff",
            backgroundStroke: "#fff"
          },
          animate: {
            visible: true,
            type: "circle-running",
            dotColor: "#3056E3",
            repeat: true,
            duration: 3000
          }
        }
      },
      groupName: "IB_TXN TYPE",
      expressions: [
        {
          name: "category",
          operator: "eql",
          value: "ib_txn"
        }
      ],
      logic: true
    },
    {
      id: "SimpleEdge",
      props: {
        size: 1,
        color: "rgba(245,166,35,1)",
        label: ["ownership.relation"],
        advanced: {
          keyshape: {
            customPoly: true,
            lineDash: [],
            opacity: 1,
            poly: 0
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: "rgba(245,166,35,1)",
            backgroundEnable: true,
            backgroundFill: "#fff",
            backgroundStroke: "#fff"
          },
          animate: {
            visible: false
          }
        }
      },
      groupName: "OWNERSHIP TYPE",
      expressions: [
        {
          name: "category",
          operator: "eql",
          value: "ownership"
        }
      ],
      logic: true
    }
  ],
  layout: {
    id: "Dagre",
    props: {
      type: "dagre",
      rankdir: "TB",
      align: null,
      nodesep: 30,
      ranksep: 60
    }
  },
  components: [
    {
      id: "Toolbar",
      props: {
        GI_CONTAINER: [
          "ZoomIn",
          "ZoomOut",
          "FitView",
          "FitCenter",
          "LassoSelect",
          "AddSheetbar"
        ],
        direction: "vertical",
        placement: "LT",
        offset: [24, 64]
      }
    },
    {
      id: "ZoomIn",
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "放大",
          isShowIcon: true,
          icon: "icon-zoomin",
          isShowTooltip: true,
          tooltip: "",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true
        }
      }
    },
    {
      id: "ZoomOut",
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "缩小",
          isShowIcon: true,
          icon: "icon-zoomout",
          isShowTooltip: true,
          tooltip: "",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true
        }
      }
    },
    {
      id: "FitView",
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "自适应",
          isShowIcon: true,
          icon: "icon-fit-view",
          isShowTooltip: true,
          tooltip: "",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true
        }
      }
    },
    {
      id: "FitCenter",
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "视图居中",
          isShowIcon: true,
          icon: "icon-fit-center",
          isShowTooltip: true,
          tooltip: "",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true
        }
      }
    },
    {
      id: "LassoSelect",
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "自由圈选",
          isShowIcon: true,
          icon: "icon-lasso",
          isShowTooltip: true,
          tooltip: "按住Shift，点击画布即可自由圈选",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true
        }
      }
    },
    {
      id: "PropertiesPanel",
      props: {
        serviceId: "GI/PropertiesPanel",
        title: "属性面板",
        placement: "LB",
        width: "356px",
        height: "calc(100% - 80px)",
        offset: [10, 10],
        animate: false
      }
    },
    {
      id: "ActivateRelations",
      props: {
        enableNodeHover: true,
        enableEdgeHover: true,
        enable: true,
        trigger: "click",
        upstreamDegree: 1,
        downstreamDegree: 1
      }
    },
    {
      id: "CanvasSetting",
      props: {
        styleCanvas: {
          background: "rgba(255,255,255,1)",
          backgroundImage:
            "https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*k9t4QamMuQ4AAAAAAAAAAAAAARQnAQ"
        },
        dragCanvas: {
          disabled: false,
          direction: "both",
          enableOptimize: false
        },
        zoomCanvas: {
          disabled: false,
          enableOptimize: true
        }
      }
    },
    {
      id: "NodeLegend",
      props: {
        sortKey: "icon",
        textColor: "#ddd",
        placement: "LT",
        offset: [100, 20]
      }
    },
    {
      id: "SideTabs",
      name: "侧边栏",
      props: {
        GI_CONTAINER: [
          "GremlinQuery",
          "FilterPanel",
          "PathAnalysis",
          "StyleSetting",
          "Save"
        ],
        outSideFromCanvas: true,
        tabPosition: "left",
        placement: "LB",
        offset: [0, 61],
        height: "calc(100vh - 120px)",
        width: "450px"
      }
    },
    {
      id: "FilterPanel",
      name: "筛选面板",
      props: {
        filterKeys: [],
        isFilterIsolatedNodes: true,
        highlightMode: true,
        filterLogic: "and",
        GI_CONTAINER_INDEX: 2,
        GIAC_CONTENT: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "筛选面板",
          isShowIcon: true,
          icon: "icon-filter",
          isShowTooltip: true,
          tooltip: "通过属性筛选画布信息，可自定义",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true,
          containerType: "div",
          containerAnimate: false,
          containerPlacement: "RT",
          offset: [0, 0],
          containerWidth: "400px",
          containerHeight: "calc(100% - 100px)",
          contaienrMask: false
        }
      }
    },
    {
      id: "ContextMenu",
      name: "右键菜单",
      props: {
        GI_CONTAINER: ["NeighborsQuery", "ToggleClusterWithMenu"]
      }
    },
    {
      id: "AddSheetbar",
      name: "新增页签",
      props: {
        isRelayout: true,
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "将选中的节点与边添加到新画布中",
          isShowIcon: true,
          icon: "icon-plus",
          isShowTooltip: true,
          tooltip: "",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true
        }
      }
    },
    {
      id: "Sheetbar",
      name: "多画布页签",
      props: {
        placement: "bottom",
        height: 40
      }
    },
    {
      id: "NeighborsQuery",
      name: "邻居查询",
      props: {
        serviceId: "GI/NeighborsQuery",
        degree: "1",
        isFocus: true
      }
    },
    {
      id: "Save",
      name: "保存分享",
      props: {
        serviceId: "GI/Save",
        GI_CONTAINER_INDEX: 2,
        GIAC_CONTENT: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "保存分享",
          isShowIcon: true,
          icon: "icon-save",
          isShowTooltip: true,
          tooltip: "保存画布,并分享给其他人",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true,
          containerType: "div",
          containerAnimate: false,
          containerPlacement: "RT",
          offset: [0, 0],
          containerWidth: "350px",
          containerHeight: "calc(100% - 100px)",
          contaienrMask: false
        }
      }
    },
    {
      id: "PathAnalysis",
      name: "路径分析",
      props: {
        pathNodeLabel: "id",
        GI_CONTAINER_INDEX: 2,
        GIAC_CONTENT: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "路径分析",
          isShowIcon: true,
          icon: "icon-path-analysis",
          isShowTooltip: true,
          tooltip: "",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true,
          containerType: "div",
          containerAnimate: false,
          containerPlacement: "RT",
          offset: [0, 0],
          containerWidth: "400px",
          containerHeight: "calc(100% - 100px)",
          contaienrMask: false
        }
      }
    },
    {
      id: "StyleSetting",
      name: "样式设置",
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC_CONTENT: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "样式设置",
          isShowIcon: true,
          icon: "icon-bold",
          isShowTooltip: true,
          tooltip: "",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true,
          containerType: "div",
          containerAnimate: false,
          containerPlacement: "RT",
          offset: [0, 0],
          containerWidth: "350px",
          containerHeight: "calc(100% - 100px)",
          contaienrMask: false
        }
      }
    },
    {
      id: "SnapshotGallery",
      name: "快照画廊",
      props: {
        background: "#fff",
        direction: "horizontal",
        placement: "LT",
        offset: [20, 20],
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "快照画廊",
          isShowIcon: true,
          icon: "icon-camera",
          isShowTooltip: true,
          tooltip: "快照画廊(快捷键ctrl+x)",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true
        }
      }
    },
    {
      id: "Loading",
      name: "加载动画",
      props: {}
    },
    {
      id: "Copyright",
      name: "版权",
      props: {
        imageUrl: "",
        width: 100,
        height: 100,
        placement: "RB",
        offset: [100, 20]
      }
    },
    {
      id: "ToggleClusterWithMenu",
      name: "展开/收起",
      props: {
        isReLayout: false,
        degree: 1
      }
    },
    {
      id: "GremlinQuery",
      name: "Gremlin 查询面板",
      props: {
        serviceId: "GI/GremlinQuery",
        initialValue: `MATCH (n:Domain) 
          WHERE n.id in ['Domain_c58c149eec59bb14b0c102a0f303d4c20366926b5c3206555d2937474124beb9','Domain_f3554b666038baffa5814c319d3053ee2c2eb30d31d0ef509a1a463386b69845'] 
          RETURN n`,
        height: 200,
        GI_CONTAINER_INDEX: 2,
        GIAC_CONTENT: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "数据查询",
          isShowIcon: true,
          icon: "icon-query",
          isShowTooltip: true,
          tooltip: "",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true,
          containerType: "div",
          containerAnimate: false,
          containerPlacement: "RT",
          offset: [0, 0],
          containerWidth: "350px",
          containerHeight: "calc(100% - 100px)",
          contaienrMask: false
        }
      }
    },
    {
      id: "Initializer",
      name: "初始化器",
      props: {
        serviceId: "GS/GI_SERVICE_INTIAL_GRAPH",
        schemaServiceId: "GS/GI_SERVICE_SCHEMA",
        GI_INITIALIZER: true
      }
    }
  ]
};
export const GI_LOCAL_DATA = {
  nodes: [
    {
      id: "account_7",
      nodeType: "account_balance",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "account_7",
        icon: "account_balance",
        create_date: "2019-01-03T00:00:00",
        is_different_bank: 0
      }
    },
    {
      id: "account_20",
      nodeType: "account_balance",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "account_20",
        icon: "account_balance",
        create_date: "2019-01-05T00:00:00",
        is_different_bank: 0
      }
    },
    {
      id: "account_55",
      nodeType: "account_balance",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "account_55",
        icon: "account_balance",
        create_date: "2019-01-07T00:00:00",
        is_different_bank: 0
      }
    },
    {
      id: "account_81",
      nodeType: "account_balance",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "account_81",
        icon: "account_balance",
        create_date: "2019-01-15T00:00:00",
        is_different_bank: 0
      }
    },
    {
      id: "account_103",
      nodeType: "account_balance",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "account_103",
        icon: "account_balance",
        create_date: "2019-01-15T00:00:00",
        is_different_bank: 0
      }
    },
    {
      id: "account_901",
      nodeType: "account_balance",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "account_901",
        icon: "account_balance",
        create_date: "2019-01-03T00:00:00",
        is_different_bank: 0
      }
    },
    {
      id: "account_902",
      nodeType: "account_balance",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "account_902",
        icon: "account_balance",
        create_date: "2019-01-10T00:00:00",
        is_different_bank: 0
      }
    },
    {
      id: "account_903",
      nodeType: "account_balance",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "account_903",
        icon: "account_balance",
        create_date: "2019-01-09T00:00:00",
        is_different_bank: 1
      }
    },
    {
      id: "account_904",
      nodeType: "account_balance",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "account_904",
        icon: "account_balance",
        create_date: "2019-01-08T00:00:00",
        is_different_bank: 1
      }
    },
    {
      id: "customer_7",
      nodeType: "account_box",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "customer_7",
        icon: "account_box",
        address: "-",
        customer_type: "retail",
        first_name: "-",
        last_name: "-",
        phone: "-",
        remarks: "high-value IB txn into customer 103's account",
        risk_category: "medium",
        risk_score: 50
      }
    },
    {
      id: "customer_20",
      nodeType: "account_box",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "customer_20",
        icon: "account_box",
        address: "-",
        customer_type: "retail",
        first_name: "-",
        last_name: "-",
        phone: "-",
        remarks: "high-value IB txn into customer 103's account",
        risk_category: "medium",
        risk_score: 50
      }
    },
    {
      id: "customer_55",
      nodeType: "account_box",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "customer_55",
        icon: "account_box",
        address: "-",
        customer_type: "retail",
        first_name: "-",
        last_name: "-",
        phone: "-",
        remarks: "high-value IB txn into customer 103's account",
        risk_category: "medium",
        risk_score: 50
      }
    },
    {
      id: "customer_81",
      nodeType: "account_box",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "customer_81",
        icon: "account_box",
        address: "-",
        customer_type: "retail",
        first_name: "-",
        last_name: "-",
        phone: "-",
        remarks: "high-value IB txn into customer 103's account",
        risk_category: "medium",
        risk_score: 50
      }
    },
    {
      id: "customer_103",
      nodeType: "account_box",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "customer_103",
        icon: "account_box",
        address: "103 RD",
        customer_type: "retail",
        first_name: "john",
        last_name: "doe",
        phone: "+65 0000 0103",
        remarks:
          "high-value purchases from luxury retailer. source of funds from 4 related accounts",
        risk_category: "high",
        risk_score: 99
      }
    },
    {
      id: "customer_901",
      nodeType: "account_box",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "customer_901",
        icon: "account_box",
        address: "901 RD",
        customer_type: "retail",
        first_name: "jane",
        last_name: "doe",
        phone: "+65 0000 0103",
        remarks:
          "source of funds for customer 103's purchase of luxury items. customer has same phone number as customer 103.",
        risk_category: "medium",
        risk_score: 74
      }
    },
    {
      id: "customer_902",
      nodeType: "account_box",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "customer_902",
        icon: "account_box",
        address: "103 RD",
        customer_type: "retail",
        first_name: "jim",
        last_name: "smith",
        phone: "+65 0000 0902",
        remarks:
          "source of funds for customer 103's purchase of luxury items. customer has same address as customer 103.",
        risk_category: "medium",
        risk_score: 74
      }
    },
    {
      id: "other_banks",
      nodeType: "-",
      nodeTypeKeyFromProperties: "icon",
      data: {
        id: "other_banks",
        icon: "-",
        address: "-",
        customer_type: "-",
        first_name: "-",
        last_name: "-",
        phone: "-",
        remarks: "other banks",
        risk_category: "-",
        risk_score: "-"
      }
    }
  ],
  edges: [
    {
      source: "account_103",
      target: "account_904",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_103",
        target: "account_904",
        amount: 1000000,
        balance: 200000,
        category: "ib_txn",
        date: "2020-01-01T00:00:00",
        id: "ib_txn_1",
        is_foreign_source: 0,
        is_foreign_target: 1,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "customer_103",
        target_owner: "other_banks",
        time: "0:00:00"
      }
    },
    {
      source: "account_903",
      target: "account_103",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_903",
        target: "account_103",
        amount: 100000,
        balance: "null",
        category: "ib_txn",
        date: "2020-01-02T01:00:00",
        id: "ib_txn_2",
        is_foreign_source: 1,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "other_banks",
        target_owner: "customer_103",
        time: "1:00:00"
      }
    },
    {
      source: "account_103",
      target: "account_904",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_103",
        target: "account_904",
        amount: 50000,
        balance: 250000,
        category: "ib_txn",
        date: "2020-01-02T02:00:00",
        id: "ib_txn_3",
        is_foreign_source: 0,
        is_foreign_target: 1,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "customer_103",
        target_owner: "other_banks",
        time: "2:00:00"
      }
    },
    {
      source: "account_904",
      target: "account_103",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_904",
        target: "account_103",
        amount: 2000000,
        balance: "null",
        category: "ib_txn",
        date: "2020-01-01T03:00:00",
        id: "ib_txn_4",
        is_foreign_source: 1,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "other_banks",
        target_owner: "customer_103",
        time: "3:00:00"
      }
    },
    {
      source: "account_103",
      target: "account_903",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_103",
        target: "account_903",
        amount: 1000000,
        balance: 1250000,
        category: "ib_txn",
        date: "2020-01-02T04:00:00",
        id: "ib_txn_5",
        is_foreign_source: 0,
        is_foreign_target: 1,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "customer_103",
        target_owner: "other_banks",
        time: "4:00:00"
      }
    },
    {
      source: "account_103",
      target: "account_903",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_103",
        target: "account_903",
        amount: 1000000,
        balance: 250000,
        category: "ib_txn",
        date: "2020-01-02T05:00:00",
        id: "ib_txn_6",
        is_foreign_source: 0,
        is_foreign_target: 1,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "customer_103",
        target_owner: "other_banks",
        time: "5:00:00"
      }
    },
    {
      source: "account_901",
      target: "account_103",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_901",
        target: "account_103",
        amount: 250000,
        balance: 10000,
        category: "ib_txn",
        date: "2020-01-01T06:00:00",
        id: "ib_txn_7",
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "customer_901",
        target_owner: "customer_103",
        time: "6:00:00"
      }
    },
    {
      source: "account_902",
      target: "account_103",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_902",
        target: "account_103",
        amount: 250000,
        balance: 300000,
        category: "ib_txn",
        date: "2020-01-01T06:30:00",
        id: "ib_txn_8",
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "customer_902",
        target_owner: "customer_103",
        time: "6:30:00"
      }
    },
    {
      source: "account_903",
      target: "account_103",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_903",
        target: "account_103",
        amount: 250000,
        balance: "null",
        category: "ib_txn",
        date: "2020-01-02T06:00:00",
        id: "ib_txn_9",
        is_foreign_source: 1,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "other_banks",
        target_owner: "customer_103",
        time: "6:00:00"
      }
    },
    {
      source: "account_904",
      target: "account_103",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_904",
        target: "account_103",
        amount: 250000,
        balance: "null",
        category: "ib_txn",
        date: "2020-01-01T00:00:00",
        id: "ib_txn_10",
        is_foreign_source: 1,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "other_banks",
        target_owner: "customer_103",
        time: "0:00:00"
      }
    },
    {
      source: "account_7",
      target: "account_103",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_7",
        target: "account_103",
        amount: 125000,
        balance: 225000,
        category: "ib_txn",
        date: "2020-01-03T22:00:00",
        id: "ib_txn_72",
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "customer_7",
        target_owner: "customer_103",
        time: "22:00:00"
      }
    },
    {
      source: "account_55",
      target: "account_103",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_55",
        target: "account_103",
        amount: 250000,
        balance: 475000,
        category: "ib_txn",
        date: "2020-01-03T22:00:00",
        id: "ib_txn_73",
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "customer_55",
        target_owner: "customer_103",
        time: "22:00:00"
      }
    },
    {
      source: "account_20",
      target: "account_103",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_20",
        target: "account_103",
        amount: 150000,
        balance: 625000,
        category: "ib_txn",
        date: "2020-01-04T18:00:00",
        id: "ib_txn_74",
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "customer_20",
        target_owner: "customer_103",
        time: "18:00:00"
      }
    },
    {
      source: "account_81",
      target: "account_103",
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "account_81",
        target: "account_103",
        amount: 300000,
        balance: 925000,
        category: "ib_txn",
        date: "2020-01-04T18:00:00",
        id: "ib_txn_75",
        is_foreign_source: 0,
        is_foreign_target: 0,
        is_high_risk_source_target_location: 0,
        relation: "ib_transfer",
        source_owner: "customer_81",
        target_owner: "customer_103",
        time: "18:00:00"
      }
    },
    {
      source: "customer_7",
      target: "account_7",
      edgeType: "ownership",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "customer_7",
        target: "account_7",
        category: "ownership",
        id: "ownership_210",
        relation: "owns"
      }
    },
    {
      source: "customer_20",
      target: "account_20",
      edgeType: "ownership",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "customer_20",
        target: "account_20",
        category: "ownership",
        id: "ownership_223",
        relation: "owns"
      }
    },
    {
      source: "customer_55",
      target: "account_55",
      edgeType: "ownership",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "customer_55",
        target: "account_55",
        category: "ownership",
        id: "ownership_258",
        relation: "owns"
      }
    },
    {
      source: "customer_81",
      target: "account_81",
      edgeType: "ownership",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "customer_81",
        target: "account_81",
        category: "ownership",
        id: "ownership_284",
        relation: "owns"
      }
    },
    {
      source: "customer_103",
      target: "account_103",
      edgeType: "ownership",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "customer_103",
        target: "account_103",
        category: "ownership",
        id: "ownership_306",
        relation: "owns"
      }
    },
    {
      source: "customer_901",
      target: "account_901",
      edgeType: "ownership",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "customer_901",
        target: "account_901",
        category: "ownership",
        id: "ownership_307",
        relation: "owns"
      }
    },
    {
      source: "customer_902",
      target: "account_902",
      edgeType: "ownership",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "customer_902",
        target: "account_902",
        category: "ownership",
        id: "ownership_308",
        relation: "owns"
      }
    },
    {
      source: "other_banks",
      target: "account_903",
      edgeType: "ownership",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "other_banks",
        target: "account_903",
        category: "ownership",
        id: "ownership_310",
        relation: "owns"
      }
    },
    {
      source: "other_banks",
      target: "account_904",
      edgeType: "ownership",
      edgeTypeKeyFromProperties: "category",
      data: {
        source: "other_banks",
        target: "account_904",
        category: "ownership",
        id: "ownership_311",
        relation: "owns"
      }
    }
  ]
};
export const GI_SCHEMA_DATA = {
  nodes: [
    {
      nodeType: "account_balance",
      nodeTypeKeyFromProperties: "icon",
      properties: {
        id: "string",
        icon: "string",
        create_date: "string",
        is_different_bank: "number"
      }
    },
    {
      nodeType: "account_box",
      nodeTypeKeyFromProperties: "icon",
      properties: {
        id: "string",
        icon: "string",
        address: "string",
        customer_type: "string",
        first_name: "string",
        last_name: "string",
        phone: "string",
        remarks: "string",
        risk_category: "string",
        risk_score: "number"
      }
    },
    {
      nodeType: "-",
      nodeTypeKeyFromProperties: "icon",
      properties: {
        id: "string",
        icon: "string",
        address: "string",
        customer_type: "string",
        first_name: "string",
        last_name: "string",
        phone: "string",
        remarks: "string",
        risk_category: "string",
        risk_score: "string"
      }
    }
  ],
  edges: [
    {
      edgeType: "ib_txn",
      edgeTypeKeyFromProperties: "category",
      sourceNodeType: "account_balance",
      targetNodeType: "account_balance",
      properties: {
        source: "string",
        target: "string",
        amount: "number",
        balance: "number",
        category: "string",
        date: "string",
        id: "string",
        is_foreign_source: "number",
        is_foreign_target: "number",
        is_high_risk_source_target_location: "number",
        relation: "string",
        source_owner: "string",
        target_owner: "string",
        time: "string"
      }
    },
    {
      edgeType: "ownership",
      edgeTypeKeyFromProperties: "category",
      sourceNodeType: "account_box",
      targetNodeType: "account_balance",
      properties: {
        source: "string",
        target: "string",
        category: "string",
        id: "string",
        relation: "string"
      }
    }
  ]
};
