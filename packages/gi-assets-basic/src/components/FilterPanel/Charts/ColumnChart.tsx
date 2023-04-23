import { Column, Datum, G2 } from '@antv/g2plot';
import React, { useEffect } from 'react';
import { IFilterCriteria } from '../type';

export interface IColumnChartProps {
  filterCriteria: IFilterCriteria;
  updateFilterCriteria: (id: string, filterCriteria: IFilterCriteria) => void;
  highlightRank?: number;
}

const ColumnChart: React.FC<IColumnChartProps> = props => {
  const { filterCriteria, updateFilterCriteria, highlightRank } = props;
  const { chartData = new Map(), selectOptions = [] } = filterCriteria;

  useEffect(() => {
    G2.registerInteraction('element-highlight', {
      start: [{ trigger: 'element:click', action: 'element-highlight:toggle' }],
    });
  }, []);

  useEffect(() => {
    const dataLength = chartData.size;
    const highlightThreshold = highlightRank && highlightRank > dataLength ? dataLength - 1 : highlightRank;
    const data = [...chartData.entries()].map((e, i) => {
      const [key, value] = e;
      const { rank = Infinity, isOutlier = false } = selectOptions[i] || {};
      return {
        x: key,
        y: value,
        highlight: highlightThreshold && rank < highlightThreshold ? true : false,
        isOutlier,
      };
    });

    const columnPlot = new Column(`${filterCriteria.id}-chart-container`, {
      data,
      xField: 'x',
      yField: 'y',
      height: 200,
      seriesField: 'highlight',
      color: ({ highlight }) => {
        if (highlight) return '#eb2f96';
        return 'rgba(111, 147, 222, 1)';
      },
      label: {
        // @ts-ignore
        content: ({ highlight, isOutlier, y }) => {
          if (highlight && !isOutlier) return y;
        },
        style: {
          fill: '#eb2f96',
          fontSize: 10,
        },
        offset: 4,
        position: 'top',
      },
      tooltip: {
        fields: ['x', 'y'],
        formatter: (datum: Datum) => {
          return { name: datum.x, value: datum.y };
        },
      },
      interactions: [{ type: 'element-highlight' }],
      state: {
        // 设置 active 激活状态的样式
        active: {
          style: {
            lineWidth: 0,
          },
        },
      },
      legend: false,
    });

    columnPlot.on('element:click', ({ view }) => {
      const id = filterCriteria.id as string;
      const elements = view.geometries[0].elements;

      const selectValue = elements.filter(e => e.states.indexOf('active') !== -1).map(e => e.data.x);

      const isFilterReady = selectValue.length !== 0;
      updateFilterCriteria(id, {
        ...filterCriteria,
        isFilterReady,
        selectValue,
      });
    });

    columnPlot.render();

    columnPlot.setState('active', (item: Datum) => {
      if (!filterCriteria.isFilterReady || !filterCriteria.selectValue) return false;
      return filterCriteria.selectValue.includes(item.x);
    });

    columnPlot.setState('inactive', (item: Datum) => {
      if (!filterCriteria.isFilterReady || !filterCriteria.selectValue) return false;
      return !filterCriteria.selectValue.includes(item.x);
    });

    return () => {
      columnPlot.destroy();
    };
  }, [chartData, selectOptions, highlightRank]);

  return <div id={`${filterCriteria.id}-chart-container`} />;
};

export default ColumnChart;
