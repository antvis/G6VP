import $i18n from '../../i18n';
const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS } = context;
  return {
    containers: [
      {
        id: 'GI_CONTAINER_SIDE',
        name: $i18n.get({ id: 'basic.components.SegmentedLayout.registerMeta.SideContainer', dm: '侧边容器' }),
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({
            id: 'basic.components.SegmentedLayout.registerMeta.IntegratedComponents',
            dm: '集成组件',
          }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        width: {
          type: 'number',
          title: $i18n.get({ id: 'basic.components.SegmentedLayout.registerMeta.ContainerWidth', dm: '容器宽度' }),
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          default: 360,
        },
        padding: {
          type: 'number',
          title: 'Padding',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          default: 12,
        },
      },
    ],
  };
};
export default registerMeta;
