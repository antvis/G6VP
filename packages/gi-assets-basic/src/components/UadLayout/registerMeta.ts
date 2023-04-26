const registerMeta = context => {
  const { GIAC_CONTENT_ITEMS } = context;
  return {
    containers: [
      {
        id: 'GI_CONTAINER_TOP',
        name: '顶部容器',
        required: true,
        GI_CONTAINER: {
          title: '顶部组件',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {},
          enum: GIAC_CONTENT_ITEMS,
          default: [],
        },
        height: {
          type: 'number',
          title: '顶部高度',
          'x-component': 'NumberPicker',
          'x-decorator': 'FormItem',
          default: 251,
        },
        padding: {
          type: 'string',
          title: '内部间距',
          'x-component': 'Input',
          'x-decorator': 'FormItem',
          default: '0px 0px',
        },
      },
      {
        id: 'GI_CONTAINER_SIDE',
        name: '侧边容器',
        required: true,
        GI_CONTAINER: {
          title: '侧边组件',
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
          title: 'Tab 位置',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            options: [
              {
                value: 'left',
                label: '左边',
              },
              {
                value: 'right',
                label: '右边',
              },
              {
                value: 'top',
                label: '上方',
              },
              {
                value: 'bottom',
                label: '下方',
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
