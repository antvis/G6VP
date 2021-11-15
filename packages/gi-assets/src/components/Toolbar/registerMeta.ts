const registerMeta = context => {
  const { config } = context;
  const { components } = config;
  const componentOptions = components.map(c => {
    return {
      value: c.id,
      label: c.id,
    };
  });
  return {
    GI_CONTAINER: {
      name: '集成组件',
      type: 'TagsSelect',
      default: [],
      options: componentOptions,
    },
  };
};

export default registerMeta;
