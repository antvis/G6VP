// TODO 目前AVA 2.0不稳定，先引用 AVA 1.0 的dw包，等2.0稳定后替换掉
import { type as calcFiedInfo } from '@antv/dw-analyzer';
import * as AlgorithmSync from '@antv/algorithm';
import { IExtendFieldInfo, IGraphData, INodeData, IEdgeData, INodeStructFeat, IEdgeStructFeat, IGraphFeat, IGraphProps } from '../types'
const GraphAlgorithms = {
  ...AlgorithmSync,
}


// 提取数据特征
function getNodeFields(nodes: INodeData[]) {
  const [node0] = nodes
  const nodeFieldNames = node0 ? Object.keys(node0.data) : [] // TODO 后面融合 node.data 和 node attr 融合
  const nodeFields = genColDataFromArr(nodes, nodeFieldNames)
  return { nodeFields, nodeFieldNames}
}
function getEdgeFields(edges: IEdgeData[]) {
  const [edge0] = edges
  const edgeFieldNames = edge0 ? Object.keys(edge0) : []
  const edgeFields = genColDataFromArr(edges, edgeFieldNames)
  return { edgeFields, edgeFieldNames }
}
function genColDataFromArr(arr: any[], columnNames: string[]) {
  const fields = []
  for (let i = 0; i < arr.length; i += 1) {
    const datum = arr[i].data || arr[i]; // TODO 后面融合 node.data 和 node attr 融合
    for (let j = 0; j < columnNames.length; j += 1) {
      const column = columnNames[j];
      if (fields[j]) {
        fields[j].push(datum[column]);
      } else {
        fields[j] = [datum[column]];
      }
    }
  }
  return fields
}

// 获取字段特征
export function getFieldInfo(dataField: any[], fieldName: string):IExtendFieldInfo {
  const fieldInfo = calcFiedInfo(dataField)
  return {
    ...fieldInfo,
    fieldName
  }
}
// 获取多个字段的特征
export function getAllFieldsInfo(dataFields: any[], fieldNames: string[]):IExtendFieldInfo[] {
  const fields:IExtendFieldInfo[] = []
  for(let i = 0; i < dataFields.length; i++) {
    const dataField = dataFields[i]
    fields.push(getFieldInfo(dataField, fieldNames[i]))
  }
  return fields
}

// 结构特征 
// TODO 结构相关特征当数据量大时，不适合前端计算，可以调用服务端服务计算后传入，应留出接口允许从其他部分传入
export function getAllStructFeats(nodes: INodeData[], edges: IEdgeData[]) {
  const nodeStructFeats:Partial<INodeStructFeat>[] = [];
  const edgeStructFeats:Partial<IEdgeStructFeat>[] = [];

  const isDirected: boolean = true;  // TODO 如何判断？1. 外部传入 2. 如果没有外部传入，则判断是否有相反的边
  const degrees = GraphAlgorithms.getDegree({nodes, edges})
  const pageRanks = GraphAlgorithms.pageRank({nodes, edges})
  const cycles = GraphAlgorithms.detectAllCycles({nodes, edges}, false)
  const directedCycles = GraphAlgorithms.detectAllDirectedCycle({nodes, edges})
  const components = GraphAlgorithms.connectedComponent({nodes, edges}, false)
  const strongConnectedComponents = GraphAlgorithms.connectedComponent({nodes, edges}, true)
  const cycleCountMap:{[key: string]: number} = {}
  cycles.forEach(cycle => {
    for(let nodeId of Object.keys(cycle)) {
      if(cycleCountMap[nodeId]){
        cycleCountMap[nodeId] += 1
      } else {
        cycleCountMap[nodeId] = 1
      }
    }
  })
  const numberOfNodeInCycle = Object.values(cycleCountMap).filter(count => count).length
  const cycleParticipate = numberOfNodeInCycle / nodes.length

  for(let node of nodes) {
    const nodeFeat = {
      degree: degrees[node.id].degree,
      inDegree: degrees[node.id].inDegree,
      outDegree: degrees[node.id].outDegree,
      pageRank: pageRanks[node.id],
      cycleCount: cycleCountMap[node.id] || 0
    }
    node.data = {
      ...node.data,
      ...nodeFeat
    }
    nodeStructFeats.push(nodeFeat)
  }
  for(let edge of edges) {
    const edgeFeat = {

    }
    edge.data = {
      ...edge.data,
      ...edgeFeat
    }
    edgeStructFeats.push(edgeFeat)
  }
  const nodeFeatNames = Object.keys(nodeStructFeats[0])
  const edgeFeatNames = Object.keys(edgeStructFeats[0])
  const nodeFeats = getAllFieldsInfo(genColDataFromArr(nodeStructFeats, nodeFeatNames), nodeFeatNames)
  const edgeFeats = getAllFieldsInfo(genColDataFromArr(edgeStructFeats, edgeFeatNames), edgeFeatNames)
  const trianglePattern = {
    nodes: [
      { id: 'pn1', cluster: 'nc1' },
      { id: 'pn2', cluster: 'nc1' },
      { id: 'pn3', cluster: 'nc3' },
    ],
    edges: [
      { source: 'pn1', target: 'pn2', cluster: 'ec1' },
      { source: 'pn1', target: 'pn3', cluster: 'ec2' },
    ]
  }
  // const triangleMatches = GraphAlgorithms.GADDI({nodes, edges}, trianglePattern, true, 0, 0)

  // 统计全图所有节点和边的结构特征，得到图的特征
  const graphInfo: Partial<IGraphFeat> = {
    isDirected,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    isConnected: components && components.length === 1,
    isDAG: isDirected && directedCycles.length === 0,
    cycleParticipate,
    // isCycle: cycles && cycles.length === 1,
    cycleCount: cycles.length,
    directedCycleCount: directedCycles.length,
    componentCount: components.length,
    components,
    strongConnectedComponents: strongConnectedComponents,
    strongConnectedComponentCount: strongConnectedComponents.length
  }

  return {
    nodeFeats,
    edgeFeats,
    graphInfo
  }
}

export function graphDataToDataProps(data:IGraphData):IGraphProps {
  const { nodes, edges } = data
  // calc fields statistics and structural statistics
  const {nodeFields, nodeFieldNames} = getNodeFields(nodes)
  const {edgeFields, edgeFieldNames} = getEdgeFields(edges)
  const nodeFieldsInfo = getAllFieldsInfo(nodeFields, nodeFieldNames)
  const edgeFieldsInfo = getAllFieldsInfo(edgeFields, edgeFieldNames)
  const graphStrucFeats = getAllStructFeats(nodes, edges)

  const graphProps = {
    nodeFieldsInfo,
    edgeFieldsInfo,
    ...graphStrucFeats,
  }
  return graphProps
}
