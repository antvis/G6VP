import { Select as AntdSelect } from 'antd';
import { createForm, onFormInputChange } from '@formily/core'
import { FormProvider, createSchemaField } from '@formily/react'
import { FormItem, Input, FormCollapse, Select, NumberPicker, Switch } from '@formily/antd'
import React, { useState } from 'react';
import ColorInput from './ColorInput'
import { SketchPicker } from 'react-color'
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
    IconSelector
  }
})
const RenderForm: React.FunctionComponent<RenderFormProps> = props => {
  const { onChange, elements, config } = props;
  const form = createForm({
    effects() {
      onFormInputChange(({ values }) => {
        const currentValues = JSON.parse(JSON.stringify(values))
        console.log('xxx', currentValues)
        if (onChange && currentValues.advanced) {
          ref.current.cacheConfigMap.set(ref.current.elementId, currentValues);
          onChange(currentValues, ref.current.elementId);
        }
      })
    }
  })
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
      <div>
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
      </div>
      <hr />
      <FormProvider form={form}>
        <SchemaField schema={schema} />
      </FormProvider>
    </>
  );
};

export default RenderForm;
