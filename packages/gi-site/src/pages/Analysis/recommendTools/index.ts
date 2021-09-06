import { graphDataToDataProps } from './pipeline/data2dataprops'
import { edgeFields2Style, nodeFields2Cfg, graph2LayoutCfg, setNodeAttr } from './pipeline/dataprops2advice';
import { testRule } from './rules'
import { IGraphData, INodeData, IEdgeData, IGraphProps, INodeCfg, ILayoutConfig, IEdgeCfg } from './types'

export class ConfigRecommedor {
  graphData: IGraphData;
  nodes: INodeData[];
  edges: IEdgeData[];
  dataProps: IGraphProps;

  constructor(graphData: IGraphData){
    const graphDataProps = graphDataToDataProps(graphData)
    this.graphData = graphData
    this.dataProps = graphDataProps
  }

  recLayoutCfg(): Partial<ILayoutConfig> {
    return graph2LayoutCfg(this.graphData, this.dataProps)
  }

  recNodeCfg(): Partial<INodeCfg> {
    const { nodeFeats, nodeFieldsInfo } = this.dataProps
    const nodeCfg = nodeFields2Cfg(nodeFieldsInfo.concat(nodeFeats))
    const { color, size } = nodeCfg
    // TODO 将size、cluster、size和color对应的field字段加入node 字段
    const [fieldForCluster] = testRule(nodeFieldsInfo, 'field-for-cluster')
    
    this.graphData && setNodeAttr(this.graphData.nodes, fieldForCluster.fieldName, size)
    return nodeCfg
  }

  recEdgeCfg(): Partial<IEdgeCfg> {
    const { edgeFeats, edgeFieldsInfo } = this.dataProps
    return edgeFields2Style(edgeFieldsInfo)
  }
}
