import { GraphinContext } from '@antv/graphin';
import * as React from 'react';
import type { IGIAC } from '@alipay/graphinsight';
import { extra } from '@alipay/graphinsight';
const { GIAComponent } = extra;

export interface ClearCanvasProps {
  visible: boolean;
  color: string;
  hasDivider: boolean;
  GIAC: IGIAC;
}

const Export: React.FunctionComponent<ClearCanvasProps> = props => {
  const { GIAC } = props;
  const { graph } = React.useContext(GraphinContext);

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

    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data)], { type: 'text/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'data.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  return <GIAComponent GIAC={GIAC} onClick={onExport} />;
};

export default Export;
