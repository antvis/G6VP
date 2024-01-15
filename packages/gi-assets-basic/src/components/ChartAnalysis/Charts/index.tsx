import { BarChartOutlined, FieldStringOutlined, LineChartOutlined, NumberOutlined } from '@ant-design/icons';
import { useContext, useSourceDataMap, utils } from '@antv/gi-sdk';
import { Card, Select } from 'antd';
import React, { useMemo } from 'react';
import { useImmer } from 'use-immer';
import $i18n from '../../../i18n';
import '../index.less';
import ColumnChart from './ColumnChart';
import LineChart from './LineChart';
const { highlightEdgeIds } = utils;

const iconMap = {
  boolean: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  string: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  number: <NumberOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
};

let timer;
const chartOptions = [
  {
    value: 'lineChart',
    title: $i18n.get({ id: 'basic.ChartAnalysis.Charts.LineChart', dm: '折线图' }),
    label: <LineChartOutlined />,
  },
  {
    value: 'columnChart',
    title: $i18n.get({ id: 'basic.ChartAnalysis.Charts.Histogram', dm: '柱状图' }),
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
  brushMode: 'filter' | 'highlight' | undefined;
}

interface IState {
  dataType: 'nodes' | 'edges';
  xField: string;
  yField: string;
  chartType: string;
  brushMode: 'filter' | 'highlight' | undefined;
}

const ChartCard: React.FC<ChartCardProps> = props => {
  const { graph, updateContext, context, transform } = useContext();
  const { schemaData, source } = context;
  const sourceDataMap = useSourceDataMap(source);
  const [state, updateState] = useImmer<IState>({
    dataType: props.dataType || 'edges',
    xField: props.xField,
    yField: props.yField,
    chartType: props.chartType,
    brushMode: props.brushMode,
  });

  const { chartType, dataType, xField, yField, brushMode } = state;

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
    const res = source[dataType]
      .map(item => {
        return {
          ...item.data,
          id: item.id,
        };
      })
      .filter(item => {
        return item[xField]; //过滤掉不合理的数据
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
      if (brushMode === 'highlight') {
        highlightEdgeIds(graph, ids || []);
      } else {
        const nodes: any[] = [];
        const edges: any[] = [];
        source.edges.forEach(item => {
          const { source, target, id } = item;
          if (ids && ids.includes(id)) {
            edges.push(item);
            nodes.push(sourceDataMap.nodes[source]);
            nodes.push(sourceDataMap.nodes[target]);
          }
        });

        updateContext(draft => {
          draft.data = transform({ nodes, edges });
        });
      }
    }
  };
  // const handlePlay = () => {
  //   clearInterval(timer);
  //   if (dataType === 'edges') {
  //     let index = 0;

  //     timer = setInterval(() => {
  //       index = index + 10;
  //       if (index > data.length) {
  //         clearInterval(timer);
  //       }
  //       const ids = data.slice(0, index).map(item => {
  //         return item.id;
  //       });
  //       console.log(ids, index);
  //       highlight(ids);
  //     }, 600);
  //   }
  // };
  const extra = (
    <div className="gi-chart-analysis-form-container">
      {/* <Button type="text" onClick={handlePlay}>
       <PlayCircleOutlined />
       自动播放
      </Button> */}
      <div className="gi-chart-analysis-form-item">
        {$i18n.get({ id: 'basic.ChartAnalysis.Charts.XAxis', dm: 'X轴：' })}

        <Select
          placeholder={$i18n.get({ id: 'basic.ChartAnalysis.Charts.XAxisField', dm: 'X轴字段' })}
          onChange={updateXField}
          size="small"
          style={{ width: '100px', marginRight: '12px' }}
          value={xField}
        >
          {Object.keys(properties).map(k => (
            <Select.Option value={k}>
              {iconMap[properties[k]]}
              {k}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="gi-chart-analysis-form-item">
        {$i18n.get({ id: 'basic.ChartAnalysis.Charts.YAxis', dm: 'Y轴：' })}

        <Select
          placeholder={$i18n.get({ id: 'basic.ChartAnalysis.Charts.YAxisField', dm: 'Y轴字段' })}
          onChange={updateYField}
          size="small"
          style={{ width: '100px' }}
          value={yField}
        >
          {Object.keys(properties).map(k => (
            <Select.Option value={k}>
              {iconMap[properties[k]]}
              {k}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="gi-chart-analysis-form-item">
        <Select
          size="small"
          value={chartType}
          style={{ width: '120px', marginLeft: '10px' }}
          onChange={updateChartType}
        >
          {chartOptions.map(option => (
            <Select.Option value={option.value}>
              {option.title}
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );

  return (
    <div>
      <Card title={props.title} bodyStyle={{ padding: '12px 24px 0px 24px' }}>
        {extra}
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
