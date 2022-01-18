const registerMeta = context => {
  const { GI_CONTAINER_INDEXS = [] } = context;

  return {
    GI_CONTAINER: {
      name: '集成组件',
      type: 'TagsSelect',
      default: [],
      options: GI_CONTAINER_INDEXS,
    },
    direction: {
      name: '展示方向',
      type: 'radio',
      default: 'vertical',
      options: [
        {
          label: '水平展示',
          value: 'horizontal',
        },
        {
          label: '纵向展示',
          value: 'vertical',
        },
      ],
    },
    placement: {
      name: '组件位置',
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
      default: [20, 100],
    },
  };
};

export default registerMeta;
