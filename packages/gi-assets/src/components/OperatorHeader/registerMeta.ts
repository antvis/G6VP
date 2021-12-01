const registerMeta = context => {
  const { GI_CONTAINER_INDEXS } = context;
  console.log('GI_CONTAINER_INDEXS', GI_CONTAINER_INDEXS);
  return {
    /** 分类信息 */
    GI_CONTAINER: {
      name: '集成组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
    },
    leftContainer: {
      name: '左侧组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
      showInPanel: {
        conditions: [['.GI_CONTAINER', '$ne', []]],
      },
    },
    centerContainer: {
      name: '中间组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
      showInPanel: {
        conditions: [['.GI_CONTAINER', '$ne', []]],
      },
    },
    rightContainer: {
      name: '右侧组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
      showInPanel: {
        conditions: [['.GI_CONTAINER', '$ne', []]],
      },
    },
    placement: {
      name: '放置方位',
      type: 'select',
      default: 'LT',
      options: [
        {
          value: 'LT',
          label: '左上',
        },
        {
          value: 'RT',
          label: '右上',
        },
        {
          value: 'LB',
          label: '左下',
        },
        {
          value: 'RB',
          label: '右下',
        },
      ],
    },
    offset: {
      name: '偏移距离',
      type: 'Offset',
      min: 0,
      max: 400,
      default: [0, 0],
    },
    height: {
      name: '高度',
      type: 'text',
      default: '60px',
    },
    width: {
      name: '宽度',
      type: 'text',
      default: '100%',
    },
  };
};

export default registerMeta;
