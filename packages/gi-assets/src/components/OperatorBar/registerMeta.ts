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

  return {
    /** 分类信息 */
    GI_CONTAINER: {
      name: '集成组件',
      type: 'checkbox',
      optionCol: 24,
      default: [''],
      options: componentOptions,
    },
  };
};

export default registerMeta;
