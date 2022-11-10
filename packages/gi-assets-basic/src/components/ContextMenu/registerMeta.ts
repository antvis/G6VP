const registerMeta = context => {
  const { GIAC_MENU_ITEMS = [] } = context;
  GIAC_MENU_ITEMS.map(item => {
    return item.value;
  });
  return {
    /** 分类信息 */
    GI_CONTAINER: {
      title: '可集成组件',
      type: 'string',
      enum: GIAC_MENU_ITEMS,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default: GIAC_MENU_ITEMS.map(item => {
        return item.value;
      }),
    },
    bindTypes: {
      title: '元素类型',
      type: 'string',
      enum: [
        {
          label: '节点',
          value: 'node',
        },
        {
          label: '边',
          value: 'edge',
        },
        {
          label: '画布',
          value: 'canvas',
        },
        {
          label: '节点分组',
          value: 'combo',
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      'x-reactions': [
        {
          target: 'nodeMenuComponents',
          fulfill: {
            state: {
              visible: '{{$self.value.includes("node") || $self.value.length === 0}}',
            },
          },
        },
        {
          target: 'edgeMenuComponents',
          fulfill: {
            state: {
              visible: '{{$self.value.includes("edge")}}',
            },
          },
        },
        {
          target: 'canvasMenuComponents',
          fulfill: {
            state: {
              visible: '{{$self.value.includes("canvas")}}',
            },
          },
        },
        {
          target: 'comboMenuComponents',
          fulfill: {
            state: {
              visible: '{{$self.value.includes("combo")}}',
            },
          },
        },
      ],
      default: ['node'],
    },
    /** 节点、边、分组、画布对应的邮件菜单组件信息 */
    nodeMenuComponents: {
      title: '(节点)集成组件',
      type: 'string',
      enum: GIAC_MENU_ITEMS,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default: ['NeighborsQuery', 'ToggleClusterWithMenu', 'PinNodeWithMenu'],
    },
    edgeMenuComponents: {
      title: '(边)集成组件',
      type: 'string',
      enum: GIAC_MENU_ITEMS,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default: [],
    },
    canvasMenuComponents: {
      title: '(画布)集成组件',
      type: 'string',
      enum: GIAC_MENU_ITEMS,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default: [],
    },
    comboMenuComponents: {
      title: '(分组)集成组件',
      type: 'string',
      enum: GIAC_MENU_ITEMS,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        mode: 'multiple',
      },
      default: [],
    },
  };
};

export default registerMeta;
