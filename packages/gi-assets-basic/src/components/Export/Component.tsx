import type { IGIAC } from '@antv/gi-sdk';
import { common, extra, useContext } from '@antv/gi-sdk';
import React, { memo } from 'react';
const { GIAComponent } = extra;

export interface ClearCanvasProps {
  visible: boolean;
  color: string;
  hasDivider: boolean;
  GIAC: IGIAC;
}

const Export: React.FunctionComponent<ClearCanvasProps> = props => {
  const { GIAC } = props;
  const { graph } = useContext();

  const onExport = () => {
    const { nodes, edges } = graph.save() as {
      nodes: any[];
      edges: any[];
    };

    const data = {
      nodes: nodes.map(node => {
        return node.data;
      }),
      edges: edges.map(edge => {
        return edge.data;
      }),
    };

    common.createDownload(new Blob([JSON.stringify(data)], { type: 'text/json' }), 'data.json');
  };

  return <GIAComponent GIAC={GIAC} onClick={onExport} />;
};

export default memo(Export);
