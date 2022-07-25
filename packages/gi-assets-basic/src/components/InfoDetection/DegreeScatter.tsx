import { Scatter, G2 } from '@antv/g2plot';
import { Card, Select } from 'antd';
import React from 'react';
import { IDegreeState } from './type';

interface DegreeScatterProps {
  degree: IDegreeState;
}

const options = [
  {
    label: '总度数',
    value: 'totalDegree',
  },
  {
    label: '出度',
    value: 'outDegree',
  },
  {
    label: '入度',
    value: 'inDegree',
  },
];

const DegreeScatter: React.FC<DegreeScatterProps> = props => {
  const { degree } = props;
  const [current, setCurrent] = React.useState<string>('totalDegree');

  // React.useEffect(() => {
  //   G2.registerInteraction('other-visible', {
  //       showEnable: [
  //         { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
  //         { trigger: 'mask:mouseenter', action: 'cursor:move' },
  //         { trigger: 'plot:mouseleave', action: 'cursor:default' },
  //         { trigger: 'mask:mouseleave', action: 'cursor:crosshair' },
  //       ],
  //       start: [
  //         {
  //           trigger: 'plot:mousedown', isEnable(context) {
  //             return !context.isInShape('mask');
  //           }, action: ['rect-mask:start', 'rect-mask:show']
  //         },
  //         { trigger: 'mask:dragstart', action: 'rect-mask:moveStart' }
  //       ],
  //       processing: [
  //         { trigger: 'plot:mousemove', action: 'rect-mask:resize' },
  //         {
  //           trigger: 'mask:drag', isEnable(context) {
  //             return context.isInPlot();
  //           }, action: 'rect-mask:move'
  //         },
  //         { trigger: 'mask:change', action: 'element-sibling-filter:filter' }
  //       ],
  //       end: [
  //         { trigger: 'plot:mouseup', action: 'rect-mask:end' },
  //         { trigger: 'mask:dragend', action: 'rect-mask:moveEnd' }
  //       ],
  //       rollback: [
  //         { trigger: 'dblclick', action: ['rect-mask:hide', 'element-sibling-filter:reset'] }
  //       ]
  //     });
  // }, [])

  React.useEffect(() => {
    const data = [...degree[current].entries()].map(item => {
      const [value, count] = item;
      return {
        value,
        count,
      };
    });
    const scatterPlot = new Scatter('gi-info-detection-degree-scatter', {
      //data: chartData,
      data,
      height: 300,
      xField: 'value',
      yField: 'count',
      interactions: [{type: 'other-visible'}],
      size: 5,
      pointStyle: {
        fill: '#5B8FF9',
      },
      xAxis: {
        title: {
          text: '度数',
        },
      },
      yAxis: {
        title: {
          text: '数量',
        },
      },
    });
    scatterPlot.render();

    return () => {
      scatterPlot.destroy();
    };
  }, [degree, current]);

  const extra = <Select options={options} value={current} onChange={val => setCurrent(val)}></Select>;

  return (
    <Card title="度数分布" extra={extra}>
      <div id="gi-info-detection-degree-scatter"></div>
    </Card>
  );
};

export default DegreeScatter;
