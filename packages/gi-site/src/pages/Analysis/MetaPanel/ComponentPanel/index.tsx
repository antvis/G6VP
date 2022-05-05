import { ColorInput, Offset } from '@alipay/gi-common-components';
import { FormCollapse, FormItem, Input, NumberPicker, Select, Switch } from '@formily/antd';
import { createForm, onFormInputChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import AssetsCenterHandler from '../../../../components/AssetsCenter/AssetsCenterHandler';
import TagsSelect from '../../../../components/DataVGui/TagsSelect';
import { useContext } from '../../hooks/useContext';
const extensions = {
  TagsSelect,
  Offset,
};

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    FormCollapse,
    Select,
    NumberPicker,
    Switch,
    SketchPicker,
    ColorInput,
    Offset,
  },
});

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

    configObj[`${id}Panel`] = {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': 'FormCollapse',
      'x-component-props': {
        ghost: true,
        className: 'gi-site-collapse',
      },
      properties: {
        [id]: {
          type: 'object',
          'x-component': 'FormCollapse.CollapsePanel',
          'x-component-props': {
            header: defaultName,
            key: `${id}Panel`,
          },
          properties: {
            ...defaultConfigObj,
          },
        },
      },
    };
  });

  const schema = {
    type: 'object',
    properties: configObj,
  };

  const form = createForm({
    initialValues: valueObj,
    effects() {
      onFormInputChange(({ values }) => {
        handleChange(values);
      });
    },
  });

  const handleChange = values => {
    const currentValues = JSON.parse(JSON.stringify(values));
    const com = getComponentsByMap(currentValues);
    console.log('com', com);
    updateContext(draft => {
      draft.config.components = com;
    });
  };

  return (
    <div>
      <AssetsCenterHandler title="组件" id="components" />
      <FormProvider form={form}>
        <SchemaField schema={JSON.parse(JSON.stringify(schema))} />
      </FormProvider>
    </div>
  );
};

export default ComponentPanel;

// export default React.memo(ComponentPanel, (prevProps, nextProps) => {
//   if (JSON.stringify(prevProps.activeAssetsKeys) !== JSON.stringify(nextProps.activeAssetsKeys)) {
//     return false;
//   }
//   return true;
// });
