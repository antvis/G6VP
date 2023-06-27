import { Sankey } from '@antv/g2plot';
import { useContext } from '@antv/gi-sdk';
import { Empty } from 'antd';
import * as React from 'react';
import $i18n from '../../i18n';

export interface IProps {
  weightField: string;
}

const SankeyAnalysis: React.FunctionComponent<IProps> = props => {
  const { weightField } = props;
  const { data } = useContext();

  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const DATA = data.edges
      .map(e => {
        return e.data;
      })
      .filter(e => {
        return typeof e[weightField] === 'number';
      });
    if (!containerRef.current) {
      return;
    }

    const sankey = new Sankey(containerRef.current, {
      data: DATA,
      sourceField: 'source',
      targetField: 'target',
      weightField: weightField,
      nodeWidthRatio: 0.01,
      nodePaddingRatio: 0.03,
      nodeSort: (a, b) => b[weightField] - a[weightField],
    });
    sankey.render();
    return () => {
      sankey.destroy();
    };
  }, [weightField, data]);
  if (!weightField) {
    return (
      <Empty
        description={$i18n.get({
          id: 'basic.components.Sankey.Component.PleaseSetTheWeightMapping',
          dm: '请先设置「桑基图」的「权重映射」',
        })}
      ></Empty>
    );
  }

  return (
    <div>
      <div ref={containerRef}></div>
    </div>
  );
};

export default SankeyAnalysis;
