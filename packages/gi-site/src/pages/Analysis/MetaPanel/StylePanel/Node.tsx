import ColorMapping from '@ali/datav-gui-color-scale';
import SizeMapping from '@ali/datav-gui-size-scale';
import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import { Select } from 'antd';
import React, { useState } from 'react';

const freeExtensions = {
  sizeMapping: SizeMapping,
  colorMapping: ColorMapping,
};

const { Option } = Select;

interface NodeStylePanelProps {
  meta: any;
  data: any;
  elements: any;
  config: any;
  dispatch: any;
}

const NodeStylePanel: React.FunctionComponent<NodeStylePanelProps> = props => {
  const { data, elements, config = { node: { props: {} } }, dispatch } = props;
  const { node: nodeConfig } = config;
  const [state, setState] = useState({
    /** 当前元素的ID */
    elementId: nodeConfig.id,
  });

  const { elementId } = state;

  /*** 当前元素物料 */
  const element = elements[elementId];
  const { configObj } = element.meta;
  const valueObj = extractDefault({ config: configObj, value: nodeConfig.props });

  const handleChangeConfig = evt => {
    const { rootValue } = evt;

    dispatch({
      type: 'update:config:node',
      ...element,
      props: rootValue,
    });
  };
  const handleChangeShape = value => {
    setState(preState => {
      return {
        ...preState,
        elementId: value,
      };
    });
    dispatch({
      type: 'update:config:node',
      ...elements[value],
    });
  };
  const elementOptions = Object.values(elements);

  const GUIComponent = React.useMemo(() => {
    return (
      <GUI configObj={configObj} valueObj={valueObj} freeExtensions={freeExtensions} onChange={handleChangeConfig} />
    );
  }, [elementId]);

  return (
    <div>
      <Select onChange={handleChangeShape} value={elementId} style={{ width: '100%' }} size="large">
        {elementOptions.map((c: any) => {
          return (
            <Option value={c.id} key={c.id}>
              <img
                src="https://gw.alipayobjects.com/mdn/rms_402c1a/afts/img/A*JoptTZdYEEYAAAAAAAAAAAAAARQnAQ"
                alt=""
                width={40}
                height={40}
              />{' '}
              {c.name}
            </Option>
          );
        })}
      </Select>
      <br />
      {GUIComponent}
      {/* <GUI configObj={configObj} valueObj={valueObj} freeExtensions={freeExtensions} onChange={handleChangeConfig} /> */}
    </div>
  );
};

export default NodeStylePanel;
