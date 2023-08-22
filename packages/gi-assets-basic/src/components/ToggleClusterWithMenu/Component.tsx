import { INode } from '@antv/g6';
import { useContext } from '@antv/gi-sdk';
import type { ContextMenuValue } from '@antv/graphin';
import { Menu } from 'antd';
import React, { memo } from 'react';
import $i18n from '../../i18n';
import { filterGraphDataByNodes, getLeafNodes } from '../utils';

type ControlledValues = {
  startId: string;
  action: 'fold' | 'unfold';
};

export interface IProps {
  contextmenu: ContextMenuValue;
  isReLayout: boolean;
  degree: number;
  controlledValues?: ControlledValues;
}

// 叶子节点缓存
const leafNodeIdsCache: Record<string, string[]> = {};
// 已被操作过的节点缓存
const nodeIdsCache = new Set<string>();

const ToggleClusterWithMenu: React.FunctionComponent<IProps> = props => {
  const { contextmenu, isReLayout, degree, controlledValues } = props;
  const { graph, updateContext, source, updateHistory } = useContext();
  const { item: targetNode, id: nodeId, onClose } = contextmenu;

  const handleUnfold = (node, leafNodeIds: string[] = []) => {
    //@ts-ignore
    graph.updateItem(node, {
      folded: false,
    });
    leafNodeIds.forEach(id => {
      graph.showItem(id);
    });
  };

  const handleFold = (node, leafNodeIds: string[] = []) => {
    leafNodeIds.forEach(id => {
      graph.hideItem(id);
    });
    nodeIdsCache.add(nodeId);
    leafNodeIdsCache[nodeId] = leafNodeIds;
    //@ts-ignore
    graph.updateItem(node, {
      folded: true,
    });
  };

  const handleRelayout = () => {
    if (isReLayout) {
      let hiddenNodeIds: string[] = [];
      Array.from(nodeIdsCache).forEach(id => {
        const node = graph.findById(id);
        if (node && node.getModel().folded) {
          const id = node.getModel().id as string;
          hiddenNodeIds = [...hiddenNodeIds, ...leafNodeIdsCache[id]];
        }
      });
      const newData = filterGraphDataByNodes(source, hiddenNodeIds);
      updateContext(draft => {
        draft.data = newData;
      });
    }
  };

  // const handleUnfold = leafNodeIds => {
  //   //@ts-ignore
  //   graph.updateItem(targetNode, {
  //     folded: false,
  //   });
  //   leafNodeIds.forEach(id => {
  //     graph.showItem(id);
  //   });
  // };

  // const handleFold = leafNodeIds => {
  //   leafNodeIds.forEach(id => {
  //     graph.hideItem(id);
  //   });
  //   nodeIdsCache.add(nodeId);
  //   leafNodeIdsCache[nodeId] = leafNodeIds;
  //   //@ts-ignore
  //   graph.updateItem(targetNode, {
  //     folded: true,
  //   });
  // };

  // const handleRelayout = () => {
  //   if (isReLayout) {
  //     let hiddenNodeIds: string[] = [];
  //     Array.from(nodeIdsCache).forEach(id => {
  //       const node = graph.findById(id);
  //       if (node && node.getModel().folded) {
  //         const id = node.getModel().id as string;
  //         hiddenNodeIds = [...hiddenNodeIds, ...leafNodeIdsCache[id]];
  //       }
  //     });
  //     const newData = filterGraphDataByNodes(source, hiddenNodeIds);
  //     updateContext(draft => {
  //       draft.data = newData;
  //     });
  //   }
  // };

  const handleToggleCluster = () => {
    onClose();
    const model = targetNode?.getModel();
    if (!model?.id) {
      return;
    }
    // n 度节点收起暂不支持
    if (degree === 1) {
      //@ts-ignore
      const leafNodeIds = getLeafNodes(targetNode).map(node => node.getModel().id as string);
      let action: 'fold' | 'unfold' = 'fold';
      if (model.folded) {
        action = 'unfold';
        handleUnfold(targetNode, leafNodeIds);
      } else {
        handleFold(targetNode, leafNodeIds);
      }

      handleRelayout();

      handleUpateHistory({
        startId: model.id,
        action,
      });
    }
  };
  /**
   * 更新到历史记录
   * @param success 是否成功
   * @param errorMsg 若失败，填写失败信息
   * @param value 查询语句
   */
  const handleUpateHistory = (params: ControlledValues, success: boolean = true, errorMsg?: string) => {
    updateHistory({
      componentId: 'ToggleClusterWithMenu',
      type: 'configure',
      subType: $i18n.get({ id: 'basic.components.ToggleClusterWithMenu.Component.FoldUpExpand', dm: '收起/展开' }),
      statement: `${$i18n.get(
        {
          id: 'basic.components.ToggleClusterWithMenu.Component.FoldUpExpandStatus',
          dm: params.action === 'fold' ? '收起' : '展开',
        },
        {
          action:
            params.action === 'fold'
              ? $i18n.get({
                  id: 'basic.components.ToggleClusterWithMenu.Component.Fold',
                  dm: '收起',
                })
              : $i18n.get({
                  id: 'basic.components.ToggleClusterWithMenu.Component.Expand',
                  dm: '展开',
                }),
        },
      )} ${params.startId}`,
      // statement: `${params.action === 'fold' ? '收起' : '展开'} ${params.startId}`,
      success,
      errorMsg,
      params,
    });
  };

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  React.useEffect(() => {
    if (controlledValues) {
      const { startId, action } = controlledValues;
      const targetNode = graph.findById(startId) as INode;
      if (!targetNode) {
        handleUpateHistory(
          { startId, action },
          false,
          $i18n.get({
            id: 'basic.components.ToggleClusterWithMenu.Component.TheTargetNodeDoesNot',
            dm: '目标节点不存在',
          }),
        );
        return;
      }
      const leafNodeIds = getLeafNodes(targetNode).map(node => node.getModel().id as string);
      if (action === 'fold') {
        handleFold(leafNodeIds);
      } else {
        handleUnfold(leafNodeIds);
      }
      handleRelayout();
      handleUpateHistory({
        startId: startId,
        action,
      });
    }
  }, [controlledValues]);

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  React.useEffect(() => {
    if (controlledValues) {
      const { startId, action } = controlledValues;
      const node = graph.findById(startId) as INode;
      if (!node) {
        handleUpateHistory(
          { startId, action },
          false,
          $i18n.get({
            id: 'basic.components.ToggleClusterWithMenu.Component.TheTargetNodeDoesNot',
            dm: '目标节点不存在',
          }),
        );
        return;
      }
      const leafNodeIds = getLeafNodes(node).map(node => node.getModel().id as string);
      if (action === 'fold') {
        handleFold(node, leafNodeIds);
      } else {
        handleUnfold(node, leafNodeIds);
      }
      handleRelayout();
      handleUpateHistory({
        startId: startId,
        action,
      });
    }
  }, [controlledValues]);

  // 仅支持对节点的操作
  if (!targetNode || targetNode.destroyed || targetNode.getType?.() !== 'node') {
    return null;
  }

  const model = targetNode.getModel();
  return (
    <Menu.Item key="toggleClusterWithMenu" onClick={handleToggleCluster}>
      {model.folded
        ? $i18n.get({ id: 'basic.components.ToggleClusterWithMenu.Component.ExpandANode', dm: '展开节点' })
        : $i18n.get({ id: 'basic.components.ToggleClusterWithMenu.Component.CollapseNode', dm: '收起节点' })}
    </Menu.Item>
  );
};

export default memo(ToggleClusterWithMenu);
