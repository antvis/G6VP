import { BarChartOutlined, FieldStringOutlined, LineChartOutlined, NumberOutlined } from '@ant-design/icons';
import { useContext, utils } from '@antv/gi-sdk';
import { Card, Select } from 'antd';
import React, { useMemo } from 'react';
import { useImmer } from 'use-immer';
import ColumnChart from './ColumnChart';
import LineChart from './LineChart';
const { highlightEdgeIds } = utils;

const iconMap = {
  boolean: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  string: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  number: <NumberOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
};

const chartOptions = [
  {
    value: 'lineChart',
    title: '折线图',
    label: <LineChartOutlined />,
  },
  {
    value: 'columnChart',
    title: '柱状图',
    label: <BarChartOutlined />,
  },
];

interface ChartCardProps {
  title: string;
  height: number | undefined;
  dataType: 'nodes' | 'edges';
  xField: string;
  yField: string;
  chartType: string;
}

interface IState {
  dataType: 'nodes' | 'edges';
  xField: string;
  yField: string;
  chartType: string;
}

const ChartCard: React.FC<ChartCardProps> = props => {
  const { schemaData, source, graph } = useContext();

  const [state, updateState] = useImmer<IState>({
    dataType: props.dataType || 'edges',
    xField: props.xField,
    yField: props.yField,
    chartType: props.chartType,
  });

  const { chartType, dataType, xField, yField } = state;

  const properties = useMemo(() => {
    //@ts-ignore
    return schemaData[dataType].reduce((acc, cur) => {
      return {
        ...acc,
        ...cur.properties,
      };
    }, {});
  }, [schemaData, dataType]);

  const data = useMemo(() => {
    const res = source[dataType].map(item => {
      return {
        ...item.data,
        id: item.id,
      };
    });

    try {
      const firstValue = res[0][xField];
      const isDate = isNaN(firstValue) && !isNaN(Date.parse(firstValue));
      if (isDate) {
        return res.sort((a, b) => {
          //@ts-ignore
          return new Date(a[xField]) - new Date(b[xField]);
        });
      }
      return res;
    } catch (error) {
      return res;
    }
  }, [source, dataType, xField]);

  const updateXField = (value: string) => {
    updateState(draft => {
      draft.xField = value;
    });
  };

  const updateYField = (value: string) => {
    updateState(draft => {
      draft.yField = value;
    });
  };

  const updateChartType = (value: string) => {
    updateState(draft => {
      draft.chartType = value;
    });
  };

  const highlight = ids => {
    if (dataType === 'edges') {
      highlightEdgeIds(graph, ids);
    }
  };
  const extra = (
    <>
      X轴：
      <Select
        placeholder="X轴字段"
        onChange={updateXField}
        size="small"
        style={{ width: '120px', marginRight: '12px' }}
        value={xField}
      >
        {Object.keys(properties).map(k => (
          <Select.Option value={k}>
            {iconMap[properties[k]]}
            {k}
          </Select.Option>
        ))}
      </Select>
      Y轴：
      <Select placeholder="Y轴字段" onChange={updateYField} size="small" style={{ width: '120px' }} value={yField}>
        {Object.keys(properties).map(k => (
          <Select.Option value={k}>
            {iconMap[properties[k]]}
            {k}
          </Select.Option>
        ))}
      </Select>
      <Select size="small" value={chartType} style={{ width: '120px', marginLeft: '10px' }} onChange={updateChartType}>
        {chartOptions.map(option => (
          <Select.Option value={option.value}>
            {option.title}
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </>
  );

  return (
    <div>
      <Card title={props.title} extra={extra} bodyStyle={{ padding: '12px 24px 0px 24px' }}>
        {chartType === 'lineChart' && (
          <LineChart xField={xField} yField={yField} data={data} highlight={highlight} height={props.height} />
        )}
        {chartType === 'columnChart' && (
          <ColumnChart xField={xField} yField={yField} data={data} highlight={highlight} height={props.height} />
        )}
      </Card>
    </div>
  );
};

export default ChartCard;
