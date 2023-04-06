import { GIGraphData, useContext } from '@antv/gi-sdk';

import type {} from 'graph-timeline';
import GraphTimeLine from 'graph-timeline';
import * as React from 'react';

export interface Props {
  dateKey: string;
  height: number;
}

const transformer = (timeTable, dateKey) => {
  const nodes: any[] = [];
  const links: any[] = [];

  (timeTable as GIGraphData['edges']).forEach(item => {
    const { source, target, data } = item;
    const date = data && data[dateKey];
    if (source && target && date) {
      nodes.push({
        id: `${source}_${date}`,
        name: `${source}_${date}`,
        nodeId: source,
        nodeName: source,
        date: date,
      });
      nodes.push({
        id: `${target}_${date}`,
        name: `${target}_${date}`,
        nodeId: target,
        nodeName: target,
        date: date,
      });

      links.push({
        source: `${source}_${date}`,
        target: `${target}_${date}`,
      });
    }
  });
  return { nodes, links };
};

const Timeline: React.FunctionComponent<Props> = props => {
  const { dateKey, height } = props;
  const { source } = useContext();
  const { nodes, links } = React.useMemo(() => {
    return transformer(source.edges, dateKey);
  }, [dateKey]);

  return (
    <div>
      <GraphTimeLine
        height={height - 100}
        nodes={nodes}
        links={links}
        // useBrush={false}
        options={{
          colors: {
            节点0: 'purple',
          },
          yAxis: {
            tickColor: '#e5e5e5',
            direction: 'topToBottom',
          },
          link: {
            selectedColor: 'yellow',
          },
        }}
        tooltip={{
          show: true,
        }}
        onBrushChange={value => {
          console.log(value);
        }}
        // timeLabelFormat={ (date) => date.toLocaleDateString()}
        onSelect={(selectedData, show, d) => {
          console.log(selectedData, d, show);
        }}
        onSelectedNodesChange={(current, selectedData) => {
          console.log('onSelectedNodesChange', 'current', current);
          console.log('onSelectedNodesChange', 'selectedData', selectedData);
        }}
        onSelectedLinksChange={(current, selectedData) => {
          console.log('onSelectedLinksChange', 'current', current);
          console.log('onSelectedLinksChange', 'selectedData', selectedData);
        }}
      />
    </div>
  );
};

export default Timeline;
