import $i18n from '../../i18n';
const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS = [], GIAC_ITEMS = [] } = context;
  return {
    containers: [
      {
        id: 'navbar-left',
        name: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.NavigationLeftArea', dm: '导航左区' }),
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_ITEMS,
          default: [],
        },
      },
      {
        id: 'navbar-right',
        name: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.NavigationRightArea', dm: '导航右区' }),
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_ITEMS,
          default: [],
        },
      },
      {
        id: 'view-mode',
        name: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.ModeDisplay', dm: '模式展示' }),
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        icon: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.DisplayIcon', dm: '展示图标' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: 'icon-tugraph-graph-view',
        },
      },
      {
        id: 'data-query',
        name: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.DataQuery', dm: '数据查询' }),
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        icon: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.DisplayIcon', dm: '展示图标' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: 'icon-tugraph-query',
        },
      },
      {
        id: 'data-filter',
        name: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.DataFiltering', dm: '数据筛选' }),
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        icon: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.DisplayIcon', dm: '展示图标' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          default: 'icon-tugraph-filter',
        },
      },
      {
        id: 'styling-setting',
        name: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.LayoutStyle', dm: '布局样式' }),
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
      },
      {
        id: 'canvas-operator',
        name: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.CanvasOperation', dm: '画布操作' }),
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_ITEMS,
          default: [],
        },
      },
      {
        id: 'condition-content',
        name: '条件展示容器',
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.IntegratedComponents', dm: '集成组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
      },
      {
        id: 'timebar-container-bottom',
        name: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.BottomContainer', dm: '底部时序容器' }),
        required: true,
        GI_CONTAINER: {
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.BottomAssembly', dm: '顶部时序组件' }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {},
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        height: {
          type: 'number',
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.BottomHeight', dm: '容器高度' }),
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          default: 150,
        },
        padding: {
          type: 'string',
          title: $i18n.get({ id: 'basic.components.RichContainer.registerMeta.InternalSpacing', dm: '内部间距' }),
          'x-component': 'Input',
          'x-decorator': 'FormItem',
          default: '0px 0px',
        },
      },
    ],
    isSheet: {
      title: '多页签',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
  };
};
export default registerMeta;
