import $i18n from '../../i18n';
const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS } = context;
  return {
    containers: [
      {
        id: 'GI_CONTAINER_TOP',
        name: $i18n.get({ id: 'basic.components.UadLayout.registerMeta.TopContainer', dm: '顶部容器' }),
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.UadLayout.registerMeta.TopAssembly', dm: '顶部组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {},
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        height: {
          type: 'number',
          title: $i18n.get({ id: 'basic.components.UadLayout.registerMeta.TopHeight', dm: '顶部高度' }),
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          default: 251,
        },
        padding: {
          type: 'string',
          title: $i18n.get({ id: 'basic.components.UadLayout.registerMeta.InternalSpacing', dm: '内部间距' }),
          'x-component': 'Input',
          'x-decorator': 'FormItem',
          default: '0px 0px',
        },
      },
      {
        id: 'GI_CONTAINER_SIDE',
        name: $i18n.get({ id: 'basic.components.UadLayout.registerMeta.SideContainer', dm: '侧边容器' }),
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.UadLayout.registerMeta.SideComponents', dm: '侧边组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        tabPosition: {
          title: $i18n.get({ id: 'basic.components.UadLayout.registerMeta.TabLocation', dm: 'Tab 位置' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options: [
              {
                value: 'left',
                label: $i18n.get({ id: 'basic.components.UadLayout.registerMeta.Left', dm: '左边' }),
              },
              {
                value: 'right',
                label: $i18n.get({ id: 'basic.components.UadLayout.registerMeta.Right', dm: '右边' }),
              },
              {
                value: 'top',
                label: $i18n.get({ id: 'basic.components.UadLayout.registerMeta.Above', dm: '上方' }),
              },
              {
                value: 'bottom',
                label: $i18n.get({ id: 'basic.components.UadLayout.registerMeta.Below', dm: '下方' }),
              },
            ],
          },
          default: 'right',
        },
      },
    ],
  };
};
export default registerMeta;
