import { AssetCollapse, ColorInput, FormCollapse, Offset } from '@alipay/gi-common-components';
import { FormItem, Input, NumberPicker, Select, Switch } from '@formily/antd';
import { createForm, onFormInputChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import React from 'react';
import { SketchPicker } from 'react-color';
import AssetsCenterHandler from '../../../../components/AssetsCenter/AssetsCenterHandler';
import { CategroyOptions } from '../../../../components/AssetsCenter/Components';
import TagsSelect from '../../../../components/DataVGui/TagsSelect';
import { useContext } from '../../hooks/useContext';
const extensions = {
  TagsSelect,
  Offset,
  AssetCollapse,
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
    AssetCollapse,
  },
});

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

  /** 手动构建ConfigObject信息 */
  const configObj = {};
  const valueObj = {};
  const sortComponents = [...components].sort((a, b) => {
    try {
      const aOrder = CategroyOptions[a.category]?.order || 99;
      const bOrder = CategroyOptions[b.category]?.order || 99;
      return aOrder - bOrder;
    } catch (error) {
      console.log(error);
      return 0;
    }
  });
  sortComponents.forEach(component => {
    const { id, meta: defaultConfigObj, props: defaultProps, name: defaultName, info } = component;
    const matchComponent = config.components?.find(c => c.id === id) || {};
    const { props = {} } = matchComponent;
    console.log('matchComponent', matchComponent, component);
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
          'x-component': 'FormCollapse.FormCollapsePanel',
          'x-component-props': {
            header: defaultName,
            key: `${id}Panel`,
            icon: info.icon,
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

  console.log('propsssss', components, schema, valueObj);
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
