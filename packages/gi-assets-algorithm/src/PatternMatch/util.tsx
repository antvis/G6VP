import { GIConfig, GIEdgeConfig, GINodeConfig } from '@alipay/graphinsight';
import { IEdgeSchema } from '@alipay/graphinsight/lib/process/schema'; // TODO 确认引入方式
import { GraphinData, Utils } from '@antv/graphin';

// 模式匹配结果根据条件进行筛选
export const filterByPatternRules = (
  oriGraphData: GraphinData,
  pattern,
  matches,
  directed
) => {
  const graphNodeTypeMap = {};
  const nodeDataMap = {};
  oriGraphData.nodes.forEach(node => {
    graphNodeTypeMap[node.id] = node.label;
    nodeDataMap[node.id] = node;
  });
  const patternEdgesLength = pattern.edges.length;
  const patternNodesLength = pattern.nodes.length;
  const matchesLength = matches.length;
  for (let i = matchesLength - 1; i >= 0; i -= 1) {
    const match = matches[i];
    // 在 match 找每一个 pattern 点的匹配。只要有一个 pattern 节点没有找到匹配，则该 match 不合格
    const matchNodesLength = match.nodes.length;
    let allPatternNodeMatched = true;
    for (let pn = 0; pn < patternNodesLength; pn += 1) {
      const pNode = pattern.nodes[pn];
      let oneNodeMatched = false;
      // 若该 pattern 点没有规则，则不需要寻找。继续匹配下一个 pattern 点
      if (!pNode.rules?.length) continue;
      for (let mn = 0; mn < matchNodesLength; mn += 1) {
        const mNode = match.nodes[mn];
        // 类型的匹配
        if (pNode.label !== mNode.label) continue; // 不匹配，继续下一个 mNode
        // 规则的匹配
        const mProperties = nodeDataMap[mNode.id]?.data || mNode.data;
        mNode.data = mProperties;
        if (!mProperties && pNode.rules?.length) continue; // 不匹配，继续下一个 mNode
        let allRuleMatched = true;
        for (let r = 0; r < pNode.rules.length; r += 1) {
          const rule = pNode.rules[r];
          let mPropertyValue = mProperties[rule.name];
          switch (rule.name) {
            case 'id':
              mPropertyValue = mNode.id;
              break;
            case 'label':
              mPropertyValue = mNode.label;
              break;
            default: 
              break;
          }
          switch (rule.rule) {
            case '>':
              if (mPropertyValue <= rule.value) allRuleMatched = false;
              break;
            case '<':
              if (mPropertyValue >= rule.value) allRuleMatched = false;
              break;
            case '=':
              if (mPropertyValue !== rule.value) allRuleMatched = false;
              break;
            case '!=':
              if (mPropertyValue === rule.value) allRuleMatched = false;
              break;
            case 'like':
              if (!(`${mPropertyValue}`.includes(rule.value))) allRuleMatched = false;
              break;
            case 'unlike':
              if (`${mPropertyValue}`.includes(rule.value)) allRuleMatched = false;
              break;
            default: 
              break;
          }
          if (!allRuleMatched) break;
        }
        // 该边符合 pNode，即有一个点符合了 pNode，继续找下一条 pNode 的匹配
        if (allRuleMatched) {
          oneNodeMatched = true;
          break;
        }
      }
      // 该 pEdge 没有找到匹配，该 match 不合格
      if (!oneNodeMatched) {
        allPatternNodeMatched = false;
        break;
      }
    }
    // 有一条 pattern 中的节点没有在该 match 中找到匹配，该 match 不合格，删除该 match
    if (!allPatternNodeMatched) {
      matches.splice(i, 1);
      continue;
    }

    // 在 match 找每一个 pattern 边的匹配。只要有一个 pattern 边没有找到匹配，则该 match 不合格
    let allPatternEdgeMatched = true;
    for (let pe = 0; pe < patternEdgesLength; pe += 1) {
      const pEdge = pattern.edges[pe];
      let oneEdgeMatched = false;
      // 若该 pattern 边没有规则，则不需要寻找
      if (!pEdge.rules || !pEdge.rules.length) continue;
      for (let me = 0; me < match.edges.length; me += 1) {
        const mEdge = match.edges[me];
        // 类型和端点的匹配
        if (pEdge.label !== mEdge.label) continue;
        const directedMatched =
          pEdge.sourceNodeType === graphNodeTypeMap[mEdge.source] &&
          pEdge.targetNodeType === graphNodeTypeMap[mEdge.target];
        const undirectedMatched =
          directedMatched ||
          (pEdge.sourceNodeType === graphNodeTypeMap[mEdge.target] &&
            pEdge.targetNodeType === graphNodeTypeMap[mEdge.source]);
        if (directed && !directedMatched) continue;
        if (!directed && !undirectedMatched) continue;
        // 规则的匹配
        const mProperties = mEdge?.data;
        if (!mProperties && pEdge.rules?.length) continue;
        let allRuleMatched = true;
        for (let r = 0; r < pEdge.rules.length; r += 1) {
          const rule = pEdge.rules[r];
          const mPropertyValue = mProperties[rule.name];
          switch (rule.rule) {
            case '>':
              if (mPropertyValue <= rule.value) allRuleMatched = false;
              break;
            case '<':
              if (mPropertyValue >= rule.value) allRuleMatched = false;
              break;
            case '=':
              if (mPropertyValue !== rule.value) allRuleMatched = false;
              break;
            case '!=':
              if (mPropertyValue === rule.value) allRuleMatched = false;
              break;
            case 'like':
              if (!(`${mPropertyValue}`.includes(rule.value))) allRuleMatched = false;
              break;
            case 'unlike':
              if (`${mPropertyValue}`.includes(rule.value)) allRuleMatched = false;
              break;
            default:
              break;
          }
          if (!allRuleMatched) break;
        }
        // 该边符合 pEdge，即有一条边符合了 pEdge，继续找下一条 pEdge 的匹配
        if (allRuleMatched) {
          oneEdgeMatched = true;
          break;
        }
      }
      // 该 pEdge 没有找到匹配，该 match 不合格
      if (!oneEdgeMatched) {
        allPatternEdgeMatched = false;
        break;
      }
    }
    // 有一条 pattern 中的边没有在该 match 中找到匹配，该 match 不合格，删除该 match
    if (!allPatternEdgeMatched) matches.splice(i, 1);
  }
};

export const formatDataModels = (dataType: 'node' | 'edge', models, config: GIConfig, schemaEdgeMap: { [key: string]: IEdgeSchema } = {}) => {
  return models?.map(model => {
    const type = model[`${dataType}Type`];
    let modelConfig = {} as GINodeConfig | GIEdgeConfig;
    if (type) {
      modelConfig = (config[`${dataType}s`] as GINodeConfig[] | GIEdgeConfig[]).find(config => config.groupName === `${type.toUpperCase()} TYPE`) || modelConfig;
    }
    const { color = '#ccc', size = dataType === 'node' ? 30 : 1 } = modelConfig.props || {};
    const res = {
      ...model,
      style: {
        ...model.style,
        keyshape: modelConfig.props ? {
          size,
          fill: dataType === 'node' ? color : undefined,
          stroke: color,
        } : undefined,
        label: typeof model.label === 'string' ? {
          value: model.label
        } : (model.style?.label || model.label)
      }
    }
    if (dataType === 'edge') {
      const edgeSchema = schemaEdgeMap[model.edgeType];
      if (edgeSchema) {
        res.sourceNodeType = edgeSchema.sourceNodeType;
        res.targeteEdgeType = edgeSchema.targetNodeType;
      }
    }
    return res
  }) || [];
};

export const formatData = (graphData, config, schemaEdgeMap): GraphinData => ({
  nodes: formatDataModels('node', graphData.nodes, config),
  edges: Utils.processEdges(formatDataModels('edge', graphData.edges, config, schemaEdgeMap))
})


export default { filterByPatternRules, formatDataModels, formatData };