import ColorMapping from '@ali/datav-gui-color-scale';
import SizeMapping from '@ali/datav-gui-size-scale';
import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import { Select } from 'antd';
import React, { useState } from 'react';

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

  const GUIComponent = React.useMemo(() => {
    return (
      <GUI configObj={configObj} valueObj={valueObj} freeExtensions={freeExtensions} onChange={handleChangeConfig} />
    );
  }, []);
  return <>{GUIComponent}</>;
};

export default EdgeStylePanel;
