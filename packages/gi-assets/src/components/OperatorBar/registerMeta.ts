const registerMeta = context => {
  const { services, config } = context;
  const { components } = config;
  const componentOptions = components.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });
  console.log('componentOptions', componentOptions);
  const dividerIndexOptions = components.map((c, index) => {
    return {
      value: index,
      label: index,
    };
  });

  return {
    /** 分类信息 */
    GI_CONTAINER: {
      name: '集成组件',
      type: 'TagsSelect',
      default: [],
      options: componentOptions,
    },
    // padding: {
    //   name: 'Padding设置',
    //   type: 'margin',
    //   components: ['top', 'right'],
    //   default: {
    //     top: 8,
    //     right: 16,
    //   },
    // },
  };
};

export default registerMeta;
