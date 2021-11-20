import ColorMapping from '@ali/datav-gui-color-scale';
import MarkerMapping from '@ali/datav-gui-marker-scale';
import SizeMapping from '@ali/datav-gui-size-scale';
import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import { Select } from 'antd';
import React, { useState } from 'react';
import AssetsCenterHandler from '../../../../components/AssetsCenter/AssetsCenterHandler';
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
  layouts: any;
  config: any;
  dispatch: any;
}

const cache = {};

const getCacheValues = (object, key) => {
  if (!cache[key]) {
    cache[key] = { id: key, props: {} };
    return object[key];
  }
  return cache[key];
};

const LayoutPanel: React.FunctionComponent<NodeStylePanelProps> = props => {
  const { data, layouts, config = { layout: { props: {} } }, dispatch } = props;
  const { layout: layoutConfig } = config;
  const [state, setState] = useState({
    /** 当前布局的ID */
    layoutId: layoutConfig.id,
  });

  const { layoutId } = state;

  /*** 当前元素物料 */
  const layout = layouts[layoutId];
  const configObj = {
    options: {
      name: '布局参数',
      type: 'group',
      fold: false,
      children: layout?.meta,
    },
  };

  const valueObj = extractDefault({ config: configObj, value: { options: layoutConfig.props } });

  /** 缓存数据 */
  cache[layoutId] = { id: layoutId, props: { ...valueObj.options } };

  const handleChangeConfig = evt => {
    const { rootValue } = evt;
    cache[layoutId].props = { ...rootValue.options };
    dispatch({
      type: 'FREE',
      update: draft => {
        draft.config.layout.props = { ...rootValue.options };
      },
    });
  };
  const handleChangeShape = value => {
    const values = getCacheValues(layouts, value);

    setState(preState => {
      return {
        ...preState,
        layoutId: value,
      };
    });
    dispatch({
      type: 'FREE',
      update: draft => {
        draft.config.layout = { ...values };
        // draft.config.layout.id = value;
        // draft.config.layout = { ...layouts[value] };
      },
    });
  };
  const layoutItems = Object.values(layouts) as any[];

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
  }, [layoutId, handleChangeConfig]);

  return (
    <div>
      <AssetsCenterHandler title="布局" id="layouts" />
      <AssetsSelect onChange={handleChangeShape} value={layoutId} options={layoutItems} />
      {GUIComponent}
    </div>
  );
};

export default LayoutPanel;
