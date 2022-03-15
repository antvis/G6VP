import GUI from '@ali/react-datav-gui';
import React, { useState } from 'react';
import AssetsCenterHandler from '../../../../components/AssetsCenter/AssetsCenterHandler';
import Offset from '../../../../components/DataVGui/Offset';
import TagsSelect from '../../../../components/DataVGui/TagsSelect';
import { useContext } from '../../hooks/useContext';
const extensions = {
  TagsSelect,
  Offset,
};

/** 根据用户的组件Meta信息，得到默认的defaultvalue值 */
const getDefaultValues = meta => {
  const { children } = meta;
  const keys = Object.keys(children);
  const values = {};
  keys.forEach(key => {
    const { default: defaultValue } = children[key];
    values[key] = defaultValue;
  });
  return values;
};

const getComponentsByMap = componentMap => {
  const componentKeys = Object.keys(componentMap);
  return componentKeys.map(id => {
    const props = componentMap[id];
    const { giEnable } = props;
    return {
      id,
      props,
      enable: giEnable,
    };
  });
};

/** 组件模块 配置面板 */
const ComponentPanel = props => {
  const { updateContext } = useContext();
  const { config, components } = props;

  const [state, setState] = useState({
    isModalVisible: false,
  });

  /** 手动构建ConfigObject信息 */
  const configObj = {};
  const valueObj = {};

  components.forEach(component => {
    const { id, meta: defaultConfigObj, props: defaultProps, name: defaultName } = component;
    const defaultFunction = params => {
      return {
        categoryId: 'components',
        id: id,
        type: 'group', //这个可以不写
        fold: true, // 这个可以不写
        name: id,
        children: {},
      };
    };
    const matchComponent = config.components?.find(c => c.id === id) || {};
    const { props = {} } = matchComponent;

    valueObj[id] = {
      ...defaultProps,
      ...props,
    };

    configObj[id] = {
      name: defaultName,
      type: 'group',
      fold: true,
      children: {
        ...defaultConfigObj,
      },
    };
  });

  const handleChange = e => {
    const { rootValue } = e;
    const com = getComponentsByMap(rootValue);
    updateContext(draft => {
      draft.config.components = com;
    });
    // dispatch({
    //   type: 'update:config:components',
    //   components: com,
    // });
  };

  console.log('%c ComponentMeta', 'color:green');

  return (
    <div>
      <AssetsCenterHandler title="组件" id="components" />
      <GUI configObj={configObj} valueObj={valueObj} onChange={handleChange} extensions={extensions} />
    </div>
  );
};

// export default ComponentPanel;

export default React.memo(ComponentPanel, (prevProps, nextProps) => {
  if (JSON.stringify(prevProps.activeAssetsKeys) !== JSON.stringify(nextProps.activeAssetsKeys)) {
    return false;
  }
  return true;
});
