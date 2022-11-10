import { Sankey } from '@antv/g2plot';
import { useContext } from '@antv/gi-sdk';
import * as React from 'react';

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

  return (
    <div>
      <div ref={containerRef}></div>
    </div>
  );
};

export default SankeyAnalysis;
