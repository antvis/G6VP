/**
 * author:shiwu.wyy@antgroup.com
 */
import { useContext } from '@antv/gi-sdk';
import { Form, Select, Spin } from 'antd';
import React, { useState } from 'react';
import { locale, MappingWay, PropertyContentProps } from './registerMeta';
import $i18n from '../i18n';

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
  } = useContext();
  const [loading, setLoading] = useState(false);
  return (
    <div className="algo-body algo-body-property">
      {/* 实体类型 */}

      {/* 关系属性重要性, 关系类型 */}

      {/* 属性 */}
      <span style={{ marginLeft: 8 }}>
        <Form.Item
          rules={[
            {
              required: visible,
              message: $i18n.get({
                id: 'gi-assets-algorithm.src.NodeImportance.propertyContent.CannotBeEmpty',
                dm: '不可为空',
              }),
            },
          ]}
          name={`${type}-property.property`}
          key={`${type}-property.property`}
          label={$i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.propertyContent.Properties', dm: '属性' })}
        >
          <Select
            placeholder={$i18n.get({
              id: 'gi-assets-algorithm.src.NodeImportance.propertyContent.PleaseSelect',
              dm: '请选择',
            })}
            dropdownMatchSelectWidth={false}
            notFoundContent={
              loading ? (
                <Spin />
              ) : (
                $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.propertyContent.NoData', dm: '无数据' })
              )
            }
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
        <span style={{ marginLeft: 8 }}>
          <Form.Item
            rules={[
              {
                required: visible,
                message: $i18n.get({
                  id: 'gi-assets-algorithm.src.NodeImportance.propertyContent.CannotBeEmpty',
                  dm: '不可为空',
                }),
              },
            ]}
            name={`${type}-property.calcway`}
            key={`${type}-property.calcway`}
            label={$i18n.get({
              id: 'gi-assets-algorithm.src.NodeImportance.propertyContent.CalculationMethod',
              dm: '计算方式',
            })}
          >
            <Select
              placeholder={$i18n.get({
                id: 'gi-assets-algorithm.src.NodeImportance.propertyContent.PleaseSelect',
                dm: '请选择',
              })}
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
      <span style={{ marginLeft: 8 }}>
        <Form.Item
          rules={[
            {
              required: visible,
              message: $i18n.get({
                id: 'gi-assets-algorithm.src.NodeImportance.propertyContent.CannotBeEmpty',
                dm: '不可为空',
              }),
            },
          ]}
          name={`${type}-property.mappingway`}
          key={`${type}-property.mappingway`}
          initialValue={MappingWay.Positive}
          label={$i18n.get({
            id: 'gi-assets-algorithm.src.NodeImportance.propertyContent.MappingMethod',
            dm: '映射方式',
          })}
        >
          <Select
            placeholder={$i18n.get({
              id: 'gi-assets-algorithm.src.NodeImportance.propertyContent.PleaseSelect',
              dm: '请选择',
            })}
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
