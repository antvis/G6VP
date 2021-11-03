import ColorMapping from '@ali/datav-gui-color-scale';
import MarkerMapping from '@ali/datav-gui-marker-scale';
import SizeMapping from '@ali/datav-gui-size-scale';
import GUI from '@ali/react-datav-gui';
import { extractDefault } from '@ali/react-datav-gui-utils';
import { Select } from 'antd';
import React, { useState } from 'react';
import AssetsCenterHandler from '../../../../components/AssetsCenter/AssetsCenterHandler';
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
  const configObj = layout?.meta;
  const valueObj = extractDefault({ config: configObj, value: layoutConfig.props });

  const handleChangeConfig = evt => {
    const { rootValue } = evt;
    dispatch({
      type: 'FREE',
      update: draft => {
        draft.config.layout.props = { ...rootValue };
      },
    });
  };
  const handleChangeShape = value => {
    setState(preState => {
      return {
        ...preState,
        layoutId: value,
      };
    });
    dispatch({
      type: 'FREE',
      update: draft => {
        draft.config.layout.id = value;
        draft.config.layout = { ...layouts[value] };
      },
    });
  };
  const layoutItems = Object.values(layouts);

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
      <Select onChange={handleChangeShape} value={layoutId} style={{ width: '268px', margin: '8px 16px' }} size="large">
        {layoutItems.map((c: any) => {
          return (
            <Option value={c.id} key={c.id}>
              <img
                src="https://gw.alipayobjects.com/mdn/rms_402c1a/afts/img/A*JoptTZdYEEYAAAAAAAAAAAAAARQnAQ"
                alt=""
                width={40}
                height={40}
              />
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

export default LayoutPanel;
