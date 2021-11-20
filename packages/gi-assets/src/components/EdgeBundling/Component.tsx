import { GraphinContext, G6 } from '@antv/graphin';
import { Button, Divider, Modal, Tooltip } from 'antd';
import * as React from 'react';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

export interface EdgeBunding {
  visible: boolean;
  color: string;
  hasDivider: boolean;
}

const EdgeBunding: React.FunctionComponent<EdgeBunding> = props => {
  const { color, hasDivider } = props;
  const { apis, graph } = React.useContext(GraphinContext);
  const { handleZoomIn, handleZoomOut } = apis;
  React.useEffect(() => {
    const edgeBundling = new G6.Bundling({
      bundleThreshold: 0.6,
      K: 100,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = graph.save() as any;
    graph.addPlugin(edgeBundling);

    const { nodes, edges } = data;
    nodes.forEach(n => {
      n.degree = 0;
      n.inDegree = 0;
      n.outDegree = 0;
    });
    const nodeIdMap = new Map();
    nodes.forEach(node => {
      nodeIdMap.set(node.id, node);
    });
    edges.forEach(e => {
      const source = nodeIdMap.get(e.source);
      const target = nodeIdMap.get(e.target);
      source.outDegree++;
      target.inDegree++;
      source.degree++;
      target.degree++;
      if (e.sytle === undefined) e.style = {};
      e.style.strokeOpacity = 0.2;
      e.style.stroke = '#C9E5CA';
      // e.style.stroke = `l(0) 0:${llightOrange16} 1:${llightBlue16}`;
      if (nodeIdMap.get(e.source).x < nodeIdMap.get(e.target).x) {
        // e.style.stroke = `l(0) 0:${llightBlue16} 1:${llightOrange16}`;
      }
    });
    let maxDegree = -9999;
    let minDegree = 9999;
    nodes.forEach(n => {
      if (maxDegree < n.degree) maxDegree = n.degree;
      if (minDegree > n.degree) minDegree = n.degree;
    });

    edgeBundling.bundling(data);
    graph.data(data);
    graph.render();
  }, [graph]);
  return <></>;
};

export default EdgeBunding;
