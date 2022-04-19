import { useContext } from '@alipay/graphinsight';
import * as React from 'react';
import './index.less';

const AddNode = props => {
  const { graph } = useContext();

  const selectedNodes = graph.findAllByState('node', 'selected');
  const selectedEdges = graph.findAllByState('edge', 'selected');

  return (
    <>
      <p>Some contents...</p>
      <p>Some contents..2.</p>
      <p>Some contents...</p>
    </>
  );
};

export default AddNode;
