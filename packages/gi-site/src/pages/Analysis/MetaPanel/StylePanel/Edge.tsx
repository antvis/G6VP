import ColorMapping from '@ali/datav-gui-color-scale';
import SizeMapping from '@ali/datav-gui-size-scale';
import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import { Select } from 'antd';
import React, { useState } from 'react';
import AssetsSelect from '../../../../components/AssetsSelect';
import { useContext } from '../../hooks/useContext';

const { Option } = Select;

interface EdgeStylePanelProps {
  meta: any;
  data: any;
  elements: any;
  config: any;
}

const freeExtensions = {
  sizeMapping: SizeMapping,
  colorMapping: ColorMapping,
};
const cache = {};

const getCacheValues = (object, key) => {
  if (!cache[key]) {
    cache[key] = { id: key, props: {} };
    return object[key];
  }
  return cache[key];
};

const EdgeStylePanel: React.FunctionComponent<EdgeStylePanelProps> = props => {
  const { updateContext } = useContext();
  const { data, elements, config = { edge: { props: {} } } } = props;
  const { edge: edgeConfig } = config;
  const [state, setState] = useState({
    /** 当前元素的ID */
    elementId: edgeConfig.id,
  });
  const { elementId } = state;

  const element = elements[edgeConfig.id];
  const { configObj } = element.meta;
  const valueObj = extractDefault({ config: configObj, value: edgeConfig.props });
  /** 缓存数据 */
  cache[elementId] = { id: elementId, props: { ...valueObj } };

  const handleChangeConfig = evt => {
    const { rootValue } = evt;
    cache[elementId].props = rootValue;
    updateContext(draft => {
      draft.config.edge = {
        ...element,
        props: rootValue,
      };
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
    const values = getCacheValues(elements, value);
    updateContext(draft => {
      draft.config.edge = { ...values };
    });
  };
  const GUIComponent = React.useMemo(() => {
    return (
      <GUI configObj={configObj} valueObj={valueObj} freeExtensions={freeExtensions} onChange={handleChangeConfig} />
    );
  }, [elementId, handleChangeConfig]);
  return (
    <>
      <AssetsSelect onChange={handleChangeShape} value={elementId} options={elementOptions} />

      {GUIComponent}
    </>
  );
};

export default EdgeStylePanel;
