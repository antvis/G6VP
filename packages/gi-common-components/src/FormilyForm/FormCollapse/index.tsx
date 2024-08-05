// @ts-nocheck
import { CaretRightOutlined } from '@ant-design/icons';
import { Schema, SchemaKey } from '@formily/json-schema';
import { RecursionField, observer, useField, useFieldSchema } from '@formily/react';
import { markRaw, model } from '@formily/reactive';
import { toArr } from '@formily/shared';
import { Badge, Collapse } from 'antd';
import { isArray } from '@antv/util';
import { CollapsePanelProps, CollapseProps } from 'antd/lib/collapse';
import cls from 'classnames';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Icon } from '../../Icon';
import usePrefixCls from './usePrefixCls';

type ActiveKeys = string | number | Array<string | number>;

type ActiveKey = string | number;
export interface IFormCollapse {
  activeKeys: ActiveKeys;
  hasActiveKey(key: ActiveKey): boolean;
  setActiveKeys(key: ActiveKeys): void;
  addActiveKey(key: ActiveKey): void;
  removeActiveKey(key: ActiveKey): void;
  toggleActiveKey(key: ActiveKey): void;
}

export interface IFormCollapseProps extends CollapseProps {
  formCollapse?: IFormCollapse;
}

type ComposedFormCollapse = React.FC<React.PropsWithChildren<IFormCollapseProps>> & {
  CollapsePanel?: React.FC<React.PropsWithChildren<CollapsePanelProps>>;
  createFormCollapse?: (defaultActiveKeys?: ActiveKeys) => IFormCollapse;
};

const usePanels = () => {
  const collapseField = useField();
  const schema = useFieldSchema();
  const panels: { name: SchemaKey; props: any; schema: Schema }[] = [];
  schema.mapProperties((schema, name) => {
    const field = collapseField.query(collapseField.address.concat(name)).take();
    if (field?.display === 'none' || field?.display === 'hidden') return;
    if (schema['x-component']?.indexOf('CollapsePanel') > -1) {
      panels.push({
        name,
        props: {
          ...schema?.['x-component-props'],
          key: schema?.['x-component-props']?.key || name,
        },
        // @ts-ignore
        schema,
      });
    }
  });
  return panels;
};

const createFormCollapse = (defaultActiveKeys?: ActiveKeys) => {
  const formCollapse = model({
    activeKeys: defaultActiveKeys,
    setActiveKeys(keys: ActiveKeys) {
      formCollapse.activeKeys = keys;
    },
    hasActiveKey(key: ActiveKey) {
      if (Array.isArray(formCollapse.activeKeys)) {
        if (formCollapse.activeKeys.includes(key)) {
          return true;
        }
      } else if (formCollapse.activeKeys == key) {
        return true;
      }
      return false;
    },
    addActiveKey(key: ActiveKey) {
      if (formCollapse.hasActiveKey(key)) return;
      formCollapse.activeKeys = toArr(formCollapse.activeKeys).concat(key);
    },
    removeActiveKey(key: ActiveKey) {
      if (Array.isArray(formCollapse.activeKeys)) {
        formCollapse.activeKeys = formCollapse.activeKeys.filter(item => item != key);
      } else {
        formCollapse.activeKeys = '';
      }
    },
    toggleActiveKey(key: ActiveKey) {
      if (formCollapse.hasActiveKey(key)) {
        formCollapse.removeActiveKey(key);
      } else {
        formCollapse.addActiveKey(key);
      }
    },
  });
  return markRaw(formCollapse);
};

export const FormCollapse: ComposedFormCollapse = observer(({ formCollapse, ...props }) => {
  const field = useField();
  const panels = usePanels();
  const prefixCls = usePrefixCls('formily-collapse', props);
  const _formCollapse = useMemo(() => {
    return formCollapse ? formCollapse : createFormCollapse();
  }, []);
  const [activeKeys, setActiveKeys] = useState<ActiveKeys>([]);

  useEffect(() => {
    if (props.activeKey) setActiveKeys(isArray(props.activeKey) ? props.activeKey : [props.activeKey]);
  }, [props.activeKey]);
  useEffect(() => {
    if (_formCollapse?.activeKeys) setActiveKeys(_formCollapse?.activeKeys);
  }, [_formCollapse?.activeKeys]);
  useEffect(() => {
    if (props.accordion) setActiveKeys(panels[0]?.name);
  }, [props.accordion]);

  const badgedHeader = (key: SchemaKey, props: any) => {
    const errors = field.form.queryFeedbacks({
      type: 'error',
      address: `${field.address.concat(key)}.*`,
    });
    if (errors.length) {
      return (
        <Badge size="small" className="errors-badge" count={errors.length}>
          {props.header}
        </Badge>
      );
    }
    return props.header;
  };
  return (
    <Collapse
      {...props}
      className={cls(prefixCls, props.className)}
      activeKey={activeKeys}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      onChange={key => {
        setActiveKeys(key);
        props?.onChange?.(key);
        _formCollapse?.setActiveKeys?.(key);
      }}
    >
      {panels.map(({ props, schema, name }, index) => {
        const { icon } = props;
        let header = badgedHeader(name, props);
        if (icon) {
          header = (
            <span>
              <Icon type={icon} /> &nbsp; {header}
            </span>
          );
        }
        return (
          <Collapse.Panel key={index} {...props} header={header} forceRender>
            {/* @ts-ignore */}
            <RecursionField schema={schema} name={name} />
          </Collapse.Panel>
        );
      })}
    </Collapse>
  );
});

const CollapsePanel: React.FC<React.PropsWithChildren<CollapsePanelProps>> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

FormCollapse.CollapsePanel = CollapsePanel;
//@ts-ignore
FormCollapse.createFormCollapse = createFormCollapse;

export default FormCollapse;
