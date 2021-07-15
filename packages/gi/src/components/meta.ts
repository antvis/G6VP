import NodeContextMenu from './ContextMenu/meta';
import DrillingOne from './DrillingOne/meta';
import graphinEdge from './Edge/meta';
import NodeLegend from './Legend/meta';
import ClickEntity from './Liaoyuan/ClickEntityMeta';
import ClickEvent from './Liaoyuan/ClickEventMeta';
import graphinNode from './Node/meta';

const meta = {
  NodeLegend,
  NodeContextMenu,
  'graphin-node': graphinNode,
  'graphin-edge': graphinEdge,
  'Liaoyuan-Click-Entity-Node': ClickEntity,
  'Liaoyuan-Click-Event-Node': ClickEvent,
  DrillingOne: DrillingOne,
};

export default meta;
