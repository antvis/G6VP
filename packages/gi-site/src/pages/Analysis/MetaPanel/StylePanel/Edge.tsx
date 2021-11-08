import ColorMapping from '@ali/datav-gui-color-scale';
import SizeMapping from '@ali/datav-gui-size-scale';
import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import { Select } from 'antd';
import React, { useState } from 'react';
import AssetsSelect from '../../../../components/AssetsSelect';

const { Option } = Select;

interface EdgeStylePanelProps {
  meta: any;
  data: any;
  elements: any;
  config: any;
  dispatch: any;
}

const freeExtensions = {
  sizeMapping: SizeMapping,
  colorMapping: ColorMapping,
};

const EdgeStylePanel: React.FunctionComponent<EdgeStylePanelProps> = props => {
  const { data, elements, config = { edge: { props: {} } }, dispatch } = props;
  const { edge: edgeConfig } = config;
  const [state, setState] = useState({
    /** 当前元素的ID */
    elementId: edgeConfig.id,
  });
  const { elementId } = state;

  const element = elements[edgeConfig.id];
  const { configObj } = element.meta;
  const valueObj = extractDefault({ config: configObj, value: edgeConfig.props });
  console.log(configObj, edgeConfig.props, valueObj);
  const handleChangeConfig = evt => {
    const { rootValue } = evt;

    dispatch({
      type: 'update:config:edge',
      ...element,
      props: rootValue,
    });
  };
  const elementOptions = Object.values(elements) as any[];
  const handleChangeShape = value => {
    setState(preState => {
      return {
        ...preState,
        elementId: value,
      };
    });
    dispatch({
      type: 'update:config:edge',
      ...elements[value],
    });
  };
  const GUIComponent = React.useMemo(() => {
    return (
      <GUI configObj={configObj} valueObj={valueObj} freeExtensions={freeExtensions} onChange={handleChangeConfig} />
    );
  }, []);
  return (
    <>
      <AssetsSelect onChange={handleChangeShape} value={elementId} options={elementOptions} />

      {GUIComponent}
    </>
  );
};

export default EdgeStylePanel;
