import { Column } from '@antv/g2plot';
import { Select } from 'antd';
import * as React from 'react';
import { iconMap } from '../FilterSelection';
interface LineChartProps {
  source: any;
  filterCriter: any;
  width: number;
  elementProps: Object;
}

const LineChart: React.FunctionComponent<LineChartProps> = props => {
  const PlotRef = React.useRef(null);
  const { source, filterCriter, elementProps } = props;
  const [state, setState] = React.useState({
    yField: '',
  });
  const { elementType } = filterCriter;
  const { yField } = state;

  React.useEffect(() => {
    const data = source[`${elementType}s`].map(c => {
      return c.data;
    });
    console.log('PlotRef', data);

    const line = new Column(PlotRef.current as any, {
      data: data,
      padding: 'auto',
      xField: filterCriter.prop,
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
    console.log('val', val);
    setState(pre => {
      return {
        ...pre,
        yField: val,
      };
    });
  };

  console.log('line chart', elementProps, props);
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
