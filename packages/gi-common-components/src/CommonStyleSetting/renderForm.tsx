import { Select } from 'antd';
import FormRender, { useForm } from 'form-render';
import React, { useState } from 'react';
import IconSelector from './IconSelector';
const { Option } = Select;

interface RenderFormProps {
  schema: any;
  onChange: (all: any, elementId: string) => void;
  /** node assets */
  elements: {};
  /** node config */
  config: {
    id: string;
    props: {};
  };
}

const RenderForm: React.FunctionComponent<RenderFormProps> = props => {
  const { onChange, elements, config } = props;
  const form = useForm();
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

  const handleChange = all => {
    if (onChange) {
      ref.current.cacheConfigMap.set(ref.current.elementId, all);
      onChange(all, ref.current.elementId);
    }
  };

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
        <Select value={elementId} onChange={handleChangeElement}>
          {OPTIONS.map(c => {
            const { id, name } = c;
            return (
              <Option value={id} key={id}>
                {name}
              </Option>
            );
          })}
        </Select>
      </div>
      <hr />
      <FormRender
        widgets={{ iconSelector: IconSelector }}
        form={form}
        displayType="row"
        allCollapsed={true}
        schema={schema as any}
        onValuesChange={(_current, all) => handleChange(all)}
      />
    </>
  );
};

export default RenderForm;
