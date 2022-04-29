import { G6 } from '@antv/graphin';
import * as React from 'react';
interface PatternGraphProps {
  pattern: any;
}

const PatternGraph: React.FunctionComponent<PatternGraphProps> = props => {
  const { pattern } = props;
  React.useEffect(() => {
    const patternGraph = new G6.Graph({
      container: 'gi-pattern-match-graph-container',
      width: 380,
      height: 250,
      fitView: true,
      defaultEdge: {
        size: 2,
        style: {
          endArrow: {
            path: G6.Arrow.triangle(10, 10),
          },
        },
        labelCfg: {
          autoRotate: true,
          style: {
            stroke: '#fff',
            lineWidth: 2,
          },
        },
      },
      defaultNode: {
        labelCfg: {
          position: 'right',
        },
      },
      layout: {
        type: 'dagre',
        ranksep: 20,
      },
    });
    const clonePattern = JSON.parse(JSON.stringify(pattern));
    patternGraph.data(clonePattern);
    patternGraph.render();
    return () => {
      patternGraph.destroy();
    };
  }, [pattern]);
  return (
    <div>
      <div id="gi-pattern-match-graph-container"></div>
    </div>
  );
};

export default PatternGraph;
