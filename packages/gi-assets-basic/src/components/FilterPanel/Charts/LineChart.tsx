import { Column } from '@antv/g2plot';
import { Select } from 'antd';
import * as React from 'react';
import { iconMap } from '../FilterSelection';
interface LineChartProps {
  source: any;
  filterCriteria: any;
  width: number;
  elementProps: Object;
}

const LineChart: React.FunctionComponent<LineChartProps> = props => {
  const PlotRef = React.useRef(null);
  const { source, filterCriteria, elementProps } = props;
  const [state, setState] = React.useState({
    yField: '',
  });
  const { elementType } = filterCriteria;
  const { yField } = state;

  React.useEffect(() => {
    const data = source[`${elementType}s`]
      .map(c => {
        return c.data;
      })
      .sort((a, b) => {
        if (a[filterCriteria.prop] < b[filterCriteria.prop]) {
          return -1;
        }
        return 1;
      });

    const line = new Column(PlotRef.current as any, {
      data: data,
      padding: 'auto',
      xField: filterCriteria.prop,
      yField: yField,
      // xAxis: {
      //   // type: 'timeCat',
      //   tickCount: 5,
      // },
      // smooth: true,
      slider: {},
    });

    line.render();
    return () => {
      line.destroy();
    };
  }, [yField]);
  const onSelectChange = val => {
    setState(pre => {
      return {
        ...pre,
        yField: val,
      };
    });
  };

  return (
    <div>
      <Select
        style={{ width: '80%' }}
        onChange={onSelectChange}
        className="gi-filter-panel-prop-select"
        placeholder={`选择${elementType}属性`}
      >
        {Object.entries(elementProps).map(e => {
          const [key, value] = e;
          //@ts-ignore
          const icon = iconMap[value];
          return (
            <Select.Option value={key}>
              {icon}
              {key}
            </Select.Option>
          );
        })}
      </Select>
      <div ref={PlotRef}></div>
    </div>
  );
};

export default LineChart;

var a = [
  {
    date_range: 181,
    first_trans_dt: '"2021-12-20 10:31:57"',
    latest_trans_dt: '"2022-06-18 13:41:51"',
    source: '"226610000637414189354"',
    target: '"1000077770000601425"',
    total_amt: 709830905.8,
    total_times: 379,
  },

  {
    date_range: 138,
    first_trans_dt: '"2021-12-21 10:50:59"',
    latest_trans_dt: '"2022-05-07 14:12:55"',
    source: '"1000077770000601425"',
    target: '"226610000637414189354"',
    total_amt: 133527952.92,
    total_times: 70,
  },
  {
    date_range: 179,
    first_trans_dt: '"2021-12-21 09:55:36"',
    latest_trans_dt: '"2022-06-17 15:33:43"',
    source: '"15000099607435"',
    target: '"226610000637414189354"',
    total_amt: 306115750,
    total_times: 108,
  },
];
