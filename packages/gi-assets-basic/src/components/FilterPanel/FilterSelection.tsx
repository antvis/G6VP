import React, { useEffect, useState, useRef } from 'react';
import { Pie, Plot, PieOptions, WordCloud, WordCloudOptions, G2, Histogram, HistogramOptions } from '@antv/g2plot';
import { Button, Select } from 'antd';
import { DeleteOutlined, NumberOutlined, FieldStringOutlined } from '@ant-design/icons';
import { useContext } from '@alipay/graphinsight';
import { IFilterCriteria, IChartData, IHistogramValue } from './type';
import { getValueMap, getHistogramData } from './utils';
import './index.less';

const iconMap = {
  boolean: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  string: <FieldStringOutlined style={{ color: 'rgb(39, 110, 241)', marginRight: '4px' }} />,
  number: <NumberOutlined style={{ color: 'rgb(255, 192, 67)', marginRight: '4px' }} />,
};

interface FilterSelectionProps {
  filterCriter: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
  removeFilterCriteria: (id: string) => void;
  nodeProperties: Object;
  edgeProperties: Object;
  histogramColor: string;
}

const FilterSelection: React.FC<FilterSelectionProps> = props => {
  const { filterCriter, nodeProperties, edgeProperties, updateFilterCriteria, removeFilterCriteria, histogramColor } =
    props;
  const [chartData, setChartData] = useState<Map<string, number>>();
  const [histogramData, setHistogramData] = useState<IHistogramValue[]>([]);
  const { source } = useContext();
  const piePlotRef = useRef<Plot<PieOptions> | undefined>();
  const wordCloudRef = useRef<Plot<WordCloudOptions> | undefined>();
  const histogramRef = useRef<Plot<HistogramOptions> | undefined>()

  const onSelectChange = value => {
    const id = filterCriter.id as string;
    const elementType = value.slice(0, 4);
    const prop = value.slice(5);
    const elementProps = elementType === 'node' ? nodeProperties : edgeProperties;
    let analyzerType;
    if (elementProps[prop] === 'number') {
      analyzerType = 'BRUSH';
      const data = getHistogramData(source, prop, elementType);
      setHistogramData(data);
      updateFilterCriteria(id, {
        id,
        analyzerType,
        isFilterReady: false,
        elementType,
        prop,
        range: [data[0].value, data[data.length - 1].value],
      });

    } else if (elementProps[prop] === 'boolean') {
      analyzerType = 'PIE';
      const valueMap = getValueMap(source, prop, elementType);
      setChartData(valueMap);
      updateFilterCriteria(id, {
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
      });
    } else if (elementProps[prop] === 'string') {
      const valueMap = getValueMap(source, prop, elementType);
      let selectOptions;
      if (valueMap.size <= 5) {
        analyzerType = 'PIE';
        setChartData(valueMap);
      } else if (valueMap.size <= 10) {
        analyzerType = 'WORDCLOUD';
        setChartData(valueMap);
      } else {
        analyzerType = 'SELECT';
        selectOptions = [...valueMap.keys()].map(key => ({
          value: key,
          label: key,
        }));
      }
      updateFilterCriteria(id, {
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
        selectOptions,
      });
    } else {
      analyzerType = 'NONE';
      updateFilterCriteria(id, {
        id,
        isFilterReady: false,
        elementType,
        prop,
        analyzerType,
      });
    }
  };

  const onValueSelectChange = value => {
    const id = filterCriter.id as string;
    const isFilterReady = value.length !== 0;
    updateFilterCriteria(id, {
      ...filterCriter,
      isFilterReady,
      selectValue: value,
    });
  };

  const onBrushChange = value => {
    const id = filterCriter.id as string;
    updateFilterCriteria(id, {
      ...filterCriter,
      isFilterReady: true,
      range: value,
    });
  };

  const renderPie = (chartData?: Map<string, number>, container?: string) => {
    if (!chartData || !container) {
      return;
    }
    const sum = [...chartData.values()].reduce((acc, cur) => acc + cur, 0);
    const data = [...chartData.entries()].map(e => {
      const [key, value] = e;
      return {
        x: key,
        value,
      };
    });

    const piePlot = new Pie(container, {
      height: 200,
      data,
      angleField: 'value',
      colorField: 'x',
      radius: 0.9,
      label: {
        type: 'inner',
        offset: '-30%',
        content: ({ value }) => `${((value / sum) * 100).toFixed(0)}%`,
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    });

    piePlot.render();

    piePlot.on('element:click', ({ view }) => {
      const id = filterCriter.id as string;
      const elements = view.geometries[0].elements;
      const selectValue = elements.filter(e => e.states.indexOf('selected') != -1).map(e => e.data.x);
      const isFilterReady = selectValue.length != 0;
      updateFilterCriteria(id, {
        ...filterCriter,
        isFilterReady,
        selectValue,
      });
    });

    piePlotRef.current = piePlot;
  };

  const renderWordCloud = (chartData?: Map<string, number>, container?: string) => {
    if (!chartData || !container) {
      return;
    }
    const data = [...chartData.entries()].map(e => {
      const [key, value] = e;
      return {
        x: key,
        value,
        category: '',
      };
    });

    const wordCloud = new WordCloud(container, {
      data,
      height: 200,
      wordField: 'x',
      weightField: 'value',
      color: '#122c6a',
      wordStyle: {
        fontFamily: 'Verdana',
        fontSize: [10, 16],
      },
      // 设置交互类型
      interactions: [{ type: 'element-active' }, { type: 'element-selected' }],
      state: {
        active: {
          // 这里可以设置 active 时的样式
          style: {
            lineWidth: 3,
          },
        },
      },
    });

    wordCloud.on('element:click', ({ view }) => {
      const elements = view.geometries[0].elements;
      const selectValue = elements.filter(e => e.states.indexOf('selected') != -1).map(e => e.data.datum.x);
      const isFilterReady = selectValue.length != 0;
      updateFilterCriteria(filterCriter.id!, {
        ...filterCriter,
        isFilterReady,
        selectValue,
      });
    });

    wordCloud.render();
    wordCloudRef.current = wordCloud;
  };

  const renderHistogram = (chartData: IHistogramValue[], container: string) => {
    if (!chartData || !container) {
      return;
    }
    const histogramPlot = new Histogram(container, {
      data: chartData,
      height: 200,
      binField: 'value',
      tooltip: false,
      interactions: [
        {
          type: 'brush',
        },
      ],
      meta: {
        range: {},
        count: {
          nice: true,
        },
      },
    });

    histogramPlot.chart.on("mask:change", (e) => {
      const minValue = chartData[0].value;
      const maxValue = chartData[chartData.length - 1].value;
      const start = histogramPlot.chart.coordinateBBox.x;
      const end = histogramPlot.chart.coordinateBBox.x + histogramPlot.chart.coordinateBBox.width;
      const minX = e.target.getBBox().minX;
      const maxX = e.target.getBBox().maxX;
      const rangeStart = minValue + (maxValue - minValue) * (minX - start) / (end - start);
      const rangeEnd = minValue + (maxValue - minValue) * (maxX - start) / (end - start);
      onBrushChange([rangeStart, rangeEnd]);
    })

    histogramPlot.render();
    histogramRef.current = histogramPlot;
  }

  useEffect(() => {
    G2.registerInteraction('brush', {
      showEnable: [
        { trigger: 'plot:mouseenter', action: 'cursor:crosshair' },
        { trigger: 'mask:mouseenter', action: 'cursor:move' },
        { trigger: 'plot:mouseleave', action: 'cursor:default' },
        { trigger: 'mask:mouseleave', action: 'cursor:crosshair' },
      ],
      start: [
        {
          trigger: 'plot:mousedown', isEnable(context) {
            return !context.isInShape('mask');
          }, action: ['rect-mask:start', 'rect-mask:show']
        },
        { trigger: 'mask:dragstart', action: 'rect-mask:moveStart' }
      ],
      processing: [
        { trigger: 'plot:mousemove', action: 'rect-mask:resize' },
        {
          trigger: 'mask:drag', isEnable(context) {
            return context.isInPlot();
          }, action: 'rect-mask:move'
        },
        { trigger: 'mask:change', action: 'element-sibling-filter-record:filter' }
      ],
      end: [
        { trigger: 'plot:mouseup', action: 'rect-mask:end' },
        { trigger: 'mask:dragend', action: 'rect-mask:moveEnd' }
      ],
      rollback: [
        { trigger: 'dblclick', action: ['rect-mask:hide', 'element-sibling-filter-record:reset'] }
      ]
    });
  }, [])

  useEffect(() => {
    if (filterCriter.analyzerType === 'PIE') {
      piePlotRef.current?.destroy();
      renderPie(chartData, `${filterCriter.id}-chart-container`);
    } else {
      piePlotRef.current?.destroy();
      piePlotRef.current = undefined;
    }

    if (filterCriter.analyzerType === 'WORDCLOUD') {
      wordCloudRef.current?.destroy();
      renderWordCloud(chartData, `${filterCriter.id}-chart-container`);
    } else {
      wordCloudRef.current?.destroy();
      wordCloudRef.current = undefined;
    }

    if (filterCriter.analyzerType == 'BRUSH') {
      histogramRef.current?.destroy();
      renderHistogram(histogramData, `${filterCriter.id}-chart-container`);
    } else {
      histogramRef.current?.destroy();
      histogramRef.current = undefined;
    }
  }, [chartData, filterCriter.analyzerType]);

  return (
    <div key={filterCriter.id} className="gi-filter-panel-group">
      <div className="gi-filter-panel-prop">
        <Select
          style={{ width: '80%' }}
          onChange={onSelectChange}
          className="gi-filter-panel-prop-select"
          placeholder="选择元素属性"
        >
          <Select.OptGroup key="node" label="节点">
            {Object.entries(nodeProperties).map(e => {
              const [key, value] = e;
              const icon = iconMap[value];
              return (
                <Select.Option value={`node-${key}`}>
                  {icon}
                  {key}
                </Select.Option>
              );
            })}
          </Select.OptGroup>
          <Select.OptGroup key="edge" label="边">
            {Object.entries(edgeProperties).map(e => {
              const [key, value] = e;
              const icon = iconMap[value];
              return (
                <Select.Option value={`edge-${key}`}>
                  {icon}
                  {key}
                </Select.Option>
              );
            })}
          </Select.OptGroup>
        </Select>
        <Button onClick={() => removeFilterCriteria(filterCriter.id!)} type="text">
          <DeleteOutlined className="gi-filter-panel-delete" />
        </Button>
      </div>
      <div className="gi-filter-panel-value" id={`${filterCriter.id}-chart-container`}>
        {filterCriter.analyzerType == 'SELECT' && (
          <Select
            style={{ width: '100%' }}
            onChange={onValueSelectChange}
            mode="tags"
            placeholder="选择筛选值"
            options={filterCriter.selectOptions}
            value={filterCriter.selectValue}
          />
        )}
        {filterCriter.analyzerType === 'NONE' && <span>请选择合法字段</span>}
      </div>
    </div>
  );
};

export default FilterSelection;
