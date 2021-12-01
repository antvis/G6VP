const registerMeta = context => {
  const { GI_CONTAINER_INDEXS } = context;
  return {
    /** 分类信息 */
    GI_CONTAINER: {
      name: '集成组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
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
      default: [10, 60],
    },
    height: {
      name: '高度',
      type: 'text',
      default: 'calc(100vh -60px)',
    },
    width: {
      name: '宽度',
      type: 'text',
      default: '400px',
    },
  };
};

export default registerMeta;
