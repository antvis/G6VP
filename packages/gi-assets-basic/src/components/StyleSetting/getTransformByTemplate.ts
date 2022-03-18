import { GraphinData, Utils } from '@antv/graphin';
import deepmerge from 'deepmerge';
import { cloneDeep } from 'lodash';
import { iconLoader } from './icons/iconLoader';
export interface NodeStyle {
  nodeType: string;
  size: number;
  elementType: 'node';
  color: string;
  fontStyle: {
    family: string;
    position: string;
    size: number;
  };
  icon: {
    iconText: string;
    [key: string]: any;
  };
  displyLabel: string;
  advancedColor: string;
  advancedSize: number;
}
export interface StyleTemplate {
  [key: string]: Partial<NodeStyle | EdgeStyle>;
}
const defaultNodeStyles: NodeStyle = {
  nodeType: '',
  size: 30,
  color: '#5B8FF9',
  elementType: 'node',
  fontStyle: {
    family: 'graphin',
    position: 'bottom',
    size: 12,
  },
  icon: {
    iconText: '',
  },
  displyLabel: 'id',
  advancedColor: '#5B8FF9',
  advancedSize: 30,
};

export interface EdgeStyle {
  advancedColor: string;
  advancedLineWidth: number;
  color: string;
  displyLabel: string;
  edgeStrokeType: string;
  edgeType: string;
  elementType: 'edge';
  fontStyle: {
    family: string;
    size: number;
  };
  lineWidth: number;
}
const defaultEdgeStyles: EdgeStyle = {
  advancedColor: '',
  advancedLineWidth: 0,
  color: '#19A576',
  displyLabel: 'class',
  edgeStrokeType: 'lineDash',
  edgeType: 'subject',
  elementType: 'edge',
  fontStyle: { family: 'system-ui', size: 11 },
  lineWidth: 13,
};
const getTransformByTemplate = (styles: StyleTemplate = {}) => {
  return (data: GraphinData): GraphinData => {
    const { nodes, edges, combos } = data;
    const newNodes = nodes.map(node => {
      const nodeType = node.data.label;
      const nodeCfg = deepmerge(defaultNodeStyles, styles[nodeType] || {}) as NodeStyle;
      const { displyLabel, size, fontStyle, icon, color } = nodeCfg;
      return {
        ...node,
        type: 'graphin-circle',
        style: {
          label: {
            // 如果设置了显示的属性值，则从 schema 中获取具体的值
            value: displyLabel && node.data.properties[displyLabel],
            position: fontStyle.position,
            fontSize: fontStyle.size,
            fontFamily: fontStyle.family,
          },
          icon: {
            type: 'font' as 'font',
            fontFamily: 'graphin',
            value: iconLoader[icon.iconText],
            fill: color,
            size: size * 0.7,
          },
          keyshape: {
            size: size,
            stroke: color || '#5B8FF9',
            fill: color || '#5B8FF9',
            fillOpacity: 0.3,
            strokeOpacity: 1,
          },
        },
      };
    });

    const filteredEdges = Utils.processEdges(cloneDeep(edges), { poly: 50, loop: 10 });
    const newEdges = filteredEdges.map(edge => {
      const edgeType = edge.data.label;
      const edgeCfg = deepmerge(defaultEdgeStyles, styles[edgeType] || {}) as EdgeStyle;
      const { displyLabel, fontStyle, color = '#19A576', lineWidth, edgeStrokeType } = edgeCfg;
      return {
        ...edge,
        type: 'graphin-line',
        label: {
          // 如果设置了显示的属性值，则从 schema 中获取具体的值
          value: (displyLabel && edge.data.properties[displyLabel]) || edge.data.label,
          fontSize: fontStyle.size || 12,
          fontFamily: fontStyle.family,
          background: {
            fill: '#fff',
            stroke: '#fff',
          },
        },
        keyshape: {
          lineWidth: lineWidth,
          stroke: color,
          lineDash: edgeStrokeType === 'line' ? [] : [5, 5],
        },
      };
    });
    return {
      nodes: newNodes,
      edges: newEdges,
      combos: combos,
    };
  };
};
export default getTransformByTemplate;
