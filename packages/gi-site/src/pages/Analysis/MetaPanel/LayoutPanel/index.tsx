import { AssetCollapse, ColorInput, FormCollapse, Offset } from '@alipay/gi-common-components';
import { FormItem, Input, NumberPicker, Radio, Switch } from '@formily/antd';
import { createForm, onFormInputChange } from '@formily/core';
import { createSchemaField, FormProvider } from '@formily/react';
import { Collapse, Select } from 'antd';
import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import AssetsCenterHandler from '../../../../components/AssetsCenter/AssetsCenterHandler';
import AssetsSelect from '../../../../components/AssetsSelect';
import { useContext } from '../../hooks/useContext';

const defSpringLen = (_edge, source, target) => {
  /** 默认返回的是 200 的弹簧长度 */
  /** 如果你要想要产生聚类的效果，可以考虑
  根据边两边节点的度数来动态设置边的初始化长度：度数越小，则边越短 */
  const defaultSpring = 100;
  const Sdegree = source.data.layout.degree;
  const Tdegree = target.data.layout.degree;
  const MinDegree = Math.min(Sdegree, Tdegree);
  const MaxDegree = Math.max(Sdegree, Tdegree);

  let SpringLength = defaultSpring;
  if (MinDegree < 5) {
    SpringLength = defaultSpring * MinDegree;
  } else {
    SpringLength = 450;
  }
  return SpringLength;
};

interface NodeStylePanelProps {
  meta: any;
  data: any;
  layouts: any;
  config: any;
}

const { Panel } = Collapse;
const SchemaField = createSchemaField({
  components: {
    Radio,
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

const cache = {};

const verifyProps = props => {
  const defaultProps = { ...props };
  if (defaultProps.defSpringLen && typeof defaultProps.defSpringLen === 'string') {
    try {
      defaultProps.defSpringLen = eval(defaultProps.defSpringLen);
    } catch (error) {
      defaultProps.defSpringLen = defSpringLen;
    }
  }
  return defaultProps;
};

const getCacheValues = (object, layoutId) => {
  const { props } = object[layoutId];
  const layoutProps = verifyProps(props);
  const cacheLayout = cache[layoutId];
  console.log('layout', layoutProps, cacheLayout);

  if (!cacheLayout) {
    cache[layoutId] = { id: layoutId, props: layoutProps };
    return layoutProps;
  }
  return cacheLayout.props;
};

const LayoutPanel: React.FunctionComponent<NodeStylePanelProps> = props => {
  const { data, layouts, config = { layout: { props: {} } } } = props;
  const { updateContext } = useContext();
  const { layout: layoutConfig } = config;

  const [state, setState] = useState({
    /** 当前布局的ID */
    layoutId: layoutConfig.id,
  });

  const { layoutId } = state;

  /*** 当前元素物料 */
  const layout = layouts[layoutId] || layouts['GraphinForce'];

  const schema = {
    type: 'object',
    properties: {
      ...layout?.meta,
    },
  };

  const layoutProps = verifyProps({ ...layout.props, ...layoutConfig.props });

  /** 缓存数据 */
  cache[layoutId] = { id: layoutId, props: layoutProps };
  console.log('deafultProps', layoutProps, cache);

  const form = createForm({
    initialValues: layoutProps,
    effects() {
      onFormInputChange(({ values }) => {
        const layoutProps = verifyProps(values);
        cache[layoutId].props = layoutProps;
        updateContext(draft => {
          draft.config.layout.props = layoutProps;
        });
      });
    },
  });

  const handleChangeShape = value => {
    const values = getCacheValues(layouts, value);
    setState(preState => {
      return {
        ...preState,
        layoutId: value,
      };
    });
    updateContext(draft => {
      draft.config.layout = {
        id: value,
        props: values,
      };
    });
  };
  const layoutItems = Object.values(layouts) as any[];

  return (
    <div>
      <AssetsCenterHandler title="布局" id="layouts" />
      <AssetsSelect
        onChange={handleChangeShape}
        value={layoutId}
        options={layoutItems}
        className="gi-tour-layout-switch"
      />
      <div
        style={{
          margin: '8px',
          padding: '12px',
          borderRadius: '8px',
          boxShadow:
            '-1px -1px 4px 0 rgb(223 223 223 / 50%), -2px 2px 4px 0 rgb(244 244 244 / 50%), 2px 3px 8px 2px rgb(151 151 151 / 5%)',
        }}
      >
        <FormProvider form={form}>
          <SchemaField schema={JSON.parse(JSON.stringify(schema))} />
        </FormProvider>
      </div>
    </div>
  );
};

export default LayoutPanel;
