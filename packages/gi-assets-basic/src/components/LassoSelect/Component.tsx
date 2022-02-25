import { Behaviors } from '@antv/graphin';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { IGIAC } from '../const';
import GIAComponent from '../GIAC';
const { BrushSelect, DragCanvas } = Behaviors;
import { useContext } from '@alipay/graphinsight';

export interface LassoType {
  visible: boolean;
  color: string;
  hasDivider: boolean;
  GIAC: IGIAC;
}

const LassoSelect: React.FunctionComponent<LassoType> = props => {
  const { GIAC } = props;
  const [isLasso, setIsLasso] = React.useState(false);
  const [seletedNodes, setSelectedNodes] = useState<any[]>([]);
  const [seletedEdges, setSelectedEdges] = useState<any[]>([]);
  const { graph } = useContext();
  const onSelect: any = (nodes, edges) => {
    setSelectedNodes([...seletedNodes, ...nodes]);
    setSelectedEdges([...seletedEdges, ...edges]);
    seletedNodes.forEach(node => {
      graph.setItemState(node, 'selected', true);
    });
    seletedEdges.forEach(edge => {
      graph.setItemState(edge, 'selected', true);
    });
  };
  const onDeselect = () => {
    setSelectedEdges([]);
    setSelectedNodes([]);
  };
  const itemStateChange = e => {
    const { state, item, enabled } = e;
    if (state === 'selected') {
      const type = item?.getType();
      if (type === 'node') {
        if (enabled) {
          setSelectedNodes([...graph.findAllByState('node', 'selected'), item]);
        } else {
          setSelectedNodes(graph.findAllByState('node', 'selected').filter(node => node.getID() !== item?.getID()));
        }
      } else if (type === 'edge') {
        if (enabled) {
          setSelectedEdges([...graph.findAllByState('edge', 'selected'), item]);
        } else {
          setSelectedEdges(graph.findAllByState('edge', 'selected').filter(edge => edge.getID() !== item?.getID()));
        }
      }
    }
  };
  const afterItemStatesClear = e => {
    const { states, item } = e;
    if (states === 'selected') {
      const type = item?.getType();
      if (type === 'node') {
        setSelectedNodes(graph.findAllByState('node', 'selected').filter(node => node.getID() !== item?.getID()));
      } else if (type === 'edge') {
        setSelectedEdges(graph.findAllByState('edge', 'selected').filter(edge => edge.getID() !== item?.getID()));
      }
    }
  };
  useEffect(() => {
    graph.on('afteritemstatechange', itemStateChange);
    graph.on('afteritemstatesclear', afterItemStatesClear);
    return () => {
      graph.off('afteritemstatesclear', afterItemStatesClear);
      graph.off('afteritemstatechange', itemStateChange);
    };
  }, [graph]);
  const Content = props => {
    const { isLasso } = props;
    if (isLasso) {
      // 套索模式
      return (
        <>
          <Behaviors.LassoSelect onSelect={onSelect} onDeselect={onDeselect}></Behaviors.LassoSelect>
          <BrushSelect disabled={true}></BrushSelect>
          <DragCanvas></DragCanvas>
        </>
      );
    } else {
      // 恢复原Behaviors
      return (
        <>
          <Behaviors.LassoSelect disabled={true}></Behaviors.LassoSelect>
          <BrushSelect></BrushSelect>
          <DragCanvas></DragCanvas>
        </>
      );
    }
  };
  const handleLasso = () => {
    setIsLasso(!isLasso);
    const container = document.getElementsByClassName('graphin-core')[0] as HTMLElement;
    // @ts-ignore
    container.style.opacity = isLasso ? 1 : 0.8;
  };

  return (
    <div>
      <GIAComponent onClick={handleLasso} GIAC={GIAC} />
      {ReactDOM.createPortal(
        <Content isLasso={isLasso}></Content>,
        //@ts-ignore
        document.getElementById('graphin-container'),
      )}
    </div>
  );
};

export default LassoSelect;
