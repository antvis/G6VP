import $i18n from '../../i18n';
const registerMeta = context => {
  return {
    /** 分类信息 */
    enableNodeHover: {
      title: $i18n.get({ id: 'basic.components.ActivateRelations.registerMeta.NodeHover', dm: '节点悬停' }),
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      type: 'boolean',
      default: true,
    },
    enableEdgeHover: {
      title: $i18n.get({ id: 'basic.components.ActivateRelations.registerMeta.EdgeHover', dm: '边悬停' }),
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      type: 'boolean',
      default: true,
    },
    enable: {
      title: $i18n.get({ id: 'basic.components.ActivateRelations.registerMeta.EnableAssociation', dm: '启用关联' }),
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      type: 'boolean',
      default: true,
    },
    trigger: {
      title: $i18n.get({ id: 'basic.components.ActivateRelations.registerMeta.TriggerMode', dm: '触发方式' }),
      type: 'string',
      'x-component': 'Select',
      'x-decorator': 'FormItem',
      'x-component-props': {
        options: [
          {
            label: $i18n.get({ id: 'basic.components.ActivateRelations.registerMeta.MouseClick', dm: '鼠标点击' }),
            value: 'click',
          },
          {
            label: $i18n.get({ id: 'basic.components.ActivateRelations.registerMeta.MoveTheMouseIn', dm: '鼠标移入' }),
            value: 'mouseenter',
          },
        ],
      },
      default: 'click',
    },
    upstreamDegree: {
      title: $i18n.get({ id: 'basic.components.ActivateRelations.registerMeta.UpstreamDegree', dm: '上游度数' }),
      type: 'number',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      default: 1,
      'x-component-props': {
        disable: true,
      },
    },
    downstreamDegree: {
      title: $i18n.get({ id: 'basic.components.ActivateRelations.registerMeta.DownstreamDegrees', dm: '下游度数' }),
      type: 'number',
      'x-component': 'NumberPicker',
      'x-decorator': 'FormItem',
      default: 1,
      'x-component-props': {
        disable: true,
      },
    },
    multiSelectEnabled: {
      title: $i18n.get({
        id: 'basic.components.ActivateRelations.registerMeta.MultipleSelectionsAllowed',
        dm: '允许多选',
      }),
      type: 'string',
      'x-component': 'Switch',
      'x-decorator': 'FormItem',
      default: false,
      'x-component-props': {
        disable: true,
      },
    },
    modifierKey: {
      title: $i18n.get({
        id: 'basic.components.ActivateRelations.registerMeta.MultipleKeyCombinationsPressThe',
        dm: '多选组合键, 按下键盘输入组合键，支持Alt, Control, Shift, Meta',
      }),
      type: 'string',
      'x-component': 'ModifierPicker',
      'x-decorator': 'FormItem',
      default: 'alt',
      'x-component-props': {
        disable: true,
      },
    },
  };
};

export default registerMeta;
