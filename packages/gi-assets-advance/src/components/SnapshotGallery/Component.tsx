import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext, utils } from '@antv/gi-sdk';
import { enableMapSet } from 'immer';
import { nanoid } from 'nanoid';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useImmer } from 'use-immer';
import './index.less';
//import Gallery from './Gallery';
import SnapShot from './Snapshot';
import { IHistoryObj, IState } from './typing';
const { GIAComponent } = extra;

const { getPositionStyles } = utils;

export interface IProps {
  GIAC: IGIAC;
  placement: string;
  offset: number[];
  direction: 'horizontal' | 'vertical';
  background: string;
}

enableMapSet();
const SnapshotGallery: React.FC<IProps> = props => {
  const { GIAC, placement, offset, direction, background } = props;

  const positionStyles = getPositionStyles(placement, offset);
  const flexDirection = direction === 'horizontal' ? 'row' : 'column';
  const { graph, data, GISDK_ID } = useContext();
  const [state, updateState] = useImmer<IState>({
    history: new Map<string, IHistoryObj>(),
  });

  const saveSnapshot = () => {
    const nodes = data.nodes.map(nodeConfig => {
      const { id } = nodeConfig;
      const node = graph.findById(id);
      const model = node.getModel();
      const { x, y } = model;
      return {
        ...nodeConfig,
        x,
        y,
      };
    });
    const edges = data.edges.map(edgeConfig => edgeConfig);
    const graphData = { nodes, edges };

    const imgURL = graph.toDataURL('image/jpeg', '#fff');

    updateState(draft => {
      const id = nanoid();
      draft.history.set(id, { graphData, imgURL });
    });
  };

  const deleteSnapShot = (id: string) => {
    updateState(draft => {
      draft.history.delete(id);
    });
  };

  const content = (
    <div className="gi-gallery-container" style={{ ...positionStyles, flexDirection, background }}>
      {[...state.history.entries()].map(e => {
        const [id, historyObj] = e;
        return <SnapShot id={id} historyObj={historyObj} deleteSnapShot={deleteSnapShot} />;
      })}
    </div>
  );

  useEffect(() => {
    // 绑定快捷键 默认为 control + x
    // 兼容 Windows 用户
    const keyMap = {};

    const onKeyDown = (e: KeyboardEvent) => {
      keyMap[e.key] = true;
      if (keyMap['x'] && keyMap['Control']) {
        saveSnapshot();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keyMap[e.key] = false;
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <div className="gi-snapshot-gallery">
      <GIAComponent GIAC={GIAC} onClick={saveSnapshot} />
      {ReactDOM.createPortal(content, document.getElementById(`${GISDK_ID}-graphin-container`)!)}
    </div>
  );
};

export default SnapshotGallery;
