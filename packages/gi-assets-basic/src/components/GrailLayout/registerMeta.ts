import $i18n from '../../i18n';
const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS = [] } = context;

  const schema = {
    containers: [
      {
        id: 'GI_CONTAINER_LEFT',
        name: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.LeftContainer', dm: '左侧容器' }),
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        visible: {
          title: $i18n.get({
            id: 'basic.components.GrailLayout.registerMeta.ByDefaultTheLeftContainer',
            dm: '默认展开左侧容器',
          }),
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: true,
        },
        width: {
          title: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.LeftWidth', dm: '左侧宽度' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {},
          default: '400px',
        },
      },
      {
        id: 'GI_CONTAINER_RIGHT',
        name: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.RightContainer', dm: '右侧容器' }),
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        visible: {
          title: $i18n.get({
            id: 'basic.components.GrailLayout.registerMeta.ByDefaultTheContainerOn',
            dm: '默认展开右侧容器',
          }),
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: true,
        },
        width: {
          title: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.RightWidth', dm: '右侧宽度' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {},
          default: '400px',
        },
      },
      {
        id: 'GI_CONTAINER_BOTTOM',
        name: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.BottomContainer', dm: '底部容器' }),
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        visible: {
          title: $i18n.get({
            id: 'basic.components.GrailLayout.registerMeta.ByDefaultTheBottomContainer',
            dm: '默认展开底部容器',
          }),
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: true,
        },
        height: {
          title: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.BottomHeight', dm: '底部高度' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {},
          default: '400px',
        },
      },
      {
        id: 'GI_CONTAINER_TOP',
        name: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.TopContainer', dm: '顶部容器' }),
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        visible: {
          title: $i18n.get({
            id: 'basic.components.GrailLayout.registerMeta.ByDefaultTheTopContainer',
            dm: '默认展开顶部容器',
          }),
          type: 'boolean',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: false,
        },
        height: {
          title: $i18n.get({ id: 'basic.components.GrailLayout.registerMeta.TopHeight', dm: '顶部高度' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {},
          default: '200px',
        },
      },
    ],
  };

  return schema;
};

export default registerMeta;
