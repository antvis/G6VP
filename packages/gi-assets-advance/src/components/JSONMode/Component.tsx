import { useContext } from '@antv/gi-sdk';
import React, { useMemo } from 'react';
import ReactJson, { ThemeKeys } from 'react-json-view';
import './index.less';

export interface IProps {
  theme?: ThemeKeys;
  style?: React.CSSProperties;
}

const JSONMode: React.FC<IProps> = props => {
  const { style = {}, theme = 'rjv-default' } = props;
  const { data: graphData } = useContext();

  const json = useMemo(() => {
    // @ts-ignore
    const { nodes, edges, combos, tableResult } = graphData;
    if (nodes.length || edges.length) {
      return { nodes: nodes.map(item => item.data), edges: edges.map(item => item.data), combos };
    }
    return tableResult;
  }, [graphData]);

  return (
    <div className="gi-json-mode" id="gi-json-mode" style={style}>
      {/* @ts-ignore */}
      <ReactJson src={json} theme={theme} />
    </div>
  );
};

export default JSONMode;
