export interface TableData {
  [index: number]: { [propName: string]: any };
  length: number;
}
export interface CodeData {
  [propName: string]: any;
}
export interface tabData {
  id: string;
  cypher: string;
  cypherForTab: string;
  graphName: string;
  btns: {
    [propName: string]: {
      active: boolean;
    };
  };
  cypherReasultData: CypherReasultData | null;
}
export interface labelData {
  name: string;
  num: number;
  activeProp: string;
  activePropSource: string;
  type: string;

  props: any[];
  sysProps: any[];
  borderColor?: string;
}
export interface GraphData {
  activeLabel: string; // 当前选中的label
  activeLabelType: string;
  addEdgeSrcAndDst: any[];
  visualMethod: {
    aStar?: { selectNode: 'start' | 'end' | ''; srcAndDst: { start: any; end: any } };
    allPath?: {};
  };
  methodResult: any;
  actionLog: {
    actionName: string;
    options?: {
      [propName: string]: any;
    };
  };
  filterList: any[]; // 用来存储过滤条件
  labels: Array<labelData>;
  activeElement: Array<any>;
  graph: { nodes: Array<{ [propName: string]: any }>; edges: Array<{ [propName: string]: any }> };
}

export interface CypherReasultData {
  showType: string; // code,table,graph展示类型
  tableData: TableData;
  codeData: CodeData;
  graphData?: GraphData;
  tabValue?: string;
}
export function createTableData(params: any): TableData {
  let tableData: Array<{ [propName: string]: any }> = [];
  let header = params.data.header;
  let body = params.data.result;
  console.log('body', body);
  body.forEach((item: any) => {
    let obj: {
      [propName: string]: any;
    } = {};
    item.forEach((cell: any, i: number) => {
      let key: string = header[i].name;
      key = key.replace(/\./g, '·');
      if (cell === true) {
        cell = 'true';
      } else if (cell === false) {
        cell = 'false';
      }
      obj[key] = cell;
    });
    tableData.push(obj);
  });
  return tableData;
}
export function createCodeData(params: any): CodeData {
  return params;
}
export function createLabel(data: any[], type: string, currenLabels: Array<any> = []): Array<any> {
  let label: Array<any> = [...currenLabels];
  data.forEach((item: any, _index: number) => {
    let properties = item.properties || {};
    let acticeProp = Reflect.has(properties, 'name') ? 'name' : 'label';
    const obj: labelData = {
      type: type === 'node' ? 'node' : 'edge',
      name: item.label,
      num: data.filter((node: any) => {
        return node.label === item.label;
      }).length,
      props: Object.keys(properties),
      activeProp: acticeProp,
      activePropSource: acticeProp === 'name' ? 'props' : 'sysProps',

      sysProps: type === 'node' ? ['vid', 'label'] : ['uid', 'label'],
    };

    let exist = label.find(o => {
      return o.name === item.label;
    });

    if (!exist) {
      label.push(obj);
    }
  });
  return label;
}
export function craeteGraphData(
  params: any,
  actionName: string,
  actionOption?: any,
  currenNodeLabels: Array<any> = [],
  currenEdgeLabels: Array<any> = [],
): GraphData {
  let nodes = params.data.nodes;
  let edges = params.data.relationships;
  let activeLabel = '';
  let nodeLabel = createLabel(nodes, 'node', currenNodeLabels);
  let edgeLabel = createLabel(edges, 'edges', currenEdgeLabels);
  let labels = [
    { name: '*NODES', type: 'node', color: '#98acc3', num: nodes.length },
    { name: '*EDGES', type: 'edge', color: '#98acc3', num: edges.length },
    ...nodeLabel,
    ...edgeLabel,
  ];

  return {
    activeLabel: activeLabel,
    activeLabelType: '',
    labels: labels,
    addEdgeSrcAndDst: [],
    filterList: [],
    methodResult: {},
    visualMethod: {
      aStar: {
        selectNode: '',
        srcAndDst: {
          start: {},
          end: {},
        },
      },
    },
    actionLog: {
      actionName: actionName,
      options: actionOption,
    },
    graph: {
      nodes: nodes,
      edges: edges,
    },
    activeElement: [],
  };
}
export function getNodeIds(params: any): Array<number> {
  let vidIndex: Array<number> = [];
  let nodeIds: Array<number> = [];
  let headers = params.data.header;
  let result = params.data.result;
  headers.forEach((item: any, index: number) => {
    if (item.type === 1) {
      vidIndex.push(index);
    }
  });
  result.forEach((item: any) => {
    vidIndex.forEach(c => {
      if (item && item[c]) {
        // let vid = item[c].replace(/(V\[)([0-9]*)(])/g, ($1: string, $2: string, $3: string) => {
        //     return $3
        // })
        let vid = JSON.parse(item[c]).identity;
        if (typeof vid === 'number') {
          nodeIds.push(vid);
        }
      }
    });
  });
  // 可以不用去重
  // nodeIds = [...new Set(nodeIds)]
  return nodeIds;
}

export function getNodeIdsByEids(params: any): { nodeIds: Array<number>; edgeIds: Array<string> } {
  let nodeIds: Array<number> = [];
  let edgeIds: Array<string> = [];
  let result = params.data.result;
  let headers = params.data.header;
  let edgeIndexList: Array<number> = [];
  let pathIndexList: Array<number> = [];
  headers.forEach((item: any, index: number) => {
    if (item.type === 4) {
      pathIndexList.push(index);
    } else if (item.type === 2) {
      edgeIndexList.push(index);
    }
  });
  result.forEach(item => {
    pathIndexList.forEach(c => {
      if (item && item[c]) {
        let data = JSON.parse(item[c]);
        data.forEach((el: any, index: number) => {
          if (index % 2 === 1) {
            let eid = `${el.src}_${el.dst}_${el.label_id}_${el.temporal_id}_${el.identity}`;
            edgeIds.push(eid);
            nodeIds.push(parseInt(el.src), parseInt(el.dst));
          }
        });
      }
    });
    edgeIndexList.forEach(c => {
      if (item && item[c]) {
        let data = JSON.parse(item[c]);
        let eid = `${data.src}_${data.dst}_${data.label_id}_${data.temporal_id}_${data.identity}`;
        edgeIds.push(eid);
        nodeIds.push(parseInt(data.src), parseInt(data.dst));
      }
    });
  });

  return {
    nodeIds: [...new Set(nodeIds)],
    edgeIds: [...new Set(edgeIds)],
  };
}

// export async function querySubGraph(graph: string, nodeIds: Array<number>) {
//   let res = await getSubGraph({ graph: graph, nodeIds: nodeIds });
//   if (res.status === 200) {
//     let graphData = JSON.parse(res.data.result[0]);
//     graphData.nodes.forEach(item => {
//       item.vid = item.identity;
//     });

//     graphData.relationships.forEach(item => {
//       item.source = item.src;
//       item.destination = item.dst;
//       item.uid = `${item.src}_${item.dst}_${item.label_id}_${item.temporal_id}_${item.identity}`;
//     });
//     return {
//       status: res.status,
//       data: graphData,
//     };
//   } else {
//     return {
//       status: res.status,
//       data: res.data,
//     };
//   }
// }
