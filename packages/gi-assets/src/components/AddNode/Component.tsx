import { SubnodeOutlined } from '@ant-design/icons';
import { GraphinContext } from '@antv/graphin';
import { Modal } from 'antd';
import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.less';

export interface AddNode {
  visible: boolean;
}

const Content = props => {
  const { visible, handleOk, handleCancel } = props;
  const { graph } = React.useContext(GraphinContext);
  console.time('cost selected');
  const selectedNodes = graph.findAllByState('node', 'selected');
  const selectedEdges = graph.findAllByState('edge', 'selected');
  console.timeEnd('cost selected');
  console.log('graph', graph, selectedNodes, selectedEdges);

  return (
    <Modal title="添加节点" visible={visible} onOk={handleOk} onCancel={handleCancel}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
};

const AddNode: React.FunctionComponent<AddNode> = props => {
  const { visible: defaultVisible } = props;
  const [visible, setVisible] = React.useState(defaultVisible);
  const graphin = React.useContext(GraphinContext);
  React.useEffect(() => {
    setVisible(defaultVisible);
  }, [defaultVisible]);
  const handleClick = () => {
    setVisible(!visible);
    (graphin as any).contextmenu = {};
    console.log('click.........', graphin);
  };

  const handleOk = () => {
    setVisible(false);
  };
  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <div>
      <div onClick={handleClick} className="gi-component-addNode">
        <div>
          <SubnodeOutlined />
        </div>
        <div> 添加节点</div>
      </div>
      {ReactDOM.createPortal(
        <Content visible={visible} handleOk={handleOk} handleCancel={handleCancel} />,
        //@ts-ignore
        document.getElementById('graphin-container'),
      )}
    </div>
  );
};

export default AddNode;
