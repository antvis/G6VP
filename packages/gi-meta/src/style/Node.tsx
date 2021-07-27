import ColorMapping from '@ali/datav-gui-color-scale';
import SizeMapping from '@ali/datav-gui-size-scale';
import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import { Select, Tabs } from 'antd';
import React, { useState } from 'react';

const { TabPane } = Tabs;

function callback(key) {
  console.log(key);
}


const freeExtensions = {
  sizeMapping: SizeMapping,
  colorMapping: ColorMapping,
};

const { Option } = Select;

const defaultOptions = [
  {
    id: 'GraphinNode',
    name: '官方内置节点',
    props: {},
    meta: {},
  },
  {
    name: '第三刚节点',
    id: 'RectNode',
    props: {},
  },
];

interface NodeStylePanelProps {
  meta: any;
  data: any;
  elements: any;
  config: any;
  dispatch: any;
}

// const extractDefault = ()=>{

// }
const getKeysByData = data => {
  try {
    return Object.keys(data.nodes[0].data);
  } catch (error) {
    return ['id'];
  }
};
const NodeStylePanel: React.FunctionComponent<NodeStylePanelProps> = props => {
  console.log('props', props);
  const {  data, elements, config = { node: { props: {} } }, dispatch } = props;
 
  const {props:NodeShapeProps,id:NodeShapeId} =config.node;

  
  const [state, setState] = useState({
    options: defaultOptions,
    currentNodeId: NodeShapeId,
  });

  const handleChange = value => {
    
    setState(preState => {
      return {
        ...preState,
        currentNodeId: value,
      };
    });
    const currentNode = options.find(opt=>opt.id===value);
    console.log(`selected ${value}`,currentNode);

    dispatch({
      type:"update:config:node",
      ...currentNode,
    })
  };

  const { options, currentNodeId } = state;

  const keys = getKeysByData(data);
  const NodeElement = elements[currentNodeId];
  const { registerMeta } = NodeElement;
  const configObj = registerMeta({ keys, data });

  const valueObj = extractDefault({ config: configObj, value: NodeShapeProps });

  console.log('currentNodeId', currentNodeId, configObj, valueObj);
  const handleGUIChange = evt => {
    const { rootValue } = evt;
    console.log('evt', rootValue);
    dispatch({
      type: 'update:config:node',
       props: rootValue,
    });
  };

  return (
    <div>
   
    <Select onChange={handleChange} value={currentNodeId}>
        {options.map(c => {
          return (
            <Option value={c.id} key={c.id}>
              {c.name}
            </Option>
          );
        })}
      </Select>
      <GUI configObj={configObj} valueObj={valueObj} freeExtensions={freeExtensions} onChange={handleGUIChange} />
    </div>
  );
};

export default NodeStylePanel;
