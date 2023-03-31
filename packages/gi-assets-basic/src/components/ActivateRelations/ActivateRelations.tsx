import * as React from 'react';
import useBehaviorHook from '@antv/graphin/es/behaviors/useBehaviorHook';
import { registerBehavior } from '@antv/g6';
import ActivateRelationsBehavior from './activate-relations-v2';

const defaultConfig = {
  /**
   * @description 是否禁用该功能
   * @default false
   */
  disabled: false,
  /**
   * @description 可以是 mousenter，表示鼠标移入时触发；也可以是 click，鼠标点击时触发
   * @default mouseenter
   */
  trigger: 'mouseenter',
  /**
   * @description 活跃节点状态。当行为被触发，需要被突出显示的节点和边都会附带此状态，默认值为  active；可以与 graph 实例的  nodeStyle  和  edgeStyle  结合实现丰富的视觉效果。
   * @default active
   */
  activeState: 'active',
  /**
   * @description 非活跃节点状态。不需要被突出显示的节点和边都会附带此状态。默认值为  inactive。可以与 graph 实例的  nodeStyle  和  edgeStyle  结合实现丰富的视觉效果；
   * @default inactive
   */
  inactiveState: 'inactive',
  /**
   * @description 高亮相连节点时是否重置已经选中的节点，默认为 false，即选中的节点状态不会被 activate-relations 覆盖；
   * @default false
   */
  resetSelected: false,
  // 上游扩展的度数 
  upstreamDegree: 1,
  // 下游扩展的度数 
  downstreamDegree: 1,
  // 多选组合键
  modifierKey: 'alt',
  // 是否支持多选
  multiSelectEnabled: false,
};

export type ActivateRelationsProps = Partial<typeof defaultConfig>;

registerBehavior('activate-relations-v2', ActivateRelationsBehavior);

const ActivateRelations: React.FunctionComponent<ActivateRelationsProps> = props => {
  useBehaviorHook({
    type: 'activate-relations-v2',
    userProps: props,
    defaultConfig,
  });
  return null;
};

export default ActivateRelations;
