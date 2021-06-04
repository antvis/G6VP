import Graphin, { GraphinContext, GraphinData } from '@antv/graphin';
import { Legend } from '@antv/graphin-components';
import React from 'react';

export interface Props {
  /**
   * @description 配置信息
   */
  config: any;
  services: {
    /** 获取初始化接口 */
    getGraphData: () => Promise<any>;
    /** 根据ID获取节点或边的详情信息 */
    getGraphDataById?: (id: string) => Promise<any>;
    /** 获取一度下钻数据 */
    getExploreGraphByDegree?: (degree: number, id: string) => Promise<any>;
  };
  children?: React.ReactChildren;
}

const getMapping = () => {
  const Mapping = new Map();
  return (enumValue, value) => {
    const current = Mapping.get(enumValue);
    if (current) {
      Mapping.set(enumValue, [...current, value]);
    } else {
      Mapping.set(enumValue, [value]);
    }
    return Mapping;
  };
};

/** 数据映射函数  需要根据配置自动生成*/
const transform = (s, config) => {
  const { node: NodeConfig, edge: EdgeConfig } = config;
  /** 解构配置项 */
  const MathNodeConfig = NodeConfig.find(cfg => cfg.enable);
  const Size = MathNodeConfig?.size.find(s => s.enable);
  const Color = MathNodeConfig?.color.find(s => s.enable);
  const Label = MathNodeConfig?.label;
  /** 分别生成Size和Color的Mapping */
  const mappingBySize = getMapping();
  const mappingByColor = getMapping();

  const nodes = s.nodes.map(node => {
    const { id, data } = node;

    /** 根据Size字段映射的枚举值 */
    const enumValueBySize = data[Size?.key || 0];
    const MappingBySize = mappingBySize(enumValueBySize, node);
    /** 根据Color字段映射的枚举值 */
    const enumValueByColor = data[Color?.key || 0];
    const MappingByColor = mappingByColor(enumValueByColor, node);

    /** 根据数组匹配，未来也是需要用户在属性面板上调整位置 */
    const colorKeys = MappingByColor.keys();
    const matchColorIndex = [...colorKeys].findIndex(c => c === enumValueByColor);
    const sizeKeys = MappingBySize.keys();
    const matchSizeIndex = [...sizeKeys].findIndex(c => c === enumValueBySize);

    return {
      id: node.id,
      data: node.data,
      style: {
        keyshape: {
          stroke: Color?.enum?.[matchColorIndex],
          fill: Color?.enum?.[matchColorIndex],
          size: Size?.enum?.[matchSizeIndex],
        },
        label: {
          value: data[Label?.key || 'id'],
        },
      },
    };
  });
  const edges = s.edges.map(edge => {
    return edge;
  });
  return {
    nodes,
    edges,
  };
};
/** 根据用户配置的颜色，获取Legend的映射字段 */
const getLegendMappingKey = config => {
  const { node: NodeConfig } = config;
  /** 解构配置项 */
  const MathNodeConfig = NodeConfig.find(cfg => cfg.enable);
  const Color = MathNodeConfig?.color.find(s => s.enable);
  return `data.${Color.key}`;
};
const GISDK = (props: Props) => {
  const { config, services, children } = props;

  const [state, setState] = React.useState({
    data: {} as GraphinData,
    layout: {
      type: config.layout.id,
      ...config.layout.options,
    },
  });

  React.useEffect(() => {
    services.getGraphData().then(res => {
      setState({
        ...state,
        data: transform(res, config),
      });
    });
  }, []);
  React.useEffect(() => {
    const { components } = config;
    const componentsMap = components
      .filter(c => c.enable)
      .reduce((acc, curr) => {
        return {
          ...acc,
          [curr.id]: curr,
        };
      }, {});
    console.log('componentsMap ***', componentsMap);
  }, [config]);

  const { data, layout } = state;

  console.log('config', config, data);
  const legendKey = getLegendMappingKey(config);
  return (
    <div>
      <Graphin data={data} layout={layout}>
        <Legend
          bindType="node"
          sortKey={legendKey}
          colorKey="style.keyshape.stroke" // 如果是GraphinNode，则可以硬编码写死
          style={{ position: 'absolute', left: '10px', top: '10px' }}
        >
          <Legend.Node />
        </Legend>
        {children}
      </Graphin>
    </div>
  );
};

export const GIContext = GraphinContext;
export default GISDK;
