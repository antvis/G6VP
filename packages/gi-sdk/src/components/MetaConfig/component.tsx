import { FormProvider, Icon, SchemaField, createForm, onFormInputChange } from '@antv/gi-common-components';
import { Button, Popover } from 'antd';
import * as React from 'react';
import { useContext } from '../../Context';
import { getComponentsByAssets } from '../../process/getComponentsByAssets';

export interface MetaProps {
  item: any;
  handleChange: (id: string, values: any) => void;
}

const Meta: React.FunctionComponent<MetaProps> = props => {
  const { item, handleChange } = props;
  const { id, props: defaultValue, meta } = item;

  //@ts-ignore

  const schema = {
    type: 'object',
    properties: {
      ...meta,
    },
  };

  const form = createForm({
    initialValues: defaultValue,
    effects() {
      onFormInputChange(({ values }) => {
        handleChange(id, values);
      });
    },
  });

  return (
    <div className="gi-asset-config-panel-content">
      <FormProvider form={form}>
        {/** @ts-ignore */}
        <SchemaField schema={JSON.parse(JSON.stringify(schema))} />
      </FormProvider>
    </div>
  );
};

const MetaConfig = props => {
  const { activeIds = [] } = props;

  const { updateContext, context, services, assets } = useContext();
  const { components, data, schemaData } = context;
  //@ts-ignore
  const activeComponentAssets = Object.values(assets.components).filter(item => {
    return activeIds.indexOf(item.info.id) !== -1;
  });
  const items = getComponentsByAssets(
    //@ts-ignore
    activeComponentAssets,
    data,
    services,
    //@ts-ignore
    {},
    schemaData,
    'GI',
  ).map(item => {
    if (!item) {
      return null;
    }
    const match = components.find(c => c.id === item.id) || {};
    return {
      ...item,
      props: {
        ...item.props,
        //@ts-ignore
        ...match.props,
      },
    };
  });

  const handleChange = (id, values) => {
    updateContext(draft => {
      draft.components.forEach(item => {
        if (item.id === id) {
          item.props = JSON.parse(JSON.stringify(values));
        }
      });
    });
  };
  const content = items.map(item => {
    return (
      <div key={item?.id}>
        <Meta handleChange={handleChange} item={item} />
      </div>
    );
  });
  return (
    <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
      <Popover placement="topLeft" title={'修改配置'} content={content} trigger="click">
        <Button shape="circle" type="primary" size="large" icon={<Icon type="icon-setting" />}></Button>
      </Popover>
    </div>
  );
};

export default MetaConfig;
