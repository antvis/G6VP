import React, { useCallback } from 'react';
import { Row, Col, Select, Input, Form } from 'antd';
import Util from '../utils';
import { formatMessage } from './locale';
import { SPLITOR } from './registerMeta';
import { useEffect } from 'react';
import './index.less';

const { Option } = Select;
const { debounce } = Util;

interface Props {
  color?: string;
  pid: string;
  properties: string[];
  visible: boolean;
  form: any;
  disabled: boolean;
  configColor?: boolean;
  deleteItem: (pid: string) => void;
  openColorPanel?: (e: any, pid: string) => void;
  emitPropertyConfigChange?: (values: object) => void;
}

const StyleConfigPropertyItem: React.FC<Props> = ({
  color,
  pid,
  properties,
  visible,
  form,
  disabled,
  configColor = true,
  deleteItem,
  openColorPanel = () => {},
  emitPropertyConfigChange = () => {}
}) => {

  const operators = ['>', '>=', '<=', '<', '=', '!=', 'like', 'unlike'];

  const onFromChange = () => {
    const fieldValues = form.getFieldsValue();

    const validValues = Object.keys(fieldValues).filter(key => {
      const value = fieldValues?.[key];
      return key.split(SPLITOR)?.[0] === pid.split(SPLITOR)?.[0] && !!value;
    })
    if (validValues?.length >= 3) {
      emitPropertyConfigChange(fieldValues)
    }
  }

  const debounceChange = useCallback(
    debounce(onFromChange, 500), []
  )

  useEffect(() => {
    form.setFieldsValue({
      [`${pid}${SPLITOR}color`]: color
    });
  }, []);

  return properties && visible ? (<Row
    className="kg-style-config-property-item"
    key={pid}
    style={configColor ? {} : { width: '100%'}}
  >
    <Col span={8}>
      <Form.Item
        rules={[{ required: true, message: formatMessage({ id: 'not-empty' }) }]}
        name={`${pid}${SPLITOR}name`}
      >
        <Select
          className="kg-style-config-property-select"
          size='small'
          placeholder={formatMessage({ id: 'select-property' })}
          onChange={onFromChange}
          disabled={disabled}
        >
          {properties.map(pKey => <Option value={pKey} key={pKey}>{pKey}</Option>)}
        </Select>
      </Form.Item>
    </Col>
    <Col span={configColor ? 5 : 6} offset={1}>
      <Form.Item
        rules={[{ required: true, message: formatMessage({ id: 'not-empty' }) }]}
        name={`${pid}${SPLITOR}operator`}
      >
        <Select
          className="kg-style-config-property-select"
          size='small'
          onChange={onFromChange}
          dropdownMatchSelectWidth={false}
          disabled={disabled}
        >
          {operators.map(operator => <Option value={operator} key={operator}>{operator}</Option>)}
        </Select>
      </Form.Item>
    </Col>
    <Col span={configColor ? 5 : 6} offset={1}>
      <Form.Item
        rules={[{ required: true, message: formatMessage({ id: 'not-empty' }) }]}
        name={`${pid}${SPLITOR}value`}
      >
        <Input
          style={{ width: '100%', height: '24px' }}
          placeholder={formatMessage({ id: 'enter-property-value' })}
          onChange={debounceChange}
          disabled={disabled}
        />
      </Form.Item>
    </Col>
    {configColor && <Col span={2} offset={1}>
      {color ? 
        <div
          className="kg-style-config-property-item-color"
          style={{ backgroundColor: color }}
          onClick={(e) => !disabled ? openColorPanel?.(e, pid) : {}}
        ></div> :
        <i className="icon-ic_opacity iconfont kg-style-config-property-item-no-color" onClick={(e) => openColorPanel(e, pid)} />
      }
    </Col>}
    <Col span={1} offset={configColor ? 0 : 1}>
      <i className="icon-delete iconfont kg-style-config-property-item-delete" onClick={() => deleteItem(pid)} />
    </Col>
  </Row>) : <div key={pid}></div>
};

export default StyleConfigPropertyItem;
