// @ts-nocheck
import { BgColorsOutlined } from '@ant-design/icons';
import { ArrayCollapse, ArrayItems, DatePicker, FormItem, Input, NumberPicker, Select, Switch } from '@formily/antd';
import { createForm, onFormInputChange } from '@formily/core';
import { FormProvider, createSchemaField } from '@formily/react';
import { Button, Radio, Typography } from 'antd';
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import { AssetCollapse, FormCollapse, Offset } from '../FormilyForm';
import PopoverContainer from '../GroupContainer/PopoverContainer';
import ColorInput from './ColorInput';
import GroupSelect from './GroupSelect';
import IconPicker from './IconPicker';
import IconSelector from './IconSelector';
import $i18n from '../i18n';

const { Text } = Typography;

interface RenderFormProps {
  onChange: (all: any, elementId: string) => void;
  /** node assets */
  elements: {};
  /** node config */
  config: {
    id: string;
    props: {};
    [key: string]: any;
  };
  schemaData: {
    nodes: [];
    edges: [];
  };
  elementType: 'nodes' | 'edges';
}

const SchemaField = createSchemaField({
  components: {
    ArrayCollapse,
    ArrayItems,
    AssetCollapse,
    ColorInput,
    DatePicker,
    FormCollapse,
    FormItem,
    GroupSelect,
    IconPicker,
    IconSelector,
    Input,
    NumberPicker,
    Offset,
    Radio,
    Select,
    SketchPicker,
    Switch,
  },
});
const RenderForm: React.FunctionComponent<RenderFormProps> = props => {
  const { onChange, elements, config, schemaData, elementType } = props;

  const form = createForm({
    initialValues: config.props,
    effects() {
      onFormInputChange(({ values }) => {
        const currentValues = JSON.parse(JSON.stringify(values));

        if (onChange) {
          ref.current.cacheConfigMap.set(ref.current.elementId, currentValues);
          onChange(currentValues, ref.current.elementId);
        }
      });
    },
  });
  // @ts-ignore
  const formCollapse = FormCollapse?.createFormCollapse();

  const [state, setState] = useState({
    elementId: config.id,
  });
  const ref = React.useRef({
    elementId: config.id,
    /** 切换的时候，缓存之前的配置 */
    cacheConfigMap: new Map(),
  });

  const { elementId } = state;
  const schema = elements[elementId].meta;

  const jsonSchema = JSON.parse(JSON.stringify(schema));
  //@ts-ignore
  const schemaType = schemaData[elementType][0];
  const schemaTypeKey = elementType === 'nodes' ? 'nodeType' : 'edgeType';
  const dataTypeKey = elementType === 'nodes' ? 'nodeTypeKeyFromProperties' : 'edgeTypeKeyFromProperties';
  const typeKeyFromProperties = schemaType && schemaType[dataTypeKey];

  const nodeTypeExpression = config.expressions?.find(d => {
    if (!d) {
      return false;
    }
    return d.name === typeKeyFromProperties;
  });
  if (nodeTypeExpression) {
    try {
      const currentNodeType = nodeTypeExpression.value;
      // 过滤掉 schema 中 nodeType 值不等于 currentNodeType 的所有选项
      const currentSchemaData = jsonSchema.properties.label['x-component-props'].schemaData.filter(
        d => d[schemaTypeKey] === currentNodeType,
      );
      jsonSchema.properties.label['x-component-props'].schemaData.length = 0;
      jsonSchema.properties.label['x-component-props'].schemaData.push(...currentSchemaData);
    } catch (error) {
      console.log(error);
    }
  }

  const OPTIONS = React.useMemo(() => {
    if (!elements) {
      return [];
    }
    return Object.values(elements).map((c: any) => c.info);
  }, [elements]);

  const handleChangeElement = e => {
    const { value } = e.target;
    setState({
      elementId: value,
    });
    ref.current.elementId = value;
    const _config = ref.current.cacheConfigMap.get(value);

    onChange(_config, ref.current.elementId);
  };
  return (
    <>
      <div className="gi-assets-selector" style={{ position: 'absolute', right: '48px', top: '-34px' }}>
        <PopoverContainer
          title={$i18n.get({
            id: 'common-components.src.CommonStyleSetting.FormilyRenderForm.SelectElementAssets',
            dm: '选择元素资产',
          })}
          content={
            <Radio.Group value={elementId} onChange={handleChangeElement}>
              {OPTIONS.map(c => {
                const { id, name, cover } = c;
                return (
                  <Radio.Button
                    value={id}
                    key={id}
                    style={{
                      textAlign: 'center',
                      justifyContent: 'center',
                      padding: '8px 16px',
                      margin: '12px',
                      width: '90px',
                      height: '90px',
                    }}
                  >
                    <img
                      src={cover}
                      alt=""
                      style={{ display: 'block', margin: 'auto', width: '40px', height: '40px' }}
                    />
                    <Text ellipsis={{ tooltip: name }}>{name}</Text>
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          }
        >
          <Button type="text" icon={<BgColorsOutlined />} size="small"></Button>
        </PopoverContainer>
      </div>

      <FormProvider form={form}>
        <SchemaField schema={JSON.parse(JSON.stringify(jsonSchema))} />
      </FormProvider>
    </>
  );
};

export default RenderForm;
