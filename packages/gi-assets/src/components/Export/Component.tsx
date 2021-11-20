import { ExportOutlined } from '@ant-design/icons';
import { GraphinContext } from '@antv/graphin';
import { Button, Divider, Tooltip } from 'antd';
import * as React from 'react';

export interface ClearCanvasProps {
  visible: boolean;
  color: string;
  hasDivider: boolean;
}

const Export: React.FunctionComponent<ClearCanvasProps> = props => {
  const { color, hasDivider } = props;
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
    console.log(data);
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(data)], { type: 'text/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'data.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  return (
    <div>
      <Tooltip title="导出" color={color} key={color}>
        <Button type="text" icon={<ExportOutlined />} onClick={onExport}></Button>
      </Tooltip>
      {hasDivider && <Divider type="vertical" />}
    </div>
  );
};

export default Export;
