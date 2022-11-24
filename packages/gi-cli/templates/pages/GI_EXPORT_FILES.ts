/**  由GI平台自动生成的，请勿修改 start **/

export const GI_SERVICES_OPTIONS = [
  {
    id: "GI_SERVICE_INTIAL_GRAPH",
    content:
      "export default (localData)=>{\n      return new Promise((resolve)=>{\n        resolve(localData)\n      })\n    }",
    mode: "MOCK",
    name: "初始化接口",
  },
  {
    id: "GI_SERVICE_SCHEMA",
    content:
      "export default (localData,schemaData)=>{\n      return new Promise((resolve)=>{\n        resolve(schemaData)\n      })\n    }",
    mode: "MOCK",
    name: "初始化接口",
  },
  {
    id: "Mock/PropertiesPanel",
    mode: "MOCK",
    name: "Mock/PropertiesPanel",
    content:
      "export default (e,t)=>{const{data:n}=e;return new Promise((e=>e(n)))}",
  },
  {
    id: "Mock/GremlinQuery",
    mode: "MOCK",
    name: "Mock/GremlinQuery",
    content:
      'export default t=>{const e="mock_gremlin_query",r={nodes:[{id:e,type:"user"},{id:`${e}-family`,type:"user"},{id:`${e}-card`,type:"card"}],edges:[{source:e,target:`${e}-family`,type:"family"},{source:e,target:`${e}-card`,type:"own"}]};return new Promise((t=>t({success:!0,data:r})))}',
  },
  {
    id: "GraphScope/GremlinQuery",
    mode: "MOCK",
    name: "GraphScope/GremlinQuery",
    content:
      'export default (t={})=>{const{value:e="g.V().limit(5)"}=t;return fetch("https://storehouse.test.alipay.net/graphcompute/gremlinQuery",{method:"post",headers:{"Content-Type":"application/json;charset=utf-8"},body:JSON.stringify({statement:e,gremlinServer:localStorage.getItem("graphScopeGremlinServer")})}).then((t=>t.json()))}',
  },
  {
    id: "Mock/NeighborsQuery",
    mode: "MOCK",
    name: "Mock/NeighborsQuery",
    content:
      'export default (e,t)=>{const{id:n}=e;console.log("邻居查询",e);const r={nodes:[{id:n},{id:`${n}-1`},{id:`${n}-2`},{id:`${n}-3`},{id:`${n}-4`}],edges:[{source:n,target:`${n}-1`},{source:n,target:`${n}-2`},{source:n,target:`${n}-3`}]};return new Promise((e=>e(r)))}',
  },
  {
    id: "GraphScope/NeighborsQuery",
    mode: "MOCK",
    name: "GraphScope/NeighborsQuery",
    content:
      'export default (e,t)=>{const{id:n,sep:r}=e;return fetch("http://dev.alipay.net:7001/graphcompute/gremlinQuery",{method:"post",headers:{"Content-Type":"application/json;charset=utf-8"},body:JSON.stringify({statement:`g.V(\'${n}\').repeat(bothE()).times(${r})`,gremlinServer:localStorage.getItem("graphScopeGremlinServer")})}).then((e=>e.json())).then((e=>e.success?e.data:{nodes:[],edges:[]}))}',
  },
  {
    id: "MOCK/Save",
    mode: "MOCK",
    name: "MOCK/Save",
    content:
      'export default (e,t)=>{const n=`${Math.random().toString(36).substr(2)}`,r=window.location.origin+"/#/share/"+n,{localforage:a}=window;return a.setItem(n,{id:n,type:"save",params:JSON.stringify(e)}),new Promise((e=>e({success:!0,data:r})))}',
  },
];
export const GI_PROJECT_CONFIG = {
  nodes: [
    {
      id: "SimpleNode",
      props: {
        size: 26,
        color: "#ddd",
        label: [],
      },
      groupName: "默认样式",
      expressions: [],
      logic: true,
    },
    {
      id: "SimpleNode",
      props: {
        size: 26,
        color: "rgba(245,166,35,1)",
        label: ["card.id"],
        advanced: {
          icon: {
            type: "font",
            value: "bank",
            fill: "#fff",
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.8,
          },
          label: {
            visible: true,
            fill: "#000",
            fontSize: 12,
            position: "bottom",
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: "CARD TYPE",
      expressions: [
        {
          name: "type",
          operator: "eql",
          value: "card",
        },
      ],
      logic: true,
    },
    {
      id: "ClusterNode",
      props: {
        size: 26,
        color: "#3056E3",
        label: ["alipay.id"],
        advanced: {
          icon: {
            type: "font",
            value: "alipay",
            fill: "#fff",
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.8,
          },
          label: {
            visible: true,
            fill: "#000",
            fontSize: 12,
            position: "bottom",
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: "ALIPAY TYPE",
      expressions: [
        {
          name: "type",
          operator: "eql",
          value: "alipay",
        },
      ],
      logic: true,
    },
    {
      id: "SimpleNode",
      props: {
        size: 26,
        color: "rgba(80,227,194,1)",
        label: ["YYZZ.id", "YYZZ.type"],
        advanced: {
          icon: {
            type: "font",
            value: "solution",
            fill: "#fff",
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.8,
          },
          label: {
            visible: true,
            fill: "#000",
            fontSize: 12,
            position: "bottom",
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: "YYZZ TYPE",
      expressions: [
        {
          name: "type",
          operator: "eql",
          value: "YYZZ",
        },
      ],
      logic: true,
    },
    {
      id: "SimpleNode",
      props: {
        size: 26,
        color: "#622CD8",
        label: ["company.id"],
        advanced: {
          icon: {
            type: "font",
            value: "company",
            fill: "#fff",
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.8,
          },
          label: {
            visible: true,
            fill: "#000",
            fontSize: 12,
            position: "bottom",
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: "COMPANY TYPE",
      expressions: [
        {
          name: "type",
          operator: "eql",
          value: "company",
        },
      ],
      logic: true,
    },
    {
      id: "SimpleNode",
      props: {
        size: 26,
        color: "rgba(65,117,5,1)",
        label: ["user.id"],
        advanced: {
          icon: {
            type: "font",
            value: "user",
            fill: "#fff",
            visible: true,
          },
          keyshape: {
            fillOpacity: 0.8,
          },
          label: {
            visible: true,
            fill: "#000",
            fontSize: 12,
            position: "bottom",
          },
          badge: {
            visible: false,
          },
        },
      },
      groupName: "USER TYPE",
      expressions: [
        {
          name: "type",
          operator: "eql",
          value: "user",
        },
      ],
      logic: true,
    },
  ],
  edges: [
    {
      id: "SimpleEdge",
      props: {
        size: 1,
        color: "#ddd",
        label: [],
      },
      groupName: "默认样式",
      expressions: [],
      logic: true,
    },
    {
      id: "SimpleEdge",
      props: {
        size: 1,
        color: "#3056E3",
        label: ["transfer.amount"],
        advanced: {
          keyshape: {
            customPoly: false,
            lineDash: [],
            opacity: 1,
          },
          label: {
            visible: true,
            fontSize: 12,
            offset: [0, 0],
            fill: "#3056E3",
            backgroundEnable: true,
            backgroundFill: "#fff",
            backgroundStroke: "#fff",
          },
          animate: {
            visible: true,
            type: "circle-running",
            dotColor: "#3056E3",
            repeat: true,
            duration: 3000,
          },
        },
      },
      groupName: "TRANSFER TYPE",
      expressions: [
        {
          name: "type",
          operator: "eql",
          value: "transfer",
        },
      ],
      logic: true,
    },
    {
      id: "SimpleEdge",
      props: {
        size: 1,
        color: "#F58CCB",
        label: [],
      },
      groupName: "OWNER TYPE",
      expressions: [
        {
          name: "type",
          operator: "eql",
          value: "owner",
        },
      ],
      logic: true,
    },
    {
      id: "SimpleEdge",
      props: {
        size: 1,
        color: "#795AE1",
        label: [],
      },
      groupName: "FAREN TYPE",
      expressions: [
        {
          name: "type",
          operator: "eql",
          value: "faren",
        },
      ],
      logic: true,
    },
  ],
  layout: {
    id: "GraphinForce",
    props: {
      type: "graphin-force",
      preset: {
        type: "concentric",
      },
    },
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
          "ClearCanvas",
          "AddSheetbar",
          "SnapshotGallery",
          "MapMode",
          "LargeGraph",
        ],
        direction: "horizontal",
        placement: "LT",
        offset: [10, 4],
      },
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
          isVertical: true,
        },
      },
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
          isVertical: true,
        },
      },
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
          isVertical: true,
        },
      },
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
          isVertical: true,
        },
      },
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
          isVertical: true,
        },
      },
    },
    {
      id: "PropertiesPanel",
      props: {
        serviceId: "Mock/PropertiesPanel",
        title: "属性面板",
        placement: "LB",
        width: "356px",
        height: "calc(100% - 80px)",
        offset: [10, 10],
        animate: false,
      },
    },
    {
      id: "ActivateRelations",
      props: {
        enableNodeHover: true,
        enableEdgeHover: true,
        enable: true,
        trigger: "click",
        upstreamDegree: 1,
        downstreamDegree: 1,
      },
    },
    {
      id: "CanvasSetting",
      props: {
        styleCanvas: {
          background: "#fff",
          backgroundImage:
            "https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*k9t4QamMuQ4AAAAAAAAAAAAAARQnAQ",
        },
        dragCanvas: {
          disabled: false,
          direction: "both",
          enableOptimize: false,
        },
        zoomCanvas: {
          disabled: false,
          enableOptimize: true,
        },
      },
    },
    {
      id: "NodeLegend",
      props: {
        sortKey: "type",
        textColor: "#ddd",
        placement: "LB",
        offset: [100, 20],
      },
    },
    {
      info: {
        id: "SideTabs",
        name: "侧边栏",
        desc: "画布侧边导航栏，可集成分析组件",
        icon: "icon-sidebar",
        cover: "http://xxxx.jpg",
        category: "container-components",
        type: "GICC",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-basic",
      id: "SideTabs",
      name: "侧边栏",
      category: "container-components",
      props: {
        GI_CONTAINER: ["GremlinQuery", "PathAnalysis", "FilterPanel"],
        outSideFromCanvas: true,
        tabPosition: "left",
        placement: "LB",
        offset: [0, 61],
        height: "calc(100vh - 120px)",
        width: "450px",
      },
      meta: {
        GI_CONTAINER: {
          title: "集成组件",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            mode: "multiple",
          },
          enum: [
            {
              label: "放大",
              value: "ZoomIn",
            },
            {
              label: "缩小",
              value: "ZoomOut",
            },
            {
              label: "自适应",
              value: "FitView",
            },
            {
              label: "视图居中",
              value: "FitCenter",
            },
            {
              label: "自由圈选",
              value: "LassoSelect",
            },
            {
              label: "清空画布",
              value: "ClearCanvas",
            },
            {
              label: "新增页签",
              value: "AddSheetbar",
            },
            {
              label: "快照画廊",
              value: "SnapshotGallery",
            },
            {
              label: "筛选面板",
              value: "FilterPanel",
            },
            {
              label: "路径分析",
              value: "PathAnalysis",
            },
            {
              label: "Gremlin 查询面板",
              value: "GremlinQuery",
            },
            {
              label: "保存分享",
              value: "Save",
            },
          ],
          default: [],
        },
        outSideFromCanvas: {
          title: "独立DOM",
          type: "boolean",
          "x-decorator": "FormItem",
          "x-component": "Switch",
          default: true,
        },
        tabPosition: {
          title: "导航布局",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          enum: [
            {
              label: "left",
              value: "left",
            },
            {
              label: "right",
              value: "right",
            },
            {
              label: "top",
              value: "top",
            },
            {
              label: "bottom",
              value: "bottom",
            },
          ],
          default: "left",
        },
        placement: {
          title: "放置方位",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                value: "LT",
                label: "左上 / top",
              },
              {
                value: "RT",
                label: "右上 / right",
              },
              {
                value: "LB",
                label: "左下 / left",
              },
              {
                value: "RB",
                label: "右下 / bottom",
              },
            ],
          },
          default: "LB",
        },
        offset: {
          title: "偏移距离",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Offset",
          default: [0, 61],
        },
        height: {
          title: "高度",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Input",
          "x-component-props": {},
          default: "calc(100vh - 120px)",
        },
        width: {
          title: "宽度",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Input",
          "x-component-props": {},
          default: "450px",
        },
      },
    },
    {
      info: {
        id: "ClearCanvas",
        name: "清空画布",
        desc: "清空画布上的所有内容",
        cover: "http://xxxx.jpg",
        category: "canvas-interaction",
        type: "GIAC",
        icon: "icon-clear",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-basic",
      id: "ClearCanvas",
      name: "清空画布",
      category: "canvas-interaction",
      props: {
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "清空画布",
          isShowIcon: true,
          icon: "icon-clear",
          isShowTooltip: true,
          tooltip: "清空画布上的所有内容",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true,
        },
      },
      meta: {
        GI_CONTAINER_INDEX: {
          title: "排序位置",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          "x-component-props": {
            min: 0,
            max: 15,
          },
          default: 2,
        },
        GIAC: {
          type: "void",
          "x-decorator": "FormItem",
          "x-component": "FormCollapse",
          "x-component-props": {
            ghost: true,
            className: "gi-site-collapse-item",
          },
          properties: {
            GIAC: {
              type: "object",
              "x-decorator": "FormItem",
              "x-component": "FormCollapse.CollapsePanel",
              "x-component-props": {
                header: "容器配置",
              },
              properties: {
                visible: {
                  title: "默认显示",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                disabled: {
                  title: "功能禁用",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                isShowTitle: {
                  title: "显示名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.title",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: false,
                },
                title: {
                  title: "填写名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "清空画布",
                },
                isShowIcon: {
                  title: "显示图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.icon",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                },
                icon: {
                  title: "选择图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "icon-clear",
                },
                isShowTooltip: {
                  title: "提示框",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.tooltip",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                tooltip: {
                  title: "提示内容",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "清空画布上的所有内容",
                },
                tooltipColor: {
                  title: "提示颜色",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "ColorInput",
                  default: "#3056e3",
                },
                tooltipPlacement: {
                  title: "提示方位",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "top",
                        label: "上方",
                      },
                      {
                        value: "left",
                        label: "左方",
                      },
                      {
                        value: "right",
                        label: "右方",
                      },
                      {
                        value: "bottom",
                        label: "下方",
                      },
                    ],
                    showInPanel: {
                      conditions: [[".isShowTooltip", "$eq", true]],
                    },
                  },
                  default: "right",
                },
                hasDivider: {
                  title: "分隔符",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                height: {
                  title: "单元高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "60px",
                },
                isVertical: {
                  title: "垂直排列",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-component-props": {
                    showInPanel: {
                      conditions: [
                        [".isShowIcon", "$eq", true],
                        [".isShowTitle", "$eq", true],
                      ],
                    },
                  },
                  default: true,
                },
              },
            },
          },
        },
      },
    },
    {
      info: {
        id: "Placeholder",
        name: "画布占位符",
        desc: "画布为空时出现的图片占位符",
        icon: "icon-placeholder",
        cover: "http://xxxx.jpg",
        category: "system-interaction",
        type: "AUTO",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-basic",
      id: "Placeholder",
      name: "画布占位符",
      category: "system-interaction",
      props: {
        img:
          "https://gw.alipayobjects.com/zos/bmw-prod/db278704-6158-432e-99d2-cc5db457585d.svg",
        text: "开始你的图分析应用～",
        width: 200,
      },
      meta: {
        img: {
          type: "string",
          "x-component": "Input",
          "x-decorator": "FormItem",
          title: "图片地址",
          default:
            "https://gw.alipayobjects.com/zos/bmw-prod/db278704-6158-432e-99d2-cc5db457585d.svg",
        },
        text: {
          type: "string",
          title: "文本",
          "x-component": "Input",
          "x-decorator": "FormItem",
          default: "开始你的图分析应用～",
        },
        width: {
          type: "number",
          title: "宽度",
          "x-component": "NumberPicker",
          "x-decorator": "FormItem",
          default: 200,
        },
      },
    },
    {
      info: {
        id: "AddSheetbar",
        name: "新增页签",
        desc: "新增页签",
        cover: "http://xxxx.jpg",
        category: "system-interaction",
        icon: "icon-plus",
        type: "GIAC",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-advance",
      id: "AddSheetbar",
      name: "新增页签",
      category: "system-interaction",
      props: {
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
          isVertical: true,
        },
      },
      meta: {
        GI_CONTAINER_INDEX: {
          title: "排序位置",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          "x-component-props": {
            min: 0,
            max: 15,
          },
          default: 2,
        },
        GIAC: {
          type: "void",
          "x-decorator": "FormItem",
          "x-component": "FormCollapse",
          "x-component-props": {
            ghost: true,
            className: "gi-site-collapse-item",
          },
          properties: {
            GIAC: {
              type: "object",
              "x-decorator": "FormItem",
              "x-component": "FormCollapse.CollapsePanel",
              "x-component-props": {
                header: "容器配置",
              },
              properties: {
                visible: {
                  title: "默认显示",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                disabled: {
                  title: "功能禁用",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                isShowTitle: {
                  title: "显示名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.title",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: false,
                },
                title: {
                  title: "填写名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "将选中的节点与边添加到新画布中",
                },
                isShowIcon: {
                  title: "显示图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.icon",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                },
                icon: {
                  title: "选择图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "icon-plus",
                },
                isShowTooltip: {
                  title: "提示框",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.tooltip",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                tooltip: {
                  title: "提示内容",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "",
                },
                tooltipColor: {
                  title: "提示颜色",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "ColorInput",
                  default: "#3056e3",
                },
                tooltipPlacement: {
                  title: "提示方位",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "top",
                        label: "上方",
                      },
                      {
                        value: "left",
                        label: "左方",
                      },
                      {
                        value: "right",
                        label: "右方",
                      },
                      {
                        value: "bottom",
                        label: "下方",
                      },
                    ],
                    showInPanel: {
                      conditions: [[".isShowTooltip", "$eq", true]],
                    },
                  },
                  default: "right",
                },
                hasDivider: {
                  title: "分隔符",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                height: {
                  title: "单元高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "60px",
                },
                isVertical: {
                  title: "垂直排列",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-component-props": {
                    showInPanel: {
                      conditions: [
                        [".isShowIcon", "$eq", true],
                        [".isShowTitle", "$eq", true],
                      ],
                    },
                  },
                  default: true,
                },
              },
            },
          },
        },
      },
    },
    {
      info: {
        id: "Sheetbar",
        name: "多画布页签",
        desc: "新建画布页签，辅助动态分析",
        cover: "http://xxxx.jpg",
        category: "system-interaction",
        type: "AUTO",
        icon: "icon-diff",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-advance",
      id: "Sheetbar",
      name: "多画布页签",
      category: "system-interaction",
      props: {
        placement: "top",
        height: 40,
      },
      meta: {
        placement: {
          title: "放置方位",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                value: "top",
                label: "顶部",
              },
              {
                value: "bottom",
                label: "底部",
              },
            ],
          },
          default: "bottom",
        },
        height: {
          title: "页签高度",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          default: 40,
        },
      },
    },
    {
      info: {
        id: "Loading",
        name: "加载动画",
        desc: "异步加载数据时，可展示加载动画",
        icon: "icon-loading",
        cover: "http://xxxx.jpg",
        category: "system-interaction",
        type: "AUTO",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-basic",
      id: "Loading",
      name: "加载动画",
      category: "system-interaction",
      props: {},
      meta: {},
    },
    {
      info: {
        id: "SnapshotGallery",
        name: "快照画廊",
        desc: "通过快照，将分析过程保存到画廊",
        icon: "icon-camera",
        cover: "http://xxx.jpg",
        category: "system-interaction",
        type: "GIAC",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-advance",
      id: "SnapshotGallery",
      name: "快照画廊",
      category: "system-interaction",
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
          isVertical: true,
        },
      },
      meta: {
        background: {
          title: "画廊背景",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "ColorInput",
          default: "#fff",
        },
        direction: {
          title: "展示方向",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                label: "水平展示",
                value: "horizontal",
              },
              {
                label: "纵向展示",
                value: "vertical",
              },
            ],
          },
          default: "horizontal",
        },
        placement: {
          title: "画廊位置",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                value: "LT",
                label: "左上",
              },
              {
                value: "RT",
                label: "右上",
              },
              {
                value: "LB",
                label: "左下",
              },
              {
                value: "RB",
                label: "右下",
              },
            ],
          },
          default: "LT",
        },
        offset: {
          title: "偏移距离",
          type: "array",
          "x-decorator": "FormItem",
          "x-component": "Offset",
          default: [20, 20],
        },
        GI_CONTAINER_INDEX: {
          title: "排序位置",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          "x-component-props": {
            min: 0,
            max: 15,
          },
          default: 2,
        },
        GIAC: {
          type: "void",
          "x-decorator": "FormItem",
          "x-component": "FormCollapse",
          "x-component-props": {
            ghost: true,
            className: "gi-site-collapse-item",
          },
          properties: {
            GIAC: {
              type: "object",
              "x-decorator": "FormItem",
              "x-component": "FormCollapse.CollapsePanel",
              "x-component-props": {
                header: "容器配置",
              },
              properties: {
                visible: {
                  title: "默认显示",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                disabled: {
                  title: "功能禁用",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                isShowTitle: {
                  title: "显示名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.title",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: false,
                },
                title: {
                  title: "填写名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "快照画廊",
                },
                isShowIcon: {
                  title: "显示图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.icon",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                },
                icon: {
                  title: "选择图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "icon-camera",
                },
                isShowTooltip: {
                  title: "提示框",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.tooltip",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                tooltip: {
                  title: "提示内容",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "快照画廊(快捷键ctrl+x)",
                },
                tooltipColor: {
                  title: "提示颜色",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "ColorInput",
                  default: "#3056e3",
                },
                tooltipPlacement: {
                  title: "提示方位",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "top",
                        label: "上方",
                      },
                      {
                        value: "left",
                        label: "左方",
                      },
                      {
                        value: "right",
                        label: "右方",
                      },
                      {
                        value: "bottom",
                        label: "下方",
                      },
                    ],
                    showInPanel: {
                      conditions: [[".isShowTooltip", "$eq", true]],
                    },
                  },
                  default: "right",
                },
                hasDivider: {
                  title: "分隔符",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                height: {
                  title: "单元高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "60px",
                },
                isVertical: {
                  title: "垂直排列",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-component-props": {
                    showInPanel: {
                      conditions: [
                        [".isShowIcon", "$eq", true],
                        [".isShowTitle", "$eq", true],
                      ],
                    },
                  },
                  default: true,
                },
              },
            },
          },
        },
      },
    },
    {
      info: {
        id: "Copyright",
        name: "版权",
        desc: "在画布上显示应用版权信息",
        cover: "http://xxx.jpg",
        category: "system-interaction",
        icon: "icon-copyright",
        type: "AUTO",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-basic",
      id: "Copyright",
      name: "版权",
      category: "system-interaction",
      props: {
        imageUrl: "",
        width: 100,
        height: 100,
        placement: "RB",
        offset: [100, 20],
      },
      meta: {
        imageUrl: {
          title: "版权图片",
          type: "string",
          "x-component": "Input",
          "x-decorator": "FormItem",
          default: "",
        },
        width: {
          title: "宽度",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          default: 100,
        },
        height: {
          title: "高度",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          default: 100,
        },
        placement: {
          title: "组件位置",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          enum: [
            {
              value: "LT",
              label: "左上",
            },
            {
              value: "RT",
              label: "右上",
            },
            {
              value: "LB",
              label: "左下",
            },
            {
              value: "RB",
              label: "右下",
            },
          ],
          default: "RB",
        },
        offset: {
          title: "偏移量",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Offset",
          "x-component-props": {
            min: 0,
            max: 400,
          },
          default: [100, 20],
        },
      },
    },
    {
      info: {
        id: "FilterPanel",
        name: "筛选面板",
        desc: "通过属性筛选画布信息，可自定义",
        icon: "icon-filter",
        cover: "http://xxxx.jpg",
        category: "data-analysis",
        type: "GIAC_CONTENT",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-basic",
      id: "FilterPanel",
      name: "筛选面板",
      category: "data-analysis",
      props: {
        histogramColor: "#3056E3",
        isFilterIsolatedNodes: true,
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
          contaienrMask: false,
        },
      },
      meta: {
        histogramColor: {
          title: "直方图颜色",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "ColorInput",
          default: "#3056E3",
        },
        isFilterIsolatedNodes: {
          title: "过滤孤立节点",
          type: "boolean",
          "x-decorator": "FormItem",
          "x-component": "Switch",
          default: true,
        },
        GI_CONTAINER_INDEX: {
          title: "排序位置",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          "x-component-props": {
            min: 0,
            max: 15,
          },
          default: 2,
        },
        GIAC_CONTENT: {
          type: "void",
          "x-decorator": "FormItem",
          "x-component": "FormCollapse",
          "x-component-props": {
            ghost: true,
            className: "gi-site-collapse-item",
          },
          properties: {
            GIAC_CONTENT: {
              type: "object",
              "x-decorator": "FormItem",
              "x-component": "FormCollapse.CollapsePanel",
              "x-component-props": {
                header: "容器配置",
              },
              properties: {
                visible: {
                  title: "默认显示",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                disabled: {
                  title: "功能禁用",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                isShowTitle: {
                  title: "显示名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.title",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                title: {
                  title: "填写名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "筛选面板",
                },
                isShowIcon: {
                  title: "显示图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.icon",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                },
                icon: {
                  title: "选择图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "icon-filter",
                },
                isShowTooltip: {
                  title: "提示框",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.tooltip",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                tooltip: {
                  title: "提示内容",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "通过属性筛选画布信息，可自定义",
                },
                tooltipColor: {
                  title: "提示颜色",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "ColorInput",
                  default: "#3056e3",
                },
                tooltipPlacement: {
                  title: "提示方位",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "top",
                        label: "上方",
                      },
                      {
                        value: "left",
                        label: "左方",
                      },
                      {
                        value: "right",
                        label: "右方",
                      },
                      {
                        value: "bottom",
                        label: "下方",
                      },
                    ],
                  },
                  default: "right",
                },
                hasDivider: {
                  title: "分隔符",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                height: {
                  title: "单元高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "60px",
                },
                isVertical: {
                  title: "垂直排列",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                },
                containerType: {
                  title: "容器类型",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Radio.Group",
                  enum: [
                    {
                      label: "普通DIV",
                      value: "div",
                    },
                    {
                      label: "抽屉",
                      value: "drawer",
                    },
                    {
                      label: "弹窗",
                      value: "modal",
                    },
                  ],
                  default: "div",
                },
                containerAnimate: {
                  title: "容器动画（仅DIV有效）",
                  type: "boolean",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                containerPlacement: {
                  title: "容器位置",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "LT",
                        label: "左上 / top",
                      },
                      {
                        value: "LB",
                        label: "左下 / left",
                      },
                      {
                        value: "RT",
                        label: "右上 / right",
                      },
                      {
                        value: "RB",
                        label: "右下 / bottom",
                      },
                    ],
                  },
                  default: "RT",
                },
                offset: {
                  title: "偏移距离",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Offset",
                  default: [0, 0],
                },
                containerWidth: {
                  title: "容器宽度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "400px",
                },
                containerHeight: {
                  title: "容器高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "calc(100% - 100px)",
                },
                contaienrMask: {
                  title: "容器遮罩",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-component-props": {},
                  default: false,
                },
              },
            },
          },
        },
      },
    },
    {
      info: {
        id: "PathAnalysis",
        name: "路径分析",
        desc: "选择起点和终点，即可分析路径",
        icon: "icon-path-analysis",
        cover: "http://xxxx.jpg",
        category: "data-analysis",
        type: "GIAC_CONTENT",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-basic",
      id: "PathAnalysis",
      name: "路径分析",
      category: "data-analysis",
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
          contaienrMask: false,
        },
      },
      meta: {
        pathNodeLabel: {
          title: "标签映射",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          enum: [],
          default: "id",
        },
        GI_CONTAINER_INDEX: {
          title: "排序位置",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          "x-component-props": {
            min: 0,
            max: 15,
          },
          default: 2,
        },
        GIAC_CONTENT: {
          type: "void",
          "x-decorator": "FormItem",
          "x-component": "FormCollapse",
          "x-component-props": {
            ghost: true,
            className: "gi-site-collapse-item",
          },
          properties: {
            GIAC_CONTENT: {
              type: "object",
              "x-decorator": "FormItem",
              "x-component": "FormCollapse.CollapsePanel",
              "x-component-props": {
                header: "容器配置",
              },
              properties: {
                visible: {
                  title: "默认显示",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                disabled: {
                  title: "功能禁用",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                isShowTitle: {
                  title: "显示名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.title",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                title: {
                  title: "填写名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "路径分析",
                },
                isShowIcon: {
                  title: "显示图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.icon",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                },
                icon: {
                  title: "选择图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "icon-path-analysis",
                },
                isShowTooltip: {
                  title: "提示框",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.tooltip",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                tooltip: {
                  title: "提示内容",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "",
                },
                tooltipColor: {
                  title: "提示颜色",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "ColorInput",
                  default: "#3056e3",
                },
                tooltipPlacement: {
                  title: "提示方位",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "top",
                        label: "上方",
                      },
                      {
                        value: "left",
                        label: "左方",
                      },
                      {
                        value: "right",
                        label: "右方",
                      },
                      {
                        value: "bottom",
                        label: "下方",
                      },
                    ],
                  },
                  default: "right",
                },
                hasDivider: {
                  title: "分隔符",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                height: {
                  title: "单元高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "60px",
                },
                isVertical: {
                  title: "垂直排列",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                },
                containerType: {
                  title: "容器类型",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Radio.Group",
                  enum: [
                    {
                      label: "普通DIV",
                      value: "div",
                    },
                    {
                      label: "抽屉",
                      value: "drawer",
                    },
                    {
                      label: "弹窗",
                      value: "modal",
                    },
                  ],
                  default: "div",
                },
                containerAnimate: {
                  title: "容器动画（仅DIV有效）",
                  type: "boolean",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                containerPlacement: {
                  title: "容器位置",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "LT",
                        label: "左上 / top",
                      },
                      {
                        value: "LB",
                        label: "左下 / left",
                      },
                      {
                        value: "RT",
                        label: "右上 / right",
                      },
                      {
                        value: "RB",
                        label: "右下 / bottom",
                      },
                    ],
                  },
                  default: "RT",
                },
                offset: {
                  title: "偏移距离",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Offset",
                  default: [0, 0],
                },
                containerWidth: {
                  title: "容器宽度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "400px",
                },
                containerHeight: {
                  title: "容器高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "calc(100% - 100px)",
                },
                contaienrMask: {
                  title: "容器遮罩",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-component-props": {},
                  default: false,
                },
              },
            },
          },
        },
      },
    },
    {
      info: {
        id: "GremlinQuery",
        name: "Gremlin 查询面板",
        desc: "通过 Gremlin 语句查询图数据",
        icon: "icon-query",
        category: "data-query",
        cover: "http://xxxx.jpg",
        type: "GIAC_CONTENT",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-advance",
      id: "GremlinQuery",
      name: "Gremlin 查询面板",
      category: "data-query",
      props: {
        serviceId: "Mock/GremlinQuery",
        initialValue: "g.V(1)",
        height: 200,
        GI_CONTAINER_INDEX: 2,
        GIAC_CONTENT: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "Gremlin 查询面板",
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
          contaienrMask: false,
        },
      },
      meta: {
        serviceId: {
          title: "数据服务",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                value: "GI_SERVICE_INTIAL_GRAPH",
                label: "GI_SERVICE_INTIAL_GRAPH",
              },
              {
                value: "GI_SERVICE_SCHEMA",
                label: "GI_SERVICE_SCHEMA",
              },
              {
                value: "Mock/PropertiesPanel",
                label: "Mock/PropertiesPanel",
              },
              {
                value: "Mock/GremlinQuery",
                label: "Mock/GremlinQuery",
              },
              {
                value: "GraphScope/GremlinQuery",
                label: "GraphScope/GremlinQuery",
              },
              {
                value: "Mock/NeighborsQuery",
                label: "Mock/NeighborsQuery",
              },
              {
                value: "GraphScope/NeighborsQuery",
                label: "GraphScope/NeighborsQuery",
              },
              {
                value: "MOCK/Save",
                label: "MOCK/Save",
              },
            ],
          },
          default: "Mock/GremlinQuery",
        },
        initialValue: {
          title: "初始查询",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Input.TextArea",
          default: "g.V(1)",
        },
        height: {
          title: "高度",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          default: 200,
        },
        GI_CONTAINER_INDEX: {
          title: "排序位置",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          "x-component-props": {
            min: 0,
            max: 15,
          },
          default: 2,
        },
        GIAC_CONTENT: {
          type: "void",
          "x-decorator": "FormItem",
          "x-component": "FormCollapse",
          "x-component-props": {
            ghost: true,
            className: "gi-site-collapse-item",
          },
          properties: {
            GIAC_CONTENT: {
              type: "object",
              "x-decorator": "FormItem",
              "x-component": "FormCollapse.CollapsePanel",
              "x-component-props": {
                header: "容器配置",
              },
              properties: {
                visible: {
                  title: "默认显示",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                disabled: {
                  title: "功能禁用",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                isShowTitle: {
                  title: "显示名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.title",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                title: {
                  title: "填写名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "Gremlin 查询面板",
                },
                isShowIcon: {
                  title: "显示图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.icon",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                },
                icon: {
                  title: "选择图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "icon-query",
                },
                isShowTooltip: {
                  title: "提示框",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.tooltip",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                tooltip: {
                  title: "提示内容",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "",
                },
                tooltipColor: {
                  title: "提示颜色",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "ColorInput",
                  default: "#3056e3",
                },
                tooltipPlacement: {
                  title: "提示方位",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "top",
                        label: "上方",
                      },
                      {
                        value: "left",
                        label: "左方",
                      },
                      {
                        value: "right",
                        label: "右方",
                      },
                      {
                        value: "bottom",
                        label: "下方",
                      },
                    ],
                  },
                  default: "right",
                },
                hasDivider: {
                  title: "分隔符",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                height: {
                  title: "单元高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "60px",
                },
                isVertical: {
                  title: "垂直排列",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                },
                containerType: {
                  title: "容器类型",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Radio.Group",
                  enum: [
                    {
                      label: "普通DIV",
                      value: "div",
                    },
                    {
                      label: "抽屉",
                      value: "drawer",
                    },
                    {
                      label: "弹窗",
                      value: "modal",
                    },
                  ],
                  default: "div",
                },
                containerAnimate: {
                  title: "容器动画（仅DIV有效）",
                  type: "boolean",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                containerPlacement: {
                  title: "容器位置",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "LT",
                        label: "左上 / top",
                      },
                      {
                        value: "LB",
                        label: "左下 / left",
                      },
                      {
                        value: "RT",
                        label: "右上 / right",
                      },
                      {
                        value: "RB",
                        label: "右下 / bottom",
                      },
                    ],
                  },
                  default: "RT",
                },
                offset: {
                  title: "偏移距离",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Offset",
                  default: [0, 0],
                },
                containerWidth: {
                  title: "容器宽度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "350px",
                },
                containerHeight: {
                  title: "容器高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "calc(100% - 100px)",
                },
                contaienrMask: {
                  title: "容器遮罩",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-component-props": {},
                  default: false,
                },
              },
            },
          },
        },
      },
    },
    {
      info: {
        id: "NeighborsQuery",
        category: "data-query",
        type: "GIAC_MENU",
        name: "邻居查询",
        desc: "集成在右键菜单中，可查询邻居节点",
        icon: "icon-kinship",
        cover: "http://xxxx.jpg",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-basic",
      id: "NeighborsQuery",
      name: "邻居查询",
      category: "data-query",
      props: {
        serviceId: "Mock/NeighborsQuery",
        degree: "1",
      },
      meta: {
        serviceId: {
          title: "数据服务",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          default: "Mock/NeighborsQuery",
          "x-component-props": {
            options: [
              {
                value: "GI_SERVICE_INTIAL_GRAPH",
                label: "GI_SERVICE_INTIAL_GRAPH",
              },
              {
                value: "GI_SERVICE_SCHEMA",
                label: "GI_SERVICE_SCHEMA",
              },
              {
                value: "Mock/PropertiesPanel",
                label: "Mock/PropertiesPanel",
              },
              {
                value: "Mock/GremlinQuery",
                label: "Mock/GremlinQuery",
              },
              {
                value: "GraphScope/GremlinQuery",
                label: "GraphScope/GremlinQuery",
              },
              {
                value: "Mock/NeighborsQuery",
                label: "Mock/NeighborsQuery",
              },
              {
                value: "GraphScope/NeighborsQuery",
                label: "GraphScope/NeighborsQuery",
              },
              {
                value: "MOCK/Save",
                label: "MOCK/Save",
              },
            ],
          },
        },
        degree: {
          title: "查询度数",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                value: "1",
                label: "一度查询",
              },
              {
                value: "2",
                label: "二度查询",
              },
              {
                value: "3",
                label: "三度查询",
              },
            ],
          },
          default: "1",
        },
      },
    },
    {
      info: {
        id: "Save",
        name: "保存分享",
        desc: "保存画布,并分享给其他人",
        icon: "icon-save",
        cover: "http://xxxx.jpg",
        category: "workbook",
        type: "GIAC",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-basic",
      id: "Save",
      name: "保存分享",
      category: "workbook",
      props: {
        serviceId: "MOCK/Save",
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
          contaienrMask: false,
        },
      },
      meta: {
        serviceId: {
          title: "保存服务",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                value: "GI_SERVICE_INTIAL_GRAPH",
                label: "GI_SERVICE_INTIAL_GRAPH",
              },
              {
                value: "GI_SERVICE_SCHEMA",
                label: "GI_SERVICE_SCHEMA",
              },
              {
                value: "Mock/PropertiesPanel",
                label: "Mock/PropertiesPanel",
              },
              {
                value: "Mock/GremlinQuery",
                label: "Mock/GremlinQuery",
              },
              {
                value: "GraphScope/GremlinQuery",
                label: "GraphScope/GremlinQuery",
              },
              {
                value: "Mock/NeighborsQuery",
                label: "Mock/NeighborsQuery",
              },
              {
                value: "GraphScope/NeighborsQuery",
                label: "GraphScope/NeighborsQuery",
              },
              {
                value: "MOCK/Save",
                label: "MOCK/Save",
              },
            ],
          },
          default: "MOCK/Save",
        },
        GI_CONTAINER_INDEX: {
          title: "排序位置",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          "x-component-props": {
            min: 0,
            max: 15,
          },
          default: 2,
        },
        GIAC_CONTENT: {
          type: "void",
          "x-decorator": "FormItem",
          "x-component": "FormCollapse",
          "x-component-props": {
            ghost: true,
            className: "gi-site-collapse-item",
          },
          properties: {
            GIAC_CONTENT: {
              type: "object",
              "x-decorator": "FormItem",
              "x-component": "FormCollapse.CollapsePanel",
              "x-component-props": {
                header: "容器配置",
              },
              properties: {
                visible: {
                  title: "默认显示",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                disabled: {
                  title: "功能禁用",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                isShowTitle: {
                  title: "显示名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.title",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: false,
                },
                title: {
                  title: "填写名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "保存分享",
                },
                isShowIcon: {
                  title: "显示图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.icon",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                },
                icon: {
                  title: "选择图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "icon-save",
                },
                isShowTooltip: {
                  title: "提示框",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.tooltip",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                tooltip: {
                  title: "提示内容",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "保存画布,并分享给其他人",
                },
                tooltipColor: {
                  title: "提示颜色",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "ColorInput",
                  default: "#3056e3",
                },
                tooltipPlacement: {
                  title: "提示方位",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "top",
                        label: "上方",
                      },
                      {
                        value: "left",
                        label: "左方",
                      },
                      {
                        value: "right",
                        label: "右方",
                      },
                      {
                        value: "bottom",
                        label: "下方",
                      },
                    ],
                  },
                  default: "right",
                },
                hasDivider: {
                  title: "分隔符",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                height: {
                  title: "单元高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "60px",
                },
                isVertical: {
                  title: "垂直排列",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                },
                containerType: {
                  title: "容器类型",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Radio.Group",
                  enum: [
                    {
                      label: "普通DIV",
                      value: "div",
                    },
                    {
                      label: "抽屉",
                      value: "drawer",
                    },
                    {
                      label: "弹窗",
                      value: "modal",
                    },
                  ],
                  default: "div",
                },
                containerAnimate: {
                  title: "容器动画（仅DIV有效）",
                  type: "boolean",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                containerPlacement: {
                  title: "容器位置",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "LT",
                        label: "左上 / top",
                      },
                      {
                        value: "LB",
                        label: "左下 / left",
                      },
                      {
                        value: "RT",
                        label: "右上 / right",
                      },
                      {
                        value: "RB",
                        label: "右下 / bottom",
                      },
                    ],
                  },
                  default: "RT",
                },
                offset: {
                  title: "偏移距离",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Offset",
                  default: [0, 0],
                },
                containerWidth: {
                  title: "容器宽度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "350px",
                },
                containerHeight: {
                  title: "容器高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "calc(100% - 100px)",
                },
                contaienrMask: {
                  title: "容器遮罩",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-component-props": {},
                  default: false,
                },
              },
            },
          },
        },
      },
    },
    {
      info: {
        id: "ContextMenu",
        name: "右键菜单",
        desc: "鼠标右键即可出现菜单容器",
        cover: "http://xxxx.jpg",
        category: "container-components",
        type: "GICC_MENU",
        icon: "icon-mouse",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-basic",
      id: "ContextMenu",
      name: "右键菜单",
      category: "container-components",
      props: {
        GI_CONTAINER: ["NeighborsQuery"],
      },
      meta: {
        GI_CONTAINER: {
          title: "集成组件",
          type: "string",
          enum: [
            {
              label: "放大",
              value: "ZoomIn",
            },
            {
              label: "缩小",
              value: "ZoomOut",
            },
            {
              label: "自适应",
              value: "FitView",
            },
            {
              label: "视图居中",
              value: "FitCenter",
            },
            {
              label: "自由圈选",
              value: "LassoSelect",
            },
            {
              label: "清空画布",
              value: "ClearCanvas",
            },
            {
              label: "新增页签",
              value: "AddSheetbar",
            },
            {
              label: "快照画廊",
              value: "SnapshotGallery",
            },
            {
              label: "筛选面板",
              value: "FilterPanel",
            },
            {
              label: "路径分析",
              value: "PathAnalysis",
            },
            {
              label: "Gremlin 查询面板",
              value: "GremlinQuery",
            },
            {
              label: "邻居查询",
              value: "NeighborsQuery",
            },
            {
              label: "保存分享",
              value: "Save",
            },
            {
              label: "地图模式",
              value: "MapMode",
            },
            {
              label: "3D大图",
              value: "LargeGraph",
            },
          ],
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            mode: "multiple",
          },
          default: [],
        },
      },
    },
    {
      info: {
        id: "MapMode",
        name: "地图模式",
        desc: "将节点的地理坐标映射到地图上",
        icon: "icon-global",
        cover: "http://xxxx.jpg",
        category: "scene-analysis",
        type: "GIAC",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-scene",
      id: "MapMode",
      name: "地图模式",
      category: "scene-analysis",
      props: {
        visible: false,
        type: "mapbox",
        theme: "light",
        minSize: "20%",
        maxSize: "100%",
        placement: "RB",
        offset: [0, 0],
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "地图模式",
          isShowIcon: true,
          icon: "icon-global",
          isShowTooltip: true,
          tooltip: "",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true,
        },
      },
      meta: {
        visible: {
          title: "默认显示",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Switch",
          default: false,
        },
        type: {
          type: "string",
          title: "地图类型",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                label: "高德",
                value: "amap",
              },
              {
                label: "MapBox",
                value: "mapbox",
              },
            ],
          },
          default: "mapbox",
        },
        theme: {
          type: "string",
          title: "主题",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                label: "明亮",
                value: "light",
              },
              {
                label: "黑暗",
                value: "dark",
              },
            ],
          },
          default: "light",
        },
        minSize: {
          type: "string",
          title: "最小尺寸",
          "x-decorator": "FormItem",
          "x-component": "Input",
          default: "20%",
        },
        maxSize: {
          type: "string",
          title: "最大尺寸",
          "x-decorator": "FormItem",
          "x-component": "Input",
          default: "100%",
        },
        placement: {
          title: "放置方位",
          type: "string",
          default: "RB",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                value: "LT",
                label: "左上 / top",
              },
              {
                value: "RT",
                label: "右上 / right",
              },
              {
                value: "LB",
                label: "左下 / left",
              },
              {
                value: "RB",
                label: "右下 / bottom",
              },
            ],
          },
        },
        offset: {
          title: "偏移距离",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Offset",
          "x-component-props": {
            min: 0,
            max: 400,
          },
          default: [0, 0],
        },
        GI_CONTAINER_INDEX: {
          title: "排序位置",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          "x-component-props": {
            min: 0,
            max: 15,
          },
          default: 2,
        },
        GIAC: {
          type: "void",
          "x-decorator": "FormItem",
          "x-component": "FormCollapse",
          "x-component-props": {
            ghost: true,
            className: "gi-site-collapse-item",
          },
          properties: {
            GIAC: {
              type: "object",
              "x-decorator": "FormItem",
              "x-component": "FormCollapse.CollapsePanel",
              "x-component-props": {
                header: "容器配置",
              },
              properties: {
                visible: {
                  title: "默认显示",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                disabled: {
                  title: "功能禁用",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                isShowTitle: {
                  title: "显示名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.title",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: false,
                },
                title: {
                  title: "填写名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "地图模式",
                },
                isShowIcon: {
                  title: "显示图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.icon",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                },
                icon: {
                  title: "选择图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "icon-global",
                },
                isShowTooltip: {
                  title: "提示框",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.tooltip",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                tooltip: {
                  title: "提示内容",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "",
                },
                tooltipColor: {
                  title: "提示颜色",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "ColorInput",
                  default: "#3056e3",
                },
                tooltipPlacement: {
                  title: "提示方位",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "top",
                        label: "上方",
                      },
                      {
                        value: "left",
                        label: "左方",
                      },
                      {
                        value: "right",
                        label: "右方",
                      },
                      {
                        value: "bottom",
                        label: "下方",
                      },
                    ],
                    showInPanel: {
                      conditions: [[".isShowTooltip", "$eq", true]],
                    },
                  },
                  default: "right",
                },
                hasDivider: {
                  title: "分隔符",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                height: {
                  title: "单元高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "60px",
                },
                isVertical: {
                  title: "垂直排列",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-component-props": {
                    showInPanel: {
                      conditions: [
                        [".isShowIcon", "$eq", true],
                        [".isShowTitle", "$eq", true],
                      ],
                    },
                  },
                  default: true,
                },
              },
            },
          },
        },
      },
    },
    {
      info: {
        id: "LargeGraph",
        name: "3D大图",
        category: "scene-analysis",
        desc: "启用3D视图，可右键节点交互",
        icon: "icon-3d",
        cover: "http://xxxx.jpg",
        type: "GIAC",
      },
      version: "2.2.0",
      pkg: "@alipay/gi-assets-scene",
      id: "LargeGraph",
      name: "3D大图",
      category: "scene-analysis",
      props: {
        visible: false,
        minSize: "20%",
        maxSize: "100%",
        placement: "RB",
        offset: [0, 0],
        GI_CONTAINER_INDEX: 2,
        GIAC: {
          visible: false,
          disabled: false,
          isShowTitle: false,
          title: "3D大图",
          isShowIcon: true,
          icon: "icon-3d",
          isShowTooltip: true,
          tooltip: "",
          tooltipColor: "#3056e3",
          tooltipPlacement: "right",
          hasDivider: false,
          height: "60px",
          isVertical: true,
        },
      },
      meta: {
        visible: {
          title: "默认显示",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Switch",
          default: false,
        },
        minSize: {
          type: "string",
          title: "最小尺寸",
          "x-decorator": "FormItem",
          "x-component": "Input",
          default: "20%",
        },
        maxSize: {
          type: "string",
          title: "最大尺寸",
          "x-decorator": "FormItem",
          "x-component": "Input",
          default: "100%",
        },
        placement: {
          title: "放置方位",
          type: "string",
          default: "RB",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                value: "LT",
                label: "左上 / top",
              },
              {
                value: "RT",
                label: "右上 / right",
              },
              {
                value: "LB",
                label: "左下 / left",
              },
              {
                value: "RB",
                label: "右下 / bottom",
              },
            ],
          },
        },
        offset: {
          title: "偏移距离",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Offset",
          "x-component-props": {
            min: 0,
            max: 400,
          },
          default: [0, 0],
        },
        GI_CONTAINER_INDEX: {
          title: "排序位置",
          type: "number",
          "x-decorator": "FormItem",
          "x-component": "NumberPicker",
          "x-component-props": {
            min: 0,
            max: 15,
          },
          default: 2,
        },
        GIAC: {
          type: "void",
          "x-decorator": "FormItem",
          "x-component": "FormCollapse",
          "x-component-props": {
            ghost: true,
            className: "gi-site-collapse-item",
          },
          properties: {
            GIAC: {
              type: "object",
              "x-decorator": "FormItem",
              "x-component": "FormCollapse.CollapsePanel",
              "x-component-props": {
                header: "容器配置",
              },
              properties: {
                visible: {
                  title: "默认显示",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                disabled: {
                  title: "功能禁用",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                isShowTitle: {
                  title: "显示名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.title",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: false,
                },
                title: {
                  title: "填写名称",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "3D大图",
                },
                isShowIcon: {
                  title: "显示图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: true,
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.icon",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                },
                icon: {
                  title: "选择图标",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "icon-3d",
                },
                isShowTooltip: {
                  title: "提示框",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-reactions": [
                    {
                      target: "GIAC_CONTENT.tooltip",
                      fulfill: {
                        state: {
                          visible: "{{$self.value}}",
                        },
                      },
                    },
                  ],
                  default: true,
                },
                tooltip: {
                  title: "提示内容",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "",
                },
                tooltipColor: {
                  title: "提示颜色",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "ColorInput",
                  default: "#3056e3",
                },
                tooltipPlacement: {
                  title: "提示方位",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Select",
                  "x-component-props": {
                    options: [
                      {
                        value: "top",
                        label: "上方",
                      },
                      {
                        value: "left",
                        label: "左方",
                      },
                      {
                        value: "right",
                        label: "右方",
                      },
                      {
                        value: "bottom",
                        label: "下方",
                      },
                    ],
                    showInPanel: {
                      conditions: [[".isShowTooltip", "$eq", true]],
                    },
                  },
                  default: "right",
                },
                hasDivider: {
                  title: "分隔符",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  default: false,
                },
                height: {
                  title: "单元高度",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Input",
                  default: "60px",
                },
                isVertical: {
                  title: "垂直排列",
                  type: "string",
                  "x-decorator": "FormItem",
                  "x-component": "Switch",
                  "x-component-props": {
                    showInPanel: {
                      conditions: [
                        [".isShowIcon", "$eq", true],
                        [".isShowTitle", "$eq", true],
                      ],
                    },
                  },
                  default: true,
                },
              },
            },
          },
        },
      },
    },
  ],
};
export const GI_LOCAL_DATA = {
  nodes: [
    {
      id: "6217****1",
      nodeType: "card",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "6217****1",
        type: "card",
        tag: "警方备案，涉黑卡号",
      },
    },
    {
      id: "2088xxx1",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "2088xxx1",
        type: "alipay",
      },
    },
    {
      id: "2088xxx2",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "2088xxx2",
        type: "alipay",
      },
    },
    {
      id: "2088xxx0",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "2088xxx0",
        type: "alipay",
        onwer: "王xx",
        is1688: true,
      },
    },
    {
      id: "Haag",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "Haag",
        type: "alipay",
        alipayNo: "66668-8265",
      },
    },
    {
      id: "Gutkowski",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "Gutkowski",
        type: "alipay",
        alipayNo: "66660-7345",
      },
    },
    {
      id: "Rice",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "Rice",
        type: "alipay",
        alipayNo: "66663-4268",
      },
    },
    {
      id: "Powlowski",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "Powlowski",
        type: "alipay",
        alipayNo: "66664-3142",
      },
    },
    {
      id: "Keebler",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "Keebler",
        type: "alipay",
        alipayNo: "66665-8064",
      },
    },
    {
      id: "Luettgen",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "Luettgen",
        type: "alipay",
        alipayNo: "66665-6317",
      },
    },
    {
      id: "李xx",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "李xx",
        type: "alipay",
        alipayNo: "2088xxxxx1",
        tag: "体系内涉黑:2021-09-02,LINK:https://www.xxxx.com",
      },
    },
    {
      id: "张xx",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "张xx",
        type: "alipay",
        alipayNo: "2088xxxxx2",
      },
    },
    {
      id: "营业执照xxxx",
      nodeType: "YYZZ",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "营业执照xxxx",
        type: "YYZZ",
      },
    },
    {
      id: "xxxx某",
      nodeType: "alipay",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "xxxx某",
        type: "alipay",
        alipayNo: "2088xxxxxxx1",
        longitude: 102.2011,
        latitude: 25.3197,
      },
    },
    {
      id: "娱乐xx春花秋月公司",
      nodeType: "company",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "娱乐xx春花秋月公司",
        type: "company",
        longitude: 102.0189,
        latitude: 25.1785,
      },
    },
    {
      id: "娱乐xx天上人间公司",
      nodeType: "company",
      nodeTypeKeyFromProperties: "type",
      data: {
        id: "娱乐xx天上人间公司",
        type: "company",
        longitude: 102.2956,
        latitude: 25.3455,
      },
    },
  ],
  edges: [
    {
      source: "6217****1",
      target: "2088xxx1",
      edgeType: "transfer",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "6217****1",
        target: "2088xxx1",
        amount: 50000,
        type: "transfer",
      },
    },
    {
      source: "2088xxx1",
      target: "2088xxx2",
      edgeType: "transfer",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "2088xxx1",
        target: "2088xxx2",
        amount: 10000,
        type: "transfer",
      },
    },
    {
      source: "2088xxx2",
      target: "2088xxx0",
      edgeType: "transfer",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "2088xxx2",
        target: "2088xxx0",
        amount: 10000,
        type: "transfer",
      },
    },
    {
      source: "Haag",
      target: "2088xxx0",
      edgeType: "transfer",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "Haag",
        target: "2088xxx0",
        amount: 100,
        type: "transfer",
      },
    },
    {
      source: "Gutkowski",
      target: "2088xxx0",
      edgeType: "transfer",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "Gutkowski",
        target: "2088xxx0",
        amount: 100,
        type: "transfer",
      },
    },
    {
      source: "Rice",
      target: "2088xxx0",
      edgeType: "transfer",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "Rice",
        target: "2088xxx0",
        amount: 100,
        type: "transfer",
      },
    },
    {
      source: "Powlowski",
      target: "2088xxx0",
      edgeType: "transfer",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "Powlowski",
        target: "2088xxx0",
        amount: 100,
        type: "transfer",
      },
    },
    {
      source: "Keebler",
      target: "2088xxx0",
      edgeType: "transfer",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "Keebler",
        target: "2088xxx0",
        amount: 100,
        type: "transfer",
      },
    },
    {
      source: "Luettgen",
      target: "2088xxx0",
      edgeType: "transfer",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "Luettgen",
        target: "2088xxx0",
        amount: 100,
        type: "transfer",
      },
    },
    {
      source: "李xx",
      target: "张xx",
      edgeType: "transfer",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "李xx",
        target: "张xx",
        amount: 50000,
        type: "transfer",
      },
    },
    {
      source: "张xx",
      target: "2088xxx0",
      edgeType: "transfer",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "张xx",
        target: "2088xxx0",
        amount: 100,
        type: "transfer",
      },
    },
    {
      source: "2088xxx0",
      target: "营业执照xxxx",
      edgeType: "owner",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "2088xxx0",
        target: "营业执照xxxx",
        type: "owner",
      },
    },
    {
      source: "营业执照xxxx",
      target: "xxxx某",
      edgeType: "faren",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "营业执照xxxx",
        target: "xxxx某",
        type: "faren",
      },
    },
    {
      source: "xxxx某",
      target: "娱乐xx春花秋月公司",
      edgeType: "owner",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "xxxx某",
        target: "娱乐xx春花秋月公司",
        type: "owner",
      },
    },
    {
      source: "xxxx某",
      target: "娱乐xx天上人间公司",
      edgeType: "owner",
      edgeTypeKeyFromProperties: "type",
      data: {
        source: "xxxx某",
        target: "娱乐xx天上人间公司",
        type: "owner",
      },
    },
  ],
};
/**  由GI平台自动生成的，请勿修改 end **/
