import React, { useMemo } from 'react';
import { Popover, Button, Select, Form } from 'antd';
import { useContext, utils } from '@alipay/graphinsight';
import { IState } from './typing';
export interface FileRuleProps {
  children: React.FC;
}

export interface IFilterRuleContentProps {
  state: IState;
  updateState: any;
}

const options = [
  {
    value: 'All-Path',
    label: '所有路径',
  },
  {
    value: 'Shortest-Path',
    label: '最短路径',
  },
  {
    value: 'Customer-Rule',
    label: '自定义规则',
  },
];

const FilterRuleContent: React.FC<IFilterRuleContentProps> = props => {
  const { state, updateState } = props;
  const { filterRule } = state;
  const { data: graphData } = useContext();
  const { generatorSchemaByGraphData } = utils;
  const schemaData = useMemo(() => generatorSchemaByGraphData(graphData), [graphData]);
  const weightProperties = useMemo(() => {
    const edgeProperties = schemaData.edges.reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});
    return Object.keys(edgeProperties).filter(key => edgeProperties[key] === 'number');
  }, [schemaData]);

  const onRuleTypeChange = (value: string) => {
    updateState(draft => {
      draft.filterRule.type = value;
    });
  };

  const onWeightChange = (value: string) => {
    updateState(draft => {
      draft.filterRule.weightPropertyName = value;
    });
  };

  return (
    <div className="gi-filter-rule-container">
      <Form.Item label="过滤规则">
        <Select value={filterRule.type} options={options} style={{ width: '100%' }} onChange={onRuleTypeChange} />
      </Form.Item>
      {filterRule.type === 'Shortest-Path' && (
        <Form.Item label="权重属性">
          <Select value={filterRule.weightPropertyName} allowClear onChange={onWeightChange}>
            {weightProperties.map(prop => {
              return <Select.Option value={prop}>{prop}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      )}
    </div>
  );
};

export const FilterRule = props => {
  const { children, state, updateState } = props;
  return (
    <Popover
      trigger="click"
      title="过滤规则"
      placement="right"
      content={<FilterRuleContent state={state} updateState={updateState} />}
    >
      <Button type="primary">过滤路径</Button>
    </Popover>
  );
};

export default FilterRule;
