import { BarChartOutlined, LineChartOutlined } from '@ant-design/icons';
import { Card, Select } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import ColumnChart from './Charts/ColumnChart';
import LineChart from './Charts/LineChart';

const chartOptions = [
  {
    value: 'lineChart',
    label: <LineChartOutlined />,
  },
  {
    value: 'columnChart',
    label: <BarChartOutlined />,
  },
];

interface ChartCardProps {
  statisticProp: string;
  data: any;
}

interface IState {
  xField: string;
  yField: string;
  chartType: string;
}

const ChartCard: React.FC<ChartCardProps> = props => {
  const { statisticProp, data } = props;

  const xFieldOptions = React.useMemo(() => {
    if (!statisticProp) {
      return [];
    }
    const element = data[statisticProp][0];
    if (typeof element !== 'object') {
      return [];
    }

    return Object.keys(element);
  }, [statisticProp, data]);

  const yFieldOptions = React.useMemo(() => {
    if (!statisticProp) {
      return [];
    }
    const element = data[statisticProp][0];
    if (typeof element !== 'object') {
      return [];
    }

    return Object.keys(element);
  }, [statisticProp, data]);

  const [state, updateState] = useImmer<IState>({
    xField: xFieldOptions[0],
    yField: yFieldOptions[0],
    chartType: 'lineChart',
  });

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

  const extra = (
    <>
      <Select placeholder="X轴字段" onChange={updateXField} style={{ width: '80px' }} value={state.xField}>
        {xFieldOptions.map(x => (
          <Select.Option value={x}>{x}</Select.Option>
        ))}
      </Select>
      <Select
        placeholder="Y轴字段"
        onChange={updateYField}
        style={{ width: '80px', marginLeft: '10px' }}
        value={state.yField}
      >
        {yFieldOptions.map(y => (
          <Select.Option value={y}>{y}</Select.Option>
        ))}
      </Select>
      <Select value={state.chartType} style={{ marginLeft: '10px' }} onChange={updateChartType}>
        {chartOptions.map(option => (
          <Select.Option value={option.value}>{option.label}</Select.Option>
        ))}
      </Select>
    </>
  );

  return (
    <div>
      <Card title={statisticProp} extra={extra} style={{marginBottom: "20px",  boxShadow: "0 0 2px rgba(0, 0, 0, 0.1)"}}>
        {state.chartType === 'lineChart' && (
          <LineChart xField={state.xField} yField={state.yField} data={data[statisticProp]} />
        )}
        {state.chartType === 'columnChart' && (
        <ColumnChart xField={state.xField} yField={state.yField} data={data[statisticProp]} />
      )}
      </Card>
    </div>
  );
};

export default ChartCard;
