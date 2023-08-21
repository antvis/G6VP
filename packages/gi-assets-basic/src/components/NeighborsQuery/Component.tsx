import { useContext, utils } from '@antv/gi-sdk';

import { Menu } from 'antd';
import React, { memo, useEffect, useRef, useState } from 'react';
import $i18n from '../../i18n';

const { SubMenu } = Menu;
type ControlledValues = {
  startIds: string[];
  expandStartId: string;
  sep: number;
};
export interface QueryNeighborsProps {
  serviceId: string;
  menuServiceId: string;
  contextmenu: any;
  degree: number;
  isFocus: boolean;
  limit: number;
  controlledValues?: ControlledValues;
}

const getContextMenuParams = (graph: any, contextmenu) => {
  const selectedItems = graph.findAllByState('node', 'selected');

  const selectedNodes = new Map();
  selectedItems.forEach(item => {
    const model = item.getModel();
    selectedNodes.set(model.id, model);
  });

  const value = contextmenu.item.getModel();
  graph.setItemState(value.id, 'selected', true);
  selectedNodes.set(value.id, value);

  const ids = [...selectedNodes.keys()];
  const nodes = [...selectedNodes.values()];
  const expandStartId = value.id;
  return {
    ids,
    nodes,
    expandStartId,
  };
};

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const QueryNeighbors: React.FunctionComponent<QueryNeighborsProps> = props => {
  const { contextmenu, serviceId, degree, isFocus, limit, controlledValues, menuServiceId } = props;
  const currentRef = useRef({
    expandIds: [],
    expandStartId: '',
  });

  const { data, updateContext, updateHistory, transform, graph, config, services } = useContext();

  const service = utils.getService(services, serviceId);
  const menuService = utils.getService(services, menuServiceId);
  const [state, setState] = useState({
    menus: [],
  });
  const { menus } = state;
  const { item: targetNode } = contextmenu;
  if (!menuService || !service || targetNode?.destroyed || targetNode?.getType?.() !== 'node') {
    return null;
  }

  const handleClick = async code => {
    const { ids, nodes, expandStartId } = getContextMenuParams(graph, contextmenu);

    updateContext(draft => {
      draft.isLoading = true;
    });

    contextmenu.onClose();
    await expandNodes(ids, expandStartId, code, nodes);
  };

  const expandNodes = async (ids, expandStartId, code, propNodes: any = undefined) => {
    let nodes = propNodes;
    const historyProps = {
      startIds: ids,
      expandStartId,
      sep: code,
    };
    if (!propNodes) {
      nodes = ids.map(id => graph.findById(id)?.getModel()).filter(Boolean);
      if (!nodes?.length)
        handleUpateHistory(
          historyProps,
          false,
          $i18n.get({
            id: 'basic.components.NeighborsQuery.Component.TheSpecifiedDiffusionStartNode',
            dm: '当前画布中未找到指定的扩散起始节点',
          }),
        );
    }
    try {
      const result = await service({
        ids,
        nodes,
        code,
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
      subType: $i18n.get({ id: 'basic.components.NeighborsQuery.Component.NeighborQuery', dm: '邻居查询' }),
      statement1: `查询 ${params.startIds.join(', ')} 的邻居`,
      statement: $i18n.get(
        {
          id: 'basic.components.NeighborsQuery.Component.NeighborQueryOfStarts',
          dm: `查询 ${params.startIds.join(', ')} 的邻居`,
        },
        { startIds: params.startIds.join(', ') },
      ),
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

  useEffect(() => {
    const { ids, nodes, expandStartId } = getContextMenuParams(graph, contextmenu);
    menuService({
      ids,
      nodes,
      expandStartId,
      limit,
    }).then(res => {
      setState(preState => {
        return {
          ...preState,
          menus: res,
        };
      });
    });
  }, [graph]);

  if (menus.length === 0) {
    return (
      <SubMenu
        key="expand"
        // @ts-ignore
        eventKey="expand"
        title={$i18n.get({ id: 'basic.components.NeighborsQuery.Component.ExtendedQuery', dm: '扩展查询' })}
      >
        please config menu
      </SubMenu>
    );
  }

  const menuItem = menus.map(_item => {
    const { label, code } = _item;
    return (
      <Menu.Item key={code} eventKey={code} onClick={() => handleClick(code)}>
        {label}
      </Menu.Item>
    );
  });

  return (
    // @ts-ignore
    <SubMenu
      key="expand"
      // @ts-ignore
      eventKey="expand"
      title={$i18n.get({ id: 'basic.components.NeighborsQuery.Component.ExtendedQuery', dm: '扩展查询' })}
    >
      {menuItem}
    </SubMenu>
  );
};

export default memo(QueryNeighbors);
