import * as React from 'react';
import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import ColorMapping from '@ali/datav-gui-color-scale';
import SizeMapping from '@ali/datav-gui-size-scale';

interface Option {
  /** 配置的内容 */
  content: React.ReactElement | JSX.Element | JSX.Element[];
  /** 配置的ID */
  id: string;
  /** 配置的名称 */
  name: string;
}
interface ConfigationPanelProps {
  value: Option['id'];
  onChange: Function;
  data: Object;
  config: Object;
}

const getMaterialByCategoryId = (market, categoryId) => {
  let materials: any[] = [];
  
  const keys = Object.keys(market);
  keys.map(k => {
    if (market[k].category === categoryId) {
      materials.push(market[k]);
    }
  });

  return materials;
}

const getMarketConfig = (value, materials, categoryId) => {
  const nameMap = {
    'NODE': '节点物料',
    'EDGE': '边物料',
  }
  
  const options = materials.map(m => {
    return {
      value: m.id,
      label: m.label,
    }
  });

  const material = {
    name: categoryId === 'NODE'? '选择节点' : '选择边',
    type: 'select',
    useFont: true,
    default: value,
    options,
  }

  const market = {
    name: nameMap[categoryId],
    type: 'group',
    enableHide: false,
    fold: false,
    children: {
      material,
    }
  }

  console.log('market', market)

  return market;

}

const StylePanel = props => {
  const { value, onChange, data, config, meta, market } = props;
  // const configObj = configation(value, data, config, meta);


  console.log('StylePanel', market)
  const { node:nodeConfig, edge:edgeConfig } = config;
  const MaterialNode = getMaterialByCategoryId(market, 'NODE');
  const MaterialEdge = getMaterialByCategoryId(market, 'EDGE');

  const valueObj = {
    style: {
      node: {},
      edge: {},
    },
  };

  let keys = ['id'];
  try {
    keys = Object.keys(data.nodes[0].data);
  } catch (error) { }

  console.log('@@@@@ StylePanel @@@@@', config, nodeConfig, edgeConfig);
  const curNodeId = nodeConfig[0]?.id;
  const curEdgeId = edgeConfig[0]?.id;

  const node = {
    name: '节点',
    mode: 'single',
    children: {
      market: getMarketConfig(curNodeId, MaterialNode, 'NODE'),
    }
  };

  const edge = {
    name: '边',
    mode: 'single',
    children: {
      market: getMarketConfig(curEdgeId, MaterialEdge, 'EDGE'),
    }
  };

  console.log('nodeConfig', nodeConfig, typeof (nodeConfig), config);
  nodeConfig.forEach(element => {
    const { id, props } = element;
    const nodeMeta = meta[id]({ data, keys });

    // const defaultValues = extractDefault({ nodeMeta });
    
    console.log('node defaultValues', props, nodeMeta);
  
    node.children = {
      ...node.children,
      ...nodeMeta,
    }

    valueObj.style.node = {
      market: {
        material: curNodeId,
      },
      // ...defaultValues,
      ...props,
    }

  });

  edgeConfig.forEach(element => {
    const { id, props } = element;
    const edgeMeta = meta[id]({ data, keys });

    // const defaultValues = extractDefault({ edgeMeta });

    console.log('defaultValues', props, edgeMeta);

    edge.children = {
      ...edge.children,
      ...edgeMeta,
    }

    valueObj.style.edge = {
      market: {
        material: curEdgeId,
      },
      // ...defaultValues,
      ...props,
    }
  });

  const configObj = {
    style: {
      type: 'menu',
      name: 'style',
      children: {
        node,
        edge,
      },
    },
  };

  console.log('Style configObj', configObj, valueObj)

  const freeExtensions = {
    sizeMapping: SizeMapping,
    colorMapping: ColorMapping,
  };

  return <GUI configObj={configObj} valueObj={valueObj} freeExtensions={freeExtensions} onChange={onChange} />;
};

export default StylePanel;
