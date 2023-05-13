import { useContext, utils } from '@antv/gi-sdk';

import { Menu } from 'antd';
import React, { useEffect, useRef } from 'react';

const { SubMenu } = Menu;
type ControlledValues = {
  startIds: string[];
  expandStartId: string;
  sep: number;
};
export interface QueryNeighborsProps {
  serviceId: '';
  contextmenu: any;
  degree: number;
  isFocus: boolean;
  limit: number;
  controlledValues?: ControlledValues;
}

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const QueryNeighbors: React.FunctionComponent<QueryNeighborsProps> = props => {
  const { contextmenu, serviceId, degree, isFocus, limit, controlledValues } = props;
  const currentRef = useRef({
    expandIds: [],
    expandStartId: '',
  });

  const { data, updateContext, updateHistory, transform, graph, config, services } = useContext();

  const service = utils.getService(services, serviceId);
  const { item: targetNode } = contextmenu;
  if (!service || targetNode?.destroyed || targetNode?.getType?.() !== 'node') {
    return null;
  }

  const handleClick = async e => {
    const selectedItems = graph.findAllByState('node', 'selected');

    const selectedNodes = new Map();
    selectedItems.forEach(item => {
      const model = item.getModel();
      selectedNodes.set(model.id, model);
    });
    const { key } = e;
    const sep = key.replace('expand-', '');

    const value = contextmenu.item.getModel();
    graph.setItemState(value.id, 'selected', true);
    selectedNodes.set(value.id, value);

    const ids = [...selectedNodes.keys()];
    const nodes = [...selectedNodes.values()];
    const expandStartId = value.id;

    updateContext(draft => {
      draft.isLoading = true;
    });

    contextmenu.onClose();
    await expandNodes(ids, expandStartId, sep, nodes);
  };

  const expandNodes = async (ids, expandStartId, sep, propNodes: any = undefined) => {
    let nodes = propNodes;
    const historyProps = {
      startIds: ids,
      expandStartId,
      sep,
    };
    if (!propNodes) {
      nodes = ids.map(id => graph.findById(id)?.getModel()).filter(Boolean);
      if (!nodes?.length) handleUpateHistory(historyProps, false, '当前画布中未找到指定的扩散起始节点');
    }
    try {
      const result = await service({
        ids,
        nodes,
        sep,
        limit,
      });

      const newData = utils.handleExpand(data, result);
      const expandIds = result.nodes?.map(n => n.id) || [];
      currentRef.current.expandIds = expandIds;
      currentRef.current.expandStartId = expandStartId;

      updateContext(draft => {
        const res = transform(newData);
        draft.data = res;
        draft.source = res;
        draft.isLoading = false;
        if (draft.layout.type === 'preset') {
          //兼容从save模式
          const { props: layoutProps } = draft.config.layout || { props: { type: 'graphin-force' } };
          draft.layout = layoutProps;
        }
      });
      handleUpateHistory(historyProps);
    } catch (error) {
      handleUpateHistory(historyProps, false, String(error));
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
      componentId: 'NeighborsQuery',
      type: 'analyse',
      subType: '邻居查询',
      statement: `查询 ${params.startIds.join(', ')} 的邻居`,
      success,
      errorMsg,
      params,
    });
  };

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      const { startIds, expandStartId, sep } = controlledValues;
      expandNodes(startIds, expandStartId, sep);
    }
  }, [controlledValues]);

  useEffect(() => {
    //@ts-ignore
    const handleCallback = () => {
      const { expandIds, expandStartId } = currentRef.current;
      if (expandIds.length === 0) {
        return;
      }
      expandIds.forEach(id => {
        const item = graph.findById(id);
        if (item && !item.destroyed) {
          graph.setItemState(id, 'query_normal', true);
        }
      });
      const startItem = graph.findById(expandStartId);
      if (!startItem || startItem.destroyed) return;
      graph.setItemState(expandStartId, 'query_start', true);
      isFocus && graph.focusItem(expandStartId);
    };
    //@ts-ignore
    graph.on('graphin:datachange', handleCallback);
    return () => {
      graph.off('graphin:datachange', handleCallback);
    };
  }, [isFocus]);

  const ChineseIndex = ['一', '二', '三'];
  const menuItem = Array.from({ length: Number(degree) }).map((_item, idx) => {
    const name = ChineseIndex[idx] + '度扩展';
    const sep = idx + 1;
    return (
      <Menu.Item key={`expand-${sep}`} eventKey={`expand-${sep}`} onClick={handleClick}>
        {name}
      </Menu.Item>
    );
  });

  return (
    // @ts-ignore
    <SubMenu key="expand" eventKey="expand" title="扩展查询">
      {menuItem}
    </SubMenu>
  );
};

export default QueryNeighbors;
