import React, { ReactNode, useEffect, useState } from 'react';
import { Form, Select, Drawer, Tooltip, Button } from 'antd';
import FormattedMessage, { formatMessage } from './locale';
import StyleConfigPropertyItem from './StyleConfigPropertyItem';
import { SPLITOR } from './registerMeta';
import Util from '../utils';

const { Option } = Select;
const { createUuid } = Util;

interface Props {
  type: 'node' | 'edge',
  itemData: any,
  id: string,
  visible: boolean,
  nodeProperties: object;
  edgeProperties: object;
  nodeTypes: TypeInfo[];
  edgeTypes: TypeInfo[];
  saveItem: (type: 'node' | 'edge', data: any) => void;
  onClose: () => void,
}

type PropertyCondition = {
  id: string,
  color: string,
  visible: boolean,
}
type Rule = {
  name?: string,
  key?: string,
  rule?: '>' | '>=' | '<=' | '<' | '=' | '!=' | 'like' | 'unlike',
  value?: string | number
}
type DataItem = {
  id: string,
  data: object,
  rules: Rule[],
  nodeType?: string,
  edgeType?: string,
  sourceNodeType?: string,
  targetNodeType?: string
}
export type TypeInfo = {
  key: string,
  content: ReactNode,
  text?: string,
  typeName?: string,
  sourceNodeType?: string,
  targetNodeType?: string,
}

const EditDrawer: React.FC<Props> = ({
  type,
  itemData,
  visible,
  nodeProperties,
  edgeProperties,
  nodeTypes,
  edgeTypes,
  saveItem,
  onClose,
}) => {

  const [form] = Form.useForm();
  const { getFieldsValue, setFieldsValue, validateFields, resetFields } = form;

  const [source, setSource] = useState();
  const [target, setTarget] = useState();
  const [selectedNodeType, setSelectedNodeType] = useState();
  const [relatedEdgeTypes, setRelatedEdgeTypes] = useState([] as TypeInfo[]);
  const [addedProperties, setAddedProperties] = useState([] as PropertyCondition[]);
  const [properties, setProperties] = useState([] as string[]);
  const [selectedEdgeType, setSelectedEdgeType] = useState();

  const onSelectNodeType = (key, endType) => {
    switch (endType) {
      case 'source': 
        setSource(key);
        form.setFieldsValue({
          [`edge.edgeType`]: null,
        });
        break;
      case 'target':
        setTarget(key);
        form.setFieldsValue({
          [`edge.edgeType`]: null,
        });
        break;
      case 'node': {
        setSelectedNodeType(key);
        break;
      }
      default:
        break;
    }
    setAddedProperties([]);
  }

  const onSelectEdgeType = (edgeType) => {
    setProperties(Array.from(edgeProperties[edgeType]));
    setSelectedEdgeType(edgeType);
  }

  const addPropertyItem = (propertyId: string | undefined = undefined) => {
    setAddedProperties(oldAddedProperties => {
      const previousAddedProperties = [...oldAddedProperties];
      let color;
      previousAddedProperties.forEach(item => {
        if (item.color) {
          color = item.color;
        }
      });
      color = color === '#2E71D6' ? '#D97825' : '#2E71D6';
      const uniqueId = propertyId || createUuid();
      previousAddedProperties.push({
        id: `${uniqueId}${SPLITOR}${type}${SPLITOR}${itemData.id}`,
        color,
        visible: true,
      });
      return previousAddedProperties;
    });
  };
  const deleteProperty = pid => {
    const previousAddedProperties = [...addedProperties];
    previousAddedProperties.forEach((property, i) => {
      if (property.id === pid) {
        previousAddedProperties.splice(i, 1);
      }
    });
    const values = getFieldsValue();
    delete values[`${pid}${SPLITOR}name`];
    delete values[`${pid}${SPLITOR}value`];
    delete values[`${pid}${SPLITOR}operator`];
    delete values[`${pid}${SPLITOR}color`];
    setFieldsValue({ ...values });
    setAddedProperties(previousAddedProperties);
  };

  const cancelEdit = () => {
    setAddedProperties([]);
    setSource(undefined);
    setTarget(undefined);
    setSelectedNodeType(undefined);
    setSelectedEdgeType(undefined);
    onClose();
  }

  const confirmEdit = () => {
    const values = getFieldsValue();
    validateFields().then(_ => {
      const item: DataItem = {
        id: itemData.id,
        data: {},
        rules: [],
      };
      const rulesMap: { [ruleId: string]: Rule } = {};

      if (values) {
        Object.keys(values).forEach(key => {
          const value = key === 'node.nodeType' ? selectedNodeType : values[key];
          if (value === undefined) return;
          if (type === 'node' && key === 'node.nodeType') {
            item.nodeType = value;
          } else if (type === 'edge' && key === 'edge.edgeType') {
            item.edgeType = value.split(SPLITOR)[1];
          } else if (type === 'edge') {
            if (key === 'edge.sourceNodeType') {
              item.sourceNodeType = value;
            } else if (key === 'edge.targetNodeType') {
              item.targetNodeType = value;
            }
          }
          if (key.split(SPLITOR).length === 4) {
            const [ruleId, type, dataId,  field] = key.split(SPLITOR);
            
            if (!rulesMap[ruleId]) rulesMap[ruleId] = {};
            switch (field) {
              case 'name':
                rulesMap[ruleId].name = value;
                rulesMap[ruleId].key = value;
                break;
              case 'operator':
                rulesMap[ruleId].rule = value;
                break;
              case 'value':
                rulesMap[ruleId].value = value;
                break;
              default: 
                break;
            }
          }
        });
      }
      Object.values(rulesMap).forEach(value => {
        item.rules.push(value);
      });
      saveItem?.(type, item);
    });
    // 清空面板内容
    cancelEdit();
  }

  const init = () => {
    setSelectedEdgeType(type === 'edge' ? itemData?.edgeType : undefined);
    setSelectedNodeType(type === 'node' ? itemData?.nodeType : undefined);
    resetFields();
  }

  useEffect(() => {
    setSelectedEdgeType(undefined);
    const sourceType = source || itemData?.sourceNodeType;
    const targetType = target || itemData?.targetNodeType;
    if (sourceType && targetType) {
      // 设置边选择器选项
      const relatedETypes: TypeInfo[] = [];
      edgeTypes.forEach(edgeType => {
        const { sourceNodeType, targetNodeType } = edgeType;
        // 筛选出与选定的节点类型相关的边类型
        if (sourceNodeType === sourceType && targetNodeType === targetType) {
          relatedETypes.push(edgeType);
        }
      });
      setRelatedEdgeTypes(relatedETypes);
    } else {
      setRelatedEdgeTypes([]);
    }
  }, [source, target, itemData?.id]);

  useEffect(() => {
    if (itemData?.sourceNodeType) {
      setSource(itemData?.sourceNodeType);
    }
    if (itemData?.targetNodeType) {
      setTarget(itemData?.targetNodeType);
    }

    setAddedProperties([]);

    // rules 回填
    if (itemData?.rules) {
      itemData?.rules?.forEach(rule => {
        const propertyId = createUuid();
        const pid = `${propertyId}${SPLITOR}${type}${SPLITOR}${itemData.id}`;
        setTimeout(() =>{
          setFieldsValue({
            [`${pid}${SPLITOR}name`]: rule.name,
            [`${pid}${SPLITOR}operator`]: rule.rule,
            [`${pid}${SPLITOR}value`]: rule.value,
          });
        }, 0);
        addPropertyItem(propertyId);
      });
    }
  }, [itemData?.data, itemData?.rules]);

  // 元素变化，清空面板内容
  useEffect(() => {
    init();
  }, [itemData?.id]);

  // 选中的节点类型发生变化，则 properties 变化
  useEffect(() => {
    if (!selectedNodeType) {
      return;
    }
    setProperties(Array.from(nodeProperties[selectedNodeType]));
  }, [selectedNodeType])

  const edgeSelectorEnabled = relatedEdgeTypes && relatedEdgeTypes?.length;
  const edgeSelector = 
    <Form.Item 
      rules={[{ required: true, message: formatMessage({ id: 'not-empty' }) }]}
      name="edge.edgeType"
      key="edge.edgeType"
    >
      <Select
        showSearch
        placeholder={<FormattedMessage id="please-select" />}
        style={{ width: 316, marginTop: 8 }}
        onSelect={onSelectEdgeType}
        dropdownMatchSelectWidth={false}
        disabled={!edgeSelectorEnabled}
        defaultValue={itemData?.edgeType ? `${itemData?.sourceNodeType}_${itemData?.edgeType}_${itemData?.targetNodeType}` : undefined}
      >
        {relatedEdgeTypes?.map(edgeType => {
          return (
            <Option value={edgeType.key} key={edgeType.key}>
              {edgeType.content}
            </Option>
          );
        })}
      </Select>
    </Form.Item>;

  const propertySelectorEnabled = type === 'edge' ?
    relatedEdgeTypes?.length && (selectedEdgeType || itemData?.edgeType) :
    (!!selectedNodeType || itemData?.edgeType); 

  const propertySelector = <div>
    {addedProperties?.map((property: any) => (
      <StyleConfigPropertyItem
        pid={property.id}
        properties={properties}
        deleteItem={deleteProperty}
        color={property?.color}
        visible={property?.visible}
        form={form}
        disabled={!propertySelectorEnabled}
        configColor={false}
      />
    ))}
    {addedProperties?.filter((property: any) => property.visible)?.length < 2 && (
      <Button
        className="kg-style-config-add-property-button"
        type="dashed"
        onClick={() => {
          addPropertyItem();
        }}
        disabled={!propertySelectorEnabled}
      >
        <FormattedMessage id="add-property" />
      </Button>
    )}
  </div>



  const getPropertySelector = itemType => (<>
    <FormattedMessage id='property-condition' /> &nbsp;&nbsp;
    <span className="kg-pattern-match-tip"><FormattedMessage id='optional' /></span>
    <br />
    {propertySelectorEnabled ?
      propertySelector :
      <Tooltip title={
        ((type === 'edge' && relatedEdgeTypes?.length && selectedEdgeType) ||
        (itemType === 'node' && nodeTypes?.length && selectedNodeType)) ?
        '' :
        <FormattedMessage id={`select-${itemType}-before-property`}/>} >
        {propertySelector}
      </Tooltip>
    }
    </>);

  const getEndTypeSelector = endType => (<>
    <FormattedMessage id={endType} />
    {itemData?.[`${endType}NodeType`] ?
      <span> : {nodeTypes.find(nodeType => nodeType.key === itemData?.[`${endType}NodeType`])?.content || itemData?.[`${endType}NodeType`]} <br /><br /></span> :
      <Form.Item 
        rules={[{ required: true, message: formatMessage({ id: 'not-empty' }) }]}
        name={`edge.${endType}NodeType`}
        key={`edge.${endType}NodeType`}
      >
        <Select
          showSearch
          placeholder={<FormattedMessage id="please-select" />}
          style={{ width: 316, marginTop: 8 }}
          onSelect={key => onSelectNodeType(key, endType)}
          dropdownMatchSelectWidth={false}
        >
          {nodeTypes.map(nodeType => <Option value={nodeType.key} key={nodeType.key}>{nodeType.content}</Option>)}
        </Select>
      </Form.Item>
    }
  </>)


  const edgeEditor = <Form form={form} name="edge">
    {/* 边起点类型 */}
    {getEndTypeSelector('source')}

    {/* 边终点类型 */}
    {getEndTypeSelector('target')}

    {/* 边类型 */}
    <FormattedMessage id='relation-type' />
    <br />
    {edgeSelectorEnabled ?
      edgeSelector :
      <Tooltip title={!relatedEdgeTypes ? <FormattedMessage id="select-node-before-edge"/> : <FormattedMessage id="no-edge-type-for-nodes"/>} >
        {edgeSelector}
      </Tooltip>
    }

    {/* 属性条件 */}
    {getPropertySelector('edge')}
  </Form>
  
  const nodeEditor = <Form form={form} name="node">
    {/* 节点类型 */}
    <FormattedMessage id='entity-type' />
    <Form.Item 
      rules={[{ required: true, message: formatMessage({ id: 'not-empty' }) }]}
      name="node.nodeType"
      key="node.nodeType"
    >
      <Select
        showSearch
        placeholder={<FormattedMessage id="please-select" />}
        style={{ width: 316, marginTop: 8 }}
        onSelect={key => onSelectNodeType(key, 'node')}
        dropdownMatchSelectWidth={false}
        defaultValue={itemData?.nodeType}
      >
        {nodeTypes.map((nodeType: any) => <Option value={nodeType.key} key={nodeType.key}>{nodeType.content}</Option>)}
      </Select>
    </Form.Item>

    {/* 属性条件 */}
    {getPropertySelector('node')}
  </Form>

  let drawerContent = type === 'edge' ? edgeEditor : nodeEditor;
  let drawerTitle = type === 'edge' ? '编辑边' : '编辑点';
  if (!itemData) {
    drawerContent = <></>;
    drawerTitle = '';
  }

  const confirmDisabled = type === 'edge' && !selectedEdgeType && !itemData?.edgeType;

  return <Drawer
    title={drawerTitle}
    visible={visible}
    width={364}
    closable={true}
    onClose={cancelEdit}
    mask={false}
    style={{ textAlign: 'left' }}
    footerStyle={{ textAlign: 'right' }}
    getContainer={false}
    footer={
      <>
        <Button onClick={cancelEdit}><FormattedMessage id="cancel"/></Button>
        <Tooltip title={confirmDisabled ? '关系类型不可为空' : ''} placement="topRight">
          <Button
            type='primary'
            style={{ marginLeft: '8px' }}
            onClick={confirmEdit}
            disabled={confirmDisabled}
          ><FormattedMessage id="confirm"/></Button>
        </Tooltip>
      </>
    }
  >
    {drawerContent}
  </Drawer>
}
export default EditDrawer;