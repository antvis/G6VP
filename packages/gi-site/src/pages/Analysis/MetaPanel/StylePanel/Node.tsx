import ColorMapping from '@ali/datav-gui-color-scale';
import MarkerMapping from '@ali/datav-gui-marker-scale';
import SizeMapping from '@ali/datav-gui-size-scale';
import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import { Select } from 'antd';
import React, { useState } from 'react';
import AssetsSelect from '../../../../components/AssetsSelect';
import TagsSelect from '../../../../components/DataVGui/TagsSelect';
const freeExtensions = {
  sizeMapping: SizeMapping,
  colorMapping: ColorMapping,
  markerMapping: MarkerMapping,
};

const extensions = {
  TagsSelect,
};

const { Option } = Select;

interface NodeStylePanelProps {
  meta: any;
  data: any;
  elements: any;
  config: any;
  dispatch: any;
}

const cache = {};

const getCacheValues = (object, key) => {
  debugger;
  if (!cache[key]) {
    cache[key] = { id: key, props: {} };
    return object[key];
  }
  return cache[key];
};

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
  const { configObj } = element?.meta;
  const valueObj = extractDefault({ config: configObj, value: nodeConfig.props });
  /** 缓存数据 */
  cache[elementId] = { id: elementId, props: { ...valueObj } };

  const handleChangeConfig = evt => {
    const { rootValue } = evt;
    cache[elementId].props = rootValue;
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
    const values = getCacheValues(elements, value);

    dispatch({
      type: 'update:config:node',
      ...values,
    });
  };
  const elementOptions = Object.values(elements) as any[];

  const GUIComponent = React.useMemo(() => {
    return (
      <GUI
        configObj={configObj}
        valueObj={valueObj}
        freeExtensions={freeExtensions}
        onChange={handleChangeConfig}
        extensions={extensions}
      />
    );
  }, [elementId, handleChangeConfig]);

  return (
    <div>
      <AssetsSelect onChange={handleChangeShape} value={elementId} options={elementOptions} />
      {GUIComponent}
    </div>
  );
};

export default NodeStylePanel;
