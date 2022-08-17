import { useContext, utils } from '@alipay/graphinsight';
import Graphin from '@antv/graphin';
import iconLoader from '@antv/graphin-icons';
import '@antv/graphin-icons/dist/index.css';
import { Menu } from 'antd';
import React, { useEffect, useRef } from 'react';

const icons = Graphin.registerFontFamily(iconLoader);

const { SubMenu } = Menu;
export interface QueryNeighborsProps {
  serviceId: '';
  contextmenu: any;
  degree: number;
  isFocus: boolean;
}

/**
 * https://doc.linkurio.us/user-manual/latest/visualization-inspect/
 */
const QueryNeighbors: React.FunctionComponent<QueryNeighborsProps> = props => {
  const { contextmenu, serviceId, degree, isFocus } = props;
  const currentRef = useRef({
    expandIds: [],
    expandStartId: '',
  });

  const { data, updateContext, transform, graph, config, services } = useContext();

  const service = utils.getService(services, serviceId);

  if (!service) {
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

    updateContext(draft => {
      draft.isLoading = true;
    });
    const result = await service({
      ids,
      nodes,
      sep,
    });
    const newData = utils.handleExpand(data, result);
    const expandIds = result.nodes?.map(n => n.id) || [];
    const expandStartId = value.id;
    currentRef.current.expandIds = expandIds;
    currentRef.current.expandStartId = expandStartId;

    contextmenu.onClose();

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
    return;
  };

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

  return (
    // @ts-ignore
    <SubMenu key="expand" eventKey="expand" title="扩展查询">
      <Menu.Item key="expand-1" eventKey="expand-1" onClick={handleClick}>
        一度扩展
      </Menu.Item>
      <Menu.Item key="expand-2" eventKey="expand-2" onClick={handleClick}>
        二度扩展
      </Menu.Item>
      <Menu.Item key="expand-3" eventKey="expand-3" onClick={handleClick}>
        三度扩展
      </Menu.Item>
    </SubMenu>
  );
};

export default QueryNeighbors;
