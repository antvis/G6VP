import { scaleLinear } from 'd3-scale';
import { DEFAULT_COLORS, DEFAULT_EDGE_WIDTH_RANGE, DEFAULT_LAYOUT_TYPE, DEFAULT_NODE_SIZE_RANGE } from '../const';
import { optimizeByRule, testRule } from '../rules/index';
import { IExtendFieldInfo, IGraphData, IGraphProps, ILayoutConfig, INodeCfg, NumMappingCfg } from '../types';
// import { GraphLayoutPredict } from '@antv/vis-predict-engine';

/**
 * 图结构特点+整图数据 --> 每个节点的 x,y 坐标
 * @param data
 * @param dataProps
 * @return ILayoutConfig
 */
export function graph2LayoutCfg(data: IGraphData, dataProps: IGraphProps): ILayoutConfig {
  // TODO 可以变成用 @antv/vis-predict-engine 作兜底
  const layoutType: string = optimizeByRule(dataProps, 'pred-layout-type') || DEFAULT_LAYOUT_TYPE;
  dataProps = {
    ...dataProps,
    layoutType,
  };
  const layoutCfg = optimizeByRule(dataProps, 'pred-layout-config');

  return layoutCfg;
}

export function field2Color(field: IExtendFieldInfo, colorScaleType?: string): INodeCfg['color'] {
  const type = colorScaleType || 'ordinal';
  const { fieldName, valueMap } = field;
  return {
    key: fieldName,
    mapping: true,
    scale: {
      type,
      range: DEFAULT_COLORS,
      domain: Object.keys(valueMap),
    },
  };
}

export function field2Size(field: IExtendFieldInfo, sizeScaleType?: string, range?: number[]): INodeCfg['size'] {
  const type = sizeScaleType || 'linear';
  return {
    key: field?.fieldName,
    mapping: true,
    scale: {
      type,
      range: range || DEFAULT_NODE_SIZE_RANGE,
      domain: [field?.minimum, field?.maximum],
    },
  };
}

/**
 * 节点数据特征 --> 节点（points）图形属性
 */
export function nodeFields2Cfg(nodeFields: IExtendFieldInfo[]): Partial<INodeCfg> {
  const [fieldForColor] = testRule(nodeFields, 'field-for-color');
  const [fieldForSize] = testRule(nodeFields, 'field-for-size');
  const [fieldForLabel] = testRule(nodeFields, 'field-for-label');

  const colorScaleType = optimizeByRule(fieldForColor, 'pred-scale-type');
  const sizeScaleType = optimizeByRule(fieldForSize, 'pred-scale-type');
  const color = field2Color(fieldForColor, colorScaleType);
  const size = field2Size(fieldForSize, sizeScaleType);
  const label = {
    key: fieldForLabel.fieldName,
    showlabel: true,
  };
  return { color, size, label };
}

export function setNodeAttr(nodes, fieldNameForCluster: string, sizeCfg: NumMappingCfg) {
  const mappingBySize = scaleLinear().domain(sizeCfg.scale.domain).range(sizeCfg.scale.range);
  nodes.forEach(node => {
    node.data = {
      ...node.data,
      cluster: node[fieldNameForCluster],
      size: mappingBySize[node.data[sizeCfg.key]],
    };
  });
}

/**
 * 边数据特征 --> 边（lines）图形属性
 * 边如果是直线，只有样式属性；如果是 polyline / curve / arc， 配置更复杂
 */
export function edgeFields2Style(edgeFields: IExtendFieldInfo[]): Partial<INodeCfg> {
  // const [fieldForColor] = testRule(edgeFields, 'field-for-color')
  // const colorScaleType = optimizeByRule(fieldForColor, 'pred-scale-type')
  // const color = field2Color(fieldForColor, colorScaleType)
  const [fieldForWidth] = testRule(edgeFields, 'field-for-size');
  const sizeScaleType = optimizeByRule(fieldForWidth, 'pred-scale-type');
  const size = field2Size(fieldForWidth, sizeScaleType, DEFAULT_EDGE_WIDTH_RANGE);
  // const edgeType
  return { size };
}
