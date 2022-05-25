/**
 * author:shiwu.wyy@antgroup.com
 */
import { GraphinContext } from '@antv/graphin';
import { Form, Select, Spin } from 'antd';
import React, { useContext, useState } from 'react';
import { locale, MappingWay, PropertyContentProps } from './registerMeta';

const { Option } = Select;

const PropertyContent: React.FC<PropertyContentProps> = ({
  type,
  visible,
  form,
  properties, // fetchSchemaProperties
}) => {
  const {
    // schemaNodeLocale,
    // schemaEdgeLocale,
    // dataTypeMap: { edgeTypeMap = {} },
    // schemaData
  } = useContext(GraphinContext);

  const [loading, setLoading] = useState(false);

  const width = type === 'node' ? 285 : 195;

  return (
    <div className="algo-body algo-body-property" style={{ display: visible ? 'inline-flex' : 'none' }}>
      {/* 实体类型 */}

      {/* 关系属性重要性, 关系类型 */}

      {/* 属性 */}
      <span style={{ width, marginLeft: 8 }}>
        属性
        <br />
        <Form.Item
          rules={[{ required: visible, message: '不可为空' }]}
          name={`${type}-property.property`}
          key={`${type}-property.property`}
        >
          <Select
            placeholder={'请选择'}
            style={{ width, marginTop: 8 }}
            dropdownMatchSelectWidth={false}
            notFoundContent={loading ? <Spin /> : '无数据'}
          >
            {properties?.map?.(property => {
              return (
                <Option value={property} key={property}>
                  {property}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </span>

      {/* 计算方式 */}
      {type === 'edge' && (
        <span style={{ width: 162, marginLeft: 8 }}>
          计算方式
          <br />
          <Form.Item
            rules={[{ required: visible, message: '不可为空' }]}
            name={`${type}-property.calcway`}
            key={`${type}-property.calcway`}
          >
            <Select
              placeholder={'请选择'}
              style={{ width: 162, marginTop: 8 }}
              dropdownMatchSelectWidth={false}
              dropdownClassName="calc"
              //@ts-ignore
              getPopupContainer={() => document.getElementById('select-drop-down-area')}
            >
              <Option value={'sort'} key={'sort'}>
                {locale['sort']}
                <br />
                <p className="calc-tip">{locale['sort-tip']}</p>
              </Option>
              <Option value={'count'} key={'count'}>
                {locale['count']}
                <br />
                <p className="calc-tip">{locale['count-tip']}</p>
              </Option>
            </Select>
          </Form.Item>
        </span>
      )}
      {/* 映射方式 */}
      <span style={{ width: 92, marginLeft: 8 }}>
        映射方式
        <br />
        <Form.Item
          rules={[{ required: visible, message: '不可为空' }]}
          name={`${type}-property.mappingway`}
          key={`${type}-property.mappingway`}
          initialValue={MappingWay.Positive}
        >
          <Select
            placeholder={'请选择'}
            style={{ width: 92, marginTop: 8 }}
            dropdownMatchSelectWidth={false}
            dropdownClassName="mapping"
            //@ts-ignore
            getPopupContainer={() => document.getElementById('select-drop-down-area')}
          >
            <Option value={MappingWay.Positive} key={MappingWay.Positive}>
              {locale['positive-correlation']}
              <br />
              <p className="mapping-tip">{locale['positive-tip']}</p>
            </Option>
            <Option value={MappingWay.Negative} key={MappingWay.Negative}>
              {locale['negative-correlation']}
              <br />
              <p className="mapping-tip">{locale['negative-tip']}</p>
            </Option>
          </Select>
        </Form.Item>
      </span>
    </div>
  );
};

export default PropertyContent;
