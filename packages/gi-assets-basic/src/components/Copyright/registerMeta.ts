const registerMeta = () => {
  return {
    imageUrl: {
      name: '版权图片',
      type: 'image',
      default: '',
    },
    width: {
      type: 'number',
      name: '宽度',
      default: 100,
    },
    height: {
      type: 'number',
      name: '高度',
      default: 50,
    },
    placement: {
      name: '组件位置',
      type: 'select',
      default: 'RB',
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
      default: [100, 20],
    },
  };
};

export default registerMeta;
