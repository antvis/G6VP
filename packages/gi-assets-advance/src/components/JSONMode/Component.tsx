import { useContext } from '@antv/gi-sdk';
import React, { memo, useMemo } from 'react';
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
    const { nodes = [], edges = [], combos = [], ...others } = graphData;
    return {
      nodes: nodes.map(node => {
        const { type, style, nodeType, nodeTypeKeyFromProperties, ...nodeData } = node;
        return {
          ...nodeData,
          [nodeTypeKeyFromProperties]: nodeType,
        };
      }),
      edges: edges.map(edge => {
        const { type, style, edgeType, edgeTypeKeyFromProperties, ...edgeData } = edge;
        return { ...edgeData, [edgeTypeKeyFromProperties]: edgeType };
      }),
      combos: combos?.map(combo => {
        const { style, type, ...comboData } = combo as any;
        return comboData;
      }),
      ...others,
    };
  }, [graphData]);

  return (
    <div className="gi-json-mode" id="gi-json-mode" style={style}>
      {/* @ts-ignore */}
      <ReactJson src={json} theme={theme} style={{ height: '100%' }} />
    </div>
  );
};

export default memo(JSONMode);
