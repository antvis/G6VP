import { IG6GraphEvent, IGraph, useContext } from '@antv/gi-sdk';

import React, { useEffect, useRef } from 'react';

export interface ContextMenuProps {
  bindTypes?: ('node' | 'edge' | 'canvas' | 'combo')[];
  container: React.RefObject<HTMLDivElement>;
}

export interface State {
  /** 当前状态 */
  visible: boolean;
  id: string;
  x: number;
  y: number;
  /** 触发的元素 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  /** 只有绑定canvas的时候才触发 */
  selectedItems: any[];
}

/**  和 g6 menu 的逻辑保持一致，便于维护 */
const onMenuShow = (e, graph: IGraph, options, container) => {
  if (!e) {
    return { x: 0, y: 0 };
  }
  e.stopPropagation();
  e.preventDefault();

  const itemTypes = options.itemTypes;
  if (!e.itemId) {
    if (itemTypes.indexOf('canvas') === -1) {
      return { x: 0, y: 0 };
    }
  } else {
    if (e.itemId && e.itemType && itemTypes.indexOf(e.itemType) === -1) {
      return { x: 0, y: 0 };
    }
  }

  if (!options.shouldBegin(e)) return { x: 0, y: 0 };

  const width: number = graph.getSize()[0];
  const height: number = graph.getSize()[1];
  const bbox = container.getBoundingClientRect();
  const offsetX = options.offsetX || 0;
  const offsetY = options.offsetY || 0;
  const graphTop = graph.container.offsetTop;
  const graphLeft = graph.container.offsetLeft;
  let x = e.viewport.x + graphLeft + offsetX;
  let y = e.viewport.y + graphTop + offsetY - 55;

  // when the menu is (part of) out of the canvas
  if (x + bbox.width > width) {
    x -= bbox.width + graphLeft + offsetX;
  }
  if (y + bbox.height > height) {
    y -= bbox.height + graphTop + offsetY;
  }
  return {
    x,
    y,
  };
};

const useContextMenu = (props: ContextMenuProps): any => {
  const { bindTypes = ['node'], container } = props;
  const { graph } = useContext();
  const constantRef = useRef({
    handleShow: (e: IG6GraphEvent) => {},
    handleClose: () => {},
  });

  const [state, setState] = React.useState<State>({
    visible: false,
    id: '',
    x: 0,
    y: 0,
    item: null,
    selectedItems: [],
  });

  useEffect(() => {
    const handleShow = (e: IG6GraphEvent) => {
      const options = {
        offsetX: 0,
        offsetY: 0,
        itemTypes: 'node',
        shouldBegin: () => true,
      };
      const { x, y } = onMenuShow(e, graph, options, container.current);

      const item = graph.getNodeData(e.itemId);
      /** 设置变量 */
      //@ts-ignore
      setState(preState => {
        return {
          ...preState,
          id: e.itemId,
          item,
          visible: true,
          x,
          y,
        };
      });
    };
    const handleClose = () => {
      setState(preState => {
        if (preState.visible) {
          return {
            ...preState,
            id: '',
            visible: false,
            x: 0,
            y: 0,
            item: null,
          };
        }
        return preState;
      });
    };
    constantRef.current.handleClose = handleClose;
    constantRef.current.handleShow = handleShow;

    const handleSaveAllItem = (e: IG6GraphEvent) => {
      setState(preState => {
        return {
          ...preState,
          selectedItems: [],
        };
      });
    };
    // @ts-ignore
    bindTypes.forEach(bindType => {
      graph.on(`${bindType}:contextmenu`, handleShow);
    });
    graph.on('canvas:click', handleClose);
    graph.on('canvas:drag', handleClose);
    graph.on('wheelzoom', handleClose);
    if (bindTypes.includes('canvas')) {
      //@ts-ignore
      graph.on('nodeselectchange', handleSaveAllItem);
    }

    return () => {
      bindTypes.forEach(bindType => {
        graph.off(`${bindType}:contextmenu`, handleShow);
      });
      graph.off('canvas:click', handleClose);
      graph.off('canvas:drag', handleClose);
      graph.off('wheelzoom', handleClose);
      graph.off('nodeselectchange', handleSaveAllItem);
    };
  }, [graph, bindTypes]);

  const { x, y, visible, item, selectedItems } = state;

  return {
    oneShow: constantRef.current.handleShow,
    onClose: constantRef.current.handleClose,
    item,
    selectedItems,
    visible,
    x,
    y,
  };
};

export default useContextMenu;
