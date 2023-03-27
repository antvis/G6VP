// 基于G6的activate-relations做了以下升级改造
// 1. 支持多选进行高亮
// 2. 支持分别定义高亮时上下游进行扩展的度数

import { Graph, Item, G6Event, IG6GraphEvent, INode, ICombo, IEdge } from '@antv/g6';
import { throttle } from '@antv/util';

export default {
  getDefaultCfg(): object {
    return {
      // 可选 mouseenter || click
      // 选择 click 会监听 touch，mouseenter 不会监听
      trigger: 'mouseenter',
      activeState: 'active',
      inactiveState: 'inactive',
      resetSelected: false,
      multiSelectEnabled: true,
      modifierKey: 'alt',
      upstreamDegree: 1,
      downstreamDegree: 1,
      shouldUpdate() {
        return true;
      },
    };
  },
  getEvents(): { [key in G6Event]?: string } {
    if ((this as any).get('trigger') === 'mouseenter') {
      return {
        'node:mouseenter': 'setAllItemStates',
        'combo:mouseenter': 'setAllItemStates',
        'node:mouseleave': 'clearActiveState',
        'combo:mouseleave': 'clearActiveState',
        'canvas:click': 'clearActiveState',
        keyup: 'onKeyUp',
        keydown: 'onKeyDown',
      };
    }
    return {
      'node:click': 'setAllItemStates',
      'combo:click': 'setAllItemStates',
      'canvas:click': 'clearActiveState',
      'node:touchstart': 'setOnTouchStart',
      'combo:touchstart': 'setOnTouchStart',
      'canvas:touchstart': 'clearOnTouchStart',
      keyup: 'onKeyUp',
      keydown: 'onKeyDown',
    };
  },
  setOnTouchStart(e: IG6GraphEvent) {
    const self = this;
    try {
      const touches = (e.originalEvent as TouchEvent).touches;
      const event1 = touches[0];
      const event2 = touches[1];

      if (event1 && event2) {
        return;
      }

      e.preventDefault();
    } catch (e) {
      console.warn('Touch original event not exist!');
    }
    self.setAllItemStates(e);
  },
  clearOnTouchStart(e: IG6GraphEvent) {
    const self = this;
    try {
      const touches = (e.originalEvent as TouchEvent).touches;
      const event1 = touches[0];
      const event2 = touches[1];

      if (event1 && event2) {
        return;
      }

      e.preventDefault();
    } catch (e) {
      console.warn('Touch original event not exist!');
    }
    self.clearActiveState(e);
  },
  setAllItemStates(e: IG6GraphEvent) {
    //@ts-ignore
    clearTimeout(this.timer);
    this.throttleSetAllItemStates(e, this);
  },
  clearActiveState(e: any) {
    //@ts-ignore
    if (this.multiSelectEnabled && this.isModifierKeydown) {
      return;
    }
    // avoid clear state frequently, it costs a lot since all the items' states on the graph need to be cleared
    //@ts-ignore
    this.timer = setTimeout(() => {
      this.throttleClearActiveState(e, this);
    }, 50);
  },
  throttleSetAllItemStates: throttle(
    (e, self) => {
      const item: INode = e.item as INode;
      const graph: Graph = self.graph;
      if (!graph || graph.destroyed) return;
      self.item = item;
      if (!self.shouldUpdate(e.item, { event: e, action: 'activate' }, self)) {
        return;
      }
      const activeState = self.activeState;
      const inactiveState = self.inactiveState;
      const nodes = graph.getNodes();
      const combos = graph.getCombos();
      const edges = graph.getEdges();
      const vEdges = graph.get('vedges');
      const nodeLength = nodes.length;
      const comboLength = combos.length;
      const edgeLength = edges.length;
      const vEdgeLength = vEdges.length;
      const inactiveItems = self.inactiveItems || {};
      const activeItems = self.activeItems || {};
      const upstreamDegree = self.upstreamDegree || 1;
      const downstreamDegree = self.downstreamDegree || 1;

      if (!(self.multiSelectEnabled && self.isModifierKeydown)) {
        for (let i = 0; i < nodeLength; i++) {
          const node = nodes[i];
          const nodeId = node.getID();
          const hasSelected = node.hasState('selected');
          if (self.resetSelected) {
            if (hasSelected) {
              graph.setItemState(node, 'selected', false);
            }
          }
          if (activeItems[nodeId]) {
            graph.setItemState(node, activeState, false);
            delete activeItems[nodeId];
          }
          if (inactiveState && !inactiveItems[nodeId]) {
            graph.setItemState(node, inactiveState, true);
            inactiveItems[nodeId] = node;
          }
        }
        for (let i = 0; i < comboLength; i++) {
          const combo = combos[i];
          const comboId = combo.getID();
          const hasSelected = combo.hasState('selected');
          if (self.resetSelected) {
            if (hasSelected) {
              graph.setItemState(combo, 'selected', false);
            }
          }
          if (activeItems[comboId]) {
            graph.setItemState(combo, activeState, false);
            delete activeItems[comboId];
          }
          if (inactiveState && !inactiveItems[comboId]) {
            graph.setItemState(combo, inactiveState, true);
            inactiveItems[comboId] = combo;
          }
        }

        for (let i = 0; i < edgeLength; i++) {
          const edge = edges[i];
          const edgeId = edge.getID();
          if (activeItems[edgeId]) {
            graph.setItemState(edge, activeState, false);
            delete activeItems[edgeId];
          }
          if (inactiveState && !inactiveItems[edgeId]) {
            graph.setItemState(edge, inactiveState, true);
            inactiveItems[edgeId] = edge;
          }
        }

        for (let i = 0; i < vEdgeLength; i++) {
          const vEdge = vEdges[i];
          const vEdgeId = vEdge.getID();
          if (activeItems[vEdgeId]) {
            graph.setItemState(vEdge, activeState, false);
            delete activeItems[vEdgeId];
          }
          if (inactiveState && !inactiveItems[vEdgeId]) {
            graph.setItemState(vEdge, inactiveState, true);
            inactiveItems[vEdgeId] = vEdge;
          }
        }
      }
      enum DirectionEnum {
        IN = 'in',
        OUT = 'out',
      }
      const queue: Array<{
        item: INode;
        direction: DirectionEnum;
        degree: number;
      }> = [
        {
          item,
          direction: DirectionEnum.IN,
          degree: 0,
        },
        {
          item,
          direction: DirectionEnum.OUT,
          degree: 0,
        },
      ];
      // 按照upstreamDegree、downstreamDegree对应的上下游度数进行扩展，
      // 高亮扩展出来的点和边
      while (queue.length > 0) {
        let { item, direction, degree } = queue.shift()!;

        if (item && !item.destroyed) {
          if (inactiveState && inactiveItems[item.getID()]) {
            graph.setItemState(item as Item, inactiveState, false);
            delete inactiveItems[item.getID()];
          }
          if (!activeItems[item.getID()]) {
            graph.setItemState(item as Item, activeState, true);
            activeItems[item.getID()] = item;
          }

          if (
            (direction === DirectionEnum.IN && degree < upstreamDegree) ||
            (direction === DirectionEnum.OUT && degree < downstreamDegree)
          ) {
            const edges = direction === DirectionEnum.IN ? item.getInEdges() : item.getOutEdges();

            edges.forEach(edge => {
              const edgeId = edge.getID();
              if (inactiveItems[edgeId]) {
                graph.setItemState(edge as Item, inactiveState, false);
                delete inactiveItems[edgeId];
              }
              if (!activeItems[edgeId]) {
                graph.setItemState(edge as Item, activeState, true);
                activeItems[edgeId] = edge;
              }
              edge.toFront();
            });

            item.getNeighbors(direction === DirectionEnum.IN ? 'source' : 'target').forEach(node => {
              queue.push({
                item: node,
                direction,
                degree: degree + 1,
              });
            });
          }
        }
      }

      self.activeItems = activeItems;
      self.inactiveItems = inactiveItems;
      graph.emit('afteractivaterelations', { item: e.item, action: 'activate' });
    },
    50,
    {
      trailing: true,
      leading: true,
    },
  ),
  throttleClearActiveState: throttle(
    (e, self) => {
      const graph = self.get('graph');
      if (!graph || graph.destroyed) return;
      if (!self.shouldUpdate(e.item, { event: e, action: 'deactivate' }, self)) return;

      const activeState = self.activeState;
      const inactiveState = self.inactiveState;

      const activeItems = self.activeItems || {};
      const inactiveItems = self.inactiveItems || {};
      //@ts-ignore
      Object.values(activeItems)
        //@ts-ignore
        .filter((item: INode | IEdge | ICombo) => !item.destroyed)
        .forEach(item => {
          graph.clearItemStates(item, activeState);
        });
      //@ts-ignore
      Object.values(inactiveItems)
        //@ts-ignore
        .filter((item: INode | IEdge | ICombo) => !item.destroyed)
        .forEach(item => {
          graph.clearItemStates(item, inactiveState);
        });
      self.activeItems = {};
      self.inactiveItems = {};
      graph.emit('afteractivaterelations', {
        item: e.item || self.get('item'),
        action: 'deactivate',
      });
    },
    50,
    {
      trailing: true,
      leading: true,
    },
  ),

  onKeyDown(e: IG6GraphEvent) {
    const self: any = this;
    if (!self.multiSelectEnabled) {
      return;
    }

    const code = e.key;
    if (!code) {
      return;
    }
    if (code.toLowerCase() === self.modifierKey.toLowerCase()) {
      self.isModifierKeydown = true;
    } else {
      self.isModifierKeydown = false;
    }
  },

  onKeyUp() {
    const self: any = this;
    self.isModifierKeydown = false;
  },
};
