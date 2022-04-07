import { BgColorsOutlined } from '@ant-design/icons';
import { FormCollapse, FormItem, Input, NumberPicker, Select, Switch } from '@formily/antd';
import { createForm, onFormInputChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Button, Select as AntdSelect } from 'antd';
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import PopoverContainer from '../GroupContainer/PopoverContainer';
import ColorInput from './ColorInput';
import IconSelector from './IconSelector';
const { Option } = AntdSelect;

interface RenderFormProps {
  onChange: (all: any, elementId: string) => void;
  /** node assets */
  elements: {};
  /** node config */
  config: {
    id: string;
    props: {};
  };
}

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
    IconSelector,
  },
});
const RenderForm: React.FunctionComponent<RenderFormProps> = props => {
  const { onChange, elements, config } = props;
  const form = createForm({
    initialValues: elements[config.id].props,
    effects() {
      onFormInputChange(({ values }) => {
        const currentValues = JSON.parse(JSON.stringify(values));
        console.log('xxx', currentValues);
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

  const OPTIONS = React.useMemo(() => {
    if (!elements) {
      return [];
    }
    return Object.values(elements).map((c: any) => c.info);
  }, [elements]);

  const handleChangeElement = value => {
    setState({
      elementId: value,
    });
    ref.current.elementId = value;
    const _config = ref.current.cacheConfigMap.get(value);

    onChange(_config, ref.current.elementId);
  };

  return (
    <>
      <div className="gi-assets-selector" style={{ position: 'absolute', right: '40px', top: '-37px' }}>
        <PopoverContainer
          title="选择元素资产"
          content={
            <AntdSelect value={elementId} onChange={handleChangeElement}>
              {OPTIONS.map(c => {
                const { id, name } = c;
                return (
                  <Option value={id} key={id}>
                    {name}
                  </Option>
                );
              })}
            </AntdSelect>
          }
        >
          <Button type="text" icon={<BgColorsOutlined />} size="small"></Button>
        </PopoverContainer>
      </div>

      <FormProvider form={form}>
        <SchemaField schema={JSON.parse(JSON.stringify(schema))} />
      </FormProvider>
    </>
  );
};

export default RenderForm;
