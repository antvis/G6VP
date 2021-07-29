const getMeta = context => {
  const { data, keys = ['id', 'type'] } = context;
  const options = keys.map(c => {
    return {
      value: c,
      label: c,
    };
  });
  return {
    /** 分类信息 */
    categoryId: 'components-analysis',
    id: 'NodeTooltip',
    type: 'group', //这个可以不写
    fold: false, // 这个可以不写
    name: '节点提示框',
    children: {
      mappingKeys: {
        name: '映射字段',
        type: 'checkbox',
        optionCol: 8,
        default: keys,
        options,
      },
    },
  };
};

export default getMeta;
