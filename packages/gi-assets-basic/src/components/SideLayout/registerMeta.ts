import { createGroupsMeta } from "../GroupBar/registerMeta";
export default (context) => {
  const { GIAC_ITEMS = [],GIAC_CONTENT_ITEMS = []} = context;
  return {
    containers: [
      {
        id: 'GI_SIDE_CONTAINER',
        name: '侧边栏',
        required: true,
        sideMenuWidth: {
          title: '菜单宽度',
          type: 'number',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          default: 80
        },
        background: {
          title: '背景色',
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'ColorInput',
        },
        groups: createGroupsMeta(context),
        GI_CONTAINER: {
          title: '集成组件',
          type: 'array',
          enum: [...GIAC_ITEMS,...GIAC_CONTENT_ITEMS],
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            mode: 'multiple',
          },
          default: [],
        },
      }
    ]
  };
};
