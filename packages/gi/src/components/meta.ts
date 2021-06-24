import NodeContextMenu from './ContextMenu/meta';
import Legend from './Legend/meta';
import graphinNode from './Node/meta';
import graphinEdge from './Edge/meta';
import NodeLegend from './Legend/meta';
import ClickEntity from './Liaoyuan/ClickEntityMeta';
import ClickEvent from './Liaoyuan/ClickEventMeta';

const meta = {
  NodeLegend,
  NodeContextMenu,
  'graphin-node':graphinNode,
  'graphin-edge':graphinEdge,
  'Liaoyuan-Click-Entity-Node': ClickEntity,
  'Liaoyuan-Click-Event-Node': ClickEvent,
};

export default meta;
