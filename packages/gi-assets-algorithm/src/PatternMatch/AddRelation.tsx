import React from 'react';
import type { ReactNode } from 'react';
import type { IItemBase, Edge } from '@antv/g6';
import Util from '../utils';
import { ADD_EDGE_ID } from '../utils/graph';
import { createUuid } from '../utils/string';

const { addEdge } = Util;

type Props = {
  currentItem: IItemBase | null;
  name: ReactNode;
  graph?: any;
  options?: {
    onOk?: (item: { source: string, target: string }) => void;
  };
};

class AddRelation extends React.PureComponent<Props> {
  static defaultProps = {
    options: {
      onOk: () => { },
    },
  };

  dragging: Edge | null = null;

  onOk = () => {
    if (!this.dragging) return;
    const { options = {} } = this.props;
    const { onOk } = options;
    const model = this.dragging.get('model');
    const { source, target } = model;
    onOk?.({ source, target });
  }

  dragEdge = (e) => {
    const { item: edge, canvasX, canvasY } = e;
    if (edge.getID() !== ADD_EDGE_ID) return;
    const graph = this.props.graph || this.context.graph;
    graph.updateItem(edge, {
      target: { x: canvasX, y: canvasY }
    });
    this.dragging = edge;
  }

  drop = (e) => {
    if (!this.dragging) return;
    const { item } = e;
    if (!item || item.isCanvas?.() || item.getType?.() !== 'node') this.cancelAdding();
    const graph = this.props.graph || this.context.graph;
    graph.updateItem(this.dragging, {
      id: `edge-${createUuid}`,
      target: item.getID(),
      type: 'graphin-line'
    });
    this.onOk();
    this.cancelAdding();
  }

  cancelAdding = () => {
    const graph = this.props.graph || this.context.graph;
    this.dragging = null;
    graph.removeItem(ADD_EDGE_ID);
  }

  componentDidMount() {
    const graph = this.props.graph || this.context.graph;
    graph.on('edge:drag', this.dragEdge);
    graph.on('drop', this.drop);
    graph.on('click', this.cancelAdding);
  }

  componentWillUnmount() {
    const graph = this.props.graph || this.context.graph;
    graph.off('edge:drag', this.dragEdge)
    graph.off('drop', this.drop);
    graph.off('click', this.cancelAdding);
  }

  handleAddRelation = () => {
    const { currentItem } = this.props;
    const graph = this.props.graph || this.context.graph;
    const sourceId = currentItem?.get('id');
    addEdge(sourceId, graph);
  };

  render() {
    const { name } = this.props;
    return <a onClick={this.handleAddRelation}>{name}</a>;
  }
}
export default AddRelation;
